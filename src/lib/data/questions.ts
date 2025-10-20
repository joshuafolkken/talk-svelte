import { create_question, type Question } from '$lib/types/question'

export const questions = [
	create_question('you_nailed_it.mp3', 'You nailed it!', '完璧にやったね！'),
	create_question('live_it.mp3', 'Love it!', 'それ好き！'),
	create_question('awesome.mp3', 'Awesome!', '最高！'),
] satisfies Question[]
