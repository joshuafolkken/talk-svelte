#!/usr/bin/env node
import { execSync } from 'child_process'
import { readFileSync } from 'fs'

interface CommitCheckResult {
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

function getCommitMessage(): string {
	// 引数からコミットメッセージファイルのパスを取得
	const commitMsgFile = process.argv[2]

	// 引数がない場合は、デフォルトのパスを試す
	const defaultPath = commitMsgFile || '.git/COMMIT_EDITMSG'

	try {
		return readFileSync(defaultPath, 'utf8').trim()
	} catch (error) {
		console.error(`Failed to read commit message file: ${defaultPath}`, error)
		process.exit(1)
	}
}

function checkCommitMessage(): CommitCheckResult {
	const currentBranch = getCurrentBranch()

	// ブランチ名が数字-xxxx-yyyの形式かチェック
	const branchPattern = /^(\d+)-[a-z0-9-]+$/
	const match = currentBranch.match(branchPattern)

	if (!match) {
		return {
			success: true,
			message: `✅ Branch format check passed: '${currentBranch}' (no issue number required)`,
		}
	}

	const issueNumber = match[1]
	const commitMessage = getCommitMessage()

	// コミットメッセージに#数字が含まれているかチェック
	if (!commitMessage.includes(`#${issueNumber}`)) {
		return {
			success: false,
			message:
				`🚫 Error: Commit message must include #${issueNumber}\n` +
				`   Current branch: ${currentBranch}\n` +
				`   Commit message: ${commitMessage}\n` +
				`   Please include #${issueNumber} in your commit message\n`,
		}
	}

	return {
		success: true,
		message: `✅ Commit message check passed: Found #${issueNumber}`,
	}
}

function main(): void {
	const result = checkCommitMessage()
	console.log(result.message)

	if (!result.success) {
		process.exit(1)
	}
}

main()
