<script lang="ts">
	import type { COBEOptions, Globe } from 'cobe';
	import { Spring } from 'svelte/motion';
	import { onDestroy, onMount } from 'svelte';
	import { cn } from '$lib/utils';

	interface Props {
		class?: string;
		config?: Partial<COBEOptions>;
		centerLocation?: [number, number] | null;
	}

	let { class: className, config = {}, centerLocation = null }: Props = $props();

	let size = $derived(config.width ?? 450);

	const baseTheta = 0.2;
	const thetaOffsetMin = -0.4;
	const thetaOffsetMax = 0.4;

	let canvas: HTMLCanvasElement | null = null;
	let globe: Globe | null = null;
	let observer: IntersectionObserver | null = null;
	let createGlobePromise: Promise<typeof import('cobe').default> | null = null;
	let isVisible = false;
	let isDragging = $state(false);
	let isAutoRotating = $state(true);

	let frame = 0;
	let autoPhi = 0;
	let dragStart: { x: number; y: number; phi: number; theta: number } | null = null;
	let lastPointer: { x: number; y: number; t: number } | null = null;
	let releaseVelocity = { phi: 0, theta: 0 };

	const initialPhi = $derived(config.phi ?? 0);
	const initialTheta = $derived(config.theta ?? baseTheta);

	const phiOffset = new Spring(0, {
		stiffness: 0.08,
		damping: 0.6,
		precision: 0.0001
	});

	const thetaOffset = new Spring(0, {
		stiffness: 0.08,
		damping: 0.6,
		precision: 0.0001
	});

	function clamp(value: number, min: number, max: number) {
		return Math.min(max, Math.max(min, value));
	}

	function handlePointerDown(event: PointerEvent) {
		dragStart = {
			x: event.clientX,
			y: event.clientY,
			phi: phiOffset.target,
			theta: thetaOffset.target
		};
		lastPointer = { x: event.clientX, y: event.clientY, t: performance.now() };
		releaseVelocity = { phi: 0, theta: 0 };
		isDragging = true;
		isAutoRotating = false;
		canvas?.setPointerCapture?.(event.pointerId);
	}

	function handlePointerMove(event: PointerEvent) {
		if (!dragStart) return;

		const nextPhi = dragStart.phi + (event.clientX - dragStart.x) / 300;
		const nextTheta = clamp(
			dragStart.theta + (event.clientY - dragStart.y) / 1000,
			thetaOffsetMin,
			thetaOffsetMax
		);

		void phiOffset.set(nextPhi, { instant: true });
		void thetaOffset.set(nextTheta, { instant: true });

		const now = performance.now();
		if (lastPointer) {
			const dt = Math.max(now - lastPointer.t, 1);
			const maxVelocity = 0.15;

			releaseVelocity = {
				phi: clamp(((event.clientX - lastPointer.x) / dt) * 0.3, -maxVelocity, maxVelocity),
				theta: clamp(((event.clientY - lastPointer.y) / dt) * 0.08, -maxVelocity, maxVelocity)
			};
		}

		lastPointer = { x: event.clientX, y: event.clientY, t: now };
	}

	function handlePointerUp(event?: PointerEvent) {
		if (!dragStart) return;

		isDragging = false;
		dragStart = null;
		lastPointer = null;

		if (event && canvas?.hasPointerCapture(event.pointerId)) {
			canvas.releasePointerCapture(event.pointerId);
		}

		void phiOffset.set(phiOffset.target + releaseVelocity.phi * 18);
		void thetaOffset.set(
			clamp(thetaOffset.target + releaseVelocity.theta * 12, thetaOffsetMin, thetaOffsetMax)
		);

		releaseVelocity = { phi: 0, theta: 0 };

		// Resume auto-rotation if no centerLocation selected
		if (!centerLocation) {
			setTimeout(() => {
				if (!isDragging && !centerLocation) {
					isAutoRotating = true;
				}
			}, 3000);
		}
	}

	function stopAnimation() {
		if (!frame) return;
		cancelAnimationFrame(frame);
		frame = 0;
	}

	function destroyGlobe() {
		stopAnimation();
		globe?.destroy();
		globe = null;
		createGlobePromise = null;
	}

	async function getCreateGlobe() {
		createGlobePromise ??= import('cobe').then((module) => module.default);
		return createGlobePromise;
	}

	async function startGlobe() {
		if (!canvas) return;

		if (globe) {
			if (!frame) animate();
			return;
		}

		const createGlobe = await getCreateGlobe();

		if (!canvas || globe || !isVisible) return;

		globe = createGlobe(canvas, {
			devicePixelRatio: Math.min(window.devicePixelRatio, 2),
			width: size * 2, // Scale width and height for retina displays
			height: size * 2,
			phi: 0,
			theta: baseTheta,
			dark: 0,
			diffuse: 1.7,
			mapSamples: 13000,
			mapBrightness: 6,
			baseColor: [1, 1, 1],
			markerColor: [0.9, 0.4, 0.1],
			glowColor: [1, 1, 1],
			markers: [],
			markerElevation: 0,
			...config
		} as COBEOptions);

		animate();
	}

	let onWindowPointerMove: ((event: PointerEvent) => void) | null = null;
	let onWindowPointerUp: ((event: PointerEvent) => void) | null = null;

	function animate() {
		if (!globe) {
			frame = 0;
			return;
		}

		if (!isDragging && isAutoRotating) {
			autoPhi += 0.005;
		}

		globe.update({
			phi: initialPhi + autoPhi + phiOffset.current,
			theta: initialTheta + thetaOffset.current
		});

		frame = requestAnimationFrame(animate);
	}

	// Update markers and config dynamically when theme or marker list changes
	$effect(() => {
		if (globe && config) {
			globe.update({
				markers: config.markers,
				dark: config.dark,
				baseColor: config.baseColor,
				glowColor: config.glowColor,
				markerColor: config.markerColor,
				mapBrightness: config.mapBrightness
			});
		}
	});

	// Smoothly focus/center on chosen lat/lon coordinates
	$effect(() => {
		if (!globe) return;

		if (centerLocation) {
			isAutoRotating = false;
			const lat = centerLocation[0];
			const lon = centerLocation[1];

			// Convert degrees to spherical radians.
			// Center is aligned by subtracting baseTheta and shifting lon by pi/2.
			const targetPhiVal = -lon * (Math.PI / 180) + Math.PI / 2;
			const targetThetaVal = lat * (Math.PI / 180) - baseTheta;

			const currentPhi = initialPhi + autoPhi + phiOffset.target;

			// Find the shortest rotation difference to prevent wrapping issues
			let diff = targetPhiVal - currentPhi;
			diff = Math.atan2(Math.sin(diff), Math.cos(diff));

			void phiOffset.set(phiOffset.target + diff);
			void thetaOffset.set(clamp(targetThetaVal, thetaOffsetMin, thetaOffsetMax));
		} else {
			// Resume automatic rotation loop
			isAutoRotating = true;
		}
	});

	onMount(() => {
		if (!canvas) return;

		onWindowPointerMove = (event: PointerEvent) => handlePointerMove(event);
		onWindowPointerUp = (event: PointerEvent) => handlePointerUp(event);

		window.addEventListener('pointermove', onWindowPointerMove, { passive: true });
		window.addEventListener('pointerup', onWindowPointerUp, { passive: true });
		window.addEventListener('pointercancel', onWindowPointerUp, { passive: true });

		observer = new IntersectionObserver(
			([entry]) => {
				if (!entry) return;
				isVisible = entry.isIntersecting;
				if (isVisible) {
					void startGlobe();
					return;
				}

				stopAnimation();
			},
			{ threshold: 0.1 }
		);

		observer.observe(canvas);
	});

	onDestroy(() => {
		observer?.disconnect();
		observer = null;
		isVisible = false;

		if (onWindowPointerMove) {
			window.removeEventListener('pointermove', onWindowPointerMove);
			onWindowPointerMove = null;
		}

		if (onWindowPointerUp) {
			window.removeEventListener('pointerup', onWindowPointerUp);
			window.removeEventListener('pointercancel', onWindowPointerUp);
			onWindowPointerUp = null;
		}

		handlePointerUp();
		destroyGlobe();
		canvas = null;
	});
</script>

<div
	class={cn(
		'globe-container absolute inset-0 mx-auto flex aspect-square w-full max-w-150 items-center justify-center',
		className
	)}
>
	<canvas
		bind:this={canvas}
		style="width: {size}px; height: {size}px;"
		class={cn(
			'block cursor-grab touch-none contain-[layout_paint_size] select-none',
			isDragging && 'cursor-grabbing'
		)}
		onpointerdown={handlePointerDown}
	></canvas>
</div>
