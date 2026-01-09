import { execSync } from 'node:child_process'
import { readdir } from 'node:fs/promises'
import path from 'node:path'

const STATIC_AUDIO_DIR = 'static-source/audio'
const R2_BUCKET_NAME = 'talk-svelte-assets'
const API_BASE_URL = process.env['API_BASE_URL'] ?? 'http://localhost:5173'

async function get_all_files(
	directory: string,
	base_directory: string = directory,
): Promise<Array<string>> {
	const files: Array<string> = []
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const entries = await readdir(directory, { withFileTypes: true })

	for (const entry of entries) {
		const full_path = path.join(directory, entry.name)

		if (entry.isDirectory()) {
			const sub_files = await get_all_files(full_path, base_directory)
			files.push(...sub_files)
		} else if (entry.isFile()) {
			files.push(full_path)
		}
	}

	return files
}

async function object_exists_in_r2_via_api(r2_key: string): Promise<boolean> {
	const url = `${API_BASE_URL}/api/files/${r2_key}`
	const response = await fetch(url, { method: 'HEAD' })

	return response.ok
}

async function object_exists_in_r2(r2_key: string, _object_path: string): Promise<boolean> {
	// まずlocalhostのAPI経由で確認を試みる
	return await object_exists_in_r2_via_api(r2_key)
}

function upload_file_to_r2(file: string, object_path: string, r2_key: string): void {
	console.info(`Uploading ${file} -> r2://${object_path}`)

	// execSync(`pnpm exec wrangler r2 object put "${object_path}" --file="${file}" --remote`, {
	// eslint-disable-next-line sonarjs/os-command
	execSync(`pnpm exec wrangler r2 object put "${object_path}" --file="${file}"`, {
		stdio: 'inherit',
	})
	console.info(`✓ Uploaded: ${r2_key}`)
}

function get_r2_paths(file: string, bucket_name: string): { r2_key: string; object_path: string } {
	const relative_path = path.relative(STATIC_AUDIO_DIR, file)
	// Normalize path separators to forward slashes for R2 (R2 uses forward slashes as path separator)
	const normalized_path = relative_path.replaceAll('\\', '/')
	const r2_key = `audio/${normalized_path}`
	const object_path = `${bucket_name}/${r2_key}`

	return { r2_key, object_path }
}

async function process_file(
	file: string,
	bucket_name: string,
): Promise<{ uploaded: boolean; skipped: boolean }> {
	const { r2_key, object_path } = get_r2_paths(file, bucket_name)

	if (await object_exists_in_r2(r2_key, object_path)) {
		console.info(`⊘ Skipped (already exists): ${r2_key}`)
		return { uploaded: false, skipped: true }
	}

	try {
		upload_file_to_r2(file, object_path, r2_key)
		return { uploaded: true, skipped: false }
	} catch (error) {
		console.error(`✗ Failed to upload ${file}:`, error)
		throw error
	}
}

function update_counts(
	result: { uploaded: boolean; skipped: boolean },
	counts: { uploaded: number; skipped: number },
): void {
	if (result.uploaded) {
		counts.uploaded += 1
	}

	if (result.skipped) {
		counts.skipped += 1
	}
}

const BATCH_SIZE = 20

async function process_files_in_batches(
	files: Array<string>,
	bucket_name: string,
): Promise<{ uploaded: number; skipped: number }> {
	const counts = { uploaded: 0, skipped: 0 }

	for (let index = 0; index < files.length; index += BATCH_SIZE) {
		const batch = files.slice(index, index + BATCH_SIZE)
		const results = await Promise.all(
			batch.map(async (file) => await process_file(file, bucket_name)),
		)

		for (const result of results) {
			update_counts(result, counts)
		}
	}

	return counts
}

async function main(): Promise<void> {
	console.info(`Scanning directory: ${STATIC_AUDIO_DIR}`)
	const files = await get_all_files(STATIC_AUDIO_DIR)

	console.info(`Found ${String(files.length)} files to upload`)
	console.info(`Target bucket: ${R2_BUCKET_NAME}\n`)

	const counts = await process_files_in_batches(files, R2_BUCKET_NAME)

	console.info(
		`\n✓ Complete! Uploaded: ${String(counts.uploaded)}, Skipped: ${String(counts.skipped)}, Total: ${String(files.length)}`,
	)
}

try {
	await main()
} catch (error: unknown) {
	console.error('Error:', error)
	process.exit(1)
}
