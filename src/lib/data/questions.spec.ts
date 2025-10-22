import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { questions } from './questions.js'

const STATIC_DIRECTORY = 'static'
const AUDIO_DIRECTORY = 'audio'
const MP3_EXTENSION = '.mp3'
const REQUIRED_PROPERTIES = ['audio_uri', 'transcript', 'translation'] as const
const MIN_QUESTIONS_COUNT = 0

describe('questions', () => {
	it.each(questions)('mp3 file exists: $audio_uri', (question) => {
		const audio_directory_path = path.join(process.cwd(), STATIC_DIRECTORY, AUDIO_DIRECTORY)
		const mp3_file_path = path.join(audio_directory_path, `${question.audio_uri}${MP3_EXTENSION}`)
		const error_message = `mp3 file does not exist: ${question.audio_uri}${MP3_EXTENSION}`

		expect(existsSync(mp3_file_path), error_message).toBe(true)
	})

	it('questions is not empty', () => {
		expect(questions.length).toBeGreaterThan(MIN_QUESTIONS_COUNT)
	})

	it.each(questions)('has required properties: $audio_uri', (question) => {
		for (const property of REQUIRED_PROPERTIES) {
			expect(question).toHaveProperty(property)
			expect(typeof question[property]).toBe('string')
		}
	})
})
