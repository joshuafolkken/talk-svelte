import { browser } from '$app/environment'

let audio_context: AudioContext | undefined // eslint-disable-line init-declarations
let audio_buffer: AudioBuffer | undefined // eslint-disable-line init-declarations
let current_url: string | undefined // eslint-disable-line init-declarations
let loading_promise: Promise<AudioBuffer | undefined> | undefined // eslint-disable-line init-declarations
let source_node: AudioBufferSourceNode | undefined // eslint-disable-line init-declarations
let is_playing = false
let on_ended_callback: (() => void) | undefined // eslint-disable-line init-declarations

function initialize_audio_content(): AudioContext | undefined {
	if (!browser) return undefined

	if (audio_context !== undefined && audio_context.state !== 'closed') {
		return audio_context
	}

	try {
		audio_context = new globalThis.AudioContext()
	} catch (error: unknown) {
		console.error('Failed to initialize audio context:', error)
		return undefined
	}

	return audio_context
}

async function load_audio_buffer(url: string): Promise<AudioBuffer | undefined> {
	const context = initialize_audio_content()

	if (context === undefined) return undefined

	if (current_url !== url) {
		audio_buffer = undefined
		current_url = url
	}

	if (audio_buffer !== undefined) return audio_buffer
	if (loading_promise !== undefined) return await loading_promise

	loading_promise = (async () => {
		try {
			const response = await fetch(url)
			const array_buffer = await response.arrayBuffer()
			audio_buffer = await context.decodeAudioData(array_buffer)
			return audio_buffer
		} catch (error: unknown) {
			console.error('Failed to load audio:', error)
			return undefined // eslint-disable-line unicorn/no-useless-undefined
		} finally {
			loading_promise = undefined
		}
	})()

	return await loading_promise
}

function create_and_setup_source_node(
	context: AudioContext,
	buffer: AudioBuffer,
): AudioBufferSourceNode {
	const node = context.createBufferSource()
	node.buffer = buffer
	node.connect(context.destination)

	node.addEventListener('ended', () => {
		is_playing = false
		source_node = undefined
		on_ended_callback?.()
	})

	return node
}

function start_playback(context: AudioContext, buffer: AudioBuffer): void {
	source_node = create_and_setup_source_node(context, buffer)
	source_node.start()
	is_playing = true
}

function stop(): void {
	source_node?.stop()
	source_node = undefined
	is_playing = false
}

async function play(url: string): Promise<void> {
	const context = initialize_audio_content()
	if (context === undefined) return

	// 既存の再生を停止
	stop()

	const buffer = await load_audio_buffer(url)
	if (buffer === undefined) return

	try {
		start_playback(context, buffer)
	} catch (error: unknown) {
		console.error('Failed to play audio:', error)
		throw error
	}
}

function reset(): void {
	stop()
}

// WebAudio APIのendedイベントはコールバックベースのため、コールバックを使用
// eslint-disable-next-line promise/prefer-await-to-callbacks
function set_on_ended(callback: (() => void) | undefined): void {
	on_ended_callback = callback
}

export const audio = {
	play,
	stop,
	reset,
	set_on_ended,
	get is_playing(): boolean {
		return is_playing
	},
}
