import { DEBOUNCE_TIME, DEVICE_REGEX, SCALE_LIMITS, VIEWPORT } from '../constants'

function has_tablet_dimensions(viewport_width: number, viewport_height: number): boolean {
	const min_dimension = Math.min(viewport_width, viewport_height)
	const max_dimension = Math.max(viewport_width, viewport_height)
	return min_dimension >= VIEWPORT.tablet_min_width && max_dimension >= VIEWPORT.tablet_min_height
}
function is_tablet_device(
	viewport_width: number,
	viewport_height: number,
	user_agent: string,
): boolean {
	if (DEVICE_REGEX.tablet.test(user_agent)) return true
	return has_tablet_dimensions(viewport_width, viewport_height)
}

function is_mobile_phone(
	user_agent: string,
	viewport_width: number,
	viewport_height: number,
): boolean {
	const is_ios = DEVICE_REGEX.ios.test(user_agent)
	const is_android = DEVICE_REGEX.android.test(user_agent)
	const is_tablet = is_tablet_device(viewport_width, viewport_height, user_agent)

	return (is_ios || is_android) && !is_tablet
}
export function calculate_scale_factor(): number {
	if (typeof globalThis === 'undefined') return 1

	const viewport_width = globalThis.innerWidth
	const viewport_height = globalThis.innerHeight
	const user_agent = navigator.userAgent.toLowerCase()

	if (is_mobile_phone(user_agent, viewport_width, viewport_height)) {
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
