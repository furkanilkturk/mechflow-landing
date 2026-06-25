<script lang="ts">
	import { onMount } from 'svelte';
	import ThermalShader from '$lib/components/ThermalShader.svelte';
	import CustomersGlobe from '$lib/components/CustomersGlobe.svelte';
	import FlowLine from '$lib/components/FlowLine.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { generateSampleReport } from '$lib/utils/sample-report';
	import DownloadIcon from '@tabler/icons-svelte/icons/download';
	import ArrowRightIcon from '@tabler/icons-svelte/icons/arrow-right';
	import MenuIcon from '@tabler/icons-svelte/icons/menu-2';
	import XIcon from '@tabler/icons-svelte/icons/x';

	// Sticky-nav scroll state — bar gains a backdrop once you leave the top.
	let scrolled = $state(false);
	let menuOpen = $state(false);
	onMount(() => {
		const onScroll = () => (scrolled = window.scrollY > 24);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
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
	const stages = [
		{
			code: 'ORD',
			label: 'Order Created',
			icon: ClipboardIcon,
			boxClass: 'border-blue-400/30 bg-blue-400/10 text-blue-400',
			codeClass: 'text-blue-400',
			pulse: 'var(--color-blue-400)'
		},
		{
			code: 'ASM',
			label: 'Assembly',
			icon: SettingsIcon,
			boxClass: 'border-amber-400/30 bg-amber-400/10 text-amber-400',
			codeClass: 'text-amber-400',
			pulse: 'var(--color-amber-400)'
		},
		{
			code: 'TST',
			label: 'Testing',
			icon: ToolIcon,
			boxClass: 'border-purple-400/30 bg-purple-400/10 text-purple-400',
			codeClass: 'text-purple-400',
			pulse: 'var(--color-purple-400)'
		},
		{
			code: 'SHP',
			label: 'Ready for Shipment',
			icon: TruckIcon,
			boxClass: 'border-indigo-400/30 bg-indigo-400/10 text-indigo-400',
			codeClass: 'text-indigo-400',
			pulse: 'var(--color-indigo-400)'
		},
		{
			code: 'INS',
			label: 'Awaiting Installation',
			icon: ClockIcon,
			boxClass: 'border-teal-400/30 bg-teal-400/10 text-teal-400',
			codeClass: 'text-teal-400',
			pulse: 'var(--color-teal-400)'
		}
	];

	const telemetry = [
		['FLEET', '1,284 units'],
		['IN TRANSIT', '37'],
		['ON SITE', '11 countries'],
		['UPTIME', '99.98%']
	];

	// The full platform surface — one card per real app module.
	const modules = [
		{ icon: DashboardIcon, title: 'Dashboard', body: 'Your whole operation at a glance.' },
		{ icon: FactoryIcon, title: 'Machines', body: 'Every unit, every stage, full history.' },
		{ icon: ChartBarIcon, title: 'Statistics', body: 'Throughput, durations & bottlenecks.' },
		{ icon: ActivityIcon, title: 'Activity', body: 'A full audit trail of every change.' },
		{ icon: SpeakerphoneIcon, title: 'Announcements', body: 'Broadcast updates to the whole team.' },
		{ icon: BellIcon, title: 'Notifications', body: 'Alerts the moment they matter.' },
		{ icon: UsersIcon, title: 'Team', body: 'Roles & permissions for everyone.' },
		{ icon: BuildingSkyscraperIcon, title: 'Companies', body: 'Your customer & partner directory.' },
		{ icon: WorldIcon, title: 'Countries', body: 'The live global fleet map.' },
		{ icon: SettingsIcon, title: 'Settings', body: 'Tune the platform to your plant.' }
	];

	const roles = [
		'Administrator',
		'General Manager',
		'Plant Manager',
		'Support Lead',
		'Site Manager',
		'Technician',
		'+ Custom roles'
	];

	// Benefit-led capabilities — what the customer actually gets.
	const features = [
		{
			tag: 'LIVE',
			icon: BoltIcon,
			title: 'Live, the moment it happens',
			body: 'Every update from the production floor appears instantly. No refreshing — your whole team sees the same picture in real time.',
			wide: true
		},
		{
			tag: 'ANYWHERE',
			icon: DevicesIcon,
			title: 'Mobile, desktop & web',
			body: 'Phone on the workshop floor, laptop at the office, browser anywhere — the same dashboard, always in sync.'
		},
		{
			tag: 'ALERTS',
			icon: BellIcon,
			title: 'Push notifications',
			body: 'Get notified the second a machine needs attention — deadlines, delays and status changes reach you wherever you are.'
		},
		{
			tag: 'FLEET',
			icon: WorldIcon,
			title: 'Your whole fleet on the map',
			body: 'A live world map of every machine, customer and shipment, all at a glance.'
		},
		{
			tag: 'REPORTS',
			icon: FileTextIcon,
			title: 'Reports in one click',
			body: 'Branded PDF reports for any machine or time period — ready to print or send.'
		},
		{
			tag: 'LANGUAGES',
			icon: LanguageIcon,
			title: 'English & Turkish',
			body: 'Switch language instantly, so every team works the way they prefer.'
		}
	];
</script>

<div class="relative">
	<!-- sticky nav — follows down the whole page -->
	<header
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
				<a class="transition-colors hover:text-bone" href="#platform">PLATFORM</a>
				<a class="transition-colors hover:text-bone" href="#flow">FLOW</a>
				<a class="transition-colors hover:text-bone" href="#reports">REPORTS</a>
			</nav>
			<a
				href="#demo"
				class="hidden border border-line-strong px-4 py-2 font-mono text-xs tracking-wide text-bone transition-colors hover:bg-bone hover:text-ink md:inline-block"
			>
				REQUEST ACCESS
			</a>

			<!-- mobile toggle -->
			<button
				class="grid h-9 w-9 place-items-center text-bone md:hidden"
				aria-label={menuOpen ? 'Close menu' : 'Open menu'}
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
						onclick={() => (menuOpen = false)}>PLATFORM</a
					>
					<a
						class="border-b border-line py-3.5 font-mono text-sm tracking-wide text-steel transition-colors hover:text-bone"
						href="#flow"
						onclick={() => (menuOpen = false)}>FLOW</a
					>
					<a
						class="border-b border-line py-3.5 font-mono text-sm tracking-wide text-steel transition-colors hover:text-bone"
						href="#reports"
						onclick={() => (menuOpen = false)}>REPORTS</a
					>
					<a
						class="mt-3 mb-2 bg-rust px-4 py-3 text-center font-mono text-sm tracking-wide text-bone"
						href="#demo"
						onclick={() => (menuOpen = false)}>REQUEST ACCESS</a
					>
				</div>
			</nav>
		{/if}
	</header>

	<!-- HERO — full-bleed thermal shader background -->
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
				INDUSTRIAL OPERATIONS · REAL-TIME
			</div>

			<h1
				use:reveal={{ delay: 0.08 }}
				class="max-w-4xl text-balance text-[2.75rem] leading-[1.03] sm:text-6xl sm:leading-[0.98] lg:text-[5.5rem] lg:leading-[0.95]"
			>
				Every machine, from order to
				<span class="text-rust">the factory floor.</span>
			</h1>

			<p
				use:reveal={{ delay: 0.18 }}
				class="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-bone/70"
			>
				MechFlow tracks the full lifecycle of industrial machinery — assembly, testing,
				shipment, installation — across every client site on earth. Type-safe, real-time,
				built for manufacturers.
			</p>

			<div use:reveal={{ delay: 0.28 }} class="mt-10 flex flex-wrap items-center gap-3">
				<a
					href="#demo"
					class="bg-rust px-7 py-4 font-mono text-sm tracking-wide text-bone transition-colors hover:bg-rust-bright"
				>
					SEE IT LIVE →
				</a>
				<a
					href="#flow"
					class="border border-line-strong bg-ink/40 px-7 py-4 font-mono text-sm tracking-wide text-bone backdrop-blur-sm transition-colors hover:bg-ink"
				>
					HOW THE FLOW WORKS
				</a>
			</div>

			<dl
				use:reveal={{ delay: 0.38 }}
				class="mt-16 grid max-w-3xl grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4"
			>
				{#each telemetry as [label, value] (label)}
					<div class="bg-ink/70 px-4 py-4 backdrop-blur-sm">
						<dt class="font-mono text-[10px] tracking-wider text-steel-dim">{label}</dt>
						<dd class="mt-1 font-display text-lg font-medium text-bone">{value}</dd>
					</div>
				{/each}
			</dl>
		</div>

	</section>

	<!-- global footprint -->
	<section id="fleet" class="border-t border-line">
		<div
			class="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[1fr_1.1fr]"
		>
			<div use:reveal={{ onView: true }}>
				<span class="font-mono text-[11px] tracking-wider text-rust">GLOBAL FOOTPRINT</span>
				<h2 class="mt-4 text-3xl leading-tight sm:text-4xl lg:text-5xl">
					Every customer you've<br class="hidden sm:block" /> sold to, on one globe.
				</h2>
				<p class="mt-5 max-w-md text-pretty text-base leading-relaxed text-steel">
					Track not just your machines, but the customers running them — see where every unit
					lives, spin the globe, and drill into any country at a glance.
				</p>

				<dl class="mt-10 grid max-w-md grid-cols-3 gap-px border border-line bg-line">
					{#each [['COUNTRIES', '12'], ['CUSTOMERS', '54'], ['MACHINES', '915']] as [label, value] (label)}
						<div class="bg-ink px-4 py-4">
							<dt class="font-mono text-[10px] tracking-wider text-steel-dim">{label}</dt>
							<dd class="mt-1 font-display text-2xl font-medium text-bone">{value}</dd>
						</div>
					{/each}
				</dl>

				<p class="mt-6 font-mono text-[11px] tracking-wider text-steel-dim">
					↳ DRAG TO SPIN · HOVER A COUNTRY
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
				<span class="font-mono text-[11px] tracking-wider text-rust">CAPABILITIES</span>
				<h2 class="mt-4 text-3xl leading-tight sm:text-4xl lg:text-5xl">
					Built for the floor,<br class="hidden sm:block" /> not the demo.
				</h2>
				<p class="mt-5 text-pretty text-base leading-relaxed text-steel">
					Everything you need to run your machines worldwide — live, on every device,
					with your whole team always on the same page.
				</p>
			</div>

			<div
				use:reveal={{ onView: true }}
				class="mt-14 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
			>
				{#each features as feature (feature.tag)}
					{@const Icon = feature.icon}
					<article
						id={feature.tag === 'REPORTS' ? 'reports' : undefined}
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
						{#if feature.tag === 'REPORTS'}
							<button
								onclick={generateSampleReport}
								class="mt-5 inline-flex w-fit items-center gap-2 border border-rust/40 bg-rust/10 px-4 py-2.5 font-mono text-xs tracking-wide text-rust transition-colors hover:bg-rust hover:text-bone"
							>
								<DownloadIcon size={15} stroke={1.5} />
								DOWNLOAD SAMPLE PDF
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
				<h2 class="text-2xl sm:text-3xl">The lifecycle, end to end</h2>
				<span class="font-mono text-[11px] tracking-wider text-steel-dim">FIG.01 — MACHINE FLOW</span>
			</div>
			<FlowLine {stages} />
		</div>
	</section>

	<!-- complete platform: every module -->
	<section class="border-t border-line">
		<div class="mx-auto max-w-7xl px-6 py-20 sm:py-28">
			<div use:reveal={{ onView: true }} class="max-w-2xl">
				<span class="font-mono text-[11px] tracking-wider text-rust">EVERY MODULE</span>
				<h2 class="mt-4 text-3xl leading-tight sm:text-4xl lg:text-5xl">
					One platform for the<br class="hidden sm:block" /> whole operation.
				</h2>
				<p class="mt-5 text-pretty text-base leading-relaxed text-steel">
					From the shop floor to the front office — ten connected modules, one source of truth.
					No spreadsheets, no scattered tools.
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
				class="mt-px grid gap-px border border-line bg-line lg:grid-cols-[1fr_1.2fr]"
			>
				<div class="bg-ink p-8">
					<span class="font-mono text-[11px] tracking-wider text-amber">ROLES & ACCESS</span>
					<h3 class="mt-4 text-2xl leading-tight">Everyone sees exactly what they should.</h3>
					<p class="mt-4 text-sm leading-relaxed text-steel">
						Granular permissions per role, plus per-person data scoping — so a technician, a
						plant manager and the GM each get their own view. Use the built-in roles or design
						your own.
					</p>
				</div>
				<div class="flex flex-col justify-center gap-4 bg-ink p-8">
					<div class="flex flex-wrap gap-2">
						{#each roles as role (role)}
							<span
								class="border px-3 py-1.5 font-mono text-xs tracking-wide {role.startsWith('+')
									? 'border-rust/40 bg-rust/10 text-rust'
									: 'border-line-strong text-steel'}"
							>
								{role}
							</span>
						{/each}
					</div>
					<div class="mt-2 grid grid-cols-2 gap-px border border-line bg-line font-mono text-[11px] sm:grid-cols-3">
						{#each ['view dashboard', 'manage machines', 'view statistics', 'manage team', 'manage companies', 'manage settings'] as perm (perm)}
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
				<span class="font-mono text-[11px] tracking-wider text-steel-dim">TRUSTED ON THE FLOOR</span>
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
					We went from chasing status updates across WhatsApp and spreadsheets to one live
					board the whole company trusts. Nothing slips through anymore.
				</blockquote>
				<figcaption class="mt-7 flex items-center justify-center gap-3 font-mono text-[11px] tracking-wider text-steel">
					<span class="grid h-8 w-8 place-items-center bg-rust text-bone">MŞ</span>
					<span class="text-left">
						<span class="block text-bone">MEHMET ŞAHİN</span>
						<span class="block text-steel-dim">OPERATIONS DIRECTOR · MERSAN</span>
					</span>
				</figcaption>
			</figure>
		</div>
	</section>

	<!-- CTA — thermal shader echo -->
	<section id="demo" class="relative isolate scroll-mt-20 overflow-hidden border-t border-line">
		<ThermalShader class="absolute inset-0 -z-30 h-full w-full" />
		<div class="pointer-events-none absolute inset-0 -z-10 bg-ink/70"></div>
		<div class="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink"></div>

		<div use:reveal={{ onView: true }} class="mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
			<span class="font-mono text-[11px] tracking-wider text-amber">● GET STARTED</span>
			<h2 class="mt-5 text-balance text-4xl leading-tight sm:text-5xl lg:text-6xl">
				Put your whole fleet on MechFlow.
			</h2>
			<p class="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-bone/70">
				Book a walkthrough with your machines and your data. We'll have you live in days, not
				months.
			</p>

			<form
				class="mx-auto mt-9 flex max-w-md flex-col gap-px border border-line-strong bg-line sm:flex-row"
				onsubmit={(event) => event.preventDefault()}
			>
				<input
					type="email"
					required
					placeholder="you@company.com"
					class="flex-1 bg-ink/80 px-4 py-3.5 font-mono text-sm text-bone placeholder:text-steel-dim focus:outline-none focus:ring-1 focus:ring-rust"
				/>
				<button
					type="submit"
					class="inline-flex items-center justify-center gap-2 bg-rust px-6 py-3.5 font-mono text-sm tracking-wide text-bone transition-colors hover:bg-rust-bright"
				>
					REQUEST ACCESS
					<ArrowRightIcon size={16} stroke={1.5} />
				</button>
			</form>

			<button
				onclick={generateSampleReport}
				class="mx-auto mt-5 inline-flex items-center gap-2 font-mono text-xs tracking-wide text-steel transition-colors hover:text-bone"
			>
				<DownloadIcon size={14} stroke={1.5} />
				or download a sample report
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
						Industrial machine operations — tracked from order to the factory floor, live and
						worldwide.
					</p>
				</div>

				<div>
					<h3 class="font-mono text-[10px] tracking-wider text-steel-dim">PRODUCT</h3>
					<ul class="mt-4 space-y-2.5 text-sm text-steel">
						<li><a class="transition-colors hover:text-bone" href="#platform">Platform</a></li>
						<li><a class="transition-colors hover:text-bone" href="#flow">Lifecycle</a></li>
						<li><a class="transition-colors hover:text-bone" href="#reports">Reports</a></li>
					</ul>
				</div>

				<div>
					<h3 class="font-mono text-[10px] tracking-wider text-steel-dim">COMPANY</h3>
					<ul class="mt-4 space-y-2.5 text-sm text-steel">
						<li><a class="transition-colors hover:text-bone" href="#top">About</a></li>
						<li><a class="transition-colors hover:text-bone" href="#demo">Contact</a></li>
						<li><a class="transition-colors hover:text-bone" href="#demo">Request access</a></li>
					</ul>
				</div>

				<div>
					<h3 class="font-mono text-[10px] tracking-wider text-steel-dim">LANGUAGE</h3>
					<div class="mt-4 inline-flex border border-line-strong font-mono text-xs">
						<span class="bg-bone px-3 py-1.5 text-ink">EN</span>
						<span class="px-3 py-1.5 text-steel">TR</span>
					</div>
				</div>
			</div>

			<div
				class="mt-14 flex flex-col gap-2 border-t border-line pt-6 font-mono text-[11px] tracking-wide text-steel-dim sm:flex-row sm:items-center sm:justify-between"
			>
				<span>© 2026 MECHFLOW · ALL RIGHTS RESERVED</span>
				<span>KEEP YOUR INDUSTRIAL PROCESSES FLOWING.</span>
			</div>
		</div>
	</footer>
</div>
