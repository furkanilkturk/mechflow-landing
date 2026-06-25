import { animate, inView } from 'motion';

type RevealOptions = {
	/** Delay in seconds before the element animates in. */
	delay?: number;
	/** Pixels to travel upward into place. */
	y?: number;
	/** Animate on scroll-into-view instead of immediately on mount. */
	onView?: boolean;
};

const reduceMotion =
	typeof window !== 'undefined' &&
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Svelte action that fades + lifts an element into place using Motion.
 * Use `delay` to orchestrate a staggered page-load sequence.
 */
export function reveal(node: HTMLElement, options: RevealOptions = {}) {
	const { delay = 0, y = 18, onView = false } = options;

	if (reduceMotion) {
		node.style.opacity = '1';
		return {};
	}

	node.style.opacity = '0';

	const run = () =>
		animate(
			node,
			{ opacity: [0, 1], transform: [`translateY(${y}px)`, 'translateY(0px)'] },
			{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }
		);

	if (onView) {
		const stop = inView(node, () => {
			run();
		});
		return { destroy: stop };
	}

	run();
	return {};
}
