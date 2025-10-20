export type TranscriptCallback = (transcript: string) => void
export type ErrorCallback = (error: string) => void

export interface SpeechRecognition extends EventTarget {
	lang: string
	continuous: boolean
	interimResults: boolean // eslint-disable-line @typescript-eslint/naming-convention
	start(): void
	stop(): void
	onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null
	onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null
	onend: ((this: SpeechRecognition, ev: Event) => void) | null
}

export interface SpeechRecognitionEvent extends Event {
	resultIndex: number // eslint-disable-line @typescript-eslint/naming-convention
	results: SpeechRecognitionResultList
}

export interface SpeechRecognitionErrorEvent extends Event {
	error: string
	message: string
}

declare global {
	interface Window {
		SpeechRecognition?: new () => SpeechRecognition // eslint-disable-line @typescript-eslint/naming-convention
		webkitSpeechRecognition?: new () => SpeechRecognition // eslint-disable-line @typescript-eslint/naming-convention
	}
}
