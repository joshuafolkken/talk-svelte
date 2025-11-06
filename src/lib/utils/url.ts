import { browser } from '$app/environment'
import { APP } from '$lib/constants/app'

function redirect(): void {
	if (!browser) return

	const this_url = new URL(globalThis.location.href)
	const target_url = new URL(APP.WEBSITE_URL)

	if (this_url.hostname === target_url.hostname) return

	this_url.hostname = target_url.hostname
	this_url.port = ''
	this_url.pathname = ''

	globalThis.location.href = this_url.toString()
}

export const url = {
	redirect,
}
