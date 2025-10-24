import { browser } from '$app/environment'
import { calculate_scale_factor, debounce } from '$lib/utils/responsive'

export function use_responsive(): {
	scale_factor: number
} {
	let scale_factor = $state(1)

	function update_scale(): void {
		scale_factor = calculate_scale_factor()
	}

	$effect(() => {
		if (!browser) {
			return (): void => {
				// operation
			}
		}

		const debounced_update_scale = debounce(update_scale)

		update_scale()
		window.addEventListener('resize', debounced_update_scale)

		return (): void => {
			window.removeEventListener('resize', debounced_update_scale)
		}
	})

	// prettier-ignore
	return {
		// States
		get scale_factor() { return scale_factor },
	}
}
