import { ACTIONS, type ActionName } from '$lib/constants/actions'
import { is_supported_key, type KeyName } from './keys'

function normalize_key(event: KeyboardEvent): string {
	const raw_key = event.key
	return raw_key.length === 1 ? raw_key.toLowerCase() : raw_key
}

function trigger_action(action_id: ActionName): void {
	const selector = `[data-action="${action_id}"]`
	const button = globalThis.document.querySelector<HTMLButtonElement>(selector)
	if (button !== null) {
		button.click()
		return
	}
	if (action_id === ACTIONS.menu) {
		globalThis.location.assign('./')
	}
}

export function create_on_keydown(
	get_action_by_key: (key: KeyName) => ActionName | undefined,
): (event: KeyboardEvent) => void {
	return (event: KeyboardEvent): void => {
		const key_name = normalize_key(event)
		if (!is_supported_key(key_name)) return
		const action_id = get_action_by_key(key_name)
		if (action_id === undefined) return
		trigger_action(action_id)
	}
}
