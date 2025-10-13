type TranscriptCallback = (transcript: string) => void
type ErrorCallback = (error: string) => void

interface SpeechRecognition extends EventTarget {
	lang: string
	continuous: boolean
	interimResults: boolean
	start(): void
	stop(): void
	onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null
	onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null
	onend: ((this: SpeechRecognition, ev: Event) => void) | null
}

interface SpeechRecognitionEvent extends Event {
	results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
	error: string
}

declare global {
	interface Window {
		SpeechRecognition?: {
			new (): SpeechRecognition
		}
		webkitSpeechRecognition?: {
			new (): SpeechRecognition
		}
	}
}

export class SpeechToText {
	private _recognition: SpeechRecognition | null = null
	private _is_active: boolean = false

	constructor(
		private on_transcript_update: TranscriptCallback,
		private _on_error: ErrorCallback = console.error,
	) {
		if (typeof window === 'undefined') return

		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

		if (!SpeechRecognition) {
			this._on_error('Speech Recognition API is not supported in this browser')
			return
		}

		this._recognition = new SpeechRecognition()
		this._recognition.continuous = true
		this._recognition.interimResults = true

		this._recognition.onresult = (event: SpeechRecognitionEvent) => {
			let transcript = ''
			for (let i = 0; i < event.results.length; i++) {
				transcript += event.results[i]?.[0]?.transcript || ''
			}
			this.on_transcript_update(transcript)
		}

		this._recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
			this._on_error(`Speech Recognition error: ${event.error}`)
			this._is_active = false
		}

		this._recognition.onend = () => {
			if (!this._is_active) return
			if (!this._recognition) return

			try {
				this._recognition.start()
			} catch (error) {
				this._on_error(`Failed to restart recognition: ${error}`)
			}
		}
	}

	start(lang: string = 'en-US'): void {
		if (!this._recognition) {
			this._on_error('SpeechRecognition is not initialized')
			return
		}

		if (this._is_active) return

		this._recognition.lang = lang

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

	destroy(): void {
		this.stop()
		this._recognition = null
	}
}
