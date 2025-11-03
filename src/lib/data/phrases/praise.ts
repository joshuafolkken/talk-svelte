import { phrases, type Phrase } from './phrases'

const en = new Map<string, string>([
	// Basic praise (low)
	['good-x', 'Good!'],
	['nice-x', 'Nice!'],
	['nice-work-x', 'Nice work!'],
	['well-done-x', 'Well done!'],
	['great-job-x', 'Great job!'],

	// Positive praise (mid-low)
	['you-did-it-x', 'You did it!'],
	['awesome-x', 'Awesome!'],

	// Strong praise (mid)
	['excellent-x', 'Excellent!'],
	['fantastic-x', 'Fantastic!'],
	['brilliant-x', 'Brilliant!'],

	// Stronger praise (mid-high)
	['amazing-x', 'Amazing!'],
	['incredible-x', 'Incredible!'],
	['superb-x', 'Superb!'],
	['outstanding-x', 'Outstanding!'],
	['perfect-x', 'Perfect!'],

	// Very strong praise (high)
	['epic-x', 'Epic!'],
	['you-nailed-it-x', 'You nailed it!'],
	['unbelievable-x', 'Unbelievable!'],
	['you-rock-x', 'You rock!'],

	// Highest level praise (maximum)
	['that-s-insane-x', "That's insane!"],
	['legendary-x', 'Legendary!'],
])

const key_collections = [
	['good-x', 'nice-x', 'nice-work-x', 'well-done-x', 'great-job-x'],
	// ['you-did-it-x', 'awesome-x'],
	// ['excellent-x', 'fantastic-x', 'brilliant-x'],
	// ['amazing-x', 'incredible-x', 'superb-x', 'outstanding-x', 'perfect-x'],
	// ['epic-x', 'you-nailed-it-x', 'unbelievable-x', 'you-rock-x'],
	// ['that-s-insane-x', 'legendary-x'],
]

const ja = new Map<string, string>([
	// Basic praise (low)
	['good-x', 'いいね！'],
	['nice-x', 'ナイス！'],
	['nice-work-x', 'お疲れ様！'],
	['well-done-x', 'よくやった！'],
	['great-job-x', '素晴らしい！'],

	// Positive praise (mid-low)
	['you-did-it-x', 'やったね！'],
	['awesome-x', 'すごい！'],

	// Strong praise (mid)
	['excellent-x', '優秀！'],
	['fantastic-x', 'ファンタスティック！'],
	['brilliant-x', '素晴らしい！'],

	// Stronger praise (mid-high)
	['amazing-x', 'すごい！'],
	['incredible-x', '信じられない！'],
	['superb-x', '素晴らしい！'],
	['outstanding-x', '傑出した！'],
	['perfect-x', '完璧！'],

	// Very strong praise (high)
	['epic-x', 'エピック！'],
	['you-nailed-it-x', '完璧にやった！'],
	['unbelievable-x', '信じられない！'],
	['you-rock-x', '君は最高！'],

	// Highest level praise (maximum)
	['that-s-insane-x', 'それはすごい！'],
	['legendary-x', '伝説的！'],
])

function get_phrases(index: number): Array<Phrase> {
	return phrases.get(index, key_collections, en, ja)
}

function get_all_phrases(): Array<Phrase> {
	return phrases.get_all(key_collections, en, ja)
}

let current_index = 0

function next(): string {
	const current_phrases = get_phrases(0)
	const phrase = current_phrases.at(current_index)
	current_index = (current_index + 1) % current_phrases.length
	return phrase?.key ?? ''
}

function reset(): void {
	current_index = 0
}

export const praise = {
	get_phrases,
	get_all_phrases,
	next,
	reset,
}
