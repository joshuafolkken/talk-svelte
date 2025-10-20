import { DEBOUNCE_TIME, DEVICE_REGEX, SCALE_LIMITS, VIEWPORT } from '../constants'

export function calculate_scale_factor(): number {
	if (typeof globalThis === 'undefined') return 1

	const viewport_width = globalThis.innerWidth
	const viewport_height = globalThis.innerHeight
	const user_agent = navigator.userAgent.toLowerCase()

	const is_ios = DEVICE_REGEX.ios.test(user_agent)
	const is_android = DEVICE_REGEX.android.test(user_agent)
	const is_tablet =
		DEVICE_REGEX.tablet.test(user_agent) ||
		((viewport_width >= VIEWPORT.tablet_min_width ||
			viewport_height >= VIEWPORT.tablet_min_width) &&
			(viewport_width >= VIEWPORT.tablet_min_height ||
				viewport_height >= VIEWPORT.tablet_min_height))

	if ((is_ios || is_android) && !is_tablet) {
		return 1
	}

	const scale_x = viewport_width / VIEWPORT.base_width
	const scale_y = viewport_height / VIEWPORT.base_height

	return Math.max(SCALE_LIMITS.min, Math.min(scale_x, scale_y, SCALE_LIMITS.max))
}

export function create_debounced_resize_handler(
	callback: () => void,
	delay: number = DEBOUNCE_TIME,
): () => void {
	let timeout_id: ReturnType<typeof setTimeout> | undefined

	return () => {
		clearTimeout(timeout_id)
		timeout_id = setTimeout(callback, delay)
	}
}
