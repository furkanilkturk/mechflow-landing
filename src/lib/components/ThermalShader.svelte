<script lang="ts">
	import { onMount } from 'svelte';

	let { class: className = '' }: { class?: string } = $props();

	let canvas: HTMLCanvasElement;

	const VERT = `
		attribute vec2 a_pos;
		void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
	`;

	// Domain-warped fbm — a slow "thermal field" in the brand palette.
	const FRAG = `
		precision highp float;
		uniform vec2 u_res;
		uniform float u_time;

		float hash(vec2 p){
			p = fract(p * vec2(123.34, 456.21));
			p += dot(p, p + 45.32);
			return fract(p.x * p.y);
		}
		float noise(vec2 p){
			vec2 i = floor(p), f = fract(p);
			f = f * f * (3.0 - 2.0 * f);
			float a = hash(i), b = hash(i + vec2(1.0, 0.0));
			float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
			return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
		}
		float fbm(vec2 p){
			float v = 0.0, a = 0.5;
			for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.02; a *= 0.5; }
			return v;
		}

		void main(){
			vec2 uv = gl_FragCoord.xy / u_res.xy;
			vec2 p = uv * 2.4;
			p.x *= u_res.x / u_res.y;

			float t = u_time * 0.06;

			// domain warp
			vec2 q = vec2(fbm(p + t), fbm(p + vec2(3.1, 1.7) - t));
			vec2 r = vec2(fbm(p + 1.6 * q + vec2(1.2, 9.2) + 0.15 * t),
			              fbm(p + 1.6 * q + vec2(8.3, 2.8) - 0.12 * t));
			float n = fbm(p + 2.0 * r);

			// brand palette
			vec3 ink   = vec3(0.050, 0.050, 0.060);
			vec3 steel = vec3(0.150, 0.160, 0.190);
			vec3 rust  = vec3(0.760, 0.300, 0.100);
			vec3 amber = vec3(0.960, 0.640, 0.190);

			vec3 col = ink;
			col = mix(col, steel, smoothstep(0.15, 0.65, n));
			col = mix(col, rust,  smoothstep(0.45, 0.92, n) * 0.95);
			float heat = pow(smoothstep(0.62, 0.98, length(r)), 1.6);
			col = mix(col, amber, heat * 0.85);

			// vignette toward the panel edges
			float vig = smoothstep(1.15, 0.25, length(uv - 0.5));
			col *= 0.45 + 0.55 * vig;

			// fine grain to keep it from banding / feeling plastic
			float g = hash(gl_FragCoord.xy + u_time) * 0.05 - 0.025;
			col += g;

			gl_FragColor = vec4(col, 1.0);
		}
	`;

	function compile(gl: WebGLRenderingContext, type: number, src: string) {
		const sh = gl.createShader(type)!;
		gl.shaderSource(sh, src);
		gl.compileShader(sh);
		return sh;
	}

	onMount(() => {
		const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
		if (!gl) {
			// graceful fallback: a static brand gradient
			canvas.style.background =
				'radial-gradient(120% 90% at 70% 20%, oklch(0.63 0.145 48 / 0.5), transparent 55%), var(--color-ink)';
			return;
		}

		const program = gl.createProgram()!;
		gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
		gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
		gl.linkProgram(program);
		gl.useProgram(program);

		const buf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buf);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
		const loc = gl.getAttribLocation(program, 'a_pos');
		gl.enableVertexAttribArray(loc);
		gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

		const uRes = gl.getUniformLocation(program, 'u_res');
		const uTime = gl.getUniformLocation(program, 'u_time');

		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		function resize() {
			const w = canvas.clientWidth * dpr;
			const h = canvas.clientHeight * dpr;
			if (canvas.width !== w || canvas.height !== h) {
				canvas.width = w;
				canvas.height = h;
				gl!.viewport(0, 0, w, h);
			}
		}

		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		let raf = 0;
		let start = performance.now();

		function frame(now: number) {
			resize();
			gl!.uniform2f(uRes, canvas.width, canvas.height);
			gl!.uniform1f(uTime, (now - start) / 1000);
			gl!.drawArrays(gl!.TRIANGLES, 0, 3);
			if (!reduce) raf = requestAnimationFrame(frame);
		}

		const onResize = () => {
			if (reduce) frame(performance.now());
		};
		window.addEventListener('resize', onResize);
		frame(performance.now());

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', onResize);
		};
	});
</script>

<canvas bind:this={canvas} class={className}></canvas>
