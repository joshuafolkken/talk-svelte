export interface Category {
	title: string
	message: string
}

export const CATEGORIES = new Map<string, Category>([
	['back-to-the-future', { title: 'Back to the Future', message: 'Great Scott!' }],
	['the-matrix', { title: 'The Matrix', message: 'Wake up, Neo.' }],
	['the-terminator', { title: 'The Terminator', message: 'I’ll be back.' }],
])
