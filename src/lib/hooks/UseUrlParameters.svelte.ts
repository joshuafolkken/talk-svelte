import { browser } from '$app/environment'
import { page } from '$app/state'
import { APP } from '$lib/constants/app'

function get_query_parameter(name: string): string | undefined {
	return page.url.searchParams.get(name) ?? undefined
}

export function use_url_parameters(): {
	lang: string
	video_id: string | undefined
	time: string | undefined
	collection_id: string | undefined
} {
	let lang: string = $state(APP.DEFAULT_LANGUAGE)
	let video_id = $state<string>()
	let time = $state<string>()
	let collection_id = $state<string | undefined>()

	$effect(() => {
		if (!browser) return

		lang = get_query_parameter('lang') ?? APP.DEFAULT_LANGUAGE
		video_id = get_query_parameter('v')
		time = get_query_parameter('t')

		collection_id = page.params.collection_id // eslint-disable-line prefer-destructuring -- collection_id is not destructured
	})

	// prettier-ignore
	return {
		// States
		get lang() { return lang },
		get video_id() { return video_id },
		get time() { return time },
		get collection_id() { return collection_id },
	}
}
