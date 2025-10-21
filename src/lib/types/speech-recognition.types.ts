export type TranscriptCallback = (transcript: string) => void
export type ErrorCallback = (error: string) => void

export interface SpeechRecognition extends EventTarget {
	lang: string
	continuous: boolean
	interimResults: boolean // eslint-disable-line @typescript-eslint/naming-convention
	start(): void
	stop(): void
	onresult: ((this: SpeechRecognition, event: SpeechRecognitionEvent) => void) | null
	onerror: ((this: SpeechRecognition, event: SpeechRecognitionErrorEvent) => void) | null
	onend: ((this: SpeechRecognition, event: Event) => void) | null
	addEventListener(
		type: 'error',
		listener: (this: SpeechRecognition, event: SpeechRecognitionErrorEvent) => void,
	): void
	addEventListener(
		type: 'result',
		listener: (this: SpeechRecognition, event: SpeechRecognitionEvent) => void,
	): void
	addEventListener(type: string, listener: EventListenerOrEventListenerObject): void
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
