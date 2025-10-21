// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
// import storybook from 'eslint-plugin-storybook';

import { fileURLToPath } from 'node:url'
import { includeIgnoreFile } from '@eslint/compat'
import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import promise from 'eslint-plugin-promise'
import sonarjs from 'eslint-plugin-sonarjs'
import svelte from 'eslint-plugin-svelte'
import unicorn from 'eslint-plugin-unicorn'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import ts from 'typescript-eslint'
import svelteConfig from './svelte.config.js'

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url))

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	{
		// tsconfig に含まれないファイルを明示的に除外
		ignores: [
			'.storybook/**',
			'*.config.js',
			'*.config.ts',
			'vite.config.js',
			'vite.config.ts',
			'vitest-setup-client.ts',
			'src/routes/demo/**',
			'src/stories/**',
			'src/app.d.ts',
			'src/hooks.server.ts',
			'src/hooks.ts',
			'src/lib/server/**',
			'src/routes/+layout*',
		],
	},
	{
		// tsconfig の include に合わせた対象ファイルを指定
		files: [
			'vite.config.js',
			'vite.config.ts',
			'src/**/*.js',
			'src/**/*.ts',
			'src/**/*.svelte',
			'tests/**/*.js',
			'tests/**/*.ts',
			'tests/**/*.svelte',
			'scripts/**/*.js',
			'scripts/**/*.ts',
		],
	},
	js.configs.recommended,
	...ts.configs.strictTypeChecked,
	...ts.configs.stylisticTypeChecked,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	unicorn.configs.recommended,
	sonarjs.configs.recommended,
	// promise.configs.recommended,
	{
		plugins: {
			promise,
		},
		rules: {
			...promise.configs.recommended.rules,
		},
	},
	importPlugin.flatConfigs.recommended,
	{
		settings: {
			'import/resolver': {
				typescript: {
					alwaysTryTypes: true,
					project: './tsconfig.json',
				},
				node: true,
			},
		},
	},
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			// typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
			// see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
			'no-undef': 'off',

			// ===== 命名規則の厳格化 =====
			'@typescript-eslint/naming-convention': [
				'error',
				// 変数は snake_case
				{
					selector: 'variable',
					format: ['snake_case'],
					leadingUnderscore: 'allow',
					trailingUnderscore: 'forbid',
				},
				// 定数（const）は UPPER_CASE または snake_case
				{
					selector: 'variable',
					modifiers: ['const'],
					format: ['UPPER_CASE', 'snake_case'],
					leadingUnderscore: 'allow',
				},
				// boolean 変数は is_, has_, should_ などで始める
				{
					selector: 'variable',
					types: ['boolean'],
					format: ['snake_case'],
					prefix: ['is_', 'has_', 'should_', 'can_', 'will_', 'did_'],
				},
				// 関数は snake_case
				{
					selector: 'function',
					format: ['snake_case'],
					leadingUnderscore: 'allow',
				},
				// パラメータは snake_case
				{
					selector: 'parameter',
					format: ['snake_case'],
					leadingUnderscore: 'allow',
				},
				// クラス、インターフェース、型エイリアス、Enum は PascalCase
				{
					selector: 'typeLike',
					format: ['PascalCase'],
				},
				// Enum メンバーは UPPER_CASE
				{
					selector: 'enumMember',
					format: ['UPPER_CASE'],
				},
				// クラスのプロパティは snake_case
				{
					selector: 'classProperty',
					format: ['snake_case'],
					leadingUnderscore: 'allow',
				},
				// クラスのメソッドは snake_case
				{
					selector: 'classMethod',
					format: ['snake_case'],
					leadingUnderscore: 'allow',
				},
				// オブジェクトリテラルのプロパティは snake_case（外部APIとの互換性のため例外を許可）
				{
					selector: 'objectLiteralProperty',
					format: ['snake_case'],
					// format: ['snake_case', 'camelCase', 'PascalCase'],
					leadingUnderscore: 'allow',
				},
				// 型プロパティは snake_case
				{
					selector: 'typeProperty',
					format: ['snake_case'],
				},
			],

			// ===== TypeScript 厳格化 =====
			// 明示的な関数戻り値の型を必須に
			'@typescript-eslint/explicit-function-return-type': [
				'error',
				{
					allowExpressions: false,
					allowTypedFunctionExpressions: true,
					allowHigherOrderFunctions: true,
					allowDirectConstAssertionInArrowFunctions: true,
					allowConciseArrowFunctionExpressionsStartingWithVoid: false,
				},
			],
			// モジュールの境界で明示的な型を必須に
			'@typescript-eslint/explicit-module-boundary-types': 'error',
			// any の使用を禁止
			'@typescript-eslint/no-explicit-any': 'error',
			// 未使用変数を禁止
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
			// 不要な型アサーションを禁止
			'@typescript-eslint/no-unnecessary-type-assertion': 'error',
			// 不要な条件を禁止
			'@typescript-eslint/no-unnecessary-condition': 'error',
			// 浮動Promiseを禁止
			'@typescript-eslint/no-floating-promises': 'error',
			// 誤ったPromiseの使い方を禁止
			'@typescript-eslint/no-misused-promises': 'error',
			// switch文のフォールスルーを禁止
			'@typescript-eslint/switch-exhaustiveness-check': 'error',
			// 厳格なboolean式
			'@typescript-eslint/strict-boolean-expressions': [
				'error',
				{
					allowString: false,
					allowNumber: false,
					allowNullableObject: false,
					allowNullableBoolean: false,
					allowNullableString: false,
					allowNullableNumber: false,
					allowAny: false,
				},
			],
			// nullishオペレーターの適切な使用
			'@typescript-eslint/prefer-nullish-coalescing': 'error',
			// optional chainingの適切な使用
			'@typescript-eslint/prefer-optional-chain': 'error',
			// 配列のメソッドチェーンを推奨
			'@typescript-eslint/prefer-reduce-type-parameter': 'error',
			// return await を推奨
			'@typescript-eslint/return-await': ['error', 'always'],
			// 配列のインデックスアクセス時の型安全性
			'@typescript-eslint/no-unsafe-member-access': 'error',
			'@typescript-eslint/no-unsafe-call': 'error',
			'@typescript-eslint/no-unsafe-return': 'error',
			'@typescript-eslint/no-unsafe-assignment': 'error',
			// 型のインポートを明示
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					prefer: 'type-imports',
					fixStyle: 'inline-type-imports',
				},
			],
			// 型定義のエクスポート方法を統一
			'@typescript-eslint/consistent-type-exports': [
				'error',
				{
					fixMixedExportsWithInlineTypeSpecifier: true,
				},
			],

			// ===== 一般的なコード品質 =====
			// console の使用を警告（開発時は許可、本番ではエラーにするべき）
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			// デバッガーの使用を禁止
			'no-debugger': 'error',
			// var の使用を禁止
			'no-var': 'error',
			// const を優先
			'prefer-const': 'error',
			// アロー関数を優先
			'prefer-arrow-callback': 'error',
			// テンプレートリテラルを優先
			'prefer-template': 'error',
			// 等価演算子は厳密等価を使用
			eqeqeq: ['error', 'always'],
			// 不要な return を禁止
			'no-useless-return': 'error',
			// 不要な catch を禁止
			'no-useless-catch': 'error',
			// 複雑度の制限
			complexity: ['warn', 10],
			// 最大ネストレベル
			'max-depth': ['warn', 4],
			// 関数の最大行数
			'max-lines-per-function': ['warn', { max: 100, skipBlankLines: true, skipComments: true }],
			// ファイルの最大行数
			'max-lines': ['warn', { max: 500, skipBlankLines: true, skipComments: true }],
			// パラメータの最大数
			'max-params': ['warn', 4],
			// 一貫した return
			'consistent-return': 'error',
			// 不要な else を禁止
			'no-else-return': 'error',
			// 重複したインポートを禁止
			'no-duplicate-imports': 'error',

			// TypeScriptコンパイラが既にチェックするため無効化
			'import/no-unresolved': 'off',
		},
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig,
			},
		},
		rules: {
			// Svelte ファイルでは Svelte 固有のルールを適用

			// Svelte の $state などのリアクティブ変数は再代入されるため、prefer-const を緩和
			// 'prefer-const': 'warn',

			// Svelte コンポーネントファイルは PascalCase を許可
			'unicorn/filename-case': [
				'error',
				{
					case: 'pascalCase',
					ignore: [
						'\\+page\\.svelte$',
						'\\+layout\\.svelte$',
						'\\+error\\.svelte$',
						'\\+server\\.ts$',
					],
				},
			],

			// Svelte の Props インターフェース名を許可
			'unicorn/prevent-abbreviations': [
				'error',
				{
					allowList: {
						Props: true,
					},
				},
			],
		},
	},
	// {
	// 	// テストファイルではルールを緩和
	// 	files: ['**/*.test.ts', '**/*.spec.ts', '**/*.test.svelte.ts', '**/*.spec.svelte.ts'],
	// 	rules: {
	// 		'@typescript-eslint/no-explicit-any': 'off',
	// 		'max-lines-per-function': 'off',
	// 		'@typescript-eslint/explicit-function-return-type': 'off',
	// 	},
	// },
)
