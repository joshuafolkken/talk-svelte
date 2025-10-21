export const APP_TITLE = 'Talk'

export const DEFAULT_LANGUAGE = 'en-US'
export const AUDIO_PATH = 'audio'

export const SCALE_LIMITS = {
	min: 0.1,
	max: 3,
}

export const DEBOUNCE_TIME = 200

export const DEVICE_REGEX = {
	ios: /iphone|ipad/u,
	android: /android/u,
	tablet: /ipad/u,
}

export const VIEWPORT = {
	base_width: 404,
	base_height: 710,
	tablet_min_width: 600,
	tablet_min_height: 1024,
}

export const ICON_SIZES = {
	sm: 'sm',
	md: 'md',
	lg: 'lg',
}

export type IconSize = (typeof ICON_SIZES)[keyof typeof ICON_SIZES]

export const BUTTON_SIZES = {
	md: 'md',
	lg: 'lg',
}

export type ButtonSize = (typeof BUTTON_SIZES)[keyof typeof BUTTON_SIZES]

export const BUTTON_STYLES = {
	recording_active: 'recording-active',
	liked_active: 'liked-active',
	trophy_active: 'trophy-active',
}
