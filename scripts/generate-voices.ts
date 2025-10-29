/* eslint-disable @typescript-eslint/no-restricted-imports */
import fs from 'node:fs'
import path from 'node:path'
import fetch from 'node-fetch'
import { get_bttf_phrases } from '../src/lib/data/phrases/back-to-the-future.js'
import { get_praise_phrases } from '../src/lib/data/phrases/praise.js'
import { text_to_slug } from '../src/lib/utils/text-to-slug.js'

const ARGV_SLICE_START = 2

const API_KEY =
	// eslint-disable-next-line dot-notation -- process.env requires bracket notation for type safety
	process.env['ELEVENLABS_API_KEY'] ??
	((): never => {
		throw new Error(
			'ELEVENLABS_API_KEY is required. Please set it in your .env file or environment variables.',
		)
	})()
// ElevenLabs voice ID (replace this with your actual voice ID)
// const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2' // Alice
const VOICE_ID = 'NDTYOmYEjbDIVCKB35i3' // Paige – Engaging Narrator // cspell:disable-line

const OUTPUT_DIRECTORY = './static/audio'

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

const text = [...get_praise_phrases(0), ...get_bttf_phrases(0)]
	.map((phrase) => phrase.script)
	.join('\n')

const MILLISECONDS_PER_SECOND = 1000
const DECIMAL_PLACES = 2
const SEPARATOR_LENGTH = 50
const PERCENTAGE_MULTIPLIER = 100
const PADDING_WIDTH = 10

interface SubscriptionInfo {
	character_count: number
	character_limit: number
	can_extend_character_limit: boolean
	allowed_to_extend_character_limit: boolean
	next_character_count_reset_unix: number
	voice_limit: number
	professional_voice_limit: number
	can_extend_voice_limit: boolean
	can_use_instant_voice_cloning: boolean
	available_models: Array<{
		model_id: string
		display_name: string
	}>
	can_use_delayed_payment_methods: boolean
}

/**
 * Get ElevenLabs subscription information
 */
async function get_subscription_info(): Promise<SubscriptionInfo> {
	const url = 'https://api.elevenlabs.io/v1/user/subscription'

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'xi-api-key': API_KEY,
		},
	})

	if (!response.ok) {
		const error_text = await response.text()
		throw new Error(`API Error: ${String(response.status)} ${response.statusText}\n${error_text}`)
	}

	return (await response.json()) as SubscriptionInfo
}

/**
 * Print credit information
 */
function print_credit_info(info: SubscriptionInfo, label: string): void {
	const used = info.character_count
	const limit = info.character_limit
	const remaining = limit - used
	const percentage = ((used / limit) * PERCENTAGE_MULTIPLIER).toFixed(1)

	console.info(`💳 ${label}:`)
	console.info(
		`  Used:      ${String(used).padStart(PADDING_WIDTH)} / ${String(limit)} chars (${percentage}%)`,
	)
	console.info(`  Remaining: ${String(remaining).padStart(PADDING_WIDTH)} chars`)
	console.info()
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

function count_total_chars(lines: Array<string>): number {
	return lines.reduce((total, line) => total + line.length, 0)
}

function print_header(lines: Array<string>, total_chars: number): void {
	console.info(`📁 Output directory: ${OUTPUT_DIRECTORY}`)
	console.info(
		`🔧 Mode: ${should_force_overwrite ? '🔄 Force overwrite' : '⏭️  Skip existing files'}`,
	)
	console.info(`📝 Total lines: ${String(lines.length)}`)
	console.info(`📊 Required characters: ${String(total_chars)} chars`)
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
	const safe_name = text_to_slug(line)
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
			// This case is unreachable due to type system, but default case is required
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

async function print_initial_credit(): Promise<SubscriptionInfo> {
	console.info('🔍 Fetching credit information...\n')
	const initial_credit = await get_subscription_info()
	print_credit_info(initial_credit, 'Initial credit')
	return initial_credit
}

async function print_final_credit(initial_credit: SubscriptionInfo): Promise<void> {
	console.info()
	const final_credit = await get_subscription_info()
	print_credit_info(final_credit, 'Final credit')

	const consumed = final_credit.character_count - initial_credit.character_count
	if (consumed > 0) {
		console.info(`📉 Consumed characters: ${String(consumed)} chars`)
		console.info()
	}
}

async function run_generation(): Promise<ProcessingStats> {
	ensure_output_directory()

	const lines = parse_lines(text)
	const total_chars = count_total_chars(lines)
	print_header(lines, total_chars)

	return await process_all_lines(lines)
}

async function main(): Promise<void> {
	const start_time = Date.now()

	const initial_credit = await print_initial_credit()
	const stats = await run_generation()
	const elapsed_time = ((Date.now() - start_time) / MILLISECONDS_PER_SECOND).toFixed(DECIMAL_PLACES)

	print_summary(stats, parse_lines(text), elapsed_time)
	await print_final_credit(initial_credit)

	if (stats.failed > 0) {
		throw new Error('Some files failed to generate')
	}
}

await main()
