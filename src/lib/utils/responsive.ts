import { DEVICE } from '$lib/constants/device'

function has_tablet_dimensions(viewport_width: number, viewport_height: number): boolean {
	const min_dimension = Math.min(viewport_width, viewport_height)
	const max_dimension = Math.max(viewport_width, viewport_height)
	return (
		min_dimension >= DEVICE.VIEWPORT.TABLET_MIN_WIDTH &&
		max_dimension >= DEVICE.VIEWPORT.TABLET_MIN_HEIGHT
	)
}
function is_tablet_device(
	viewport_width: number,
	viewport_height: number,
	user_agent: string,
): boolean {
	if (DEVICE.REGEX.TABLET.test(user_agent)) return true
	return has_tablet_dimensions(viewport_width, viewport_height)
}

function is_mobile_phone(
	user_agent: string,
	viewport_width: number,
	viewport_height: number,
): boolean {
	const is_ios = DEVICE.REGEX.IOS.test(user_agent)
	const is_android = DEVICE.REGEX.ANDROID.test(user_agent)
	const is_tablet = is_tablet_device(viewport_width, viewport_height, user_agent)

	return (is_ios || is_android) && !is_tablet
}
function calculate_scale(): number {
	if (typeof globalThis === 'undefined') return 1

	const viewport_width = globalThis.innerWidth
	const viewport_height = globalThis.innerHeight
	const user_agent = navigator.userAgent.toLowerCase()

	if (is_mobile_phone(user_agent, viewport_width, viewport_height)) {
		return 1
	}

	const scale_x = viewport_width / DEVICE.VIEWPORT.BASE_WIDTH
	const scale_y = viewport_height / DEVICE.VIEWPORT.BASE_HEIGHT

	return Math.max(DEVICE.SCALE_LIMITS.MIN, Math.min(scale_x, scale_y, DEVICE.SCALE_LIMITS.MAX))
}

function debounce(callback: () => void, delay: number = DEVICE.DEBOUNCE_TIME): () => void {
	let timeout_id: ReturnType<typeof setTimeout> | undefined = undefined

	return () => {
		clearTimeout(timeout_id)
		timeout_id = setTimeout(callback, delay)
	}
}

export const responsive = {
	calculate_scale,
	debounce,
}
