// Fisher-Yates シャッフルアルゴリズム
function shuffle<T>(array: Array<T>): Array<T> {
	const shuffled = [...array]
	for (let index = shuffled.length - 1; index > 0; index--) {
		const index2 = Math.floor(Math.random() * (index + 1)) // eslint-disable-line sonarjs/pseudo-random
		const temporary = shuffled[index] as T
		shuffled[index] = shuffled[index2] as T
		shuffled[index2] = temporary
	}
	return shuffled
}

export const arrays = {
	shuffle,
}
