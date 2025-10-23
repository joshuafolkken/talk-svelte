import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from 'vitest'
import { praise_audio_files } from './praise-audio.js'
import { questions } from './questions.js'

const STATIC_DIRECTORY = 'static'
const AUDIO_DIRECTORY = 'audio'
const MP3_EXTENSION = '.mp3'
const MIN_QUESTIONS_COUNT = 0

test.each(questions)('mp3 file exists: $audio_uri', (question) => {
	const audio_directory_path = path.join(process.cwd(), STATIC_DIRECTORY, AUDIO_DIRECTORY)
	const mp3_file_path = path.join(audio_directory_path, `${question.audio_uri}${MP3_EXTENSION}`)
	const error_message = `mp3 file does not exist: ${question.audio_uri}${MP3_EXTENSION}`

	expect(existsSync(mp3_file_path), error_message).toBe(true)
})

test('questions is not empty', () => {
	expect(questions.length).toBeGreaterThan(MIN_QUESTIONS_COUNT)
})

test('audio_uri should be unique', () => {
	const audio_uris = questions.map((question) => question.audio_uri)
	const unique_audio_uris = [...new Set(audio_uris)]

	expect(audio_uris.length).toBe(unique_audio_uris.length)

	const duplicates = audio_uris.filter((uri, index) => audio_uris.indexOf(uri) !== index)
	if (duplicates.length > 0) {
		const unique_duplicates = [...new Set(duplicates)]
		throw new Error(`Duplicate audio_uri found: ${unique_duplicates.join(', ')}`)
	}
})

const audio_directory_path = path.join(process.cwd(), STATIC_DIRECTORY, AUDIO_DIRECTORY)
const mp3_files = readdirSync(audio_directory_path)
	.filter((file) => file.endsWith(MP3_EXTENSION))
	.map((file) => file.replace(MP3_EXTENSION, ''))

test.each(mp3_files)('mp3 file is defined: %s', (mp3_file) => {
	const question_audio_uris = questions.map((question) => question.audio_uri)
	const all_defined_audio_uris = new Set([...question_audio_uris, ...praise_audio_files])

	expect(all_defined_audio_uris.has(mp3_file)).toBe(true)
})
