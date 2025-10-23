# AI test

E2E テストを書く。

- 対象ファイル：src/routes/+page.svelte
- 検証内容：ページに表示されている問題（シャッフルされた questions[0]）の audio_uri が 対象の音声エレメントの src にセットされているか
- テスト方法：ページに表示されているトランスクリプトテキストを取得し、それに対応する audio_uri を $lib/data/questions から検索して、audio 要素の src と比較する

## cases

ページに表示されている現在の question（src/routes/+page.svelte 内の const questions = get_shuffled_questions() の questions[0]）

## ignore

- 無視：なし

## Test Guidelines

- コーディング方針：eslint の定義を確認する。また、参考になる他のテストコードも参照する。
- テスト関数：describe の外では test を使う。describe 内では it を使う。
- パラメータ化テスト：Playwright では パラメータの for、Vitest では、describe の外では test.each、describe 内では it.each を使用する。
- describe：不要であればなるべく書かない。複数テストをまとめる必要があるときのみ利用する。
- テストケース：配列でテスト関数の外部に定義する。作成するテストケースは、const cases にする。複数ある場合は cases をサフィックスにする。
- テスト結果：一部エラーになることがあるがそれでもよい。
- リンター：lint エラーは解決する。
- コメント：コメントはなるべく書かない。書く場合は英語。
- Playwrightの場合： テスト対象のエレメントは、label 等で比較するのではなく、data-testid を適切に付与する。

## run guidelines

ai_test.md「Test Guidelines」をもとに、プロジェクトのすべてのテストコードを修正する。（demo や sample、page.svelte.spec.ts は除く）
