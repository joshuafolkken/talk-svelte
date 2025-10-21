import { create_question, type Question } from '$lib/types/question'

const questions = [
	create_question('love-it', 'Love it!', 'それ好き！'),
	create_question('praise/awesome', 'Awesome!', '最高！'),
	create_question('praise/you-nailed-it', 'You nailed it!', '完璧にやったね！'),
] satisfies Array<Question>

export { questions }
