/* eslint-disable @typescript-eslint/naming-convention */

export type TranscriptCallback = (transcript: string) => void
export type ErrorCallback = (error: string) => void

export interface SpeechRecognition extends EventTarget {
	lang: string
	continuous: boolean
	interimResults: boolean
	start: () => void
	stop: () => void
	onresult: ((this: SpeechRecognition, event: SpeechRecognitionEvent) => void) | null
	onerror: ((this: SpeechRecognition, event: SpeechRecognitionErrorEvent) => void) | null
	onend: ((this: SpeechRecognition, event: Event) => void) | null
	addEventListener: ((
		type: 'error',
		listener: (this: SpeechRecognition, event: SpeechRecognitionErrorEvent) => void,
	) => void) &
		((
			type: 'result',
			listener: (this: SpeechRecognition, event: SpeechRecognitionEvent) => void,
		) => void) &
		((type: string, listener: EventListenerOrEventListenerObject) => void)
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
