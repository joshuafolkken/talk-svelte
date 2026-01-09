import { readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'
import type { Phrase, PhrasesModule } from '$lib/data/phrases/phrases'
import { praise } from '$lib/data/phrases/praise'

const STATUS_CODE_OK = 200
const TS_EXTENSION = '.ts'
const COLLECTIONS_PATH_PREFIX = '$lib/data/phrases/collections/'
const AUDIO_API_PATH_PREFIX = '/api/files/audio/'
const MP3_EXTENSION = '.mp3'
const CONTENT_TYPE_AUDIO = 'audio'
const HEADER_CONTENT_TYPE = 'content-type'
const HEADER_CACHE_CONTROL = 'cache-control'

const current_file = fileURLToPath(import.meta.url)
const current_directory = path.dirname(current_file)
const collections_directory = path.join(current_directory, '../src/lib/data/phrases/collections')

function get_collection_file_names(): Array<string> {
	return readdirSync(collections_directory)
		.filter((file) => file.endsWith(TS_EXTENSION))
		.map((file) => file.replace(TS_EXTENSION, ''))
}

async function load_collection_module(collection_file: string): Promise<PhrasesModule> {
	const collection_path = `${COLLECTIONS_PATH_PREFIX}${collection_file}`
	const collection_module = (await import(collection_path)) as {
		default: PhrasesModule
	}

	return collection_module.default
}

function add_phrases_to_map(phrases: Array<Phrase>, phrases_map: Map<string, Phrase>): void {
	for (const phrase of phrases) {
		if (!phrases_map.has(phrase.key)) {
			phrases_map.set(phrase.key, phrase)
		}
	}
}

async function load_collection_phrases(): Promise<Map<string, Phrase>> {
	const phrases_map = new Map<string, Phrase>()
	const collection_files = get_collection_file_names()

	for (const collection_file of collection_files) {
		const phrases_module = await load_collection_module(collection_file)
		const phrases = phrases_module.get_all_phrases()

		add_phrases_to_map(phrases, phrases_map)
	}

	return phrases_map
}

function add_praise_phrases(phrases_map: Map<string, Phrase>): void {
	const all_praise_phrases = praise.get_all_phrases()

	add_phrases_to_map(all_praise_phrases, phrases_map)
}

async function get_all_unique_phrases(): Promise<Array<Phrase>> {
	const phrases_map = await load_collection_phrases()

	add_praise_phrases(phrases_map)

	return [...phrases_map.values()]
}

function verify_audio_response(
	response: { status: () => number; headers: () => Record<string, string> },
	phrase_key: string,
): void {
	const file_name = `${phrase_key}${MP3_EXTENSION}`

	expect(response.status(), `${file_name} should return 200`).toBe(STATUS_CODE_OK)

	const headers = response.headers()
	const content_type = headers[HEADER_CONTENT_TYPE]

	expect(content_type, `${file_name} should be audio type`).toContain(CONTENT_TYPE_AUDIO)

	const cache_control = headers[HEADER_CACHE_CONTROL]

	expect(cache_control, `${file_name} should have Cache-Control header`).toBeDefined()
}

const is_ci = Boolean(process.env['CI'])
test.skip(is_ci, 'skip phrases audio test in CI')

const all_phrases = await get_all_unique_phrases()

for (const phrase of all_phrases) {
	test(`phrase audio file accessible: ${phrase.key}`, async ({ page }) => {
		const audio_url = `${AUDIO_API_PATH_PREFIX}${phrase.key}${MP3_EXTENSION}`
		const response = await page.request.get(audio_url)
		verify_audio_response(response, phrase.key)
	})
}
