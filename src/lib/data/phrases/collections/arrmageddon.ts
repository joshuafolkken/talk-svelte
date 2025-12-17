import { phrases, type Phrase, type PhrasesModule } from '$lib/data/phrases/phrases'

const en = new Map<string, string>([
	['mcfly-x', 'McFly!'],
	['great-scott-x', 'Great Scott!'],
	['time-machine-x', 'Time machine!'],
	['the-future-x', 'The future!'],
	['holy-shit-x', 'Holy shit!'],

	['i-m-your-density', "I'm your density."],
	['you-re-my-son-x', "You're my son!"],
	['it-s-a-delorean-x', "It's a DeLorean!"],
	['this-is-heavy-x', 'This is heavy!'],
	['this-is-insane-x', 'This is insane!'],
])

const key_collections = [
	// ['mcfly-x', 'doc-x', 'great-scott-x', 'time-machine-x', 'the-future-x'],
	['mcfly-x', 'great-scott-x', 'time-machine-x', 'the-future-x', 'holy-shit-x'],
	[
		'i-m-your-density',
		'you-re-my-son-x',
		'it-s-a-delorean-x',
		'this-is-heavy-x',
		'this-is-insane-x',
	],
	[
		'this-is-crazy-x',
		'1-21-gigawatts-x',
		'88-miles-per-hour-x',
		'back-to-the-future-x',
		'i-m-from-the-future-x',
	],
]

const ja = new Map<string, string>([
	['mcfly-x', 'マクフライ！'],
	['great-scott-x', 'グレート・スコット！'],
	['time-machine-x', 'タイムマシン！'],
	['the-future-x', '未来！'],
	['holy-shit-x', 'うわー！'],

	['i-m-your-density', '俺は君の運命だ'],
	['you-re-my-son-x', '君は俺の息子だ！'],
	['it-s-a-delorean-x', 'デロリアンだ！'],
	['this-is-heavy-x', 'これは重い！'],
	['this-is-insane-x', 'これは狂ってる！'],
])

function get_phrases(index: number): Array<Phrase> {
	return phrases.get(index, key_collections, en, ja)
}

function get_all_phrases(): Array<Phrase> {
	return phrases.get_all(key_collections, en, ja)
}

// eslint-disable-next-line import/no-default-export
export default {
	key_collections,
	get_phrases,
	get_all_phrases,
} satisfies PhrasesModule
