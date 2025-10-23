# AI test

テストコードを書く。

- 対象ファイル：src/lib/utils/transcript.ts
- 対象メソッド：is_transcript_correct()

## data

Love it!, love it
I'm counting on you. i'm counting on you
How's it going?, how's it going
I mean…, i mean

## ignore

- 無視：transcript\_.spec.ts

## Test Guidelines

- コーディング方針：eslint の定義を確認する。また、参考になるほかのファイルも参照する。
- テスト関数：通常は test, describe 内では it 使う。
- パラメータ化テスト：テストケースがある場合。for で回すのではなく、テストツールの慣習に従う。(test.each 等)
- describe：不要であればなるべく書かない。複数テストをまとめる必要があるときのみ利用する。
- テスト用パラメータ：配列でテスト関数の外部に定義する。関連テストファイルを参照すること。
- テスト結果：一部エラーになることがあるがそれでもよい。
- リンター：lint エラーは解決する。
- コメント：コメントはなるべく書かない。書く場合は英語。
