import { expect, test } from 'vitest'
import {
	get_praise_audio_file,
	praise_audio_files,
	reset_praise_audio_index,
} from './praise-audio.js'

const MIN_PRAISE_FILES_COUNT = 0
const FIRST_INDEX = 0
const TEST_ITERATION_COUNT = 5

test('praise_audio_files is not empty', () => {
	expect(praise_audio_files.length).toBeGreaterThan(MIN_PRAISE_FILES_COUNT)
})

test('get_praise_audio_file returns files in sequence', () => {
	reset_praise_audio_index()

	for (const [index, expected_file] of praise_audio_files.entries()) {
		const actual_file = get_praise_audio_file()
		const error_message = `Expected file at index ${String(index)} to be "${expected_file}", but got "${actual_file}"`

		expect(actual_file, error_message).toBe(expected_file)
	}
})

test('get_praise_audio_file cycles back to start after reaching end', () => {
	reset_praise_audio_index()

	const array_length = praise_audio_files.length
	const indices = Array.from({ length: array_length }).keys()
	for (const index of indices) {
		get_praise_audio_file()
		expect(index).toBeGreaterThanOrEqual(FIRST_INDEX)
	}

	const first_file = praise_audio_files.at(FIRST_INDEX)
	const cycled_file = get_praise_audio_file()
	const error_message = `Expected to cycle back to first file "${first_file ?? ''}", but got "${cycled_file}"`

	expect(cycled_file, error_message).toBe(first_file)
})

test('reset_praise_audio_index resets to first file', () => {
	for (let index = 0; index < TEST_ITERATION_COUNT; index++) {
		get_praise_audio_file()
	}

	reset_praise_audio_index()

	const first_file = praise_audio_files.at(FIRST_INDEX)
	const actual_file = get_praise_audio_file()
	const error_message = `Expected file after reset to be "${first_file ?? ''}", but got "${actual_file}"`

	expect(actual_file, error_message).toBe(first_file)
})

test('multiple resets work correctly', () => {
	const first_file = praise_audio_files.at(FIRST_INDEX)

	reset_praise_audio_index()
	const file_after_first_reset = get_praise_audio_file()

	get_praise_audio_file()
	get_praise_audio_file()

	reset_praise_audio_index()
	const file_after_second_reset = get_praise_audio_file()

	expect(file_after_first_reset).toBe(first_file)
	expect(file_after_second_reset).toBe(first_file)
})
