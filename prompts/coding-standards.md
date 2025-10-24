# ESLint設定ガイド - コーディング支援用

このプロジェクトのESLint設定は非常に厳格で、標準的なJavaScript/TypeScriptプロジェクトとは異なる命名規則を採用しています。新しいコード作成やリファクタリング時は必ずこのガイドを参照してください。

## 🚨 最重要：命名規則（標準と大きく異なる）

### ❌ よくある間違い：camelCase を使う

```typescript
// ❌ 間違い（標準的なTypeScript）
const userName = 'john'
const isLoggedIn = true
const getUserData = () => {}

// ✅ 正しい（このプロジェクト）
const user_name = 'john'
const is_logged_in = true
const get_user_data = () => {}
```

### 正しい命名規則

- **変数・関数・パラメータ**: `snake_case`
- **定数（const）**: `UPPER_CASE` または `snake_case`
- **boolean変数**: `is_`, `has_`, `should_`, `can_`, `will_`, `did_` で始める
- **型・クラス・インターフェース・Enum**: `PascalCase`
- **Enumメンバー**: `UPPER_CASE`
- **クラスプロパティ・メソッド**: `snake_case`

## 🔧 必須：型安全性ルール

### 明示的な型定義が必須

```typescript
// ❌ 間違い
const processData = (data) => {
	return data.map((item) => item.value)
}

// ✅ 正しい
const process_data = (data: Array<{ value: string }>): Array<string> => {
	return data.map((item) => item.value)
}
```

### 禁止事項

- `any` の使用は完全禁止
- 未使用変数は禁止
- 浮動Promiseは禁止
- 型アサーションは制限あり

## 📁 新規作成時の手順

### 1. 既存ファイルを必ず参照

```bash
# 類似機能の既存ファイルを探す
find src -name "*.ts" -o -name "*.svelte" | grep -i [関連キーワード]
```

### 2. ファイル作成時の注意点

- **Svelteファイル**: `PascalCase.svelte`（例: `UserProfile.svelte`）
- **TypeScriptファイル**: `kebab-case.ts`（例: `user-service.ts`）
- **ルートファイル**: `+page.svelte`, `+layout.svelte` などは例外

### 3. インポート/エクスポート規則

```typescript
// ❌ 間違い
export default class UserService {}

// ✅ 正しい
export class UserService {}
export type { UserData }
```

## 🧹 必須：Lintチェック手順

### 編集後の必須作業

```bash
# 1. ESLintチェック
npm run lint

# 2. エラーがある場合は修正
npm run lint:fix

# 3. 型チェック
npm run check

# 4. 最終確認
npm run build
```

### よくあるLintエラーと対処法

#### 1. 命名規則エラー

```bash
# エラー例
error: Identifier 'userName' is not in snake_case

# 修正
const user_name = 'john'; // snake_caseに変更
```

#### 2. 型定義エラー

```bash
# エラー例
error: Missing return type on function

# 修正
const get_user_data = (): UserData => { // 戻り値の型を明記
```

#### 3. 未使用変数エラー

```bash
# エラー例
error: 'unusedVar' is defined but never used

# 修正
const _unused_var = 'value'; // アンダースコアプレフィックス
```

## 🎯 プロジェクト固有の設定

### Svelte固有ルール

- `$state` などのリアクティブ変数は再代入可能
- Propsインターフェース名は `Props` で許可
- DOM操作は制限あり

### ファイル除外設定

以下のファイルはESLint対象外：

- `.storybook/**`
- `*.config.js`
- `src/routes/demo/**`
- `src/stories/**`

### 複雑度制限

- **関数の複雑度**: 最大4
- **ネストレベル**: 最大1
- **関数の行数**: 最大25行
- **ファイルの行数**: 最大300行
- **パラメータ数**: 最大3個

## 🔍 デバッグ用コマンド

### 特定ファイルのLintチェック

```bash
npx eslint src/path/to/file.ts
```

### 自動修正可能なエラーを修正

```bash
npx eslint --fix src/path/to/file.ts
```

### 型チェックのみ

```bash
npx tsc --noEmit
```

## ⚠️ よくある間違いトップ5

1. **camelCase使用** → `snake_case`に変更
2. **型定義省略** → 明示的な型定義を追加
3. **any使用** → 適切な型を定義
4. **Lintチェック忘れ** → 必ず`npm run lint`実行
5. **既存ファイル未参照** → 類似機能のファイルを必ず確認

## 📋 チェックリスト

新規作成・リファクタリング時：

- [ ] 既存の類似ファイルを参照した
- [ ] 命名規則（snake_case）を守った
- [ ] 明示的な型定義を追加した
- [ ] `any`を使用していない
- [ ] `npm run lint`でエラーがない
- [ ] `npm run check`で型エラーがない
- [ ] 複雑度制限内に収まっている

---

**重要**: このプロジェクトのESLint設定は標準と大きく異なります。必ずこのガイドを参照し、既存ファイルのパターンに従ってコーディングしてください。
