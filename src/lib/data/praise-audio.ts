const praise_audio_files = [
	'awesome',
	'great-job',
	'nice',
	'amazing',
	'well-done',
	'fantastic',
	'you-did-it',
	'incredible',
	'brilliant',
	'excellent',
	'unbelievable',
	'epic',
	'perfect',
	'nice-work',
	'superb',
	'outstanding',
	'you-nailed-it',
	'thats-insane',
	'you-rock',
	'legendary',
] satisfies Array<string>

function get_praise_audio_file(): string {
	return (
		// eslint-disable-next-line sonarjs/pseudo-random
		praise_audio_files.at(Math.floor(Math.random() * praise_audio_files.length)) ?? ''
	)
}

export { praise_audio_files, get_praise_audio_file }
