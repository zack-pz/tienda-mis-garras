<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { login } from '$lib/features/auth/api/auth.api';
	import { loginSchema } from '$lib/features/auth/schema/login.schema';
	import type { LoginSchema } from '$lib/features/auth/schema/login.schema';

	const nextPath = $derived(page.url.searchParams.get('next') ?? '/dashboard');
	let credentials = $state<LoginSchema>({ nombreUsuario: '', contrasena: '' });
	let submitError = $state<string | null>(null);
	let isSubmitting = $state(false);

	async function submitLogin(): Promise<void> {
		submitError = null;
		const parsed = loginSchema.safeParse(credentials);

		if (!parsed.success) {
			submitError = parsed.error.issues[0]?.message ?? 'Revisá los campos';
			return;
		}

		isSubmitting = true;
		try {
			const response = await login(fetch, parsed.data);
			if (!response.ok) {
				submitError = response.error.message;
				return;
			}

			await goto(nextPath);
		} catch {
			submitError = 'No se pudo iniciar sesión';
		} finally {
			isSubmitting = false;
		}
	}

	function handleSubmit(event: SubmitEvent): void {
		event.preventDefault();
		event.stopPropagation();
		void submitLogin();
	}
</script>

<main class="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
	<h1 class="text-2xl font-semibold">Iniciar sesión</h1>
	<p class="mt-2 text-sm text-muted-foreground">Ingresá con tu usuario del sistema</p>

	<form class="mt-6 space-y-4" onsubmit={handleSubmit}>
		<label class="block">
			<span class="mb-1 block text-sm font-medium">Usuario</span>
			<input
				name="nombreUsuario"
				bind:value={credentials.nombreUsuario}
				class="w-full rounded-md border border-input bg-background px-3 py-2"
				autocomplete="username"
			/>
		</label>

		<label class="block">
			<span class="mb-1 block text-sm font-medium">Contraseña</span>
			<input
				name="contrasena"
				type="password"
				bind:value={credentials.contrasena}
				class="w-full rounded-md border border-input bg-background px-3 py-2"
				autocomplete="current-password"
			/>
		</label>

		{#if submitError}
			<p class="text-sm text-destructive">{submitError}</p>
		{/if}

		<button
			type="button"
			class="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
			disabled={isSubmitting}
			onclick={() => void submitLogin()}
		>
			{isSubmitting ? 'Ingresando…' : 'Ingresar'}
		</button>
	</form>
</main>
