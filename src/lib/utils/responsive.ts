import { DEBOUNCE_TIME, DEVICE_REGEX, SCALE_LIMITS, VIEWPORT } from '../constants'

export function calculate_scale_factor(): number {
	if (typeof globalThis === 'undefined') return 1

	const viewport_width = globalThis.innerWidth
	const viewport_height = globalThis.innerHeight
	const user_agent = navigator.userAgent.toLowerCase()

	const is_ios = DEVICE_REGEX.IOS.test(user_agent)
	const is_android = DEVICE_REGEX.ANDROID.test(user_agent)
	const is_tablet =
		DEVICE_REGEX.TABLET.test(user_agent) ||
		((viewport_width >= VIEWPORT.TABLET_MIN_WIDTH ||
			viewport_height >= VIEWPORT.TABLET_MIN_WIDTH) &&
			(viewport_width >= VIEWPORT.TABLET_MIN_HEIGHT ||
				viewport_height >= VIEWPORT.TABLET_MIN_HEIGHT))

	if ((is_ios || is_android) && !is_tablet) {
		return 1
	}

	const scale_x = viewport_width / VIEWPORT.BASE_WIDTH
	const scale_y = viewport_height / VIEWPORT.BASE_HEIGHT

	return Math.max(SCALE_LIMITS.MIN, Math.min(scale_x, scale_y, SCALE_LIMITS.MAX))
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
