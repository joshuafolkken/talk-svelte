import fs from 'node:fs'
import path from 'node:path'
import fetch from 'node-fetch'

const ARGV_SLICE_START = 2

const API_KEY =
	// eslint-disable-next-line dot-notation -- process.env requires bracket notation for type safety
	process.env['ELEVENLABS_API_KEY'] ??
	((): never => {
		throw new Error(
			'ELEVENLABS_API_KEY is required. Please set it in your .env file or environment variables.',
		)
	})()
// ElevenLabs voice ID (この値は実際のvoice IDに置き換える必要があります)
const VOICE_ID = 'Alice'
const OUTPUT_DIRECTORY = './output'

const command_line_arguments = new Set(process.argv.slice(ARGV_SLICE_START))
const should_force_overwrite =
	command_line_arguments.has('--force') || command_line_arguments.has('-f')
const should_show_help = command_line_arguments.has('--help') || command_line_arguments.has('-h')

// Help message
if (should_show_help) {
	console.info(
		`
Usage: npm run generate-voices [options]

Options:
  -f, --force    Overwrite existing files
  -h, --help     Display this help message
	`.trim(),
	)
	process.exit(0)
}

const text = `
Hello there!
How are you doing today?
Let's get started!
This is fine
`

const MILLISECONDS_PER_SECOND = 1000
const DECIMAL_PLACES = 2
const SEPARATOR_LENGTH = 50

/**
 * テキストを安全なスラッグ形式のファイル名に変換する
 * - 非英数字はハイフンに
 * - 末尾が記号の場合はハイフンで終わるように
 */
function remove_leading_hyphens(input: string): string {
	return input.replaceAll(/^-+/gu, '')
}

function remove_trailing_hyphens(input: string): string {
	// 末尾のハイフンを削除（繰り返し処理）
	let result = input
	while (result.endsWith('-')) {
		result = result.slice(0, -1)
	}
	return result
}

function to_slug(filename: string): string {
	const trimmed = filename.trim()
	// 小文字にして非英数字をハイフンに置換
	let slug = trimmed.toLowerCase().replaceAll(/[^\da-z]+/gu, '-')

	// 先頭と末尾のハイフンを削除
	slug = remove_leading_hyphens(slug)
	slug = remove_trailing_hyphens(slug)

	// 元のテキストが記号（!?など）で終わっていたら、末尾にハイフンを追加
	const has_ending_punctuation = /[!?]$/u.test(trimmed)
	return has_ending_punctuation ? `${slug}-` : slug
}

async function text_to_speech(line: string, filename: string): Promise<void> {
	const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'xi-api-key': API_KEY,
			'Content-Type': 'application/json',
			accept: 'audio/mpeg',
		},
		body: JSON.stringify({
			text: line,
			model_id: 'eleven_multilingual_v2',
			voice_settings: {
				stability: 1,
			},
		}),
	})

	if (!response.ok) {
		const error_text = await response.text()
		throw new Error(`API Error: ${String(response.status)} ${response.statusText}\n${error_text}`)
	}

	const array_buffer = await response.arrayBuffer()
	fs.writeFileSync(filename, Buffer.from(array_buffer))
}

interface ProcessingStats {
	generated: number
	skipped: number
	failed: number
}

function parse_lines(input_text: string): Array<string> {
	return input_text
		.split(/\r?\n/u)
		.map((line) => line.trim())
		.filter(Boolean)
}

function print_header(lines: Array<string>): void {
	console.info(`📁 Output directory: ${OUTPUT_DIRECTORY}`)
	console.info(
		`🔧 Mode: ${should_force_overwrite ? '🔄 Force overwrite' : '⏭️  Skip existing files'}`,
	)
	console.info(`📝 Total lines: ${String(lines.length)}`)
	console.info()
}

function print_summary(stats: ProcessingStats, lines: Array<string>, elapsed_time: string): void {
	console.info('━'.repeat(SEPARATOR_LENGTH))
	console.info('📊 Summary:')
	console.info(`  ✅ Generated: ${String(stats.generated)}`)
	console.info(`  ⏭️  Skipped:   ${String(stats.skipped)}`)
	if (stats.failed > 0) {
		console.info(`  ❌ Failed:    ${String(stats.failed)}`)
	}
	console.info(`  📝 Total:     ${String(lines.length)}`)
	console.info(`  ⏱️  Time:      ${elapsed_time}s`)
	console.info('━'.repeat(SEPARATOR_LENGTH))
}

function should_skip_file(output_path: string): boolean {
	return fs.existsSync(output_path) && !should_force_overwrite
}

async function generate_audio(line: string, output_path: string): Promise<'generated' | 'failed'> {
	try {
		await text_to_speech(line, output_path)
		console.info(`  ✅ Saved: ${output_path}`)
		return 'generated'
	} catch (error) {
		console.error(`  ❌ Failed: ${error instanceof Error ? error.message : String(error)}`)
		return 'failed'
	}
}

async function process_line(
	line: string,
	index: number,
	total: number,
): Promise<'generated' | 'skipped' | 'failed'> {
	const safe_name = to_slug(line)
	const output_path = path.join(OUTPUT_DIRECTORY, `${safe_name}.mp3`)

	console.info(`[${String(index + 1)}/${String(total)}] ${line}`)

	if (should_skip_file(output_path)) {
		console.info(`  ⏭️  Skipped (already exists)`)
		return 'skipped'
	}

	return await generate_audio(line, output_path)
}

function ensure_output_directory(): void {
	if (!fs.existsSync(OUTPUT_DIRECTORY)) {
		fs.mkdirSync(OUTPUT_DIRECTORY, { recursive: true })
	}
}

function increment_stat(stats: ProcessingStats, result: 'generated' | 'skipped' | 'failed'): void {
	switch (result) {
		case 'generated': {
			stats.generated = stats.generated + 1
			break
		}
		case 'skipped': {
			stats.skipped = stats.skipped + 1
			break
		}
		case 'failed': {
			stats.failed = stats.failed + 1
			break
		}
		default: {
			// このケースは型システムにより到達不可能だが、default caseが必要
			throw new Error('Unknown result type')
		}
	}
}

async function process_all_lines(lines: Array<string>): Promise<ProcessingStats> {
	const stats: ProcessingStats = {
		generated: 0,
		skipped: 0,
		failed: 0,
	}

	for (const [index, line] of lines.entries()) {
		const result = await process_line(line, index, lines.length)
		increment_stat(stats, result)
		console.info()
	}

	return stats
}

async function main(): Promise<void> {
	const start_time = Date.now()

	ensure_output_directory()

	const lines = parse_lines(text)
	print_header(lines)

	const stats = await process_all_lines(lines)

	const elapsed_time = ((Date.now() - start_time) / MILLISECONDS_PER_SECOND).toFixed(DECIMAL_PLACES)

	print_summary(stats, lines, elapsed_time)

	if (stats.failed > 0) {
		throw new Error('Some files failed to generate')
	}
}

await main()
