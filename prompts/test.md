# Test Generation Prompt

このプロンプトは、AI に一発で理想的なテストコードを生成させるための指示書です。

---

## 1. Test Type

テストの種類を選択してください：

- [x] **E2E Test (Playwright)** - ファイル名: `e2e/*.test.ts`
- [ ] **Unit/Integration Test (Vitest)** - ファイル名: `src/**/*.spec.ts`

---

## 2. Target Specification

### Target File

- `src/routes/+page.svelte`

### Test Objective

ページに表示されている問題（シャッフルされた questions[0]）の audio_uri が、対象の音声エレメントの src に正しくセットされているか検証する。

### Test Description

音声URIと表示されているトランスクリプトの整合性をテストする。

---

## 3. Test Conditions (Given-When-Then)

### Given (前提条件)

- ページが読み込まれている
- questions データが存在する

### When (操作)

- トグルボタンをクリックしてスクリプトを表示
- 表示されているトランスクリプトテキストを取得
- questions 配列から対応する question を検索

### Then (期待結果)

- audio 要素の src 属性が、トランスクリプトに対応する audio_uri と一致する
- マッチする question が見つからない場合はエラーをスローする

---

## 4. Test Cases

### Test Case Definition

```typescript
// 単一のテストケース（ランダムにシャッフルされた questions[0] を検証）
// パラメータ化は不要（現在表示されている1つの問題のみをテスト）
```

### Test Data Source

- `$lib/data/questions` から questions をインポート
- ページに表示されている現在の question（`const questions = get_shuffled_questions()` の `questions[0]`）

---

## 5. Required Constants

以下の定数をファイル上部で定義すること（マジックナンバー/文字列を避けるため）：

| Constant Name  | Value | Reason |
| -------------- | ----- | ------ |
| （今回は不要） | -     | -      |

**Note**: このテストでは特別な定数定義は不要。ただし、数値や繰り返し使用する文字列が出現した場合は UPPER_SNAKE_CASE で定義すること。

---

## 6. Required Data-TestIDs (Playwright)

以下の data-testid が対象ファイルに必要です：

| Element                    | data-testid      | Purpose                | Location                |
| -------------------------- | ---------------- | ---------------------- | ----------------------- |
| トグルボタン               | `toggle-script`  | スクリプト表示切り替え | src/routes/+page.svelte |
| トランスクリプト表示エリア | `script-content` | 問題文テキスト取得     | src/routes/+page.svelte |
| 音声要素                   | `question-audio` | audio 要素の src 検証  | src/routes/+page.svelte |

**Action**: テスト生成後、対象ファイルに上記 data-testid が存在することを確認してください。

---

## 7. Expected Output

### File Path

`e2e/page.test.ts` (既存ファイルを確認し、存在する場合は上書きまたは追加)

### Expected Code Structure

```typescript
import { expect, test } from '@playwright/test'
import { questions } from '$lib/data/questions.js'

test('audio src matches displayed question', async ({ page }) => {
	await page.goto('/')
	await page.getByTestId('toggle-script').click()

	const displayed_transcript = await page.getByTestId('script-content').textContent()
	const matching_question = questions.find((qu) => qu.transcript === displayed_transcript)

	if (matching_question === undefined) {
		throw new Error(`Matching question not found for: ${displayed_transcript ?? ''}`)
	}

	const source = await page.getByTestId('question-audio').getAttribute('src')
	expect(source).toContain(`/audio/${matching_question.audio_uri}.mp3`)
})
```

---

## 8. Test Guidelines (Common Rules)

### Coding Standards

- **ESLint**: 必ず eslint ルールに準拠する（`eslint.config.js` 参照）
- **Naming Convention**:
  - 変数: `snake_case`
  - 定数: `UPPER_SNAKE_CASE`
  - 関数: `snake_case`
  - boolean: `is_`, `has_`, `should_`, `can_`, `will_`, `did_` プレフィックス

### Test Function Usage

- **describe の外**: `test` を使用
- **describe の内**: `it` を使用
- **describe**: 複数テストをグループ化する必要がある場合のみ使用（不要ならば避ける）

### Parameterized Tests

- **Playwright**: `for` ループを使用
  ```typescript
  for (const item of items) {
  	test(`test: ${item.name}`, async ({ page }) => {
  		// ...
  	})
  }
  ```
- **Vitest**: `test.each` または `it.each` を使用
  ```typescript
  test.each(items)('test: $name', (item) => {
  	// ...
  })
  ```

### Test Case Definition

- テストケースが複数ある場合は配列で定義
- 変数名: `cases` またはサフィックスに `_cases` を使用
- ファイル上部、テスト関数の外部に定義

### Constants

- **マジックナンバー/文字列は厳禁**（0, 1, -1 以外はすべて定数化）
- `UPPER_SNAKE_CASE` で命名
- ファイル上部、インポートの後に配置
- 例:
  ```typescript
  const STATUS_CODE_OK = 200
  const MIN_COUNT = 0
  const MP3_EXTENSION = '.mp3'
  const TEST_ITERATION_COUNT = 5
  const FIRST_INDEX = 0
  ```

### Error Messages

- 詳細かつ具体的に記述
- 何が期待され、何が得られたかを明示
- テンプレートリテラルを使用
- **template literal 内で `number` 型を使用する場合は `String()` で変換**
- **template literal 内で不要な `?? ''` を使用しない**（既に string 型の場合）
- 例:
  ```typescript
  throw new Error(`Matching question not found for: ${displayed_transcript ?? ''}`)
  const error_message = `mp3 file does not exist: ${file_name}`
  const error_message = `Expected file at index ${String(index)} to be "${expected_file}"`
  ```

### Comments

- 最小限に抑える
- 必要な場合は英語で記述
- コードの「何を」ではなく「なぜ」を説明

### Imports

- 拡張子 `.js` を明示（TypeScript ファイルでも `.js` と記述）
- 型インポートは `type` キーワードを使用: `import { type Foo } from '...'`
- 例:
  ```typescript
  import { expect, test } from '@playwright/test'
  import { questions } from '$lib/data/questions.js'
  import type { Question } from '$lib/types/question.js'
  ```

### Playwright Specific

- 要素の取得: `data-testid` を使用（label や text での検索は避ける）
- セレクター: `page.getByTestId('element-id')`
- 実装ファイルに `data-testid` 属性を追加する必要がある

### Async/Await

- Playwright: テスト関数は必ず `async` を使用
- 非同期操作には必ず `await` を付与
- `await` を忘れないこと

### Type Safety

- 型アノテーションを適切に使用
- `any` の使用は禁止
- undefined チェックを適切に行う
- **ループ変数は必ず使用する**（未使用変数エラーを避けるため）

  ```typescript
  // NG: 未使用変数
  for (const _ of array) {
  	do_something()
  }

  // OK: ループ変数を使用
  for (const [index, item] of array.entries()) {
  	do_something()
  	expect(index).toBeGreaterThanOrEqual(0)
  }
  ```

---

## 9. Generation Checklist

生成前に以下を確認してください：

- [ ] すべてのマジックナンバー/文字列を定数化した（0, 1, -1 以外）
- [ ] インポート文に `.js` 拡張子を付与した（TypeScript でも）
- [ ] 必要に応じて `test.each` または `for` でパラメータ化した
- [ ] エラーメッセージを詳細に記述した（何が期待され、何が得られたか）
- [ ] template literal 内の number 型を String() で変換した
- [ ] template literal 内の不要な `?? ''` を削除した
- [ ] `data-testid` を使用してエレメントを取得した（Playwright の場合）
- [ ] `async`/`await` を適切に使用した
- [ ] 型の安全性を確保した（`undefined` チェック等）
- [ ] ループ変数を必ず使用した（未使用変数エラーを避ける）
- [ ] **テスト生成後、必ず `read_lints` ツールでリントエラーを確認した**
- [ ] eslint ルールに準拠している（命名規則、関数の複雑度等）
- [ ] テスト関数の最大ステートメント数（10）を超えていない
- [ ] 不要なコメントを削除した
- [ ] `describe` が本当に必要か確認した（不要なら削除）

---

## 10. Reference Files

参考にするテストコード：

**E2E Tests (Playwright):**

- `e2e/page.test.ts` - E2E テストの基本構造
- `e2e/praise.test.ts` - パラメータ化テスト（Playwright）

**Unit/Integration Tests (Vitest):**

- `src/lib/data/questions.spec.ts` - パラメータ化テスト、データ検証（Vitest）
- `src/lib/data/praise-audio.spec.ts` - ステートフルな関数のテスト（Vitest）

ESLint 設定：

- `eslint.config.js` - コーディング規約の詳細

---

## 10.1. Unit Test Examples

### ステートフルな関数のテスト例

状態を持つ関数（内部変数を変更する関数）をテストする場合の注意点：

#### 基本パターン

```typescript
import { expect, test } from 'vitest'
import { get_praise_audio_file, reset_praise_audio_index } from './praise-audio.js'

test('function returns expected values in sequence', () => {
	reset_praise_audio_index() // 状態をリセット

	// 期待される動作を検証
	const first_result = get_praise_audio_file()
	expect(first_result).toBe('expected-value-1')

	const second_result = get_praise_audio_file()
	expect(second_result).toBe('expected-value-2')
})
```

#### テスト間の独立性を保つ

```typescript
test('test A', () => {
	reset_praise_audio_index() // 各テストの開始時に状態をリセット
	// テストロジック
})

test('test B', () => {
	reset_praise_audio_index() // 前のテストの影響を受けないように
	// テストロジック
})
```

#### 循環動作のテスト

```typescript
test('function cycles back to start', () => {
	reset_praise_audio_index()

	// 全要素を消費
	for (let i = 0; i < array_length; i++) {
		get_next_item()
	}

	// 最初に戻ることを確認
	const cycled_item = get_next_item()
	expect(cycled_item).toBe(first_item)
})
```

#### リセット関数のテスト

```typescript
test('reset function restores initial state', () => {
	// 状態を変更
	for (let i = 0; i < 5; i++) {
		modify_state()
	}

	// リセット
	reset_state()

	// 初期状態に戻ったことを確認
	const result = get_state()
	expect(result).toBe(initial_value)
})
```

---

## 11. Execution Instructions

このプロンプトを使用してテストを生成する際の手順：

1. **Test Type** を確認（E2E or Unit/Integration）
2. **Target Specification** で対象と目的を理解
3. **Test Conditions** で Given-When-Then を確認
4. **Expected Output** の完成形を参照
5. **Test Guidelines** に従ってコードを生成
6. **Generation Checklist** で最終確認

---

## 12. Additional Notes

- **Lint エラー**: 必ず解決すること（一部エラーになっても構わないが、lint エラーは許容しない）
  - **重要**: テスト生成後、必ず `read_lints` ツールで対象ファイルを指定してリントエラーを確認すること
  - エラーが見つかった場合は、すべて修正してから完了とすること
- **Test 実行**: 生成後、テストが実際に動作することを確認することが望ましい
- **除外ファイル**: `demo`、`sample`、`page.svelte.spec.ts` は対象外

### よくあるリントエラーと対処法

1. **template literal 内の number 型エラー**
   - エラー: `Invalid type "number" of template literal expression`
   - 対処: `${index}` → `${String(index)}`

2. **不要な `??` オペレーター**
   - エラー: `Unnecessary conditional, expected left-hand side of ?? operator to be possibly null or undefined`
   - 対処: 既に string 型の変数には `?? ''` は不要

3. **for ループを for-of に変更**
   - エラー: `Expected a for-of loop instead of a for loop with this simple iteration`
   - 対処: `for (let i = 0; i < array.length; i++)` → `for (const item of array)`
   - 注意: ループ変数は必ず使用すること

4. **マジックナンバー**
   - エラー: `No magic number: 5`
   - 対処: すべての数値（0, 1, -1 以外）を定数化

5. **未使用変数**
   - エラー: `Remove the declaration of the unused '_' variable`
   - 対処: ループ変数は必ず使用する（例: `expect(index).toBeGreaterThanOrEqual(0)`）

6. **テスト関数の最大ステートメント数超過**
   - エラー: `Arrow function has too many statements (11). Maximum allowed is 10`
   - 対処: テストをシンプルにするか、複数のテストに分割する

---

## Template for Future Use

新しいテストを作成する際は、このプロンプトをコピーし、以下のセクションを更新してください：

1. **Test Type** - チェックボックスを更新
2. **Target Specification** - 対象ファイルと目的を記述
3. **Test Conditions** - Given-When-Then を記述
4. **Test Cases** - 具体的なケースを定義
5. **Required Constants** - 必要な定数をリスト
6. **Required Data-TestIDs** - Playwright の場合のみ
7. **Expected Output** - 期待される完成形を記述
