export const APP = {
	NAME: 'Talk',
	VERSION: import.meta.env['APP_VERSION'] as string,
	WEBSITE_URL: 'https://talk.joshuafolkken.com/',
	GITHUB_URL: 'https://github.com/joshuafolkken/talk-svelte/',
	DEFAULT_LANGUAGE: 'en-US',
} as const

export const AUTHOR = {
	NAME: 'Joshua Folkken',
	WEBSITE_URL: 'https://joshuafolkken.com/',
	GITHUB_URL: 'https://github.com/joshuafolkken/',
	EMAIL: 'joshuafolkken@gmail.com',
} as const
