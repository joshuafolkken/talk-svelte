import { get_all_phrase_entries, get_phrase_entries, type Phrase } from './common'

/* eslint-disable sonarjs/no-duplicate-string */

const en = new Map<string, string>([
	['mcfly-x', 'McFly!'],
	// ['doc-x', 'Doc!'],
	// ['marty-x', 'Marty!'],
	// ['biff-x', 'Biff!'],
	['great-scott-x', 'Great Scott!'],
	['time-machine-x', 'Time machine!'],
	['the-future-x', 'The future!'],
	['holy-shit-x', 'Holy shit!'],

	['i-m-your-density', "I'm your density."],
	['you-re-my-son-x', "You're my son!"],
	['it-s-a-delorean-x', "It's a DeLorean!"],
	['this-is-heavy-x', 'This is heavy!'],
	['this-is-insane-x', 'This is insane!'],

	['this-is-crazy-x', 'This is crazy!'],
	['1-21-gigawatts-x', '1.21 gigawatts!'],
	['88-miles-per-hour-x', '88 miles per hour!'],
	['back-to-the-future-x', 'Back to the future!'],
	['i-m-from-the-future-x', "I'm from the future!"],

	['the-flux-capacitor-x', 'The flux capacitor!'],
	['the-plutonium-chamber-x', 'The plutonium chamber!'],
	['the-temporal-displacement-x', 'The temporal displacement!'],
	['this-is-unbelievable-x', 'This is unbelievable!'],
	['this-is-crazy-x', 'This is crazy!'],

	['i-m-going-to-be-late-x', "I'm going to be late!"],
	['what-the-hell-x', 'What the hell!'],
	['i-m-late-for-school-x', "I'm late for school!"],
	['nobody-calls-me-chicken-x', 'Nobody calls me chicken!'],
	['where-the-hell-are-they-q', 'Where the hell are they?'],

	['the-time-circuits-are-on-x', 'The time circuits are on!'],
	['i-can-t-believe-this-x', "I can't believe this!"],
	['i-m-having-a-nightmare-x', "I'm having a nightmare!"],
	['i-m-going-to-be-late-for-school-x', "I'm going to be late for school!"],
	['i-m-going-to-be-late-for-my-own-birth-x', "I'm going to be late for my own birth!"],

	['where-we-re-going-we-don-t-need-roads', "Where we're going, we don't need roads."],
	['roads-where-we-re-going-we-don-t-need-roads', "Roads? Where we're going, we don't need roads."],
	['your-mother-and-i-are-going-to-the-dance', 'Your mother and I are going to the dance.'],
	['you-re-not-thinking-fourth-dimensionally-x', "You're not thinking fourth dimensionally!"],
	[
		'this-is-the-most-amazing-thing-i-ve-ever-seen-x',
		"This is the most amazing thing I've ever seen!",
	],

	// [
	// 	'the-way-i-see-it-if-you-re-going-to-build-a-time-machine-into-a-car-why-not-do-it-with-some-style-q',
	// 	"The way I see it, if you're going to build a time machine into a car, why not do it with some style?",
	// ],
])

const phrase_key_groups = [
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
	// [
	// 	'the-flux-capacitor-x',
	// 	'the-plutonium-chamber-x',
	// 	'the-temporal-displacement-x',
	// 	'this-is-unbelievable-x',
	// 	'this-is-crazy-x',
	// ],
	// [
	// 	'i-m-going-to-be-late-x',
	// 	'what-the-hell-x',
	// 	'i-m-late-for-school-x',
	// 	'nobody-calls-me-chicken-x',
	// 	'where-the-hell-are-they-q',
	// ],
	// [
	// 	'the-time-circuits-are-on-x',
	// 	'i-can-t-believe-this-x',
	// 	'i-m-having-a-nightmare-x',
	// 	'i-m-going-to-be-late-for-school-x',
	// 	'i-m-going-to-be-late-for-my-own-birth-x',
	// ],
	// [
	// 	'where-we-re-going-we-don-t-need-roads',
	// 	'roads-where-we-re-going-we-don-t-need-roads',
	// 	'your-mother-and-i-are-going-to-the-dance',
	// 	'you-re-not-thinking-fourth-dimensionally-x',
	// 	'this-is-the-most-amazing-thing-i-ve-ever-seen-x',
	// ],
]

const ja = new Map<string, string>([
	['mcfly-x', 'マクフライ！'],
	// ['doc-x', 'ドク！'],
	// ['marty-x', 'マーティ！'],
	// ['biff-x', 'ビフ！'],
	['great-scott-x', 'グレート・スコット！'],
	['time-machine-x', 'タイムマシン！'],
	['the-future-x', '未来！'],
	['holy-shit-x', 'うわー！'],

	['i-m-your-density', '俺は君の運命だ'],
	['you-re-my-son-x', '君は俺の息子だ！'],
	['it-s-a-delorean-x', 'デロリアンだ！'],
	['this-is-heavy-x', 'これは重い！'],
	['this-is-insane-x', 'これは狂ってる！'],

	['this-is-crazy-x', 'これはクレイジー！'],
	['1-21-gigawatts-x', '1.21ギガワット！'],
	['88-miles-per-hour-x', '時速88マイル！'],
	['back-to-the-future-x', 'バックトゥーザフューチャー！'],
	['i-m-from-the-future-x', '俺は未来から来た！'],

	['the-flux-capacitor-x', 'フラックス・コンデンサー！'],
	['the-plutonium-chamber-x', 'プルトニウム・チェンバー！'],
	['the-temporal-displacement-x', '時間移動！'],
	['this-is-unbelievable-x', 'これは信じられない！'],
	['this-is-crazy-x', 'これはクレイジー！'],

	['i-m-going-to-be-late-x', '遅刻しそう！'],
	['what-the-hell-x', '何だって！'],
	['i-m-late-for-school-x', '学校に遅刻する！'],
	['nobody-calls-me-chicken-x', '誰にもチキンとは呼ばせない！'],
	['where-the-hell-are-they-q', '一体どこに行ったんだ？'],

	['the-time-circuits-are-on-x', 'タイム回路がオンだ！'],
	['i-can-t-believe-this-x', 'これを信じられない！'],
	['i-m-having-a-nightmare-x', '悪夢を見てる！'],
	['i-m-going-to-be-late-for-school-x', '学校に遅刻しそう！'],
	['i-m-going-to-be-late-for-my-own-birth-x', '自分の誕生に遅刻しそう！'],

	['where-we-re-going-we-don-t-need-roads', '行く先には道路は要らない'],
	['roads-where-we-re-going-we-don-t-need-roads', '道路？行く先には道路は要らない'],
	['your-mother-and-i-are-going-to-the-dance', '君の母親と私はダンスに行く'],
	['you-re-not-thinking-fourth-dimensionally-x', '君は4次元的に考えていない！'],
	['this-is-the-most-amazing-thing-i-ve-ever-seen-x', 'これは今まで見た中で最も素晴らしい！'],

	// [
	// 	'the-way-i-see-it-if-you-re-going-to-build-a-time-machine-into-a-car-why-not-do-it-with-some-style-q',
	// 	'俺の考えでは、車にタイムマシンを組み込むなら、なぜスタイルよくやらない？',
	// ],
])

function get_bttf_phrases(index: number): Array<Phrase> {
	return get_phrase_entries(index, phrase_key_groups, en, ja)
}

function get_all_bttf_phrases(): Array<Phrase> {
	return get_all_phrase_entries(phrase_key_groups, en, ja)
}

export { get_bttf_phrases, get_all_bttf_phrases }
