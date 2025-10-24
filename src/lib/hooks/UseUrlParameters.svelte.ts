import { browser } from '$app/environment'
import { page } from '$app/state'
import { DEFAULT_LANGUAGE } from '$lib/constants'

function get_url_parameter(name: string): string | undefined {
	return page.url.searchParams.get(name) ?? undefined
}

export function use_url_parameters(): {
	lang: string
	video_id: string | undefined
	time: string | undefined
} {
	let lang = $state(DEFAULT_LANGUAGE)
	let video_id = $state<string>()
	let time = $state<string>()

	$effect(() => {
		if (!browser) return

		lang = get_url_parameter('lang') ?? DEFAULT_LANGUAGE
		video_id = get_url_parameter('v')
		time = get_url_parameter('t')
	})

	// prettier-ignore
	return {
		// States
		get lang() { return lang },
		get video_id() { return video_id },
		get time() { return time },
	}
}
