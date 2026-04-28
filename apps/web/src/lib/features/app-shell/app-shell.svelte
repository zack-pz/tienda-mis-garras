<script lang="ts">
	import type { Role } from '@garras/shared-types';
	import { getNavigationForRole } from '../navigation/navigation.model';

	let { role, children }: { role?: Role | string | null; children?: import('svelte').Snippet } = $props();
	const items = $derived(getNavigationForRole(role));
</script>

<div class="app-shell">
	<aside aria-label="Navegación principal">
		<h2>Mis Garras</h2>
		<nav>
			<ul>
				{#each items as item (item.href)}
					<li><a href={item.href}>{item.title}</a></li>
				{/each}
			</ul>
		</nav>
	</aside>

	<main>
		{#if children}
			{@render children()}
		{/if}
	</main>
</div>

<style>
	.app-shell {
		display: grid;
		grid-template-columns: 240px minmax(0, 1fr);
		min-height: 100vh;
	}
</style>
