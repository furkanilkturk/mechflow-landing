<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import ThermalShader from '$lib/components/ThermalShader.svelte';
	import CustomersGlobe from '$lib/components/CustomersGlobe.svelte';
	import FlowLine from '$lib/components/FlowLine.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { theme } from '$lib/theme.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { generateSampleReport } from '$lib/utils/sample-report';
	import { m } from '$lib/paraglide/messages';
	import { getLocale, setLocale, locales, baseLocale } from '$lib/paraglide/runtime';
	import DownloadIcon from '@tabler/icons-svelte/icons/download';
	import ArrowRightIcon from '@tabler/icons-svelte/icons/arrow-right';
	import MenuIcon from '@tabler/icons-svelte/icons/menu-2';
	import XIcon from '@tabler/icons-svelte/icons/x';

	// Active locale. Starts at the prerendered base locale so the first client
	// render matches the SSR HTML (no hydration mismatch); onMount adopts the
	// visitor's stored choice. {#key locale} re-renders all copy on switch.
	let locale = $state(baseLocale);
	function switchLocale(next: (typeof locales)[number]) {
		if (next === locale) return;
		setLocale(next, { reload: false }); // writes localStorage + cookie, no reload
		locale = next;
	}

	// Sticky-nav scroll state — bar gains a backdrop once you leave the top.
	let scrolled = $state(false);
	let menuOpen = $state(false);
	onMount(() => {
		const stored = getLocale();
		if (stored !== locale) locale = stored;

		const onScroll = () => (scrolled = window.scrollY > 24);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	$effect(() => {
		if (browser) document.documentElement.lang = locale;
	});

	import ClipboardIcon from '@tabler/icons-svelte/icons/clipboard';
	import SettingsIcon from '@tabler/icons-svelte/icons/settings';
	import ToolIcon from '@tabler/icons-svelte/icons/tool';
	import TruckIcon from '@tabler/icons-svelte/icons/truck';
	import ClockIcon from '@tabler/icons-svelte/icons/clock';

	import BoltIcon from '@tabler/icons-svelte/icons/bolt';
	import DevicesIcon from '@tabler/icons-svelte/icons/devices';
	import BellIcon from '@tabler/icons-svelte/icons/bell';
	import WorldIcon from '@tabler/icons-svelte/icons/world';
	import FileTextIcon from '@tabler/icons-svelte/icons/file-text';
	import LanguageIcon from '@tabler/icons-svelte/icons/language';

	// Real app modules (from the sidebar) — shows the platform's full surface.
	import DashboardIcon from '@tabler/icons-svelte/icons/dashboard';
	import FactoryIcon from '@tabler/icons-svelte/icons/building-factory-2';
	import ChartBarIcon from '@tabler/icons-svelte/icons/chart-bar';
	import ActivityIcon from '@tabler/icons-svelte/icons/activity';
	import SpeakerphoneIcon from '@tabler/icons-svelte/icons/speakerphone';
	import UsersIcon from '@tabler/icons-svelte/icons/users';
	import BuildingSkyscraperIcon from '@tabler/icons-svelte/icons/building-skyscraper';

	// Machine lifecycle — same icons + colours as the MechFlow app's status badges.
	// Derived so labels re-resolve on locale switch and the node tints deepen
	// in light mode (the dark /10 fills wash out on a white surface).
	const stages = $derived.by(() => {
		void locale;
		const light = theme.value === 'light';
		return [
		{
			code: 'ORD',
			label: m.stage_ord(),
			icon: ClipboardIcon,
			boxClass: light
				? 'border-blue-500/55 text-blue-600'
				: 'border-blue-400/30 text-blue-400',
			codeClass: light ? 'text-blue-600' : 'text-blue-400',
			pulse: 'var(--color-blue-400)'
		},
		{
			code: 'ASM',
			label: m.stage_asm(),
			icon: SettingsIcon,
			boxClass: light
				? 'border-amber-500/55 text-amber-600'
				: 'border-amber-400/30 text-amber-400',
			codeClass: light ? 'text-amber-600' : 'text-amber-400',
			pulse: 'var(--color-amber-400)'
		},
		{
			code: 'TST',
			label: m.stage_tst(),
			icon: ToolIcon,
			boxClass: light
				? 'border-purple-500/55 text-purple-600'
				: 'border-purple-400/30 text-purple-400',
			codeClass: light ? 'text-purple-600' : 'text-purple-400',
			pulse: 'var(--color-purple-400)'
		},
		{
			code: 'SHP',
			label: m.stage_shp(),
			icon: TruckIcon,
			boxClass: light
				? 'border-indigo-500/55 text-indigo-600'
				: 'border-indigo-400/30 text-indigo-400',
			codeClass: light ? 'text-indigo-600' : 'text-indigo-400',
			pulse: 'var(--color-indigo-400)'
		},
		{
			code: 'INS',
			label: m.stage_ins(),
			icon: ClockIcon,
			boxClass: light
				? 'border-teal-500/55 text-teal-600'
				: 'border-teal-400/30 text-teal-400',
			codeClass: light ? 'text-teal-600' : 'text-teal-400',
			pulse: 'var(--color-teal-400)'
		}
		];
	});

	// The full platform surface — one card per real app module.
	const modules = $derived.by(() => {
		void locale;
		return [
		{ icon: DashboardIcon, title: m.mod_dashboard_title(), body: m.mod_dashboard_body() },
		{ icon: FactoryIcon, title: m.mod_machines_title(), body: m.mod_machines_body() },
		{ icon: ChartBarIcon, title: m.mod_statistics_title(), body: m.mod_statistics_body() },
		{ icon: ActivityIcon, title: m.mod_activity_title(), body: m.mod_activity_body() },
		{ icon: SpeakerphoneIcon, title: m.mod_announcements_title(), body: m.mod_announcements_body() },
		{ icon: BellIcon, title: m.mod_notifications_title(), body: m.mod_notifications_body() },
		{ icon: UsersIcon, title: m.mod_team_title(), body: m.mod_team_body() },
		{ icon: BuildingSkyscraperIcon, title: m.mod_companies_title(), body: m.mod_companies_body() },
		{ icon: WorldIcon, title: m.mod_countries_title(), body: m.mod_countries_body() },
		{ icon: SettingsIcon, title: m.mod_settings_title(), body: m.mod_settings_body() }
		];
	});

	const roles = $derived.by(() => {
		void locale;
		return [
		{ label: m.role_administrator(), custom: false },
		{ label: m.role_general_manager(), custom: false },
		{ label: m.role_plant_manager(), custom: false },
		{ label: m.role_support_lead(), custom: false },
		{ label: m.role_site_manager(), custom: false },
		{ label: m.role_technician(), custom: false },
		{ label: m.role_custom(), custom: true }
		];
	});

	const perms = $derived.by(() => {
		void locale;
		return [
		m.perm_view_dashboard(),
		m.perm_manage_machines(),
		m.perm_view_statistics(),
		m.perm_manage_team(),
		m.perm_manage_companies(),
		m.perm_manage_settings()
		];
	});

	// Benefit-led capabilities — `id` stays stable for keys/anchors; the rest is localized.
	const features = $derived.by(() => {
		void locale;
		return [
		{
			id: 'live',
			tag: m.feat_live_tag(),
			icon: BoltIcon,
			title: m.feat_live_title(),
			body: m.feat_live_body(),
			wide: true
		},
		{
			id: 'anywhere',
			tag: m.feat_anywhere_tag(),
			icon: DevicesIcon,
			title: m.feat_anywhere_title(),
			body: m.feat_anywhere_body()
		},
		{
			id: 'alerts',
			tag: m.feat_alerts_tag(),
			icon: BellIcon,
			title: m.feat_alerts_title(),
			body: m.feat_alerts_body()
		},
		{
			id: 'fleet',
			tag: m.feat_fleet_tag(),
			icon: WorldIcon,
			title: m.feat_fleet_title(),
			body: m.feat_fleet_body()
		},
		{
			id: 'reports',
			tag: m.feat_reports_tag(),
			icon: FileTextIcon,
			title: m.feat_reports_title(),
			body: m.feat_reports_body()
		},
		{
			id: 'languages',
			tag: m.feat_languages_tag(),
			icon: LanguageIcon,
			title: m.feat_languages_title(),
			body: m.feat_languages_body()
		}
		];
	});
</script>

<!-- segmented EN/TR control, reused in the nav, mobile menu and footer -->
{#snippet langSwitch()}
	<div class="inline-flex border border-line-strong font-mono text-xs">
		{#each locales as l (l)}
			<button
				type="button"
				onclick={() => switchLocale(l)}
				class="px-3 py-1.5 uppercase transition-colors {locale === l
					? 'bg-bone text-ink'
					: 'text-steel hover:text-bone'}"
				aria-pressed={locale === l}
			>
				{l}
			</button>
		{/each}
	</div>
{/snippet}

<!-- everything re-renders when the locale changes -->
{#key locale}
<div class="relative">
	<!-- sticky nav — follows down the whole page -->
	<header
		class:surface-dark={!scrolled && !menuOpen && theme.value === 'dark'}
		class="fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 {scrolled || menuOpen
			? 'border-line bg-ink/80 backdrop-blur-md'
			: 'border-transparent bg-transparent'}"
	>
		<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
			<a href="#top" class="flex items-center gap-2.5" onclick={() => (menuOpen = false)}>
				<div class="grid h-7 w-7 place-items-center bg-rust">
					<div class="h-2.5 w-2.5 bg-ink"></div>
				</div>
				<span class="font-display text-lg font-semibold tracking-tight">MechFlow</span>
			</a>
			<nav class="hidden items-center gap-8 font-mono text-xs tracking-wide text-steel md:flex">
				<a class="transition-colors hover:text-bone" href="#platform">{m.nav_platform()}</a>
				<a class="transition-colors hover:text-bone" href="#flow">{m.nav_flow()}</a>
				<a class="transition-colors hover:text-bone" href="#reports">{m.nav_reports()}</a>
			</nav>
			<div class="hidden items-center gap-3 md:flex">
				{@render langSwitch()}
				<ThemeToggle />
				<a
					href="#demo"
					class="border border-line-strong px-4 py-2 font-mono text-xs tracking-wide text-bone transition-colors hover:bg-bone hover:text-ink"
				>
					{m.request_access()}
				</a>
			</div>

			<!-- mobile toggle -->
			<button
				class="grid h-9 w-9 place-items-center text-bone md:hidden"
				aria-label={menuOpen ? m.menu_close() : m.menu_open()}
				aria-expanded={menuOpen}
				onclick={() => (menuOpen = !menuOpen)}
			>
				{#if menuOpen}
					<XIcon size={22} stroke={1.5} />
				{:else}
					<MenuIcon size={22} stroke={1.5} />
				{/if}
			</button>
		</div>

		<!-- mobile menu panel -->
		{#if menuOpen}
			<nav class="border-t border-line bg-ink/95 backdrop-blur-md md:hidden">
				<div class="mx-auto flex max-w-7xl flex-col px-6 py-2">
					<a
						class="border-b border-line py-3.5 font-mono text-sm tracking-wide text-steel transition-colors hover:text-bone"
						href="#platform"
						onclick={() => (menuOpen = false)}>{m.nav_platform()}</a
					>
					<a
						class="border-b border-line py-3.5 font-mono text-sm tracking-wide text-steel transition-colors hover:text-bone"
						href="#flow"
						onclick={() => (menuOpen = false)}>{m.nav_flow()}</a
					>
					<a
						class="border-b border-line py-3.5 font-mono text-sm tracking-wide text-steel transition-colors hover:text-bone"
						href="#reports"
						onclick={() => (menuOpen = false)}>{m.nav_reports()}</a
					>
					<a
						class="mt-3 bg-rust px-4 py-3 text-center font-mono text-sm tracking-wide text-bone"
						href="#demo"
						onclick={() => (menuOpen = false)}>{m.request_access()}</a
					>
					<div class="mt-4 mb-2 flex items-center justify-between">
						{@render langSwitch()}
						<ThemeToggle />
					</div>
				</div>
			</nav>
		{/if}
	</header>

	<!-- HERO — full-bleed thermal shader background (follows the theme) -->
	<section id="top" class="relative isolate overflow-hidden">
		<!-- shader -->
		<ThermalShader class="absolute inset-0 -z-30 h-full w-full" />

		<!-- industrial grid over the shader -->
		<div
			class="pointer-events-none absolute inset-0 -z-20
			       [background-image:linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)]
			       [background-size:64px_64px]"
		></div>

		<!-- legibility scrims + seamless handoff to the page background -->
		<div class="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/55 to-ink/5"></div>
		<div class="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/35 to-transparent"></div>

		<!-- hero content, spread across the shader -->
		<div class="mx-auto max-w-7xl px-6 pb-20 pt-28 sm:pb-28 lg:pb-36 lg:pt-40">
			<div
				use:reveal={{ delay: 0 }}
				class="mb-7 inline-flex items-center gap-2 border border-line-strong bg-ink/40 px-3 py-1.5 font-mono text-[11px] tracking-wider text-bone/80 backdrop-blur-sm"
			>
				<span class="h-1.5 w-1.5 animate-pulse bg-amber"></span>
				{m.hero_badge()}
			</div>

			<h1
				use:reveal={{ delay: 0.08 }}
				class="max-w-4xl text-balance text-[2.75rem] leading-[1.03] sm:text-6xl sm:leading-[0.98] lg:text-[5.5rem] lg:leading-[0.95]"
			>
				{m.hero_title()}
				<span class="text-rust">{m.hero_title_accent()}</span>
			</h1>

			<p
				use:reveal={{ delay: 0.18 }}
				class="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-bone/70"
			>
				{m.hero_sub()}
			</p>

			<div use:reveal={{ delay: 0.28 }} class="mt-10 flex flex-wrap items-center gap-3">
				<a
					href="#demo"
					class="bg-rust px-7 py-4 font-mono text-sm tracking-wide text-bone transition-colors hover:bg-rust-bright"
				>
					{m.hero_cta_primary()} →
				</a>
				<a
					href="#flow"
					class="border border-line-strong bg-ink/40 px-7 py-4 font-mono text-sm tracking-wide text-bone backdrop-blur-sm transition-colors hover:bg-ink"
				>
					{m.hero_cta_secondary()}
				</a>
			</div>

		</div>
	</section>

	<!-- global footprint -->
	<section id="fleet" class="border-t border-line">
		<div
			class="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[1fr_1.1fr]"
		>
			<div use:reveal={{ onView: true }}>
				<span class="font-mono text-[11px] tracking-wider text-rust">{m.fleet_eyebrow()}</span>
				<h2 class="mt-4 text-3xl leading-tight sm:text-4xl lg:text-5xl">
					{m.fleet_title_a()}<br class="hidden sm:block" /> {m.fleet_title_b()}
				</h2>
				<p class="mt-5 max-w-md text-pretty text-base leading-relaxed text-steel">
					{m.fleet_body()}
				</p>

				<dl class="mt-10 grid max-w-md grid-cols-3 gap-px border border-line bg-line">
					{#each [[m.fleet_stat_countries(), '12'], [m.fleet_stat_customers(), '54'], [m.fleet_stat_machines(), '915']] as [label, value] (value)}
						<div class="bg-ink px-4 py-4">
							<dt class="font-mono text-[10px] tracking-wider text-steel-dim">{label}</dt>
							<dd class="mt-1 font-display text-2xl font-medium text-bone">{value}</dd>
						</div>
					{/each}
				</dl>

				<p class="mt-6 font-mono text-[11px] tracking-wider text-steel-dim">
					{m.fleet_hint()}
				</p>
			</div>

			<div use:reveal={{ onView: true, y: 0 }}>
				<CustomersGlobe />
			</div>
		</div>
	</section>

	<!-- capabilities -->
	<section id="platform" class="border-t border-line">
		<div class="mx-auto max-w-7xl px-6 py-20 sm:py-28">
			<div use:reveal={{ onView: true }} class="max-w-2xl">
				<span class="font-mono text-[11px] tracking-wider text-rust">{m.cap_eyebrow()}</span>
				<h2 class="mt-4 text-3xl leading-tight sm:text-4xl lg:text-5xl">
					{m.cap_title_a()}<br class="hidden sm:block" /> {m.cap_title_b()}
				</h2>
				<p class="mt-5 text-pretty text-base leading-relaxed text-steel">
					{m.cap_body()}
				</p>
			</div>

			<div
				use:reveal={{ onView: true }}
				class="mt-14 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
			>
				{#each features as feature (feature.id)}
					{@const Icon = feature.icon}
					<article
						id={feature.id === 'reports' ? 'reports' : undefined}
						class="group flex scroll-mt-24 flex-col bg-ink p-7 transition-colors hover:bg-ink-2 {feature.wide
							? 'sm:col-span-2 lg:col-span-1'
							: ''}"
					>
						<div class="flex items-center justify-between">
							<span
								class="grid h-10 w-10 place-items-center border border-line-strong text-rust transition-colors group-hover:border-rust/50"
							>
								<Icon size={20} stroke={1.5} />
							</span>
							<span class="font-mono text-[10px] tracking-wider text-steel-dim">{feature.tag}</span>
						</div>
						<h3 class="mt-6 text-xl">{feature.title}</h3>
						<p class="mt-3 text-sm leading-relaxed text-steel">{feature.body}</p>
						{#if feature.id === 'reports'}
							<button
								onclick={generateSampleReport}
								class="mt-5 inline-flex w-fit items-center gap-2 border border-rust/40 bg-rust/10 px-4 py-2.5 font-mono text-xs tracking-wide text-rust transition-colors hover:bg-rust hover:text-bone"
							>
								<DownloadIcon size={15} stroke={1.5} />
								{m.feat_download_sample()}
							</button>
						{/if}
					</article>
				{/each}
			</div>
		</div>
	</section>

	<!-- stage pipeline — the lifecycle the product encodes -->
	<section id="flow" class="border-t border-line">
		<div class="mx-auto max-w-7xl px-6 py-16 sm:py-20">
			<div use:reveal={{ onView: true }} class="mb-10 flex items-baseline justify-between gap-4">
				<h2 class="text-2xl sm:text-3xl">{m.flow_title()}</h2>
				<span class="font-mono text-[11px] tracking-wider text-steel-dim">{m.flow_fig()}</span>
			</div>
			<FlowLine {stages} />
		</div>
	</section>

	<!-- complete platform: every module -->
	<section class="border-t border-line">
		<div class="mx-auto max-w-7xl px-6 py-20 sm:py-28">
			<div use:reveal={{ onView: true }} class="max-w-2xl">
				<span class="font-mono text-[11px] tracking-wider text-rust">{m.modules_eyebrow()}</span>
				<h2 class="mt-4 text-3xl leading-tight sm:text-4xl lg:text-5xl">
					{m.modules_title_a()}<br class="hidden sm:block" /> {m.modules_title_b()}
				</h2>
				<p class="mt-5 text-pretty text-base leading-relaxed text-steel">
					{m.modules_body()}
				</p>
			</div>

			<div
				use:reveal={{ onView: true }}
				class="mt-14 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-5"
			>
				{#each modules as module (module.title)}
					{@const Icon = module.icon}
					<div class="group bg-ink p-5 transition-colors hover:bg-ink-2">
						<span class="grid h-9 w-9 place-items-center border border-line-strong text-rust transition-colors group-hover:border-rust/50">
							<Icon size={18} stroke={1.5} />
						</span>
						<h3 class="mt-4 font-display text-base font-medium">{module.title}</h3>
						<p class="mt-1.5 text-[13px] leading-snug text-steel">{module.body}</p>
					</div>
				{/each}
			</div>

			<!-- roles & permissions -->
			<div
				use:reveal={{ onView: true, y: 24 }}
				class="mt-6 grid gap-px border border-line bg-line sm:mt-8 lg:grid-cols-[1fr_1.2fr]"
			>
				<div class="bg-ink p-8">
					<span class="font-mono text-[11px] tracking-wider text-amber">{m.roles_eyebrow()}</span>
					<h3 class="mt-4 text-2xl leading-tight">{m.roles_title()}</h3>
					<p class="mt-4 text-sm leading-relaxed text-steel">
						{m.roles_body()}
					</p>
				</div>
				<div class="flex flex-col justify-center gap-4 bg-ink p-8">
					<div class="flex flex-wrap gap-2">
						{#each roles as role (role.label)}
							<span
								class="border px-3 py-1.5 font-mono text-xs tracking-wide {role.custom
									? 'border-rust/40 bg-rust/10 text-rust'
									: 'border-line-strong text-steel'}"
							>
								{role.label}
							</span>
						{/each}
					</div>
					<div class="mt-2 grid grid-cols-2 gap-px border border-line bg-line font-mono text-[11px] sm:grid-cols-3">
						{#each perms as perm (perm)}
							<div class="flex items-center gap-2 bg-ink px-3 py-2 text-steel">
								<span class="h-1 w-1 bg-rust"></span>{perm}
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- social proof -->
	<section class="border-t border-line">
		<div class="mx-auto max-w-7xl px-6 py-16 sm:py-20">
			<div use:reveal={{ onView: true }} class="flex flex-col items-center gap-6">
				<span class="font-mono text-[11px] tracking-wider text-steel-dim">{m.proof_eyebrow()}</span>
				<div
					class="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-display text-lg font-semibold tracking-tight text-steel sm:gap-x-12 sm:text-xl"
				>
					<span>MERSAN</span>
					<span class="hidden h-4 w-px bg-line-strong sm:block"></span>
					<span>DOKUMA TEKSTİL</span>
					<span class="hidden h-4 w-px bg-line-strong sm:block"></span>
					<span>ANAND MILLS</span>
					<span class="hidden h-4 w-px bg-line-strong sm:block"></span>
					<span>NILE WEAVE</span>
					<span class="hidden h-4 w-px bg-line-strong sm:block"></span>
					<span>DHAKA FABRICS</span>
				</div>
			</div>

			<figure
				use:reveal={{ onView: true, y: 24 }}
				class="mx-auto mt-14 max-w-3xl border border-line bg-ink-2/40 p-8 text-center sm:p-12"
			>
				<div class="font-mono text-3xl leading-none text-rust">"</div>
				<blockquote class="mt-3 text-balance text-xl leading-relaxed sm:text-2xl">
					{m.proof_quote()}
				</blockquote>
				<figcaption class="mt-7 flex items-center justify-center gap-3 font-mono text-[11px] tracking-wider text-steel">
					<span class="grid h-8 w-8 place-items-center bg-rust text-bone">MŞ</span>
					<span class="text-left">
						<span class="block text-bone">MEHMET ŞAHİN</span>
						<span class="block text-steel-dim">{m.proof_role()}</span>
					</span>
				</figcaption>
			</figure>
		</div>
	</section>

	<!-- CTA — thermal shader echo (follows the theme) -->
	<section id="demo" class="relative isolate scroll-mt-20 overflow-hidden border-t border-line">
		<ThermalShader class="absolute inset-0 -z-30 h-full w-full" />
		<div class="pointer-events-none absolute inset-0 -z-10 bg-ink/70"></div>
		<div class="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink"></div>

		<div use:reveal={{ onView: true }} class="mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
			<span class="font-mono text-[11px] tracking-wider text-amber">● {m.cta_eyebrow()}</span>
			<h2 class="mt-5 text-balance text-4xl leading-tight sm:text-5xl lg:text-6xl">
				{m.cta_title()}
			</h2>
			<p class="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-bone/70">
				{m.cta_body()}
			</p>

			<form
				class="mx-auto mt-9 flex max-w-md flex-col gap-px border border-line-strong bg-line sm:flex-row"
				onsubmit={(event) => event.preventDefault()}
			>
				<input
					type="email"
					required
					placeholder={m.cta_email_placeholder()}
					class="flex-1 bg-ink/80 px-4 py-3.5 font-mono text-sm text-bone placeholder:text-steel-dim focus:outline-none focus:ring-1 focus:ring-rust"
				/>
				<button
					type="submit"
					class="inline-flex items-center justify-center gap-2 bg-rust px-6 py-3.5 font-mono text-sm tracking-wide text-bone transition-colors hover:bg-rust-bright"
				>
					{m.request_access()}
					<ArrowRightIcon size={16} stroke={1.5} />
				</button>
			</form>

			<button
				onclick={generateSampleReport}
				class="mx-auto mt-5 inline-flex items-center gap-2 font-mono text-xs tracking-wide text-steel transition-colors hover:text-bone"
			>
				<DownloadIcon size={14} stroke={1.5} />
				{m.cta_download()}
			</button>
		</div>
	</section>

	<!-- footer -->
	<footer class="border-t border-line">
		<div class="mx-auto max-w-7xl px-6 py-16">
			<div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
				<div>
					<div class="flex items-center gap-2.5">
						<div class="grid h-7 w-7 place-items-center bg-rust">
							<div class="h-2.5 w-2.5 bg-ink"></div>
						</div>
						<span class="font-display text-lg font-semibold tracking-tight">MechFlow</span>
					</div>
					<p class="mt-4 max-w-xs text-sm leading-relaxed text-steel">
						{m.footer_tagline()}
					</p>
				</div>

				<div>
					<h3 class="font-mono text-[10px] tracking-wider text-steel-dim">{m.footer_product()}</h3>
					<ul class="mt-4 space-y-2.5 text-sm text-steel">
						<li><a class="transition-colors hover:text-bone" href="#platform">{m.footer_link_platform()}</a></li>
						<li><a class="transition-colors hover:text-bone" href="#flow">{m.footer_link_lifecycle()}</a></li>
						<li><a class="transition-colors hover:text-bone" href="#reports">{m.footer_link_reports()}</a></li>
					</ul>
				</div>

				<div>
					<h3 class="font-mono text-[10px] tracking-wider text-steel-dim">{m.footer_company()}</h3>
					<ul class="mt-4 space-y-2.5 text-sm text-steel">
						<li><a class="transition-colors hover:text-bone" href="#top">{m.footer_link_about()}</a></li>
						<li><a class="transition-colors hover:text-bone" href="#demo">{m.footer_link_contact()}</a></li>
						<li><a class="transition-colors hover:text-bone" href="#demo">{m.footer_link_request()}</a></li>
					</ul>
				</div>

				<div>
					<h3 class="font-mono text-[10px] tracking-wider text-steel-dim">{m.footer_language()}</h3>
					<div class="mt-4">
						{@render langSwitch()}
					</div>
				</div>
			</div>

			<div
				class="mt-14 flex flex-col gap-2 border-t border-line pt-6 font-mono text-[11px] tracking-wide text-steel-dim sm:flex-row sm:items-center sm:justify-between"
			>
				<span>{m.footer_copyright()}</span>
				<span>{m.footer_motto()}</span>
			</div>
		</div>
	</footer>
</div>
{/key}
