<script lang="ts">
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';
	import { geoOrthographic, geoPath, geoGraticule, type GeoPermissibleObjects } from 'd3-geo';

	type Customer = { name: string; customers: number; machines: number };
	type Feature = { properties: Record<string, string>; type: string; geometry: unknown };

	// Static customer footprint, keyed by ISO_A2 — mirrors the app's per-country view.
	const CUSTOMERS: Record<string, Customer> = {
		TR: { name: 'Türkiye', customers: 12, machines: 248 },
		IN: { name: 'India', customers: 8, machines: 156 },
		CN: { name: 'China', customers: 6, machines: 110 },
		BD: { name: 'Bangladesh', customers: 5, machines: 92 },
		PK: { name: 'Pakistan', customers: 4, machines: 54 },
		EG: { name: 'Egypt', customers: 4, machines: 61 },
		IT: { name: 'Italy', customers: 3, machines: 47 },
		BR: { name: 'Brazil', customers: 3, machines: 38 },
		VN: { name: 'Vietnam', customers: 3, machines: 40 },
		ID: { name: 'Indonesia', customers: 2, machines: 29 },
		UZ: { name: 'Uzbekistan', customers: 2, machines: 22 },
		MA: { name: 'Morocco', customers: 2, machines: 18 }
	};

	let features = $state<Feature[]>([]);
	let box = $state(450);
	let hovered = $state<string | null>(null);
	let dragging = $state(false);

	const rotation = new Spring([-50, -22, 0], { stiffness: 0.08, damping: 0.6 });

	const projection = $derived(
		geoOrthographic()
			.scale(box / 2 - 8)
			.translate([box / 2, box / 2])
			.rotate(rotation.current as [number, number, number])
			.clipAngle(90)
	);
	const pathGenerator = $derived(geoPath().projection(projection));
	const graticule = geoGraticule();

	function isoOf(feature: Feature) {
		return feature.properties?.ISO_A2 ?? '';
	}
	function customerOf(feature: Feature): Customer | null {
		return CUSTOMERS[isoOf(feature)] ?? null;
	}

	let startX = 0;
	let startY = 0;
	let startRot: number[] = [-50, -22, 0];
	const sensitivity = 0.25;

	function handlePointerDown(event: PointerEvent) {
		startX = event.clientX;
		startY = event.clientY;
		startRot = [...(rotation.current as number[])];
		dragging = true;
		window.addEventListener('pointermove', handlePointerMove);
		window.addEventListener('pointerup', handlePointerUp);
	}
	function handlePointerMove(event: PointerEvent) {
		if (!dragging) return;
		const dx = event.clientX - startX;
		const dy = event.clientY - startY;
		const lon = startRot[0] + dx * sensitivity;
		const lat = Math.max(-80, Math.min(80, startRot[1] - dy * sensitivity));
		void rotation.set([lon, lat, 0], { instant: true });
	}
	function handlePointerUp() {
		dragging = false;
		window.removeEventListener('pointermove', handlePointerMove);
		window.removeEventListener('pointerup', handlePointerUp);
	}

	onMount(() => {
		let cancelled = false;
		fetch('/world-110m.geojson')
			.then((r) => r.json())
			.then((json) => {
				if (!cancelled) features = json.features;
			})
			.catch(() => {});

		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		let frame: number;
		const animate = () => {
			if (!dragging && !hovered && !reduce) {
				const c = rotation.current as number[];
				void rotation.set([c[0] + 0.12, c[1], 0], { instant: true });
			}
			frame = requestAnimationFrame(animate);
		};
		frame = requestAnimationFrame(animate);

		return () => {
			cancelled = true;
			cancelAnimationFrame(frame);
		};
	});

	const hoveredData = $derived(hovered ? CUSTOMERS[hovered] : null);
</script>

<div class="relative mx-auto aspect-square w-full max-w-[520px]" bind:clientWidth={box}>
	<!-- glow -->
	<div class="pointer-events-none absolute inset-0 grid place-items-center">
		<div class="h-2/3 w-2/3 rounded-full bg-rust/15 blur-[90px]"></div>
	</div>

	<svg
		viewBox="0 0 {box} {box}"
		class="relative h-full w-full touch-none select-none {dragging
			? 'cursor-grabbing'
			: 'cursor-grab'}"
		role="presentation"
		onpointerdown={handlePointerDown}
		onpointerleave={() => (hovered = null)}
	>
		<!-- ocean sphere -->
		<path d={pathGenerator({ type: 'Sphere' })} class="fill-[#0b0b0f] stroke-line" stroke-width="0.5" />
		<!-- graticule -->
		<path d={pathGenerator(graticule())} class="fill-none stroke-line" stroke-width="0.3" />

		{#each features as feature (feature.properties?.NAME)}
			{@const customer = customerOf(feature)}
			{@const isHovered = customer && hovered === isoOf(feature)}
			<path
				d={pathGenerator(feature as unknown as GeoPermissibleObjects)}
				stroke-width="0.3"
				class="transition-colors duration-150 {customer
					? isHovered
						? 'cursor-pointer fill-rust-bright stroke-amber'
						: 'cursor-pointer fill-rust/70 stroke-rust'
					: 'pointer-events-none fill-[#212126] stroke-[#2c2c32]'}"
				role={customer ? 'button' : 'presentation'}
				tabindex={customer ? 0 : -1}
				aria-label={feature.properties?.NAME}
				onmouseenter={customer ? () => (hovered = isoOf(feature)) : undefined}
				onmouseleave={customer ? () => (hovered = null) : undefined}
			/>
		{/each}
	</svg>

	<!-- hover tooltip -->
	{#if hoveredData && !dragging}
		<div
			class="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 border border-line-strong bg-ink/90 px-3 py-2 backdrop-blur-md"
		>
			<div class="font-display text-sm font-medium text-bone">{hoveredData.name}</div>
			<div class="font-mono text-[11px] text-steel">
				{hoveredData.customers} customers · {hoveredData.machines} machines
			</div>
		</div>
	{/if}
</div>
