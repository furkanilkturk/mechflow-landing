<script lang="ts">
	import { theme } from '$lib/theme.svelte';
	import SunIcon from '@tabler/icons-svelte/icons/sun';
	import MoonIcon from '@tabler/icons-svelte/icons/moon';

	let { class: className = '' }: { class?: string } = $props();
</script>

<button
	type="button"
	onclick={() => theme.toggle()}
	class="grid h-9 w-9 place-items-center border border-line-strong text-steel transition-colors hover:text-bone {className}"
	aria-label={theme.value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
	title={theme.value === 'dark' ? 'Light' : 'Dark'}
>
	{#if theme.value === 'dark'}
		<SunIcon size={16} stroke={1.5} />
	{:else}
		<MoonIcon size={16} stroke={1.5} />
	{/if}
</button>
