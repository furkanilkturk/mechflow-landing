<script lang="ts">
	import { inView } from 'motion';
	import type { Component } from 'svelte';

	type Stage = {
		code: string;
		label: string;
		icon: Component;
		boxClass: string;
		codeClass: string;
		pulse: string;
	};

	let { stages }: { stages: Stage[] } = $props();

	let started = $state(false);

	const n = $derived(stages.length);
	const x1 = $derived(1000 / (2 * n));
	const x2 = $derived(1000 - 1000 / (2 * n));
	const railLength = $derived(x2 - x1);
	const cycle = $derived(Math.max(n - 1, 1) * 1.1);
	const step = $derived(cycle / Math.max(n - 1, 1));

	function watch(node: HTMLElement) {
		const stop = inView(node, () => { started = true; }, { amount: 0.4 });
		return { destroy: stop };
	}
</script>

<div use:watch class:started class="flow" style="--cycle: {cycle}s; --rail: {railLength};">
	<!-- horizontally scrollable on phones so the rail keeps its design -->
	<div class="overflow-x-auto pb-2 [scrollbar-width:thin] sm:overflow-visible sm:pb-0">
		<div class="relative min-w-[480px] sm:min-w-0">
			<!-- connector line, centred on the icon row -->
			<svg
				class="pointer-events-none absolute left-0 top-0 h-14 w-full"
				viewBox="0 0 1000 56"
				preserveAspectRatio="none"
				aria-hidden="true"
			>
				<line {x1} y1="28" {x2} y2="28" class="rail-base" />
				<line {x1} y1="28" {x2} y2="28" class="rail-draw" />
				<line {x1} y1="28" {x2} y2="28" class="rail-pulse" />
			</svg>

			<ol class="relative grid" style="grid-template-columns: repeat({n}, minmax(0, 1fr));">
				{#each stages as stage, i (stage.code)}
					{@const Icon = stage.icon}
					<li class="flex flex-col items-center px-1 text-center">
						<div
							class="node-box grid h-14 w-14 place-items-center border {stage.boxClass}"
							style="--delay: {step * i}s; --pulse: {stage.pulse};"
						>
							<Icon size={22} stroke={1.5} />
						</div>
						<span class="mt-4 font-mono text-xs tracking-wider {stage.codeClass}">{stage.code}</span>
						<span class="mt-1 max-w-[12ch] text-[11px] leading-tight text-steel">{stage.label}</span>
					</li>
				{/each}
			</ol>
		</div>
	</div>
</div>

<style>
	.rail-base {
		stroke: var(--color-line-strong);
		stroke-width: 1.5;
	}

	.rail-draw {
		stroke: var(--color-steel-dim);
		stroke-width: 1.5;
		stroke-dasharray: var(--rail);
		stroke-dashoffset: var(--rail);
	}
	.started .rail-draw {
		transition: stroke-dashoffset 1.1s cubic-bezier(0.16, 1, 0.3, 1);
		stroke-dashoffset: 0;
	}

	.rail-pulse {
		stroke: var(--color-rust-bright);
		stroke-width: 2.5;
		stroke-dasharray: 22 9999;
		stroke-dashoffset: 0;
		opacity: 0;
		filter: drop-shadow(0 0 6px var(--color-rust));
	}
	.started .rail-pulse {
		opacity: 1;
		animation: travel var(--cycle) linear infinite 1.1s;
	}
	@keyframes travel {
		from {
			stroke-dashoffset: 0;
		}
		to {
			stroke-dashoffset: calc(-1 * var(--rail) * 1px);
		}
	}

	/* each node lights in its own app colour as the signal passes */
	.node-box {
		position: relative;
		transition: transform 0.3s;
	}
	.node-box::after {
		content: '';
		position: absolute;
		inset: -1px;
		border: 1px solid var(--pulse);
		opacity: 0;
	}
	.started .node-box::after {
		animation: nodeglow var(--cycle) ease-out infinite 1.1s;
		animation-delay: calc(1.1s + var(--delay));
	}
	@keyframes nodeglow {
		0% {
			opacity: 0;
			box-shadow: 0 0 0 0 transparent;
		}
		8% {
			opacity: 1;
			box-shadow: 0 0 18px -2px var(--pulse);
		}
		26% {
			opacity: 0;
			box-shadow: 0 0 0 0 transparent;
		}
		100% {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.started .rail-draw {
			transition: none;
			stroke-dashoffset: 0;
		}
		.rail-pulse {
			opacity: 0;
		}
		.started .rail-pulse,
		.started .node-box::after {
			animation: none;
		}
	}
</style>
