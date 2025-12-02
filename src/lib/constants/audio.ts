import { device } from '$lib/utils/device'

const IPHONE_DELAY_MS = {
	PLAY: 700,
	RECORD: 200,
}

const OTHER_DELAY_MS = {
	PLAY: 300,
	RECORD: 100,
}

export const AUDIO = {
	PRELOAD: {
		NONE: 'none',
		AUTO: 'auto',
	},
	RESET_TIME: 0,
	VOLUME: 1,
	PLAYBACK_RATE: 1,
	PATH: 'audio',
	PLAY_DELAY_MS: device.is_iphone() ? IPHONE_DELAY_MS.PLAY : OTHER_DELAY_MS.PLAY,
	RECORD_DELAY_MS: device.is_iphone() ? IPHONE_DELAY_MS.RECORD : OTHER_DELAY_MS.RECORD,
} as const
