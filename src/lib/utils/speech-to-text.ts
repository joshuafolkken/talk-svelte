import { APP } from '$lib/constants/app'
import type {
	ErrorCallback,
	SpeechRecognition,
	SpeechRecognitionErrorEvent,
	SpeechRecognitionEvent,
	TranscriptCallback,
} from '$lib/types/speech-recognition.types'
import { device } from './device'

export class SpeechToText {
	readonly #recognition: SpeechRecognition | undefined
	#is_active = false
	#final_transcript = ''
	#interim_transcript = ''
	readonly #on_transcript_update: TranscriptCallback
	readonly #on_error: ErrorCallback
	readonly #on_end: () => void

	constructor(
		on_transcript_update: TranscriptCallback,
		on_error: ErrorCallback = console.error,
		on_end: () => void = console.info,
	) {
		this.#on_transcript_update = on_transcript_update
		this.#on_error = on_error
		this.#on_end = on_end
		this.#recognition = this.#initialize_recognition()
	}

	#add_event_listener(recognition: SpeechRecognition): void {
		recognition.addEventListener('error', this.#handle_error.bind(this))

		if (device.is_android()) {
			recognition.addEventListener('result', this.#handle_result_android.bind(this))
			recognition.addEventListener('end', this.#handle_end_android.bind(this))
		} else {
			recognition.addEventListener('result', this.#handle_result.bind(this))
			recognition.addEventListener('end', this.#handle_end.bind(this))
		}
	}

	#get_speech_recognition(): (new () => SpeechRecognition) | undefined {
		if (typeof globalThis === 'undefined') return undefined

		const window = globalThis as unknown as Window
		const speech_recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition

		if (speech_recognition === undefined) {
			this.#on_error('Speech Recognition API is not supported in this browser')
		}

		return speech_recognition
	}

	#initialize_recognition(): SpeechRecognition | undefined {
		const speech_recognition = this.#get_speech_recognition()
		if (speech_recognition === undefined) return undefined

		const recognition = new speech_recognition()
		recognition.continuous = !device.is_ios()
		recognition.interimResults = !device.is_ios()
		this.#add_event_listener(recognition)

		return recognition
	}

	#add_final_transcript(transcript: string): void {
		this.#final_transcript = this.#get_full_transcript(transcript)
	}

	#get_full_transcript(interim_transcript: string): string {
		if (this.#final_transcript === '' || interim_transcript === '') {
			return this.#final_transcript + interim_transcript
		}

		return `${this.#final_transcript} ${interim_transcript}`
	}

	#should_add_to_interim(is_android_device: boolean, is_final: boolean): boolean {
		return is_android_device || !is_final
	}

	#get_transcript(result: SpeechRecognitionResult | undefined): string | undefined {
		if (result === undefined) return undefined
		return result[0]?.transcript
	}

	#process_result(result: SpeechRecognitionResult | undefined, is_android_device: boolean): string {
		if (result === undefined) return ''

		const transcript = this.#get_transcript(result)
		if (transcript === undefined) return ''

		if (this.#should_add_to_interim(is_android_device, result.isFinal)) {
			return transcript
		}

		this.#add_final_transcript(transcript)
		return ''
	}
	#handle_result_common(event: SpeechRecognitionEvent, is_android_device: boolean): void {
		let interim_transcript = ''

		for (let index = event.resultIndex; index < event.results.length; index++) {
			interim_transcript += this.#process_result(event.results[index], is_android_device)
		}

		if (is_android_device) {
			this.#interim_transcript = interim_transcript
		}

		const full_transcript = this.#get_full_transcript(interim_transcript)
		this.#on_transcript_update(full_transcript)
	}

	#handle_result(event: SpeechRecognitionEvent): void {
		this.#handle_result_common(event, false)
	}

	#handle_result_android(event: SpeechRecognitionEvent): void {
		this.#handle_result_common(event, true)
	}

	#handle_error(event: SpeechRecognitionErrorEvent): void {
		this.#on_error(`Speech Recognition error: ${event.error}`)
		this.#on_error(`Additional information: ${event.message}`)
		this.#is_active = false
	}

	#should_restart(): boolean {
		const should_restart = this.#is_active && this.#recognition !== undefined && !device.is_ios()

		if (!should_restart) {
			this.#on_end()
		}

		return should_restart
	}

	#restart_recognition(): void {
		if (this.#recognition === undefined) return

		try {
			this.#recognition.start()
		} catch (error: unknown) {
			this.#on_error(`Failed to restart recognition: ${String(error)}`)
		}
	}

	#handle_end(): void {
		if (!this.#should_restart()) return
		this.#restart_recognition()
	}

	#handle_end_android(): void {
		if (!this.#should_restart()) return

		this.#add_final_transcript(this.#interim_transcript)
		this.#interim_transcript = ''
		this.#restart_recognition()
	}

	#reset_transcripts(): void {
		this.#final_transcript = ''
		this.#interim_transcript = ''
	}

	#start_recognition(lang: string): void {
		if (this.#recognition === undefined) return

		try {
			this.#is_active = true
			this.#recognition.lang = lang
			this.#recognition.start()
		} catch (error: unknown) {
			this.#on_error(`Failed to start recognition: ${String(error)}`)
			this.#is_active = false
		}
	}

	start(lang: string = APP.DEFAULT_LANGUAGE): void {
		if (this.#recognition === undefined) {
			this.#on_error('SpeechRecognition is not initialized')
			return
		}

		if (this.#is_active) return

		this.#reset_transcripts()
		this.#start_recognition(lang)
	}

	#should_stop_recognition(is_automatic: boolean): boolean {
		return !(device.is_ios() && is_automatic)
	}

	#stop_recognition(): void {
		try {
			this.#recognition?.stop()
		} catch (error: unknown) {
			this.#on_error(`Failed to stop recognition: ${String(error)}`)
		}
	}

	stop(is_automatic = true): void {
		if (this.#recognition === undefined || !this.#is_active) return

		this.#is_active = false

		if (this.#should_stop_recognition(is_automatic)) {
			this.#stop_recognition()
		}
	}

	restart(): void {
		if (this.#recognition === undefined) return

		this.#reset_transcripts()

		if (device.is_ios()) return
		this.#recognition.stop()
	}

	destroy(): void {
		if (device.is_ios()) return
		this.stop()
	}
}
