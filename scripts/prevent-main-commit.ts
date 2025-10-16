#!/usr/bin/env node
import { executeCheck, getCurrentBranch, type CheckResult } from './common.js'

function checkMainBranch(): CheckResult {
	const currentBranch = getCurrentBranch()

	if (currentBranch === 'main') {
		return {
			success: false,
			message:
				`🚫 Error: Direct commits to main branch are not allowed\n` +
				`   Please create a new branch and commit there:\n` +
				`   git checkout -b feature/your-feature-name\n`,
		}
	}

	return {
		success: true,
		message: `✅ Branch check passed: '${currentBranch}'`,
	}
}

function main(): void {
	executeCheck(checkMainBranch)
}

main()
