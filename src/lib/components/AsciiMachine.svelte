<script lang="ts">
	import { onMount } from 'svelte';

	type Seg = { t: string; c?: string };

	const INNER = 36;
	const reduceMotion =
		typeof window !== 'undefined' &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	let tick = $state(0);

	function pad(s: string) {
		return s.length >= INNER ? s.slice(0, INNER) : s + ' '.repeat(INNER - s.length);
	}
	function rep(ch: string, n: number) {
		return n > 0 ? ch.repeat(n) : '';
	}
	// Triangle wave 0..max..0 for the shuttle.
	function triangle(t: number, max: number) {
		const span = max * 2;
		const p = t % span;
		return p <= max ? p : span - p;
	}

	const GEAR = ['◴', '◷', '◶', '◵'];

	const lines = $derived.by<Seg[][]>(() => {
		const t = tick;
		const border = (l: string, r: string) => [{ t: l + rep('─', INNER) + r, c: 'line' }];

		// title + rotating gear
		const title = ' MERSAN STENTER PRO 3000';
		const gear = GEAR[t % GEAR.length];
		const titleRow: Seg[] = [
			{ t: '│', c: 'line' },
			{ t: title, c: 'bone' },
			{ t: rep(' ', INNER - title.length - 1), c: 'steel' },
			{ t: gear, c: 'rust' },
			{ t: '│', c: 'line' }
		];

		// rollers — fill alternates to read as rotation
		const fill = t % 2 ? '▓' : '▒';
		const rTop = pad('  ' + Array(5).fill('╔══╗').join(' '));
		const rMid = pad('  ' + Array(5).fill('║' + fill + fill + '║').join('═'));
		const rBot = pad('  ' + Array(5).fill('╚╤═╝').join(' '));
		const warp = pad(' ' + rep('─', INNER - 2));

		// shuttle gliding across the fabric
		const pos = triangle(t, INNER - 2);
		const fabricPre = rep('░', pos);
		const fabricPost = rep('░', INNER - pos - 2);
		const shuttleRow: Seg[] = [
			{ t: '│', c: 'line' },
			{ t: fabricPre, c: 'steel-dim' },
			{ t: '██', c: 'rust' },
			{ t: fabricPost, c: 'steel-dim' },
			{ t: '│', c: 'line' }
		];

		// conveyor — a marker scrolls left → right
		const mpos = t % INNER;
		const convRow: Seg[] = [
			{ t: '│', c: 'line' },
			{ t: rep('·', mpos), c: 'steel-dim' },
			{ t: '▶', c: 'amber' },
			{ t: rep('·', INNER - mpos - 1), c: 'steel-dim' },
			{ t: '│', c: 'line' }
		];

		// status panel
		const led = t % 2 ? '●' : '○';
		const metrics = pad(' TEMP 184°C · SPD 42m/min').slice(0, INNER - 9);
		const statusRow: Seg[] = [
			{ t: '│', c: 'line' },
			{ t: metrics, c: 'steel' },
			{ t: ' ', c: 'steel' },
			{ t: led, c: t % 2 ? 'green' : 'steel-dim' },
			{ t: ' ONLINE', c: 'steel' },
			{ t: '│', c: 'line' }
		];

		const plain = (s: string): Seg[] => [
			{ t: '│', c: 'line' },
			{ t: s, c: 'steel' },
			{ t: '│', c: 'line' }
		];

		return [
			border('┌', '┐'),
			titleRow,
			border('├', '┤'),
			plain(rTop),
			plain(rMid),
			plain(rBot),
			plain(warp),
			shuttleRow,
			plain(pad(' ' + rep('─', INNER - 2))),
			convRow,
			border('├', '┤'),
			statusRow,
			border('└', '┘')
		];
	});

	onMount(() => {
		if (reduceMotion) return;
		const id = setInterval(() => (tick = (tick + 1) % 100000), 170);
		return () => clearInterval(id);
	});
</script>

<div class="ascii" aria-hidden="true">
	<pre>{#each lines as line, i (i)}<div class="row">{#each line as seg, j (j)}<span class={seg.c}>{seg.t}</span>{/each}</div>{/each}</pre>
</div>

<style>
	.ascii {
		display: flex;
		justify-content: center;
	}
	pre {
		margin: 0;
		font-family: var(--font-mono);
		font-size: clamp(7px, 1.55vw, 13px);
		line-height: 1.34;
		letter-spacing: 0;
		white-space: pre;
		filter: drop-shadow(0 0 28px oklch(0.63 0.145 48 / 0.12));
	}
	.row {
		white-space: pre;
	}
	.line {
		color: var(--color-line-strong);
	}
	.steel {
		color: var(--color-steel);
	}
	.steel-dim {
		color: var(--color-steel-dim);
	}
	.bone {
		color: var(--color-bone);
	}
	.rust {
		color: var(--color-rust-bright);
		text-shadow: 0 0 8px var(--color-rust);
	}
	.amber {
		color: var(--color-amber);
	}
	.green {
		color: #34d399;
		text-shadow: 0 0 8px #34d39988;
	}
</style>
