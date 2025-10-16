#!/usr/bin/env node
import { execSync } from 'child_process'

interface BranchCheckResult {
	success: boolean
	message: string
}

function getCurrentBranch(): string {
	try {
		return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim()
	} catch (error) {
		console.error('Failed to get current branch:', error)
		process.exit(1)
	}
}

function checkMainBranch(): BranchCheckResult {
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
	const result = checkMainBranch()
	console.log(result.message)

	if (!result.success) {
		process.exit(1)
	}
}

main()
