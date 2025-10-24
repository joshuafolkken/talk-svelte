/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-lines */

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
	q('Love it!', 'それ大好き！'),
	q("I'm counting on you.", '頼りにしてるよ。'),

	// 日常会話
	q("How's it going?", '調子はどう？'),
	q("What's up?", '元気？'),
	q('Long time no see!', '久しぶりだね！'),
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

	q("I'm starving!", 'お腹ペコペコ！'),
	q("Let's grab a bite.", '何か食べよう。'),
	q("I'm good, thanks.", '大丈夫、ありがとう。'),
	q('Never mind.', '気にしないで / いいよ。'),
	q('You never know.', 'どうなるかわからないよ。'),
	q('Guess what?', 'ねえ、聞いて！'),
	q("I'm in.", '参加するよ。'),
	q("I'm out.", '参加しないよ。'),
	q('Take your time.', 'ゆっくりでいいよ。'),
	q("I'm so tired.", 'すごく疲れた。'),

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
	// q('This is unreal!', '現実じゃないみたい！'),
	q('Mind blown!', '頭が吹き飛んだ！'),
	q('Absolutely amazing!', '本当にすごい！'),
	q("I'm so happy!", 'すごく嬉しい！'),
	q('This is perfect!', '完璧だね！'),
	q("Couldn't be better!", 'これ以上ない！'),
	q("I'm thrilled!", '興奮してる！'),
	q('This made my day!', 'おかげで最高の一日！'),

	q('What a day!', 'なんて一日！'),
	q("I'm exhausted!", '疲れ果てた！'),
	q('What a mess!', 'なんて混乱！'),
	// q('This is crazy!', 'これはクレイジー！'),
	q("I can't handle this!", 'これには対処できない！'),
	q('Give me a break!', '勘弁してよ！'),
	q('This is too much!', 'これは多すぎる！'),
	q('I need a vacation!', '休暇が必要！'),
	q("I'm overwhelmed!", '圧倒されてる！'),
	// q('This is insane!', 'これは狂ってる！'),

	q("I'm so sorry!", '本当にごめん！'),
	q('My apologies!', '申し訳ありません！'),
	q('I messed up!', '失敗しちゃった！'),
	q("That's my fault!", 'それは私のせい！'),
	q('No problem at all!', '全然大丈夫！'),
	q("Don't worry about it!", '心配しないで！'),
	q('It happens to everyone!', '誰にでもあること！'),
	q('We all make mistakes!', 'みんな間違いはするよ！'),
	q("That's totally fine!", '全然問題ないよ！'),

	q("I'm all set.", '準備完了だよ。'),
	q("That's a good idea.", 'それはいいアイデアだね。'),
	q("I'm not feeling well.", '調子が悪いんだ。'),
	q("Let's get started.", '始めよう。'),
	q("I'm running late.", '遅刻しそう。'),
	q("That's not fair.", 'それは不公平だよ。'),
	q("I'm really sorry.", '本当にごめん。'),
	q('Let me help you.', '手伝わせて。'),
	q("I'm so excited!", 'めっちゃワクワク！'),
	q("That's too expensive.", 'それは高すぎる。'),

	q("I'm getting hungry.", 'お腹がすいてきた。'),
	q("Let's take a break.", '休憩しよう。'),
	q("I'm almost done.", 'もうすぐ終わる。'),
	q("That's really cool!", 'それ本当にクール！'),
	q("I'm not ready yet.", 'まだ準備できてない。'),
	q("Let's try again.", 'もう一度やってみよう。'),
	q("I'm really proud of you.", '君を本当に誇りに思う。'),
	q("I'm feeling much better.", 'だいぶ良くなった。'),
	q("Let's keep in touch.", '連絡を取り合おう。'),

	q("I'm so grateful.", '本当に感謝してる。'),
	q("That's exactly right.", 'まさにその通り。'),
	q("I'm getting nervous.", '緊張してきた。'),
	q("Let's make it happen.", '実現させよう。'),
	q("I'm really impressed.", '本当に感心した。'),
	q("I'm getting better.", 'だんだん良くなってる。'),
	q("Let's work together.", '一緒に働こう。'),
	q("I'm so proud of you.", '君をとても誇りに思う。'),

	q("I'm getting tired.", '疲れてきた。'),
	q("Let's do our best.", 'ベストを尽くそう。'),
	q("I'm really happy for you.", '君のことを本当に嬉しく思う。'),
	q("I'm getting excited.", 'ワクワクしてきた。'),
	q("Let's celebrate together.", '一緒にお祝いしよう。'),
	q("I'm so glad you're here.", '君がここにいてくれて嬉しい。'),
	q("I'm feeling confident.", '自信を感じてる。'),
	q("Let's make it special.", '特別にしよう。'),

	q("I'm really enjoying this.", 'これを本当に楽しんでる。'),
	q("That's a fantastic result.", 'それは素晴らしい結果だ。'),
	q("I'm starting to feel comfortable.", 'だんだん慣れてきた。'),
	q("Let's create something amazing.", '何かすごいものを作ろう。'),
	q("I'm so lucky to have you.", '君がいてくれて本当にラッキー。'),

	q("I'm feeling motivated.", 'やる気が出てきた。'),
	q("I'm really looking forward to this.", 'これを本当に楽しみにしてる。'),
	q("Let's have some fun.", '楽しもう。'),
	q("I'm so thankful for you.", '君に本当に感謝してる。'),
	q("Let's build something great.", '素晴らしいものを作ろう。'),

	q("I'm really excited about this.", 'これについて本当にワクワクしてる。'),
	q('We can do this together.', '一緒にできるよ。'),
	q("I'm really inspired by you.", '君に本当にインスパイアされてる。'),
	q("I'm so happy we met.", '君と出会えて本当に嬉しい。'),
	q("I'm so excited to see what's next.", '次に何が起こるか本当にワクワクしてる。'),

	q("I'm really excited about the future.", '未来について本当にワクワクしてる。'),

	// Back to the Future phrases
	q('Great Scott!', 'グレート・スコット！ (Back to the Future)'),
	q('This is heavy!', 'これは重い！ (Back to the Future)'),
	q("I'm late for school!", '学校に遅刻する！ (Back to the Future)'),
	q("Where we're going, we don't need roads.", '行く先には道路は要らない (Back to the Future)'),
	q('Nobody calls me chicken!', '誰も俺を臆病者とは呼ばない！ (Back to the Future)'),

	q('Time machine!', 'タイムマシン！ (Back to the Future)'),
	q('1.21 gigawatts!', '1.21ギガワット！ (Back to the Future)'),
	q('88 miles per hour!', '時速88マイル！ (Back to the Future)'),
	q('The future!', '未来！ (Back to the Future)'),
	q('Back to the future!', 'バックトゥーザフューチャー！ (Back to the Future)'),

	q('Your mother and I are going to the dance.', '君の母親と私はダンスに行く (Back to the Future)'),
	q("I'm your density.", '俺は君の運命だ (Back to the Future)'),
	q("You're my son!", '君は俺の息子だ！ (Back to the Future)'),
	q("I'm from the future!", '俺は未来から来た！ (Back to the Future)'),
	q(
		"You're not thinking fourth dimensionally!",
		'君は4次元的に考えていない！ (Back to the Future)',
	),

	q('The flux capacitor!', 'フラックス・コンデンサー！ (Back to the Future)'),
	q("It's a DeLorean!", 'デロリアンだ！ (Back to the Future)'),
	q('The time circuits are on!', 'タイム回路がオンだ！ (Back to the Future)'),
	q('The plutonium chamber!', 'プルトニウム・チェンバー！ (Back to the Future)'),
	q('The temporal displacement!', '時間移動！ (Back to the Future)'),

	q('This is unbelievable!', 'これは信じられない！ (Back to the Future)'),
	q("I can't believe this!", 'これを信じられない！ (Back to the Future)'),
	q('This is insane!', 'これは狂ってる！ (Back to the Future)'),
	q("I'm having a nightmare!", '悪夢を見てる！ (Back to the Future)'),
	q('This is crazy!', 'これはクレイジー！ (Back to the Future)'),

	q("I'm going to be late for school!", '学校に遅刻しそう！ (Back to the Future)'),
	q(
		"This is the most amazing thing I've ever seen!",
		'これは今まで見た中で最も素晴らしい！ (Back to the Future)',
	),
	q("I'm going to be late for my own birth!", '自分の誕生に遅刻しそう！ (Back to the Future)'),
	q(
		"The way I see it, if you're going to build a time machine into a car, why not do it with some style?",
		'俺の考えでは、車にタイムマシンを組み込むなら、なぜスタイルよくやらない？ (Back to the Future)',
	),
	q(
		"Roads? Where we're going, we don't need roads.",
		'道路？行く先には道路は要らない (Back to the Future)',
	),

	// Movie phrases
	q('May the Force be with you.', 'フォースと共にあらんことを (Star Wars)'),
	q("I'll be back.", 'また戻ってくるぞ (Terminator)'),
	q("Here's looking at you, kid.", '君を見つめているよ (Casablanca)'),
	q('You talking to me?', '俺に話しかけてるのか？ (Taxi Driver)'),
	q("I'm the king of the world!", '俺は世界の王だ！ (Titanic)'),

	q("You can't handle the truth!", '真実には耐えられない！ (A Few Good Men)'),
	q("I'm not a regular mom, I'm a cool mom.", '普通のママじゃない、クールなママよ (Mean Girls)'),
	q("There's no place like home.", '家ほど良い場所はない (The Wizard of Oz)'),
	q('Houston, we have a problem.', 'ヒューストン、問題が発生した (Apollo 13)'),
	q('Just keep swimming.', '泳ぎ続けるのよ (Finding Nemo)'),

	q('To infinity and beyond!', '無限の彼方へ！ (Toy Story)'),
	q("You're a wizard, Harry.", '君は魔法使いだ、ハリー (Harry Potter)'),
	q('I volunteer as tribute!', '私が志願する！ (The Hunger Games)'),
	q('I am Groot.', '俺はグルートだ (Guardians of the Galaxy)'),
	q('You had me at hello.', 'ハローで心を奪われた (Jerry Maguire)'),

	q('Nobody puts Baby in a corner.', 'ベイビーを隅に追いやるな (Dirty Dancing)'),
	q("I'll never let go.", '絶対に離さない (Titanic)'),
	q('You complete me.', '君が俺を完成させる (Jerry Maguire)'),
	q(
		"I'm just a girl, standing in front of a boy.",
		'私はただの女の子、男の子の前に立って (Notting Hill)',
	),
	q('Hasta la vista, baby.', 'ハスタ・ラ・ビスタ、ベイビー (Terminator)'),

	q("I'm Batman.", '俺はバットマンだ (Batman)'),
	q('I am Iron Man.', '俺はアイアンマンだ (Iron Man)'),
	q('With great power comes great responsibility.', '大きな力には大きな責任が伴う (Spider-Man)'),
	q("I'm going to make him an offer he can't refuse.", '断れない条件を提示する (The Godfather)'),
	q('Life is like a box of chocolates.', '人生はチョコレートの箱のようなもの (Forrest Gump)'),

	q("I'll have what she's having.", '彼女と同じものをください (When Harry Met Sally)'),
	q('Show me the money!', '金を見せろ！ (Jerry Maguire)'),
	q("I'm the captain now.", '今は俺が船長だ (Captain Phillips)'),

	// Modern American catchphrases
	q("That's so valid!", 'それ完全に正しい！'),
	q("I'm here for it!", 'それに乗ってる！'),
	q('This hits different.', 'これは違う感じ。'),
	q("That's a whole mood.", 'それまさにその気分。'),
	q("You're doing amazing!", '君は素晴らしい！'),

	q('This is your era!', 'これが君の時代！'),
	q("You're absolutely killing it!", '君は完全にやってる！'),
	q("That's the energy!", 'それがエネルギー！'),
	q('We love to see it!', 'それ見るのが好き！'),
	q('No way!', 'まさか！'),

	q('Get out of here!', 'まさか！ / 嘘でしょ！'),
	q("That's wild!", 'それクレイジー！'),
	q("I'm shook!", 'びっくりした！'),
	q('This is unreal!', 'これ現実じゃない！'),
	q('Period!', '以上！'),

	q('Facts!', '事実！'),
	q('Same energy!', '同じエネルギー！'),
	q('I feel that!', 'それ感じる！'),
	q("That's the tea!", 'それが真実！'),
	q("It's giving me life.", 'それは私を生かしてる。'),

	q('The vibes are good.', '雰囲気は良い。'),
	q('This is a moment.', 'これは瞬間。'),
	q("We're in our zone.", '私たちはゾーンの中。'),
	q('This is the way.', 'これが道。'),
	q("That's cap!", 'それは嘘！'),

	q('This slaps!', 'これ最高！'),
	q("I'm vibing with this.", 'これにノってる。'),
	q("That's fire!", 'それめっちゃいい！'),
	q('This is everything!', 'これが全て！'),
	q('This is a vibe.', 'これは雰囲気。'),

	q("I'm living for this.", 'これのために生きてる。'),
	q('This is giving me life.', 'これが私を生かしてる。'),
	q("I'm here for the vibes.", '雰囲気のためにいる。'),
	q('This is my jam!', 'これが私の曲！'),
	q("I can't even!", 'もう無理！'),

	// 疑問文
	q('How are you doing?', '元気ですか？'),
	q("What's your name?", 'お名前は？'),
	q('Where are you from?', 'どちらの出身ですか？'),
	q('How old are you?', '何歳ですか？'),
	q('What do you do?', 'お仕事は何ですか？'),

	q('Are you okay?', '大丈夫ですか？'),
	q('What time is it?', '今何時ですか？'),
	q('Where is the bathroom?', 'お手洗いはどこですか？'),
	q('How much does it cost?', '料金はいくらですか？'),
	q('Can you help me?', '手伝ってもらえますか？'),

	q('Do you speak English?', '英語を話せますか？'),
	q('What color do you like?', '何色が好きですか？'),
	q('How was your day?', '今日はどんな一日でしたか？'),
	q('What are we having for dinner?', '夕飯は何にしますか？'),
	q('Are you free tonight?', '今夜空いてますか？'),

	q('How is the weather?', '天気はどうですか？'),
	q('How do you feel?', '気分はどうですか？'),
	q('What do you do for fun?', '何をして楽しみますか？'),
	q('Do you have any plans?', '何か予定はありますか？'),
	q('What kind of food do you like?', 'どんな食べ物が好きですか？'),

	q('How long have you been here?', 'ここにどのくらいいますか？'),
	q('Can I get your phone number?', '電話番号を教えてもらえますか？'),
	q('Do you like music?', '音楽は好きですか？'),
	q('What do you want to be?', '何になりたいですか？'),
	q('Are you married?', '結婚していますか？'),

	q('Do you watch movies?', '映画は見ますか？'),
	q('How do you get to work?', '仕事にはどうやって行きますか？'),
	q('Which season do you prefer?', 'どの季節が好きですか？'),
	q('Do you have any siblings?', '兄弟姉妹はいますか？'),
	q('Do you play any sports?', 'スポーツはしますか？'),

	q('How was your weekend?', '週末はどうでしたか？'),
	q('Do you read books?', '本は読みますか？'),
	q('Do you like to travel?', '旅行は好きですか？'),
	q('Where would you like to go?', 'どこに行きたいですか？'),
	q('How do you spend your free time?', '暇な時間はどう過ごしますか？'),

	q('What do you usually drink?', '普段何を飲みますか？'),
	q('Do you have any pets?', 'ペットは飼っていますか？'),
	q('How do you relax?', 'どうやってリラックスしますか？'),
	q('Where do you like to eat?', 'どこで食べるのが好きですか？'),

	q('Do you like to cook?', '料理は好きですか？'),
	q('Do you watch TV?', 'テレビは見ますか？'),
	q('How do you stay healthy?', 'どうやって健康を保ちますか？'),
	q('Do you play games?', 'ゲームはしますか？'),
	q('Do you like to dance?', 'ダンスは好きですか？'),

	q('Do you like animals?', '動物は好きですか？'),
	q('How do you learn new things?', 'どうやって新しいことを学びますか？'),
	q('What was your best memory?', '最高の思い出は何ですか？'),
	q('Do you like to read?', '読書は好きですか？'),
	q('What subjects interest you?', 'どんな科目に興味がありますか？'),

	q('How do you make friends?', 'どうやって友達を作りますか？'),
	q('Do you use any apps?', 'アプリは使いますか？'),
	q('Do you like to exercise?', '運動は好きですか？'),
	q('What music do you listen to?', 'どんな音楽を聴きますか？'),
	q('How do you handle stress?', 'どうやってストレスに対処しますか？'),

	q('Do you like flowers?', '花は好きですか？'),
	q('Do you like to garden?', 'ガーデニングは好きですか？'),
	q('Which season is your favorite?', 'どの季節が一番好きですか？'),
	q('How do you celebrate birthdays?', '誕生日はどう祝いますか？'),
	q('What desserts do you like?', 'どんなデザートが好きですか？'),

	q('Do you like to swim?', '泳ぐのは好きですか？'),
	q('What kind of car do you drive?', 'どんな車に乗っていますか？'),
	q('How do you stay motivated?', 'どうやってモチベーションを保ちますか？'),
	q('Which city do you like?', 'どの都市が好きですか？'),
	q('Do you like to paint?', '絵を描くのは好きですか？'),

	q('What fruits do you eat?', 'どんな果物を食べますか？'),
	q('How do you solve problems?', 'どうやって問題を解決しますか？'),
	q('What hobbies do you have?', 'どんな趣味がありますか？'),
	q('Do you like to sing?', '歌うのは好きですか？'),
	q('Do you play any instruments?', '楽器は演奏しますか？'),

	q('How do you stay organized?', 'どうやって整理整頓を保ちますか？'),
	q('What languages do you speak?', 'どんな言語を話しますか？'),
	q('Do you like to write?', '書くのは好きですか？'),
	q('What websites do you visit?', 'どんなウェブサイトを見ますか？'),
	q('How do you stay positive?', 'どうやってポジティブでいられますか？'),

	q('Where do you like to shop?', 'どこで買い物するのが好きですか？'),
	q('Do you like to shop?', '買い物は好きですか？'),
	q('What brands do you prefer?', 'どんなブランドが好きですか？'),
	q('How do you stay creative?', 'どうやって創造性を保ちますか？'),
	q('Do you have a favorite quote?', '好きな名言はありますか？'),

	q('Do you like to volunteer?', 'ボランティアは好きですか？'),

	q('What are you grateful for?', '何に感謝していますか？'),

	q('What gives you hope?', '何が希望を与えてくれますか？'),
	q('Do you like to dream?', '夢を見るのは好きですか？'),
	q('What dreams do you have?', 'どんな夢がありますか？'),
	q('How do you stay inspired?', 'どうやってインスピレーションを保ちますか？'),
	q('What inspires you?', '何があなたをインスパイアしますか？'),

	q("I'm doing great!", 'すごく調子いいよ！'),
	q("My name's John.", 'ジョンです。'),
	q("I'm from Tokyo.", '東京から来ました。'),
	q("I'm 25 years old.", '25歳です。'),
	q('I work in IT.', 'IT関係の仕事してます。'),

	q("I'm fine, thanks.", '大丈夫、ありがとう。'),
	q("It's 3 o'clock.", '3時です。'),
	q("It's over there.", 'あそこです。'),
	q("It's 500 yen.", '500円です。'),
	q('Sure, no problem!', 'もちろん、問題ないよ！'),

	q('Yes, I do.', 'はい、話せます。'),
	q('I like blue.', '青が好きです。'),
	q('It was good!', '良かったよ！'),
	q("Let's have pizza.", 'ピザにしよう。'),
	q("Yes, I'm free.", 'はい、空いてます。'),

	q("It's sunny today.", '今日は晴れてる。'),
	q('I feel great!', '気分最高！'),
	q('I play video games.', 'ゲームしてる。'),
	q('I love sushi.', '寿司が大好き。'),

	q("I've been here for 2 years.", '2年ここにいます。'),
	q("Here's my number.", 'これが私の番号。'),
	q('Yes, I love music.', 'はい、音楽大好き。'),
	q('I want to be a teacher.', '教師になりたい。'),
	q("No, I'm single.", 'いいえ、独身です。'),

	q('Yes, I watch movies.', 'はい、映画見ます。'),
	q('I take the train.', '電車で行きます。'),
	q('I prefer summer.', '夏が好き。'),
	q('I have two brothers.', '兄弟が2人います。'),
	q('Yes, I play tennis.', 'はい、テニスしてます。'),

	q('It was relaxing.', 'リラックスできた。'),
	q('Yes, I read a lot.', 'はい、よく読みます。'),
	q('Yes, I love traveling.', 'はい、旅行大好き。'),
	q("I'd like to go to Paris.", 'パリに行きたい。'),
	q('I watch Netflix.', 'Netflix見てる。'),

	q('I usually drink coffee.', '普段コーヒー飲む。'),
	q('Yes, I have a cat.', 'はい、猫飼ってます。'),
	q('I celebrate Christmas.', 'クリスマス祝います。'),
	q('I listen to music.', '音楽聴いてる。'),
	q('I like Italian food.', 'イタリアンが好き。'),

	q('Yes, I love cooking.', 'はい、料理大好き。'),
	q('Yes, I watch TV.', 'はい、テレビ見ます。'),
	q('Yes, I play games.', 'はい、ゲームします。'),
	q('Yes, I love dancing.', 'はい、ダンス大好き。'),

	q('Yes, I love animals.', 'はい、動物大好き。'),
	q('Yes, I read books.', 'はい、本読みます。'),
	q('I like science.', '科学が好き。'),

	q('Yes, I use apps.', 'はい、アプリ使います。'),
	q('Yes, I exercise.', 'はい、運動します。'),
	q('I listen to pop music.', 'ポップス聴いてる。'),

	q('Yes, I love flowers.', 'はい、花大好き。'),
	q('Yes, I garden.', 'はい、ガーデニングします。'),
	q('I love spring.', '春が一番好き。'),
	q('I have a party.', 'パーティーする。'),
	q('I love chocolate cake.', 'チョコレートケーキが好き。'),

	q('Yes, I love swimming.', 'はい、泳ぐの大好き。'),
	q('I drive a Honda.', 'ホンダに乗ってる。'),
	q('I love New York.', 'ニューヨークが好き。'),
	q('Yes, I paint.', 'はい、絵を描きます。'),

	q('I eat apples.', 'りんご食べる。'),
	q('I play guitar.', 'ギター弾く。'),
	q('Yes, I sing.', 'はい、歌います。'),
	q('Yes, I play piano.', 'はい、ピアノ弾きます。'),

	q('I use a planner.', 'プランナー使ってる。'),
	q('I speak Japanese.', '日本語話します。'),
	q('Yes, I write.', 'はい、書きます。'),
	q('I visit YouTube.', 'YouTube見てる。'),

	q('I shop at the mall.', 'モールで買い物。'),
	q('Yes, I love shopping.', 'はい、買い物大好き。'),
	q('I prefer Nike.', 'ナイキが好き。'),
	q('Yes, I have quotes.', 'はい、名言あります。'),

	q('Yes, I volunteer.', 'はい、ボランティアします。'),
	q('Yes, I meditate.', 'はい、瞑想します。'),

	q('Yes, I journal.', 'はい、日記書きます。'),
	q('I use a notebook.', 'ノート使ってる。'),

	q('Yes, I dream.', 'はい、夢見ます。'),

	q('No cap!', 'マジで！ / 本当に！'),
	q('That hits different.', 'これは一味違う。'),
	q("I'm totally here for it.", '完全にそれに乗ってる。'),
	q("I'm obsessed!", 'ハマってる！'),
	q("That's iconic!", 'それ伝説的！'),
]

function get_shuffled_questions(): Array<Question> {
	return shuffle_array(questions)
}

export { get_shuffled_questions, questions }
