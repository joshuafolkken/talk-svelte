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
	['what-the-hell-x', 'What the hell!'],

	['hello-anybody-home-q', 'Hello, anybody home?'],
	['what-s-going-on-q', "What's going on?"],
	['that-s-disgusting', "That's disgusting."],
	['rock-n-roll-x', "Rock 'N' Roll!"],
	// ['marty-is-that-you-q', 'Marty, is that you?'],
	['hey-hey-doc-x', 'Hey, hey, Doc!'],

	['where-are-you-q', 'Where are you?'],
	['wait-a-minute-x', 'Wait a minute!'],
	['where-s-einstein-q', "Where's Einstein?"],
	['right', 'Right.'],
	['precisely', 'Precisely.'],

	['all-right', 'All right.'],
	['come-on', 'Come on.'],
	['oh-yes-sir', 'Oh, yes, sir.'],
	// ['you-re-a-slacker-x', "You're a slacker!"],
	['next-please', 'Next, please.'],
	['okay', 'Okay.'],

	['he-s-right-here', "He's right here."],
	['it-s-eight-o-clock', "It's eight o'clock"],
	['thank-you', 'Thank you.'],
	['you-re-really-good', "You're really good."],
	['yeah-i-know-i-know', 'Yeah, I know, I know.'],

	['that-s-good-advice', "That's good advice."],
	['all-right-okay', 'All right, okay.'],
	['i-mean', 'I mean...'],
	['save-the-tower', 'Save the tower.'],
	['that-is-hot', 'That is hot.'],

	['stop-it', 'Stop it.'],
	['what-q', 'What?'],
	['here-you-go', 'Here you go.'],
	['here-s-a-quarter', "Here's a quarter."],
	['where-were-we-q', 'Where were we?'],

	['it-s-my-dad', "It's my dad."],
	['i-ve-gotta-go', "I've gotta go."],
	['bye', 'Bye.'],
	['just-perfect', 'Just perfect.'],
	['it-s-your-car-x', "It's your car!"],

	['think-mcfly-think-x', 'Think McFly, think!'],
	['of-course', 'Of course.'],
	['of-course-not', 'Of course not.'],
	['your-shoe-s-untied', "Your shoe's untied."],
	['he-wrecked-it', 'He wrecked it.'],

	['i-m-sorry', "I'm sorry."],
	['goddamn-it-x', 'Goddamn it!'],
	['i-m-late-x', "I'm late!"],
	['watch-your-mouth-x', 'Watch your mouth!'],
	['make-it-fast', 'Make it fast.'],

	['see-you-later', 'See you later.'],
	['he-s-so-funny', "He's so funny."],
	['it-ll-just-happen', "It'll just happen."],
	['bird-watching-q', 'Bird watching?'],
	['what-lorraine-what-q', 'What, Lorraine? What?'],

	['anyway', 'Anyway...'],

	['i-m-going-to-be-late-x', "I'm going to be late!"],
	['i-m-late-for-school-x', "I'm late for school!"],
	['nobody-calls-me-chicken-x', 'Nobody calls me chicken!'],
	['where-the-hell-are-they-q', 'Where the hell are they?'],
	['the-time-circuits-are-on-x', 'The time circuits are on!'],

	['i-can-t-believe-this-x', "I can't believe this!"],
	['i-m-having-a-nightmare-x', "I'm having a nightmare!"],
	['i-m-going-to-be-late-for-school-x', "I'm going to be late for school!"],
	['i-m-going-to-be-late-for-my-own-birth-x', "I'm going to be late for my own birth!"],
	['year-well-history-is-gonna-be-change', 'Year, well, history is gonna change.'],

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
	[
		'the-flux-capacitor-x',
		'the-plutonium-chamber-x',
		'the-temporal-displacement-x',
		'this-is-unbelievable-x',
		'what-the-hell-x',
	],
	[
		'hello-anybody-home-q',
		'what-s-going-on-q',
		'that-s-disgusting',
		'rock-n-roll-x',
		// 'marty-is-that-you-q',
		'hey-hey-doc-x',
	],
	['where-are-you-q', 'wait-a-minute-x', 'where-s-einstein-q', 'right', 'precisely'],
	['all-right', 'come-on', 'oh-yes-sir', 'next-please', 'okay'],

	[
		'he-s-right-here',
		'it-s-eight-o-clock',
		'thank-you',
		'you-re-really-good',
		'yeah-i-know-i-know',
	],
	['that-s-good-advice', 'all-right-okay', 'i-mean', 'save-the-tower', 'that-is-hot'],
	['stop-it', 'what-q', 'here-you-go', 'here-s-a-quarter', 'where-were-we-q'],
	['it-s-my-dad', 'i-ve-gotta-go', 'bye', 'just-perfect', 'it-s-your-car-x'],
	['think-mcfly-think-x', 'of-course', 'of-course-not', 'your-shoe-s-untied', 'he-wrecked-it'],
	['i-m-sorry', 'goddamn-it-x', 'i-m-late-x', 'watch-your-mouth-x', 'make-it-fast'],
	[
		'see-you-later',
		'he-s-so-funny',
		'it-ll-just-happen',
		'bird-watching-q',
		'what-lorraine-what-q',
	],

	['anyway'],

	// [
	// 	'i-m-going-to-be-late-x',
	// 	'i-m-late-for-school-x',
	// 	'nobody-calls-me-chicken-x',
	// 	'where-the-hell-are-they-q',
	// 	'the-time-circuits-are-on-x',
	// ],
	// [
	// 	'i-can-t-believe-this-x',
	// 	'i-m-having-a-nightmare-x',
	// 	'i-m-going-to-be-late-for-school-x',
	// 	'i-m-going-to-be-late-for-my-own-birth-x',
	// 	'year-well-history-is-gonna-be-change',
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
	['what-the-hell-x', '何だって！'],

	['hello-anybody-home-q', 'こんにちは、だれかいる？'],
	['what-s-going-on-q', 'どうなってるんだ？'],
	['that-s-disgusting', 'まいったな。'],
	['rock-n-roll-x', 'ロックンロールだ！'],
	// ['marty-is-that-you-q', 'マーティ、君か？'],
	['hey-hey-doc-x', 'ねえ、ねえ、ドク！'],

	['where-are-you-q', 'どこにいるの？'],
	['wait-a-minute-x', 'ちょっと待って！'],
	['where-s-einstein-q', 'アインシュタインはどこ？'],
	['right', '分かった。'],
	['precisely', 'まったくそのとおり。'],

	['all-right', 'いいよ。'],
	['come-on', 'Come on.'],
	['oh-yes-sir', 'Oh, yes, sir.'],
	// ['you-re-a-slacker-x', "You're a slacker!"],
	['next-please', 'Next, please.'],
	['okay', 'Okay.'],

	['he-s-right-here', '彼はここにいる。'],
	['it-s-eight-o-clock', '8時だ。'],
	['thank-you', 'ありがとう。'],
	['you-re-really-good', 'あなたは本当にいいよ。'],
	['yeah-i-know-i-know', 'ああ、分かってるよ、分かってる。'],

	['that-s-good-advice', 'それはいいアドバイスだね。'],
	['all-right-okay', '分かった、そうだね。'],
	['i-mean', 'つまり...'],
	['save-the-tower', 'タワーを守ろう。'],
	['that-is-hot', 'イカスな。'],

	['stop-it', 'やめて。'],
	['what-q', '何？'],
	['here-you-go', 'さあ、どうぞ。'],
	['here-s-a-quarter', 'さあ25セント。'],
	['where-were-we-q', 'どこまで話してた？'],

	['it-s-my-dad', 'パパだ。'],
	['i-ve-gotta-go', '行かなきゃ。'],
	['bye', 'じゃあね。'],
	['just-perfect', '全く最高だ。'],
	['it-s-your-car-x', 'お前の車だ！'],

	['think-mcfly-think-x', '考えろよ、マクフライ、考えろ！'],
	['of-course', 'もちろん。'],
	['of-course-not', 'もちろん違う。'],
	['your-shoe-s-untied', '靴紐がほどけてるぞ。'],
	['he-wrecked-it', '彼が壊したんだ。'],

	['i-m-sorry', '申し訳ない。'],
	['goddamn-it-x', 'ちくしょう！'],
	['i-m-late-x', '遅刻だ！'],
	['watch-your-mouth-x', '口を慎みなさい！'],
	['make-it-fast', '早くしてよ。'],

	['see-you-later', 'じゃあね、また。'],
	['he-s-so-funny', '彼は面白いな。'],
	['it-ll-just-happen', '自然に起こるのよ。'],
	['bird-watching-q', 'バードウォッチング?'],
	['what-lorraine-what-q', 'えっ、ロレーン？なんだい？'],

	['anyway', 'とにかく...'],

	['i-m-going-to-be-late-x', '遅刻しそう！'],
	['i-m-late-for-school-x', '学校に遅刻する！'],
	['nobody-calls-me-chicken-x', '誰にもチキンとは呼ばせない！'],
	['where-the-hell-are-they-q', '一体どこに行ったんだ？'],
	['the-time-circuits-are-on-x', 'タイム回路がオンだ！'],

	['i-can-t-believe-this-x', 'これを信じられない！'],
	['i-m-having-a-nightmare-x', '悪夢を見てる！'],
	['i-m-going-to-be-late-for-school-x', '学校に遅刻しそう！'],
	['i-m-going-to-be-late-for-my-own-birth-x', '自分の誕生に遅刻しそう！'],
	['year-well-history-is-gonna-be-change', 'ええ、でも歴史は変わるものですよ。'],

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

export { get_bttf_phrases, get_all_bttf_phrases, phrase_key_groups }
