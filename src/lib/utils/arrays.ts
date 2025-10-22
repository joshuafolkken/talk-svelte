// Fisher-Yates シャッフルアルゴリズム
function shuffle_array<T>(array: Array<T>): Array<T> {
	const shuffled = [...array]
	for (let index = shuffled.length - 1; index > 0; index--) {
		// eslint-disable-next-line sonarjs/pseudo-random
		const index2 = Math.floor(Math.random() * (index + 1))
		const temporary = shuffled[index] as T
		shuffled[index] = shuffled[index2] as T
		shuffled[index2] = temporary
	}
	return shuffled
}

export { shuffle_array }
