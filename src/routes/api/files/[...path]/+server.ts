import type { R2Bucket, R2Object, R2ObjectBody } from '@cloudflare/workers-types'
import { json } from '@sveltejs/kit'
import { HTTP_STATUS } from '$lib/constants/http'
import type { RequestHandler } from './$types'

class ApiError extends Error {
	constructor(
		message: string,
		public readonly status: number,
	) {
		super(message)
		this.name = 'ApiError'
	}
}

interface Environment {
	talk_svelte_assets?: R2Bucket
}

function get_environment(platform: App.Platform | undefined): Environment {
	const environment = platform?.env ?? undefined

	if (environment === undefined) {
		throw new ApiError('Platform not available', HTTP_STATUS.INTERNAL_SERVER_ERROR)
	}

	return environment
}

function get_bucket(environment: Environment): R2Bucket {
	const bucket = environment.talk_svelte_assets

	if (bucket === undefined) {
		throw new ApiError('R2 bucket not configured', HTTP_STATUS.INTERNAL_SERVER_ERROR)
	}

	return bucket
}

function check_path_valid(path: string): boolean {
	return !(path.includes('..') || path.trim() === '' || path.startsWith('/') || path.endsWith('/'))
}

function validate_path(path?: string): string {
	if (path === undefined || path.length === 0) {
		throw new ApiError('File path is required', HTTP_STATUS.BAD_REQUEST)
	}

	if (!check_path_valid(path)) {
		throw new ApiError('Invalid file path', HTTP_STATUS.BAD_REQUEST)
	}

	return path
}

async function get_object(bucket: R2Bucket, path: string): Promise<R2ObjectBody> {
	const object = await bucket.get(path)

	if (object === null) {
		throw new ApiError('File not found', HTTP_STATUS.NOT_FOUND)
	}

	return object
}

async function head_object(bucket: R2Bucket, path: string): Promise<R2Object> {
	const result = await bucket.head(path)

	if (result === null) {
		throw new ApiError('Head object not found', HTTP_STATUS.NOT_FOUND)
	}

	return result
}

const DEFAULT_CONTENT_TYPE = 'audio/mpeg'
const CACHE_CONTROL = 'public, max-age=31536000, immutable'

async function get_response(object: R2ObjectBody): Promise<Response> {
	const array_buffer = await object.arrayBuffer()
	const content_type = object.httpMetadata?.contentType ?? DEFAULT_CONTENT_TYPE

	return new Response(array_buffer, {
		headers: {
			'Content-Type': content_type,
			'Cache-Control': CACHE_CONTROL,
		},
	})
}

function head_response(object: R2Object): Response {
	const content_type = object.httpMetadata?.contentType ?? DEFAULT_CONTENT_TYPE

	return new Response(undefined, {
		headers: {
			'Content-Type': content_type,
		},
	})
}

export const GET: RequestHandler = async ({ platform, params }) => {
	try {
		const file_path = validate_path(params.path)
		const environment = get_environment(platform)
		const bucket = get_bucket(environment)
		const object = await get_object(bucket, file_path)
		return await get_response(object)
	} catch (error) {
		if (error instanceof ApiError) {
			return json({ error: error.message }, { status: error.status })
		}

		throw error
	}
}

export const HEAD: RequestHandler = async ({ platform, params }) => {
	try {
		const file_path = validate_path(params.path)
		const environment = get_environment(platform)
		const bucket = get_bucket(environment)
		const object = await head_object(bucket, file_path)
		return head_response(object)
	} catch (error) {
		if (error instanceof ApiError) {
			return new Response(undefined, { status: error.status })
		}

		throw error
	}
}
