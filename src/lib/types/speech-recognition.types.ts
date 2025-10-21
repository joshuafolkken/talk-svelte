/* eslint-disable @typescript-eslint/naming-convention */

type TranscriptCallback = (transcript: string) => void
type ErrorCallback = (error: string) => void

interface SpeechRecognition extends EventTarget {
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

interface SpeechRecognitionEvent extends Event {
	resultIndex: number
	results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
	error: string
	message: string
}

declare global {
	interface Window {
		SpeechRecognition?: new () => SpeechRecognition
		webkitSpeechRecognition?: new () => SpeechRecognition
	}
}

export type {
	TranscriptCallback,
	ErrorCallback,
	SpeechRecognition,
	SpeechRecognitionEvent,
	SpeechRecognitionErrorEvent,
}
