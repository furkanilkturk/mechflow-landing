import { browser } from '$app/environment';

export type Theme = 'dark' | 'light';

const KEY = 'mf-theme';

function read(): Theme {
	if (!browser) return 'dark';
	const stored = localStorage.getItem(KEY);
	return stored === 'light' || stored === 'dark' ? stored : 'dark';
}

let current = $state<Theme>(read());

export const theme = {
	get value() {
		return current;
	},
	set(next: Theme) {
		current = next;
		if (!browser) return;
		localStorage.setItem(KEY, next);
		document.documentElement.dataset.theme = next;
	},
	toggle() {
		this.set(current === 'dark' ? 'light' : 'dark');
	}
};
