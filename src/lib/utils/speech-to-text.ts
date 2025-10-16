import type {
	ErrorCallback,
	SpeechRecognition,
	SpeechRecognitionErrorEvent,
	SpeechRecognitionEvent,
	TranscriptCallback,
} from '../types/speech-recognition.types'
import { is_android } from './device'

export class SpeechToText {
	public static readonly DEFAULT_LANG = 'en-US'

	private readonly _recognition: SpeechRecognition | null = null
	private _is_active: boolean = false
	private _final_transcript: string = ''
	private _interim_transcript: string = ''

	constructor(
		private readonly _on_transcript_update: TranscriptCallback,
		private readonly _on_error: ErrorCallback = console.error,
	) {
		this._recognition = this._initialize_recognition()
	}

	private _initialize_recognition(): SpeechRecognition | null {
		if (typeof globalThis === 'undefined') return null

		const window = globalThis as unknown as Window
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

		if (!SpeechRecognition) {
			this._on_error('Speech Recognition API is not supported in this browser')
			return null
		}

		const recognition = new SpeechRecognition()
		recognition.continuous = true
		recognition.interimResults = true
		recognition.onerror = this._handle_error.bind(this)

		if (is_android()) {
			recognition.onresult = this._handle_result_android.bind(this)
			recognition.onend = this._handle_end_android.bind(this)
		} else {
			recognition.onresult = this._handle_result.bind(this)
			recognition.onend = this._handle_end.bind(this)
		}

		return recognition
	}

	private _add_transcript(transcript: string): void {
		this._final_transcript = this._get_full_transcript(transcript)
	}

	private _get_full_transcript(interim_transcript: string): string {
		if (!this._final_transcript || !interim_transcript) {
			return this._final_transcript + interim_transcript
		}

		return `${this._final_transcript} ${interim_transcript}`
	}

	private _handle_result_common(event: SpeechRecognitionEvent, is_android: boolean): void {
		let interim_transcript = ''

		for (let i = event.resultIndex; i < event.results.length; i++) {
			const result = event.results[i]
			if (!result) continue

			const transcript = result[0]?.transcript
			if (!transcript) continue

			if (is_android || !result.isFinal) {
				interim_transcript += transcript
			} else {
				this._add_transcript(transcript)
			}
		}

		if (is_android) {
			this._interim_transcript = interim_transcript
		}

		const full_transcript = this._get_full_transcript(interim_transcript)
		this._on_transcript_update(full_transcript)
	}

	private _handle_result(event: SpeechRecognitionEvent): void {
		this._handle_result_common(event, false)
	}

	private _handle_result_android(event: SpeechRecognitionEvent): void {
		this._handle_result_common(event, true)
	}

	private _handle_error(event: SpeechRecognitionErrorEvent): void {
		this._on_error(`Speech Recognition error: ${event.error}`)
		this._on_error(`Additional information: ${event.message}`)
		this._is_active = false
	}

	private _should_restart(): boolean {
		return this._is_active && this._recognition !== null
	}

	private _restart_recognition(): void {
		if (!this._recognition) return

		try {
			this._recognition.start()
		} catch (error) {
			this._on_error(`Failed to restart recognition: ${error}`)
		}
	}

	private _handle_end(): void {
		if (!this._should_restart()) return
		this._restart_recognition()
	}

	private _handle_end_android(): void {
		if (!this._should_restart()) return

		this._add_transcript(this._interim_transcript)
		this._interim_transcript = ''
		this._restart_recognition()
	}

	private _reset_transcripts(): void {
		this._final_transcript = ''
		this._interim_transcript = ''
	}

	start(lang: string = SpeechToText.DEFAULT_LANG): void {
		if (!this._recognition) {
			this._on_error('SpeechRecognition is not initialized')
			return
		}

		if (this._is_active) return

		this._recognition.lang = lang
		this._reset_transcripts()

		try {
			this._is_active = true
			this._recognition.start()
		} catch (error) {
			this._on_error(`Failed to start recognition: ${error}`)
			this._is_active = false
		}
	}

	stop(): void {
		if (!this._recognition) return
		if (!this._is_active) return

		try {
			this._is_active = false
			this._recognition.stop()
		} catch (error) {
			this._on_error(`Failed to stop recognition: ${error}`)
		}
	}

	restart(): void {
		if (!this._recognition) return

		this._reset_transcripts()
		this._recognition.stop()
	}

	destroy(): void {
		this.stop()
	}
}
