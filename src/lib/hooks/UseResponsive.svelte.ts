import { browser } from '$app/environment'
import { calculate_scale_factor, debounce } from '$lib/utils/responsive'

export function use_responsive(): {
	scale_factor: number
	is_ready: boolean
} {
	let scale_factor = $state(1)
	let is_ready = $state(false)

	function update_scale(): void {
		scale_factor = calculate_scale_factor()
	}

	$effect(() => {
		if (!browser) {
			return (): void => {
				// operation
			}
		}

		scale_factor = calculate_scale_factor()
		is_ready = true

		const debounced_update_scale = debounce(update_scale)

		window.addEventListener('resize', debounced_update_scale)

		return (): void => {
			window.removeEventListener('resize', debounced_update_scale)
		}
	})

	// prettier-ignore
	return {
		// States
		get scale_factor() { return scale_factor },
		get is_ready() { return is_ready },
	}
}
