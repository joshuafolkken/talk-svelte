import type { Question } from '$lib/types/question'
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
	// q('Love it!', 'それ好き！'),
	// q('Awesome!', '最高！'),
	// q('You nailed it!', '完璧にやったね！'),
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
]

export { questions }
