import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from 'vitest'
import { get_all_bttf_phrases, get_bttf_phrases } from './back-to-the-future.js'
import { get_all_praise_phrases, get_praise_phrases } from './praise.js'

const STATIC_DIRECTORY = 'static'
const AUDIO_DIRECTORY = 'audio'
const MP3_EXTENSION = '.mp3'
const MIN_PHRASES_COUNT = 0
const INVALID_GROUP_INDEX = 999

// Back to the Future phrases tests
const all_bttf_phrases = get_all_bttf_phrases()

test.each(all_bttf_phrases)('bttf phrase mp3 file exists: $key', (phrase) => {
	const audio_directory_path = path.join(process.cwd(), STATIC_DIRECTORY, AUDIO_DIRECTORY)
	const mp3_file_path = path.join(audio_directory_path, `${phrase.key}${MP3_EXTENSION}`)
	const error_message = `mp3 file does not exist: ${phrase.key}${MP3_EXTENSION}`

	expect(existsSync(mp3_file_path), error_message).toBe(true)
})

test('bttf phrases is not empty', () => {
	expect(all_bttf_phrases.length).toBeGreaterThan(MIN_PHRASES_COUNT)
})

test('bttf phrase keys should be unique', () => {
	const phrase_keys = all_bttf_phrases.map((phrase) => phrase.key)
	const unique_phrase_keys = [...new Set(phrase_keys)]

	const duplicates = phrase_keys.filter((key, index) => phrase_keys.indexOf(key) !== index)
	if (duplicates.length > 0) {
		const unique_duplicates = [...new Set(duplicates)]

		// 各重複値が何回出現するかをカウント
		const duplicate_counts = unique_duplicates.map((key) => {
			const count = phrase_keys.filter((key_item) => key_item === key).length
			return `${key} (${String(count)} times)`
		})

		throw new Error(`Duplicate phrase key found: ${duplicate_counts.join(', ')}`)
	}

	expect(phrase_keys.length).toBe(unique_phrase_keys.length)
})

test.each(all_bttf_phrases)('bttf phrase has non-empty script: $key', (phrase) => {
	expect(phrase.script, `Script is empty for key: ${phrase.key}`).not.toBe('')
})

test.each(all_bttf_phrases)('bttf phrase has non-empty translation: $key', (phrase) => {
	expect(phrase.translation, `Translation is empty for key: ${phrase.key}`).not.toBe('')
})

// Praise phrases tests
const all_praise_phrases = get_all_praise_phrases()

test.each(all_praise_phrases)('praise phrase mp3 file exists: $key', (phrase) => {
	const audio_directory_path = path.join(process.cwd(), STATIC_DIRECTORY, AUDIO_DIRECTORY)
	const mp3_file_path = path.join(audio_directory_path, `${phrase.key}${MP3_EXTENSION}`)
	const error_message = `mp3 file does not exist: ${phrase.key}${MP3_EXTENSION}`

	expect(existsSync(mp3_file_path), error_message).toBe(true)
})

test('praise phrases is not empty', () => {
	expect(all_praise_phrases.length).toBeGreaterThan(MIN_PHRASES_COUNT)
})

test('praise phrase keys should be unique', () => {
	const phrase_keys = all_praise_phrases.map((phrase) => phrase.key)
	const unique_phrase_keys = [...new Set(phrase_keys)]

	const duplicates = phrase_keys.filter((key, index) => phrase_keys.indexOf(key) !== index)
	if (duplicates.length > 0) {
		const unique_duplicates = [...new Set(duplicates)]

		// 各重複値が何回出現するかをカウント
		const duplicate_counts = unique_duplicates.map((key) => {
			const count = phrase_keys.filter((key_item) => key_item === key).length
			return `${key} (${String(count)} times)`
		})

		throw new Error(`Duplicate phrase key found: ${duplicate_counts.join(', ')}`)
	}

	expect(phrase_keys.length).toBe(unique_phrase_keys.length)
})

test.each(all_praise_phrases)('praise phrase has non-empty script: $key', (phrase) => {
	expect(phrase.script, `Script is empty for key: ${phrase.key}`).not.toBe('')
})

test.each(all_praise_phrases)('praise phrase has non-empty translation: $key', (phrase) => {
	expect(phrase.translation, `Translation is empty for key: ${phrase.key}`).not.toBe('')
})

// Cross-reference tests with existing audio files
const audio_directory_path = path.join(process.cwd(), STATIC_DIRECTORY, AUDIO_DIRECTORY)
const mp3_files = readdirSync(audio_directory_path)
	.filter((file) => file.endsWith(MP3_EXTENSION))
	.map((file) => file.replace(MP3_EXTENSION, ''))

test.each(mp3_files)('mp3 file is defined in phrases: %s', (mp3_file) => {
	const all_phrase_keys = new Set([
		...all_bttf_phrases.map((phrase) => phrase.key),
		...all_praise_phrases.map((phrase) => phrase.key),
	])

	// britishディレクトリやothersディレクトリのファイルは除外
	if (mp3_file.includes('/') || mp3_file.includes('british') || mp3_file.includes('others')) {
		expect(true).toBe(true) // スキップ用のアサーション
		return
	}

	expect(all_phrase_keys.has(mp3_file)).toBe(true)
})

function validate_phrase_properties(phrase: {
	key: string
	script: string
	translation: string
}): void {
	expect(phrase).toHaveProperty('key')
	expect(phrase).toHaveProperty('script')
	expect(phrase).toHaveProperty('translation')
	expect(phrase.key).not.toBe('')
	expect(phrase.script).not.toBe('')
	expect(phrase.translation).not.toBe('')
}

function test_phrase_group(
	group_index: number,
	get_phrases: (index: number) => Array<{ key: string; script: string; translation: string }>,
): void {
	const phrases = get_phrases(group_index)
	expect(phrases.length).toBeGreaterThan(0)

	for (const phrase of phrases) {
		validate_phrase_properties(phrase)
	}
}

// Test phrase group functionality
const bttf_group_indices = [0] // Based on actual phrase_key_groups length in back-to-the-future.ts
const praise_group_indices = [0] // Based on actual phrase_key_groups length in praise.ts

test.each(bttf_group_indices)('bttf phrase group %d returns correct phrases', (index) => {
	test_phrase_group(index, get_bttf_phrases)
})

test.each(praise_group_indices)('praise phrase group %d returns correct phrases', (index) => {
	test_phrase_group(index, get_praise_phrases)
})

// Test error handling for invalid group indices
test('bttf phrases throw error for invalid group index', () => {
	const error_message = `Group at index ${String(INVALID_GROUP_INDEX)} not found`
	expect(() => get_bttf_phrases(INVALID_GROUP_INDEX)).toThrow(error_message)
})

test('praise phrases throw error for invalid group index', () => {
	const error_message = `Group at index ${String(INVALID_GROUP_INDEX)} not found`
	expect(() => get_praise_phrases(INVALID_GROUP_INDEX)).toThrow(error_message)
})
