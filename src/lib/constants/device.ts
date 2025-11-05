export const DEVICE = {
	REGEX: {
		IOS: /iphone|ipad/u,
		ANDROID: /android/u,
		TABLET: /ipad/u,
	},
	VIEWPORT: {
		BASE_WIDTH: 404,
		BASE_HEIGHT: 750,
		TABLET_MIN_WIDTH: 600,
		TABLET_MIN_HEIGHT: 1024,
	},
	SCALE_LIMITS: {
		MIN: 0.1,
		MAX: 3,
	},
	DEBOUNCE_TIME: 200,
} as const
