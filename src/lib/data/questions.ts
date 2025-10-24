import type { Question } from '$lib/types/question'
import { shuffle_array } from '$lib/utils/arrays'
import { text_to_slug } from '$lib/utils/text-to-slug'

// audio_uri を自動生成するヘルパー関数
/* eslint-disable-next-line id-length */
function q(transcript: string, translation: string): Question {
	return {
		audio_uri: text_to_slug(transcript),
		transcript,
		translation,
	}
}

const questions: Array<Question> = [
	q('Love it!', 'それ好き！'),
	q("I'm counting on you.", '頼りにしてるよ。'),

	q("How's it going?", '調子どう？'),
	q("What's up?", '元気？'),
	q('Long time no see!', '久しぶり！'),
	q('How have you been?', 'お元気してた？'),
	q('I see.', 'なるほど。'),

	q('That makes sense.', 'それは理にかなってるね。'),
	q('Sounds good!', '良いね！'),
	q('I got it.', '分かった。'),
	q('No worries.', '気にしないで。'),
	q('Take care.', '気をつけてね。'),

	q("I'm on my way.", '今向かってる。'),
	q('Hang on a sec.', 'ちょっと待って。'),
	q('Let me see.', 'えっと… / ちょっと考えさせて。'),
	q('You know what?', 'あのね / ねえ、聞いて。'),
	q("That's awesome!", 'すごいね！'),

	q('Good for you!', 'よかったね！'),
	q("I can't believe it!", '信じられない！'),
	q("I'm not sure.", 'よくわからないな。'),
	q("That's too bad.", '残念だね。'),
	q("I'm just kidding.", '冗談だよ。'),

	q('I mean…', 'つまり… / というか…'),
	q('Kind of.', 'まあね / そんな感じ。'),
	q('Not really.', 'そうでもない。'),
	q("I don't mind.", '気にしないよ。'),
	q('It depends.', '場合によるね。'),

	q("That's interesting.", 'おもしろいね。'),
	q('What do you mean?', 'どういう意味？'),
	q("You're right.", 'その通り。'),
	q('Exactly!', 'まさにその通り！'),
	q('I guess so.', 'そうかもね。'),

	q("I'm starving!", 'めっちゃお腹すいた。'),
	q("Let's grab a bite.", '何か食べよう。'),
	q("I'm good, thanks.", '大丈夫、ありがとう。'),
	q('Never mind.', '気にしないで / いいよ。'),
	q('You never know.', 'どうなるかわからないよ。'),

	q('Guess what?', 'ねえ、聞いて！'),
	q("I'm in.", '参加するよ。'),
	q("I'm out.", '参加しないよ。'),
	q('Take your time.', 'ゆっくりでいいよ。'),
	q("I'm so tired.", 'めっちゃ疲れた。'),

	q('You made my day!', 'おかげで最高の一日になったよ。'),
	q("I'm not sure about that.", 'それはちょっとどうかな。'),
	q("It's up to you.", '君次第だよ。'),
	q("That's the point.", 'そこがポイントだよ。'),
	q('I knew it.', 'やっぱりね！'),

	q("I'm looking forward to it.", '楽しみにしてるよ。'),
	q("What's going on?", 'どうしたの？ / 何が起きてるの？'),
	q("I'll think about it.", '考えておくよ。'),
	q('I have no idea.', '全くわからない。'),
	q("That's it.", '以上だよ / それだけ。'),

	q('Nice work!', 'いい仕事したね！'),
	q('You rock!', '君は最高だよ！'),
	q("I'm impressed.", '感心したよ。'),
	q('Well done!', 'よくやった！'),
	q('You nailed it!', '完璧にやったね！'),

	q('That sounds fun!', '楽しそうだね！'),
	q('Count me in!', '私も参加するよ！'),
	q("I'm excited!", 'ワクワクする！'),
	q('This is amazing!', 'これはすごい！'),
	q('I love this!', 'これ大好き！'),

	q('What a surprise!', 'なんて驚き！'),
	q('I had no idea!', '知らなかった！'),
	q('That explains it!', 'それで納得！'),
	q('Makes perfect sense!', '完璧に理解できる！'),
	q('I totally agree!', '完全に同感！'),

	q('You got this!', '君ならできる！'),
	q("Don't give up!", '諦めないで！'),
	q('Keep it up!', 'その調子で！'),
	q('You can do it!', 'できるよ！'),
	q('I believe in you!', '君を信じてる！'),

	q("That's incredible!", '信じられないほどすごい！'),
	q("I'm speechless!", '言葉が出ない！'),
	q('This is unreal!', '現実じゃないみたい！'),
	q('Mind blown!', '頭が吹き飛んだ！'),
	q('Absolutely amazing!', '本当にすごい！'),

	q("I'm so happy!", 'めっちゃ嬉しい！'),
	q('This is perfect!', '完璧だね！'),
	q("Couldn't be better!", 'これ以上ない！'),
	q("I'm thrilled!", '興奮してる！'),
	q('This made my day!', 'おかげで最高の一日！'),

	q('What a day!', 'なんて一日！'),
	q("I'm exhausted!", '疲れ果てた！'),
	q('What a mess!', 'なんて混乱！'),
	q('This is crazy!', 'これはクレイジー！'),
	q("I can't handle this!", 'これには対処できない！'),

	q('Give me a break!', '勘弁してよ！'),
	q('This is too much!', 'これは多すぎる！'),
	q('I need a vacation!', '休暇が必要！'),
	q("I'm overwhelmed!", '圧倒されてる！'),
	q('This is insane!', 'これは狂ってる！'),

	q("I'm so sorry!", '本当にごめん！'),
	q('My apologies!', '申し訳ありません！'),
	q('I messed up!', '失敗しちゃった！'),
	q("That's my fault!", 'それは私のせい！'),
	q('I take full responsibility!', '全責任を負います！'),

	q('No problem at all!', '全然大丈夫！'),
	q("Don't worry about it!", '心配しないで！'),
	q('It happens to everyone!', '誰にでもあること！'),
	q('We all make mistakes!', 'みんな間違いはするよ！'),
	q("That's totally fine!", '全然問題ないよ！'),
]

function get_shuffled_questions(): Array<Question> {
	return shuffle_array(questions)
}

export { get_shuffled_questions, questions }
