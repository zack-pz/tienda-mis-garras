<script lang="ts">
	import '../layout.css';
	import AppShell from '$lib/features/app-shell/app-shell.svelte';

	let { children, data } = $props();
</script>

<AppShell role={data.role}>
	{@render children()}
</AppShell>
