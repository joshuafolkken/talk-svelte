# Git Automation Prompt

このプロンプトは、AI に一発でコミット、プッシュ、PR作成を安全に自動実行させるための指示書です。

---

## 1. 事前確認チェックリスト

以下の確認を**必ず**実行すること：

- [ ] すべての変更ファイルがステージングされているか確認
- [ ] 現在のブランチを確認
- [ ] Issue番号と Issue タイトルを取得済みか確認
- [ ] **mainブランチの最新を取得**（対象ブランチにいない場合は必須）
- [ ] **Issue番号とIssueタイトルがGitHub上に存在し、完全一致することを確認**（一致しない場合は停止）
- [ ] ブランチ作成の要否を判定（mainブランチにいる場合のみ作成）

---

## 2. ユーザー確認項目

以下の3つの操作について、ユーザーに実行可否を確認すること：

### 確認項目

1. **コミットを自動実行しますか？** (yes/no)
2. **プッシュを自動実行しますか？** (yes/no)
3. **PR作成を自動実行しますか？** (yes/no)

**Note**: ユーザーが "no" と回答した項目はスキップし、次の項目に進むこと。

---

## 3. 実行前の必須チェック

### 3.1 ステージング確認

すべての変更ファイルがステージングされているかを確認：

```bash
git status
```

**判定基準**:

- "Changes not staged for commit" セクションにファイルが存在する → **エラー停止**
- "Untracked files" が存在する → **エラー停止**
- "Changes to be committed" のみ存在する → **OK（次のステップへ）**

**エラーメッセージ**:

```
🚫 すべての変更ファイルがステージングされていません。
以下のコマンドでステージングしてください：
  git add .
```

### 3.2 現在のブランチ確認

現在のブランチを確認：

```bash
git branch --show-current
```

**判定**:

- `main` または `master` → **セクション 3.3 へ**
- その他のブランチ → **セクション 3.3 へ**（対象ブランチかどうかのチェックが必要）

### 3.3 mainブランチの最新取得

ブランチ作成前に、mainブランチの最新を取得する必要があります。

**処理フロー**:

1. 現在のブランチを確認
2. 対象ブランチ名を生成（Issue番号とタイトルから）
3. 現在のブランチが以下のいずれでもない場合、mainブランチに切り替えて最新を取得：
   - mainブランチ
   - masterブランチ
   - 対象ブランチ

**判定基準**:

| 現在のブランチ | 対象ブランチとの一致 | 処理内容                                                    |
| -------------- | -------------------- | ----------------------------------------------------------- |
| main/master    | -                    | mainブランチの最新を取得（`git pull`）                      |
| その他         | 一致する             | 何もしない（既に対象ブランチにいる）                        |
| その他         | 一致しない           | mainに切り替えて最新取得（`git checkout main && git pull`） |

**実装例**:

```bash
# 現在のブランチを取得
CURRENT_BRANCH=$(git branch --show-current)

# 対象ブランチ名を生成（Issue番号とタイトルから）
TARGET_BRANCH="123-add-dark-mode-toggle"

# 判定と処理
if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
  # mainブランチの最新を取得
  echo "mainブランチの最新を取得しています..."
  git pull origin main
elif [ "$CURRENT_BRANCH" != "$TARGET_BRANCH" ]; then
  # mainブランチに切り替えて最新を取得
  echo "mainブランチに切り替えて最新を取得しています..."
  git checkout main
  git pull origin main
else
  # 既に対象ブランチにいる場合は何もしない
  echo "既に対象ブランチにいます。最新取得をスキップします。"
fi
```

**エラーハンドリング**:

`git pull` でコンフリクトが発生した場合：

```
🚫 mainブランチの最新取得に失敗しました。
コンフリクトを解決してください。

エラー内容:
<git pullのエラーメッセージ>

修正方法:
1. コンフリクトを手動で解決
2. git add でステージング
3. 再度このスクリプトを実行
```

**対処**:

- エラー内容をユーザーに提示
- **エラー停止**（ユーザーに解決を依頼）

### 3.4 Issue番号とタイトルの検証

GitHub上に指定されたIssue番号とタイトルが存在し、完全一致することを確認：

```bash
gh issue view <issue-number> --json title --jq .title
```

**検証手順**:

1. ユーザーから Issue番号と Issueタイトルを取得
2. GitHub CLI で Issue情報を取得
3. 取得したタイトルとユーザーが指定したタイトルが完全一致するか確認

**判定基準**:

- Issue が存在しない → **エラー停止**
- タイトルが完全一致しない → **エラー停止**
- タイトルが完全一致する → **OK（次のステップへ）**

**エラーメッセージ例**:

```
🚫 Issue #123 が見つかりません。
Issue番号を確認してください。
```

```
🚫 Issueタイトルが一致しません。
  指定されたタイトル: Add dark mode toggle
  GitHubのタイトル:    Add darkmode toggle
Issue番号とタイトルを確認してください。
```

**実装例**:

```bash
# Issue タイトルを取得
GITHUB_TITLE=$(gh issue view 123 --json title --jq .title)

# 比較
if [ "$GITHUB_TITLE" != "Add dark mode toggle" ]; then
  echo "🚫 Issueタイトルが一致しません"
  exit 1
fi
```

---

## 4. ブランチ作成（main/master にいる場合のみ）

### 4.1 Issue情報の取得

ユーザーに以下を質問：

- **Issue番号** (例: `123`)
- **Issueタイトル** (例: `Add dark mode toggle`)

### 4.2 ブランチ名の生成規則

ブランチ名: `<issue-number>-<issue-title>`

**変換ルール**:

- スペース → ハイフン (`-`)
- 記号 (`!`, `?`, `.`, `,`, `/`, `\`, `(`, `)`, `[`, `]`, `{`, `}`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, `+`, `=`, `~`, `` ` ``, `'`, `"`, `:`, `;`, `<`, `>`, `|`) → ハイフン (`-`)
- 連続するハイフン → 単一のハイフン
- 先頭・末尾のハイフン → 削除
- すべて小文字に変換

**例**:

- Issue番号: `123`
- Issueタイトル: `Add dark mode toggle!`
- 生成されるブランチ名: `123-add-dark-mode-toggle`

### 4.3 ブランチ作成コマンド

```bash
git checkout -b <branch-name>
```

**例**:

```bash
git checkout -b 123-add-dark-mode-toggle
```

---

## 5. コミット実行

### 5.1 コミットメッセージ生成規則

コミットメッセージ: `<issue-title> #<issue-number>`

**例**:

- Issueタイトル: `Add dark mode toggle`
- Issue番号: `123`
- 生成されるコミットメッセージ: `Add dark mode toggle #123`

### 5.2 コミットコマンド

```bash
git commit -m "<commit-message>"
```

**例**:

```bash
git commit -m "Add dark mode toggle #123"
```

### 5.3 lefthook エラー処理

lefthook の `pre-commit` および `commit-msg` フックが実行されます。

**エラーが発生した場合**:

1. **エラー内容を確認**し、ユーザーに提示
2. **修正方法を提案**（lefthook の fail_text を参照）
3. **実行を停止**（ユーザーに修正を依頼）

**lefthook の主なチェック項目**:

- cspell（スペルチェック）
- prettier（コードフォーマット）
- eslint（リント）
- prevent-main-commit（mainブランチへの直接コミット防止）
- check-commit-message（コミットメッセージ形式チェック）

**エラーメッセージ例**:

```
🚫 Commit blocked due to quality checks failure
Please fix the issues above and try again.

Quick fixes:
• Run `npm run format` to auto-format code
• Run `npm run lint` to check and fix linting issues
• Run `npm run check` to verify TypeScript types
```

**対処法**:

- エラー内容をユーザーに提示
- 修正コマンドを提案
- 修正後、再度コミットを試みる（ユーザーの承認が必要）

---

## 6. プッシュ実行

### 6.1 プッシュコマンド

```bash
git push -u origin <branch-name>
```

**例**:

```bash
git push -u origin 123-add-dark-mode-toggle
```

### 6.2 lefthook エラー処理

lefthook の `pre-push` フックが実行されます。

**エラーが発生した場合**:

1. **エラー内容を確認**し、ユーザーに提示
2. **修正方法を提案**
3. **実行を停止**（ユーザーに修正を依頼）

**lefthook の主なチェック項目**:

- type-check（型チェック）
- test-unit（単体テスト）
- test-e2e（E2Eテスト）

**エラーメッセージ例**:

```
🚫 Push blocked due to build or test failures
Please resolve the issues above before pushing.

Troubleshooting:
• Check build errors: `npm run build`
• Run tests locally: `npm run test:unit` and `npm run test:e2e`
```

**対処法**:

- エラー内容をユーザーに提示
- 修正コマンドを提案
- 修正後、再度プッシュを試みる（ユーザーの承認が必要）

---

## 7. PR作成

### 7.1 PR作成方法

GitHub CLI (`gh`) を使用してPRを作成：

```bash
gh pr create --title "<pr-title>" --body "<pr-body>" --label "<label>" --base main
```

### 7.2 PRタイトル

PRタイトルの形式: `<issue-title> #<issue-number>`

**例**:

```
Add dark mode toggle #123
```

### 7.3 PR本文

PR本文の形式: `closes #<issue-number>`

**例**:

```
closes #123
```

**Note**: 簡潔に `closes #<issue-number>` のみを記載する（変更内容等の追加情報は不要）

### 7.4 PRラベル

PR作成時に `enhancement` ラベルを付与する：

```bash
--label enhancement
```

### 7.5 PR作成コマンド例

```bash
gh pr create --title "Add dark mode toggle #123" --body "closes #123" --label enhanced --base main
```

### 7.6 gh コマンドが使用できない場合

`gh` コマンドがインストールされていない場合:

1. **エラーメッセージを表示**:

   ```
   ⚠️ GitHub CLI (gh) がインストールされていません。
   以下のコマンドでインストールしてください：
     brew install gh
   ```

2. **代替手段を提案**:
   ```
   または、以下のURLから手動でPRを作成してください：
   https://github.com/<owner>/<repo>/pull/new/<branch-name>
   ```

### 7.7 ステータスチェックの待機

PR作成後、ステータスチェック（CI/CD）が完了するまで待機する：

```bash
gh pr checks --watch
```

**動作**:

- ステータスチェックの進行状況をリアルタイムで表示
- すべてのチェックが完了するまで待機
- チェックが成功/失敗したら次のステップへ

**例**:

```
$ gh pr checks --watch
Some checks have not completed yet.

  ✓ Build (7s)
  ✓ Test / Unit Tests (12s)
  ✓ Test / E2E Tests (45s)
  - SonarCloud Analysis (running)
```

### 7.8 SonarCloud チェック

ステータスチェック完了後、SonarCloud の結果を確認：

```bash
gh pr checks
```

**判定基準**:

1. SonarCloud チェックの結果を確認
2. Issue や Code Smell が存在するか確認
3. 結果に応じて処理を分岐

**Issue/Code Smell が存在する場合**:

```
⚠️ SonarCloud で問題が検出されました。
以下のURLで詳細を確認し、修正してください：
<SonarCloud URL>

検出された問題:
- Bugs: X件
- Code Smells: Y件
- Security Hotspots: Z件

修正後、再度コミット・プッシュしてください。
```

**対処**:

- ユーザーに修正を依頼
- **警告終了**（処理を停止）

**Issue/Code Smell が存在しない場合**:

```
✅ すべてのチェックが正常に完了しました。

PR情報:
- URL: <PR URL>
- タイトル: <PR タイトル>
- ステータス: ✓ All checks passed

次のステップ:
コードレビューを依頼してください。
```

**対処**:

- **正常終了**として報告
- PR URLを提示

### 7.9 SonarCloud 結果の取得方法

**オプション1: gh pr checks を使用**

```bash
gh pr checks --json name,conclusion,detailsUrl
```

出力例:

```json
[
	{
		"name": "SonarCloud Analysis",
		"conclusion": "success",
		"detailsUrl": "https://sonarcloud.io/dashboard?id=..."
	}
]
```

**オプション2: SonarCloud APIを使用**

プロジェクトキーと組織から直接 SonarCloud の Issue を取得：

```bash
curl -u <token>: "https://sonarcloud.io/api/issues/search?componentKeys=<project-key>&organization=<org>"
```

**Note**: `gh pr checks` で SonarCloud のステータスが `success` であれば、基本的に問題なしと判断可能

---

## 8. 実行フロー全体像

```
開始
  ↓
[1] 事前確認チェック
  ├─ すべての変更ファイルがステージング済み？
  │   ├─ No → エラー停止（ステージング依頼）
  │   └─ Yes → 次へ
  ├─ 現在のブランチを確認
  ├─ Issue情報取得（Issue番号とタイトル）
  ├─ 対象ブランチ名を生成
  ├─ mainブランチの最新取得
  │   ├─ main/master → git pull origin main
  │   ├─ 対象ブランチ → スキップ
  │   └─ その他 → git checkout main && git pull origin main
  │       ├─ コンフリクト発生 → エラー停止（解決依頼）
  │       └─ 成功 → 次へ
  ├─ Issue検証（GitHub上の情報と完全一致確認）
  │   ├─ Issue不存在 → エラー停止
  │   ├─ タイトル不一致 → エラー停止
  │   └─ 完全一致 → 次へ
  └─ ブランチ作成（mainブランチにいる場合のみ）
      ├─ main/master → ブランチ作成
      └─ その他 → スキップ
  ↓
[2] ユーザー確認
  ├─ コミット実行？
  │   ├─ Yes → コミット実行
  │   │   ├─ lefthook エラー → 停止（修正依頼）
  │   │   └─ 成功 → 次へ
  │   └─ No → スキップ
  ↓
  ├─ プッシュ実行？
  │   ├─ Yes → プッシュ実行
  │   │   ├─ lefthook エラー → 停止（修正依頼）
  │   │   └─ 成功 → 次へ
  │   └─ No → スキップ
  ↓
  └─ PR作成実行？
      ├─ Yes → PR作成
      │   ├─ gh コマンドなし → エラー（インストール依頼）
      │   ├─ PR作成成功 → ステータスチェック待機
      │   │   ↓
      │   │   ステータスチェック完了
      │   │   ↓
      │   │   SonarCloud結果確認
      │   │   ├─ Issue/Code Smell あり → 警告終了（修正依頼）
      │   │   └─ 問題なし → ✅ 正常終了（PR URL提示）
      │   └─ PR作成失敗 → エラー停止
      └─ No → 完了
```

---

## 9. エラーハンドリング

### 9.1 エラー分類

| エラー種別                 | 対処方法                             | 停止種別 |
| -------------------------- | ------------------------------------ | -------- |
| ステージング未完了         | `git add .` を実行するよう依頼       | エラー   |
| git pull コンフリクト      | コンフリクト解決を依頼               | エラー   |
| Issue番号が存在しない      | Issue番号を確認するよう依頼          | エラー   |
| Issueタイトルが不一致      | Issue情報を修正するよう依頼          | エラー   |
| lefthook pre-commit エラー | エラー内容と修正コマンドを提示       | エラー   |
| lefthook commit-msg エラー | コミットメッセージ形式を修正依頼     | エラー   |
| lefthook pre-push エラー   | エラー内容と修正コマンドを提示       | エラー   |
| gh コマンド未インストール  | インストール方法または代替手段を提示 | エラー   |
| Issue情報未取得            | Issue番号とタイトルを質問            | エラー   |
| SonarCloud で問題検出      | 問題詳細と修正依頼を提示             | 警告     |

### 9.2 エラーメッセージ例

#### ステージング未完了

```
🚫 すべての変更ファイルがステージングされていません。
以下のコマンドでステージングしてください：
  git add .
```

#### git pull コンフリクト

```
🚫 mainブランチの最新取得に失敗しました。
コンフリクトを解決してください。

エラー内容:
CONFLICT (content): Merge conflict in src/routes/+page.svelte
Automatic merge failed; fix conflicts and then commit the result.

修正方法:
1. コンフリクトを手動で解決
2. git add でステージング
3. 再度このスクリプトを実行
```

#### lefthook エラー（共通）

```
🚫 <Hook種別> blocked due to <エラー種別>
<lefthook の fail_text を表示>

エラー詳細:
<エラー内容>
```

---

## 10. 必須パラメータ

### ユーザーから取得する情報

| パラメータ       | 必須条件 | 取得タイミング   | 例                     |
| ---------------- | -------- | ---------------- | ---------------------- |
| Issue番号        | 常に     | 実行フロー開始時 | `123`                  |
| Issueタイトル    | 常に     | 実行フロー開始時 | `Add dark mode toggle` |
| コミット実行可否 | 常に     | 実行フロー開始時 | `yes` / `no`           |
| プッシュ実行可否 | 常に     | 実行フロー開始時 | `yes` / `no`           |
| PR作成実行可否   | 常に     | 実行フロー開始時 | `yes` / `no`           |

**Note**:

- Issue番号とタイトルは、mainブランチ以外にいる場合でもブランチ名やコミットメッセージ作成に必要
- PR本文は `closes #<issue-number>` のみを記載するため、追加情報の取得は不要

---

## 11. 実行例

### 例1: mainブランチから新規ブランチ作成 → コミット → プッシュ → PR作成 → 正常終了

```
[AI] 現在 main ブランチにいます。Issue番号を教えてください。
[User] 123
[AI] Issueタイトルを教えてください。
[User] Add dark mode toggle
[AI] 対象ブランチ名を生成しました: 123-add-dark-mode-toggle
[AI] mainブランチの最新を取得しています...
     $ git pull origin main
     Already up to date.
     ✅ 最新取得完了
[AI] GitHub上のIssue情報を確認しています...
     $ gh issue view 123 --json title --jq .title
     ✅ Issueタイトルが一致しました
[AI] 以下の操作を実行しますか？
     1. コミット実行: yes/no
     2. プッシュ実行: yes/no
     3. PR作成実行: yes/no
[User] yes, yes, yes
[AI] ブランチを作成します...
     $ git checkout -b 123-add-dark-mode-toggle
     ✅ ブランチ作成成功
[AI] コミットを実行します...
     $ git commit -m "Add dark mode toggle #123"
     ✅ コミット成功
[AI] プッシュを実行します...
     $ git push -u origin 123-add-dark-mode-toggle
     ✅ プッシュ成功
[AI] PR を作成します...
     $ gh pr create --title "Add dark mode toggle #123" --body "closes #123" --label enhanced --base main
     ✅ PR作成成功: https://github.com/owner/repo/pull/124
[AI] ステータスチェックを待機しています...
     $ gh pr checks --watch
     ✓ Build (7s)
     ✓ Test / Unit Tests (12s)
     ✓ Test / E2E Tests (45s)
     ✓ SonarCloud Analysis (30s)
     ✅ すべてのチェックが完了しました
[AI] SonarCloud の結果を確認しています...
     $ gh pr checks --json name,conclusion,detailsUrl
     ✅ 問題は検出されませんでした

     ✅ すべてのチェックが正常に完了しました。

     PR情報:
     - URL: https://github.com/owner/repo/pull/124
     - タイトル: Add dark mode toggle #123
     - ステータス: ✓ All checks passed

     次のステップ:
     コードレビューを依頼してください。
```

### 例2: lefthook エラー発生時

```
[AI] コミットを実行します...
     $ git commit -m "Add dark mode toggle #123"
     🚫 Commit blocked due to quality checks failure
     Please fix the issues above and try again.

     Quick fixes:
     • Run `npm run format` to auto-format code
     • Run `npm run lint` to check and fix linting issues

     エラー内容:
     src/routes/+page.svelte:10:1 - error: Expected indentation of 2 spaces

[AI] エラーが発生しました。以下のコマンドで修正してください：
     $ npm run format

     修正後、再度コミットを試みますか？ (yes/no)
```

### 例3: SonarCloud で問題検出時（警告終了）

```
[AI] ステータスチェックを待機しています...
     $ gh pr checks --watch
     ✓ Build (7s)
     ✓ Test / Unit Tests (12s)
     ✓ Test / E2E Tests (45s)
     ✓ SonarCloud Analysis (30s)
     ✅ すべてのチェックが完了しました
[AI] SonarCloud の結果を確認しています...
     $ gh pr checks --json name,conclusion,detailsUrl

     ⚠️ SonarCloud で問題が検出されました。
     以下のURLで詳細を確認し、修正してください：
     https://sonarcloud.io/dashboard?id=your-project

     検出された問題:
     - Bugs: 2件
     - Code Smells: 5件
     - Security Hotspots: 0件

     修正後、再度コミット・プッシュしてください。

     [処理を停止します]
```

### 例4: Issue検証エラー発生時

```
[AI] 現在 main ブランチにいます。Issue番号を教えてください。
[User] 123
[AI] Issueタイトルを教えてください。
[User] Add dark mode toggle
[AI] 対象ブランチ名を生成しました: 123-add-dark-mode-toggle
[AI] mainブランチの最新を取得しています...
     $ git pull origin main
     Already up to date.
     ✅ 最新取得完了
[AI] GitHub上のIssue情報を確認しています...
     $ gh issue view 123 --json title --jq .title

     🚫 Issueタイトルが一致しません。
       指定されたタイトル: Add dark mode toggle
       GitHubのタイトル:    Add darkmode toggle
     Issue番号とタイトルを確認してください。

     [処理を停止します]
```

### 例5: 別ブランチからmainに切り替えて最新取得

```
[AI] 現在 feature-old ブランチにいます。Issue番号を教えてください。
[User] 456
[AI] Issueタイトルを教えてください。
[User] Fix login bug
[AI] 対象ブランチ名を生成しました: 456-fix-login-bug
[AI] mainブランチに切り替えて最新を取得しています...
     $ git checkout main
     Switched to branch 'main'
     $ git pull origin main
     Updating abc1234..def5678
     Fast-forward
      src/lib/auth.ts | 10 +++++-----
      1 file changed, 5 insertions(+), 5 deletions(-)
     ✅ 最新取得完了
[AI] GitHub上のIssue情報を確認しています...
     $ gh issue view 456 --json title --jq .title
     ✅ Issueタイトルが一致しました
[AI] 以下の操作を実行しますか？
     1. コミット実行: yes/no
     2. プッシュ実行: yes/no
     3. PR作成実行: yes/no
[User] yes, yes, yes
[AI] ブランチを作成します...
     $ git checkout -b 456-fix-login-bug
     ✅ ブランチ作成成功
[AI] コミットを実行します...
     （以下省略）
```

### 例6: git pull コンフリクト発生時

```
[AI] 現在 feature-old ブランチにいます。Issue番号を教えてください。
[User] 789
[AI] Issueタイトルを教えてください。
[User] Update dependencies
[AI] 対象ブランチ名を生成しました: 789-update-dependencies
[AI] mainブランチに切り替えて最新を取得しています...
     $ git checkout main
     error: Your local changes to the following files would be overwritten by checkout:
            package.json
     Please commit your changes or stash them before you switch branches.

     🚫 mainブランチへの切り替えに失敗しました。
     未コミットの変更があります。

     修正方法:
     1. 変更をコミットまたはstashしてください
     2. 再度このスクリプトを実行

     [処理を停止します]
```

---

## 12. チェックリスト（AI実行前）

以下を確認してから実行すること：

- [ ] `git status` でステージング状態を確認した
- [ ] 現在のブランチを確認した（`git branch --show-current`）
- [ ] Issue番号とタイトルを取得した
- [ ] 対象ブランチ名を生成した
- [ ] **mainブランチの最新を取得した**（必要に応じて `git checkout main && git pull`）
- [ ] **git pull のエラーハンドリングを実装した**（コンフリクト等）
- [ ] **GitHub上のIssue情報と完全一致することを確認した**（`gh issue view`）
- [ ] ユーザーに3つの確認項目（コミット/プッシュ/PR）を質問した
- [ ] lefthook のエラーハンドリングを実装した
- [ ] gh コマンドの存在確認を実装した
- [ ] PR作成後のステータスチェック待機を実装した
- [ ] **SonarCloud結果の確認と判定を実装した**

---

## 13. 注意事項

1. **mainブランチの最新取得は必須**
   - ブランチ作成前に必ず実行
   - 対象ブランチにいる場合のみスキップ可能
   - git pull のエラー（コンフリクト等）は必ず処理

2. **Issue検証は必須**
   - 実行前に必ずGitHub上のIssue情報と完全一致することを確認
   - タイトルが1文字でも異なる場合は停止すること

3. **lefthook エラーは必ず修正すること**
   - エラーが発生した場合は、必ずユーザーに修正を依頼し、実行を停止する
   - 自動修正を試みる場合は、ユーザーの承認を得ること

4. **main/master への直接コミット/プッシュは禁止**
   - lefthook の `prevent-main-commit` がブロックする
   - 必ず新規ブランチを作成すること

5. **PR作成後は必ずステータスチェックを待機**
   - `gh pr checks --watch` でリアルタイム監視
   - すべてのチェックが完了するまで次のステップに進まない

6. **SonarCloud結果の確認は必須**
   - Issue/Code Smellが存在する場合は**警告終了**
   - 問題がない場合のみ**正常終了**として報告

7. **ユーザー確認を省略しない**
   - 3つの確認項目は必ずユーザーに質問すること
   - 勝手に実行しないこと

8. **エラーメッセージは詳細に**
   - lefthook の fail_text を必ず表示
   - 修正方法を具体的に提示

9. **PR情報の形式を厳守**
   - PRタイトル: `<issue-title> #<issue-number>`
   - PR本文: `closes #<issue-number>`
   - ラベル: `enhanced`

---

## 14. リファレンス

### 関連ファイル

- `lefthook.yml` - Git フックの設定
- `scripts/prevent-main-commit.ts` - main ブランチへの直接コミット防止
- `scripts/check-commit-message.ts` - コミットメッセージ形式チェック

### 外部コマンド

- `git` - バージョン管理
- `gh` - GitHub CLI（PR作成に必要）
- `npm` - Node.js パッケージマネージャー

---

## Template for Future Use

新しい自動化タスクを作成する際は、このプロンプトを参考にしてください。

重要なポイント:

1. **事前確認チェックを必ず実装**
   - ステージング確認
   - ブランチ確認
   - **mainブランチの最新取得**（対象ブランチでない場合）
   - **Issue検証（GitHub上の情報と完全一致）**

2. **ユーザー確認を省略しない**
   - コミット/プッシュ/PR作成の実行可否を必ず確認

3. **エラーハンドリングを徹底**
   - git pull エラー → コンフリクト解決依頼して停止
   - lefthook エラー → 修正依頼して停止
   - Issue検証エラー → 情報修正依頼して停止
   - SonarCloud問題検出 → 修正依頼して警告終了

4. **lefthook のフックを尊重**
   - pre-commit, commit-msg, pre-push の全チェックを実行
   - エラー時は必ず停止

5. **詳細なエラーメッセージを提示**
   - エラー内容を具体的に説明
   - 修正方法を明示
   - 関連URLを提示（SonarCloudなど）

6. **PR作成後の処理を忘れない**
   - ステータスチェック待機（`gh pr checks --watch`）
   - SonarCloud結果確認
   - 正常終了/警告終了の明確な報告
