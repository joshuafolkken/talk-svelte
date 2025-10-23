import { expect, test } from 'vitest'
import { is_transcript_correct } from './transcript.js'

const cases = [
	{ expected: 'Love it!', actual: 'love it', result: true },
	{ expected: "I'm counting on you.", actual: "i'm counting on you", result: true },
	{ expected: "How's it going?", actual: "how's it going", result: true },
	{ expected: 'I mean…', actual: 'i mean', result: true },
] satisfies Array<{ expected: string; actual: string; result: boolean }>

test.each(cases)(
	'is_transcript_correct("$expected", "$actual") -> $result',
	({ expected, actual, result }) => {
		expect(is_transcript_correct(expected, actual)).toBe(result)
	},
)
