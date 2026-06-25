<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>MechFlow — Industrial machine flow, tracked end to end</title>
	<meta
		name="description"
		content="MechFlow tracks every machine from order to installation across the globe — real-time, type-safe, built for machinery manufacturers."
	/>
</svelte:head>

{@render children()}
