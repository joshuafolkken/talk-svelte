// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { R2Bucket } from '@cloudflare/workers-types'

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}

		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user']
			session: import('$lib/server/auth').SessionValidationResult['session']
		}

		interface Platform {
			env: {
				talk_svelte_assets?: R2Bucket
			}
		}
	}
}

export {}
