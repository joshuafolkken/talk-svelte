const praise_audio_files = [
	// Basic praise (low)
	'good-x',
	'nice-x',
	'nice-work-x',
	'well-done-x',
	'great-job-x',

	// Positive praise (mid-low)
	'you-did-it-x',
	'awesome-x',

	// Strong praise (mid)
	'excellent-x',
	'fantastic-x',
	'brilliant-x',

	// Stronger praise (mid-high)
	'amazing-x',
	'incredible-x',
	'superb-x',
	'outstanding-x',
	'perfect-x',

	// Very strong praise (high)
	'epic-x',
	'you-nailed-it-x',
	'unbelievable-x',
	'you-rock-x',

	// Highest level praise (maximum)
	'that-s-insane-x',
	'legendary-x',
] satisfies Array<string>

let current_praise_index = 0

function get_praise_audio_file(): string {
	const file = praise_audio_files.at(current_praise_index) ?? ''
	current_praise_index = (current_praise_index + 1) % praise_audio_files.length
	return file
}

function reset_praise_audio_index(): void {
	current_praise_index = 0
}

export { praise_audio_files, get_praise_audio_file, reset_praise_audio_index }
