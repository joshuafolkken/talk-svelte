import { browser } from '$app/environment'

function set_string(key: string, value: string): void {
	if (!browser) return

	try {
		localStorage.setItem(key, value)
	} catch (error) {
		console.error('Error setting item in localStorage:', error)
	}
}

function get_string(key: string): string | undefined {
	if (!browser) return undefined

	try {
		return localStorage.getItem(key) ?? undefined
	} catch (error) {
		console.error('Error getting item from localStorage:', error)
		return undefined
	}
}

function remove(key: string): void {
	if (!browser) return

	try {
		localStorage.removeItem(key)
	} catch (error) {
		console.error('Error removing item from localStorage:', error)
	}
}

function clear(): void {
	if (!browser) return

	try {
		localStorage.clear()
	} catch (error) {
		console.error('Error clearing localStorage:', error)
	}
}

function set_number(key: string, value: number): void {
	set_string(key, String(value))
}

function get_number(key: string): number | undefined {
	const value = get_string(key)
	if (value === undefined) return undefined
	return Number.parseInt(value, 10)
}

function set_boolean(key: string, value: boolean): void {
	set_string(key, String(value))
}

function get_boolean(key: string): boolean | undefined {
	const value = get_string(key)
	if (value === undefined) return undefined
	return value === 'true'
}

export const storage = {
	set_string,
	get_string,
	remove,
	clear,
	set_number,
	get_number,
	set_boolean,
	get_boolean,
}
