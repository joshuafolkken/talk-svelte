export const APP_TITLE = 'Talk'

export const DEFAULT_LANGUAGE = 'en-US'
export const AUDIO_PATH = '/audio'

export const SCALE_LIMITS = {
	MIN: 0.1,
	MAX: 3,
}

export const DEBOUNCE_TIME = 200

export const DEVICE_REGEX = {
	IOS: /iphone|ipad/,
	ANDROID: /android/,
	TABLET: /ipad/,
}

export const VIEWPORT = {
	BASE_WIDTH: 404,
	BASE_HEIGHT: 710,
	TABLET_MIN_WIDTH: 600,
	TABLET_MIN_HEIGHT: 1024,
}

export const ICON_SIZES = {
	SM: 'sm',
	MD: 'md',
	LG: 'lg',
}

export type IconSize = (typeof ICON_SIZES)[keyof typeof ICON_SIZES]

export const BUTTON_SIZES = {
	MD: 'md',
	LG: 'lg',
}

export type ButtonSize = (typeof BUTTON_SIZES)[keyof typeof BUTTON_SIZES]

export const BUTTON_STYLES = {
	RECORDING_ACTIVE: 'recording-active',
	LIKED_ACTIVE: 'liked-active',
	TROPHY_ACTIVE: 'trophy-active',
}
