#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { execute_check, get_current_branch, type CheckResult } from './common.js'

function get_commit_message(): string {
	// 引数からコミットメッセージファイルのパスを取得
	const commit_message_file = process.argv[2]

	// 引数がない場合は、デフォルトのパスを試す
	const default_path = commit_message_file ?? '.git/COMMIT_EDITMSG'

	try {
		return readFileSync(default_path, 'utf8').trim()
	} catch (error) {
		throw new Error(`Failed to read commit message file: ${default_path}`, { cause: error })
	}
}

function check_commit_message(): CheckResult {
	const current_branch = get_current_branch()

	// ブランチ名が数字-xxxx-yyyの形式かチェック
	const branch_pattern = /^(\d+)-[a-z0-9-]+$/
	const match = branch_pattern.exec(current_branch)

	if (match === null) {
		return {
			success: true,
			message: `✅ Branch format check passed: '${current_branch}' (no issue number required)`,
		}
	}

	const issue_number = match[1] ?? '999999'
	const commit_message = get_commit_message()

	// コミットメッセージに#数字が含まれているかチェック
	if (!commit_message.includes(`#${issue_number}`)) {
		return {
			success: false,
			message:
				`🚫 Error: Commit message must include #${issue_number}\n` +
				`   Current branch: ${current_branch}\n` +
				`   Commit message: ${commit_message}\n` +
				`   Please include #${issue_number} in your commit message\n`,
		}
	}

	return {
		success: true,
		message: `✅ Commit message check passed: Found #${issue_number}`,
	}
}

function main(): void {
	execute_check(check_commit_message)
}

main()
