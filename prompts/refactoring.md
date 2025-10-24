# リファクタリング支援プロンプト

このプロンプトは、AI にリファクタリング提案を行う際の指示書です。小さくて簡単な方法から提案し、ユーザーが考えて対応できるよう配慮します。

## 重要な動作指示

**このプロンプトが提示された場合、以下の動作を実行してください：**

1. **現在選択されているファイルのリファクタリング提案を実行**
   - ユーザーが現在開いているファイルを分析
   - そのファイルのリファクタリング案を3つまで提案
   - 実装可能なサンプルコードを提供

2. **プロンプトの説明は行わない**
   - このプロンプトの内容説明は不要
   - 直接リファクタリング提案に移る

---

## 1. 基本方針

### 提案の優先順位

1. **小さくて簡単な方法から提案**
   - 1つの関数の分割
   - 1つのファイルの分割
   - 変数名の改善
   - 定数の抽出

2. **ユーザー主導の対応**
   - Agent モードでも勝手に変更しない
   - 提案のみを行い、実装はユーザーに委ねる
   - 複数の選択肢を提示

3. **関連ファイルの確認**
   - 現在指定されているファイルを中心に分析
   - 関連するファイルを特定して確認
   - 依存関係を把握

---

## 2. リファクタリング提案の手順

### Step 1: 現在選択されているファイルの分析

**重要**: ユーザーが現在開いているファイルを分析してください。

```typescript
// 分析すべき項目
- ファイルの行数（300行制限の確認）
- 関数の複雑度（最大4の確認）
- ネストレベル（最大1の確認）
- 関数の行数（最大25行の確認）
- パラメータ数（最大3個の確認）
- 複数の責任を持つファイルかどうか
- 密結合な部分の特定
```

### Step 2: 関連ファイルの特定

```bash
# 関連ファイルを探す
- インポートされているファイル
- 同じディレクトリのファイル
- 類似機能のファイル
- 依存関係のあるファイル
```

### Step 3: リファクタリング候補の特定

**重要**: 一度に3つまでの具体的な提案に絞り、実装可能なサンプルコードを提供する。

**優先度の決定ルール**:

1. 高優先度の候補が3つ以上ある場合 → 高優先度のみを3つ提案
2. 高優先度が2つ以下の場合 → 高優先度 + 中優先度で3つまで
3. 高・中優先度が合計2つ以下の場合 → 高・中・低優先度で3つまで

#### 高優先度の候補

1. **関数の分割**
   - 25行を超える関数
   - 複雑度が4を超える関数
   - 複数の責任を持つ関数

2. **ファイルの分割**
   - 300行を超えるファイル
   - 複数の責任を持つファイル
   - 関連性の低い機能が混在

3. **型定義の改善**
   - `any` の使用
   - 型定義の不足
   - 型の安全性向上

#### 中優先度の候補

4. **定数の抽出**
   - マジックナンバー（0, 1, -1以外）
   - ハードコードされた文字列
   - 繰り返し使用される値

5. **変数名の改善**
   - 意味が不明確な変数名
   - 命名規則に従っていない変数名
   - 長すぎる変数名

#### 低優先度の候補

6. **コードの整理**
   - 未使用の変数・関数
   - 重複コード
   - 不要なコメント

---

## 3. 提案の形式

### 提案テンプレート

```markdown
## リファクタリング提案

### 優先度: [高/中/低]

#### 現在の状況

- 問題点の説明
- 現在のコードの状況

#### 提案内容

- 具体的な改善案
- 期待される効果

#### 実装方法

- ステップバイステップの手順
- 注意点

#### 関連ファイル

- 影響を受けるファイル
- 確認すべきファイル
```

### 命名規則の遵守

**重要**: 提案時のコード例は必ずsnake_caseの命名規則に従うこと：

```typescript
// 正しい例
const handle_audio_play = (): void => { ... }
const use_audio_controller = () => { ... }
const audio_state_manager = { ... }

// 間違った例
const handleAudioPlay = (): void => { ... }
const useAudioController = () => { ... }
const audioStateManager = { ... }
```

### 具体例

````markdown
## リファクタリング提案

### 優先度: 高

#### 現在の状況

- `process_user_data` 関数が45行で複雑度が6
- ユーザーデータの検証、変換、保存を1つの関数で処理
- テストが困難

#### 提案内容

- 関数を3つに分割：
  1. `validate_user_data` - データ検証
  2. `transform_user_data` - データ変換
  3. `save_user_data` - データ保存
- 各関数を25行以下、複雑度4以下に

#### 実装方法

1. 新しい関数を作成
2. 既存関数から処理を移動
3. 既存関数を各関数を呼び出すように変更
4. テストを追加

#### サンプルコード

```typescript
// 新しい関数を作成
const validate_user_data = (user_data: UserData): boolean => {
	if (!user_data.email || !user_data.name) {
		return false
	}
	return user_data.email.includes('@')
}

const transform_user_data = (user_data: UserData): TransformedUserData => {
	return {
		...user_data,
		email: user_data.email.toLowerCase(),
		created_at: new Date(),
	}
}

const save_user_data = async (user_data: TransformedUserData): Promise<void> => {
	await fetch('/api/users', {
		method: 'POST',
		body: JSON.stringify(user_data),
	})
}

// 既存関数を修正
const process_user_data = async (user_data: UserData): Promise<void> => {
	if (!validate_user_data(user_data)) {
		throw new Error('Invalid user data')
	}

	const transformed_data = transform_user_data(user_data)
	await save_user_data(transformed_data)
}
```
````

#### 関連ファイル

- `src/lib/utils/user-utils.ts` - 新規作成
- `src/lib/types/user.ts` - 型定義確認
- `src/lib/data/user-data.ts` - データ処理確認

````

---

## 4. ESLint ルールとの整合性

### リファクタリング時の注意点

**重要**: 既存コードはESLintで矯正済みですが、リファクタリング中は以下の点に注意：

1. **新しいコードの品質維持**
   - 分割した関数・ファイルがESLintルールに準拠しているか確認
   - 提案するサンプルコードがESLintルールに準拠しているか確認

2. **段階的なリファクタリング対応**
   - 大きなリファクタリングでは一時的にルール違反が発生する可能性
   - 各段階でESLintルールを意識して進める

3. **提案時の品質チェック**
   - 提案するコード例がESLintルールに準拠しているか確認
   - ユーザーが実装時に迷わないよう指針を提供

### 主要なESLintルール（参考）

```typescript
// 命名規則
- 変数・関数: snake_case
- 定数: UPPER_CASE または snake_case
- 型・クラス: PascalCase
- boolean: is_, has_, should_ プレフィックス

// 複雑度制限
- 関数の複雑度: 最大4
- ネストレベル: 最大1
- 関数の行数: 最大25行
- ファイルの行数: 最大300行
- パラメータ数: 最大3個
```

---

## 5. 提案時の注意点

### ユーザーへの配慮

1. **選択肢の提示**
   - 複数の実装方法を提示
   - メリット・デメリットを説明
   - ユーザーが判断できる情報を提供

2. **段階的な提案**
   - 小さな変更から開始
   - 大きな変更は後回し
   - 各段階で効果を確認

3. **実装の委譲**
   - 提案のみを行い、実装はユーザーに委ねる
   - コード例は参考程度に
   - ユーザーの判断を尊重

4. **命名規則の遵守**
   - 提案時のコード例は必ずsnake_caseを使用
   - 変数・関数: snake_case
   - 定数: UPPER_CASE または snake_case
   - 型・クラス: PascalCase
   - boolean: is*, has*, should\_ プレフィックス

### 技術的な配慮

1. **既存コードの尊重**
   - 現在の設計思想を理解
   - 既存のパターンに従う
   - 破壊的変更を避ける

2. **テストの考慮**
   - 既存テストへの影響を確認
   - 新しいテストの必要性を検討
   - テストの可読性を向上

3. **パフォーマンスの考慮**
   - リファクタリングによる性能劣化を避ける
   - 不要な処理の追加を避ける
   - 既存の最適化を維持

---

## 6. 提案の実行手順

### 1. 現在選択されているファイルを分析

**重要**: ユーザーが現在開いているファイルを分析してください。

```bash
# ファイルの基本情報を確認
- 行数、関数数、複雑度
- インポート、エクスポート
- 型定義、変数定義
- 複数の責任を持つファイルかどうか
- 密結合な部分の特定
```

### 2. 関連ファイルを特定

```bash
# 関連ファイルを探す
- インポートされているファイル
- 同じディレクトリのファイル
- 類似機能のファイル
```

### 3. リファクタリング候補を特定

**重要**: 一度に3つまでの具体的な提案に絞り、実装可能なサンプルコードを提供する。

**優先度の決定ルール**:

1. 高優先度の候補が3つ以上ある場合 → 高優先度のみを3つ提案
2. 高優先度が2つ以下の場合 → 高優先度 + 中優先度で3つまで
3. 高・中優先度が合計2つ以下の場合 → 高・中・低優先度で3つまで

```typescript
// 優先度順に候補をリストアップ（最大3つ）
// 例1: 高優先度が3つ以上ある場合
1. 高優先度: 関数分割
2. 高優先度: ファイル分割
3. 高優先度: 型定義改善

// 例2: 高優先度が2つ以下の場合
1. 高優先度: 関数分割
2. 高優先度: ファイル分割
3. 中優先度: 定数抽出
```

### 4. 提案を作成

```markdown
## リファクタリング提案

### 優先度: [高/中/低]

#### 現在の状況

- 問題点の説明
- 現在のコードの状況

#### 提案内容

- 具体的な改善案
- 期待される効果

#### 実装方法

- ステップバイステップの手順
- 注意点

#### サンプルコード

- そのまま利用できる具体的なコード
- 実装例を含む

#### 関連ファイル

- 影響を受けるファイル
- 確認すべきファイル
```

### 5. ユーザーに提案

- 提案内容を説明
- 実装方法を提示
- サンプルコードを提供
- ユーザーの判断を待つ
- 必要に応じて追加情報を提供

---

## 7. よくあるリファクタリングパターン

### 関数分割のパターン

```typescript
// Before: 長い関数
const process_user_data = (user_data: UserData): ProcessedUserData => {
  // 検証処理 (10行)
  // 変換処理 (15行)
  // 保存処理 (10行)
  // 通知処理 (5行)
}

// After: 分割された関数
const validate_user_data = (user_data: UserData): boolean => {
  // 検証処理
}

const transform_user_data = (user_data: UserData): TransformedUserData => {
  // 変換処理
}

const save_user_data = (user_data: TransformedUserData): void => {
  // 保存処理
}

const notify_user = (user_data: ProcessedUserData): void => {
  // 通知処理
}

const process_user_data = (user_data: UserData): ProcessedUserData => {
  if (!validate_user_data(user_data)) {
    throw new Error('Invalid user data')
  }

  const transformed_data = transform_user_data(user_data)
  save_user_data(transformed_data)
  notify_user(transformed_data)

  return transformed_data
}
```

### ファイル分割のパターン

```typescript
// Before: 大きなファイル (400行)
// user-service.ts
export class UserService {
  // 認証関連 (100行)
  // データ処理関連 (150行)
  // 通知関連 (100行)
  // ユーティリティ関連 (50行)
}

// After: 分割されたファイル
// user-auth.ts
export class UserAuth {
  // 認証関連
}

// user-data.ts
export class UserData {
  // データ処理関連
}

// user-notification.ts
export class UserNotification {
  // 通知関連
}

// user-utils.ts
export class UserUtils {
  // ユーティリティ関連
}
```

### 定数抽出のパターン

```typescript
// Before: マジックナンバー
const process_items = (items: Item[]): ProcessedItem[] => {
  return items.filter(item => item.status === 1)
    .map(item => ({ ...item, priority: 2 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
}

// After: 定数抽出
const ACTIVE_STATUS = 1
const HIGH_PRIORITY = 2
const MAX_RESULTS = 10

const process_items = (items: Item[]): ProcessedItem[] => {
  return items.filter(item => item.status === ACTIVE_STATUS)
    .map(item => ({ ...item, priority: HIGH_PRIORITY }))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS)
}
```

---

## 8. チェックリスト

提案前に以下を確認：

- [ ] 現在のファイルの状況を正確に把握した
- [ ] 関連ファイルを確認した
- [ ] ESLint ルールに準拠している
- [ ] 一度に3つまでの提案に絞っている
- [ ] 実装可能なサンプルコードを提供している
- [ ] 実装はユーザーに委ねている
- [ ] 既存の設計思想を尊重している
- [ ] テストへの影響を考慮している
- [ ] パフォーマンスへの影響を考慮している

---

## 9. 参考ファイル

- `prompts/coding-standards.md` - ESLint ルールの詳細
- `eslint.config.js` - 設定ファイル
- `src/lib/` - 既存の実装パターン
- `src/routes/` - ページコンポーネントの実装

---

**重要**: このプロンプトが提示された場合、現在選択されているファイルのリファクタリング提案を実行してください。提案のみを行い、実装はユーザーに委ねます。一度に3つまでの具体的な提案に絞り、高優先度の候補が3つ以上ある場合は高優先度のみを提案し、実装可能なサンプルコードを提供して、ユーザーが考えて対応できるよう配慮してください。
````
