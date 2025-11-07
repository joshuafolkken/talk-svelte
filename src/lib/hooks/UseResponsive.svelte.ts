import { browser } from '$app/environment'
import { responsive } from '$lib/utils/responsive'

export function use_responsive_state(): {
	scale: number
	is_ready: boolean
} {
	let scale = $state(1)
	let is_ready = $state(false)

	function update_scale(): void {
		scale = responsive.calculate_scale()
	}

	$effect(() => {
		if (!browser) {
			return (): void => {
				// operation
			}
		}

		scale = responsive.calculate_scale()
		is_ready = true

		const debounced_update_scale = responsive.debounce(update_scale)

		window.addEventListener('resize', debounced_update_scale)

		return (): void => {
			window.removeEventListener('resize', debounced_update_scale)
		}
	})

	// prettier-ignore
	return {
		// States
		get scale() { return scale },
		get is_ready() { return is_ready },
	}
}
