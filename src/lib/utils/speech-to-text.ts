import { DEFAULT_LANGUAGE } from '../constants'
import type {
	ErrorCallback,
	SpeechRecognition,
	SpeechRecognitionErrorEvent,
	SpeechRecognitionEvent,
	TranscriptCallback,
} from '../types/speech-recognition.types'
import { is_android } from './device'

export class SpeechToText {
	readonly #recognition: SpeechRecognition | null = null
	#is_active: boolean = false
	#final_transcript: string = ''
	#interim_transcript: string = ''
	readonly #on_transcript_update: TranscriptCallback
	readonly #on_error: ErrorCallback

	constructor(on_transcript_update: TranscriptCallback, on_error: ErrorCallback = console.error) {
		this.#on_transcript_update = on_transcript_update
		this.#on_error = on_error
		this.#recognition = this.#initialize_recognition()
	}

	#initialize_recognition(): SpeechRecognition | null {
		if (typeof globalThis === 'undefined') return null

		const window = globalThis as unknown as Window
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

		if (!SpeechRecognition) {
			this.#on_error('Speech Recognition API is not supported in this browser')
			return null
		}

		const recognition = new SpeechRecognition()
		recognition.continuous = true
		recognition.interimResults = true
		recognition.onerror = this.#handle_error.bind(this)

		if (is_android()) {
			recognition.onresult = this.#handle_result_android.bind(this)
			recognition.onend = this.#handle_end_android.bind(this)
		} else {
			recognition.onresult = this.#handle_result.bind(this)
			recognition.onend = this.#handle_end.bind(this)
		}

		return recognition
	}

	#add_transcript(transcript: string): void {
		this.#final_transcript = this.#get_full_transcript(transcript)
	}

	#get_full_transcript(interim_transcript: string): string {
		if (!this.#final_transcript || !interim_transcript) {
			return this.#final_transcript + interim_transcript
		}

		return `${this.#final_transcript} ${interim_transcript}`
	}

	#handle_result_common(event: SpeechRecognitionEvent, is_android: boolean): void {
		let interim_transcript = ''

		for (let i = event.resultIndex; i < event.results.length; i++) {
			const result = event.results[i]
			if (!result) continue

			const transcript = result[0]?.transcript
			if (!transcript) continue

			if (is_android || !result.isFinal) {
				interim_transcript += transcript
			} else {
				this.#add_transcript(transcript)
			}
		}

		if (is_android) {
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
		return this.#is_active && this.#recognition !== null
	}

	#restart_recognition(): void {
		if (!this.#recognition) return

		try {
			this.#recognition.start()
		} catch (error) {
			this.#on_error(`Failed to restart recognition: ${error}`)
		}
	}

	#handle_end(): void {
		if (!this.#should_restart()) return
		this.#restart_recognition()
	}

	#handle_end_android(): void {
		if (!this.#should_restart()) return

		this.#add_transcript(this.#interim_transcript)
		this.#interim_transcript = ''
		this.#restart_recognition()
	}

	#reset_transcripts(): void {
		this.#final_transcript = ''
		this.#interim_transcript = ''
	}

	start(lang: string = DEFAULT_LANGUAGE): void {
		if (!this.#recognition) {
			this.#on_error('SpeechRecognition is not initialized')
			return
		}

		if (this.#is_active) return

		this.#recognition.lang = lang
		this.#reset_transcripts()

		try {
			this.#is_active = true
			this.#recognition.start()
		} catch (error) {
			this.#on_error(`Failed to start recognition: ${error}`)
			this.#is_active = false
		}
	}

	stop(): void {
		if (!this.#recognition) return
		if (!this.#is_active) return

		try {
			this.#is_active = false
			this.#recognition.stop()
		} catch (error) {
			this.#on_error(`Failed to stop recognition: ${error}`)
		}
	}

	restart(): void {
		if (!this.#recognition) return

		this.#reset_transcripts()
		this.#recognition.stop()
	}

	destroy(): void {
		this.stop()
	}
}
