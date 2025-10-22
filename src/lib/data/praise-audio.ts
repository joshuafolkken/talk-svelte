const praise_audio_files = [
	'awesome-x',
	'great-job-x',
	'nice-x',
	'amazing-x',
	'well-done-x',
	'fantastic-x',
	'you-did-it-x',
	'incredible-x',
	'brilliant-x',
	'excellent-x',
	'unbelievable-x',
	'epic-x',
	'perfect-x',
	'nice-work-x',
	'superb-x',
	'outstanding-x',
	'you-nailed-it-x',
	'that-s-insane-x',
	'you-rock-x',
	'legendary-x',
] satisfies Array<string>

function get_praise_audio_file(): string {
	return (
		// eslint-disable-next-line sonarjs/pseudo-random
		praise_audio_files.at(Math.floor(Math.random() * praise_audio_files.length)) ?? ''
	)
}

export { praise_audio_files, get_praise_audio_file }
