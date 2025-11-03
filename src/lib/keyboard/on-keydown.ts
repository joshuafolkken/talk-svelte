import { ACTIONS, type ActionName } from '$lib/constants/actions'
import { keyboard, type KeyName } from './keyboard'

function normalize(event: KeyboardEvent): string {
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
	if (action_id === ACTIONS.MENU) {
		globalThis.location.assign('./')
	}
}

function is_editable_target(element: Element | null): boolean {
	if (element instanceof HTMLInputElement) return true
	if (element instanceof HTMLTextAreaElement) return true
	return element instanceof HTMLElement && element.isContentEditable
}

function create(
	get_action_by_key: (key: KeyName) => ActionName | undefined,
): (event: KeyboardEvent) => void {
	return (event: KeyboardEvent): void => {
		if (is_editable_target(event.target as Element | null)) return
		const key = normalize(event)
		if (!keyboard.is_supported(key)) return
		const action_id = get_action_by_key(key)
		if (action_id === undefined) return
		event.preventDefault()
		trigger_action(action_id)
	}
}

export const on_keydown = {
	normalize,
	create,
}
