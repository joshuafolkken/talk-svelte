#!/usr/bin/env node
import { execSync } from 'node:child_process'
import * as os from 'node:os'

interface BranchCheckResult {
	success: boolean
	message: string
}

function getGitCommand(): string {
	const platform = os.platform()

	if (platform === 'win32') {
		// Windows環境での一般的なGitパス
		const possiblePaths = [
			'C:\\Program Files\\Git\\bin\\git.exe',
			'C:\\Program Files (x86)\\Git\\bin\\git.exe',
			'C:\\Program Files\\Git\\cmd\\git.exe',
			'C:\\Program Files (x86)\\Git\\cmd\\git.exe',
		]

		// 利用可能なパスを探す
		for (const path of possiblePaths) {
			try {
				execSync(`"${path}" --version`, { stdio: 'ignore' })
				return path
			} catch {
				continue
			}
		}

		throw new Error('Gitが見つかりません。Gitをインストールしてください。')

		// 見つからない場合はPATHから探す
		// try {
		// 	execSync('git --version', { stdio: 'ignore' })
		// 	return 'git'
		// } catch {
		// 	throw new Error('Gitが見つかりません。Gitをインストールしてください。')
		// }
	} else {
		// Linux/macOS環境
		return '/usr/bin/git'
	}
}

function getCurrentBranch(): string {
	try {
		const gitCommand = getGitCommand()
		const command = `"${gitCommand}" rev-parse --abbrev-ref HEAD`
		return execSync(command, { encoding: 'utf8' }).trim()
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
