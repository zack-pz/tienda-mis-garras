<script lang="ts">
	import '../layout.css';
	import AppShell from '$lib/features/app-shell/app-shell.svelte';

	let { children } = $props();
</script>

<AppShell role="staff">
	{@render children()}
</AppShell>
