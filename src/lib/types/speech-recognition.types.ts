export type TranscriptCallback = (transcript: string) => void
export type ErrorCallback = (error: string) => void

export interface SpeechRecognition extends EventTarget {
	lang: string
	continuous: boolean
	interimResults: boolean
	start(): void
	stop(): void
	onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null
	onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null
	onend: ((this: SpeechRecognition, ev: Event) => void) | null
}

export interface SpeechRecognitionEvent extends Event {
	resultIndex: number
	results: SpeechRecognitionResultList
}

export interface SpeechRecognitionErrorEvent extends Event {
	error: string
	message: string
}

declare global {
	interface Window {
		SpeechRecognition?: new () => SpeechRecognition
		webkitSpeechRecognition?: new () => SpeechRecognition
	}
}
