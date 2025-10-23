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

- コーディング方針：eslint の定義を確認する。また、参考になる他のテストコードも参照する。
- テスト関数：describe の外では test を使う。describe 内では it を使う。
- パラメータ化テスト：Playwright では パラメータの for、Vitest では、describe の外では test.each、describe 内では it.each を使用する。
- describe：不要であればなるべく書かない。複数テストをまとめる必要があるときのみ利用する。
- テストケース：配列でテスト関数の外部に定義する。作成するテストケースは、const cases にする。複数ある場合は cases をサフィックスにする。
- テスト結果：一部エラーになることがあるがそれでもよい。
- リンター：lint エラーは解決する。
- コメント：コメントはなるべく書かない。書く場合は英語。

## run guidelines

ai_test.md「Test Guidelines」をもとに、プロジェクトのすべてのテストコードを修正する。（demo や sample、page.svelte.spec.ts は除く）
