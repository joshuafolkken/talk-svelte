#!/usr/bin/env node
import { execSync } from 'node:child_process'
import * as os from 'node:os'

export interface CheckResult {
	success: boolean
	message: string
}

export function getCurrentBranch(): string {
	try {
		if (os.platform() === 'win32') {
			return execSync('"C:\\Program Files\\Git\\bin\\git.exe" rev-parse --abbrev-ref HEAD', {
				encoding: 'utf8',
			}).trim()
		} else {
			return execSync('/usr/bin/git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim()
		}
	} catch (error) {
		console.error('Failed to get current branch:', error)
		process.exit(1)
	}
}

export function executeCheck(checkFunction: () => CheckResult): void {
	const result = checkFunction()
	console.log(result.message)

	if (!result.success) {
		process.exit(1)
	}
}
