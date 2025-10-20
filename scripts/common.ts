#!/usr/bin/env node
import { execSync } from 'node:child_process'
import * as os from 'node:os'

export interface CheckResult {
	success: boolean
	message: string
}

export function get_current_branch(): string {
	try {
		if (os.platform() === 'win32') {
			return execSync(String.raw`"C:\Program Files\Git\bin\git.exe" rev-parse --abbrev-ref HEAD`, {
				encoding: 'utf8',
			}).trim()
		}
		return execSync('/usr/bin/git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim()
	} catch (error) {
		throw new Error('Failed to get current branch', { cause: error })
	}
}

export function execute_check(check_function: () => CheckResult): void {
	const result = check_function()
	console.log(result.message) // eslint-disable-line no-console

	if (!result.success) {
		process.exit(1)
	}
}
