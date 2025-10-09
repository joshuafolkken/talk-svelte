<script lang="ts">
	type Question = {
		audio_uri: string
		transcript: string
		translation: string
	}

	function create_question(audio_uri: string, transcript: string, translation: string): Question {
		return {
			audio_uri,
			transcript,
			translation,
		}
	}

	const questions = [
		create_question('you_nailed_it.mp3', 'You nailed it!', '完璧にやったね！'),
		create_question('live_it.mp3', 'Love it!', 'それ好き！'),
		create_question('awesome.mp3', 'Awesome!', '最高！'),
	]

	let current_question = $state(1)
	let total_questions = $derived(questions.length)
	let is_playing = $state(false)
	let show_transcript = $state(false)
	let show_translation = $state(false)
	let is_recording = $state(false)
	let user_transcript = $state('Yay!')
	let liked = $state(false)
	let question = $state(questions[0]!)

	let audio_element: HTMLAudioElement

	function play_audio(): void {
		if (!audio_element) return

		if (is_playing) {
			audio_element.pause()
			is_playing = false
		} else {
			audio_element.play()
			is_playing = true
		}
	}

	function toggle_transcript(): void {
		show_transcript = !show_transcript
	}

	function toggle_translation(): void {
		show_translation = !show_translation
	}

	function toggle_recording(): void {
		is_recording = !is_recording
	}

	function toggle_like(): void {
		liked = !liked
	}

	function retry(): void {
		show_transcript = false
		show_translation = false
		user_transcript = ''
		liked = false

		if (audio_element && is_playing) {
			audio_element.pause()
		}
		is_playing = false
	}

	function next_question(): void {
		if (current_question < total_questions) {
			const next = questions[current_question]
			if (!next) return

			question = next
			current_question++
			retry()
		}
	}
</script>

<div
	class="gradient-animated min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-blue-500 px-4 py-8"
>
	<div class="mx-auto max-w-2xl">
		<!-- Progress Bar -->
		<div class="mb-8">
			<div
				class="mb-2 flex items-center justify-between text-sm font-medium text-white/90 drop-shadow-lg"
			>
				<h1 class="mb-1 text-center text-xl font-bold text-white drop-shadow-lg">🎧 Talk</h1>
				<span>{current_question} / {total_questions}</span>
			</div>
			<div class="h-3 overflow-hidden rounded-full bg-white/20 shadow-lg backdrop-blur-sm">
				<div
					class="h-full rounded-full bg-gradient-to-r from-white/60 to-white/80 shadow-inner transition-all duration-300"
					style="width: {(current_question / total_questions) * 100}%"
				></div>
			</div>
		</div>

		<!-- Main Card with Liquid Glass Effect -->
		<div
			class="overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl"
		>
			<!-- Audio Section-->
			<div
				class="border-b border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 backdrop-blur-lg"
			>
				<h2 class="mb-6 text-center text-2xl font-bold text-white drop-shadow-lg">🔊 Listen</h2>
				<div class="mb-6 flex justify-center">
					<button
						onclick={play_audio}
						class="group relative flex h-24 w-24 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/30 hover:shadow-white/50 active:scale-95"
					>
						<svg class="h-12 w-12 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
							{#if is_playing}
								<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
							{:else}
								<path d="M8 5v14l11-7z" />
							{/if}
						</svg>
					</button>
				</div>
				<audio
					bind:this={audio_element}
					src="/audio/{question.audio_uri}"
					onended={() => (is_playing = false)}
				></audio>

				<!-- Transcript Section -->
				<button
					onclick={toggle_transcript}
					class="mb-6 w-full rounded-2xl border border-white/20 bg-white/15 p-4 text-center text-lg shadow-xl backdrop-blur-md transition-all duration-300 {show_transcript
						? 'text-white'
						: 'font-semibold text-white/90 hover:scale-[1.02] hover:bg-white/25'}"
				>
					{#if show_transcript}
						📝 {question.transcript}
					{:else}
						<div class="flex items-center justify-center gap-2">
							<span>📝 Transcript</span>
							<svg
								class="h-5 w-5 text-white/70"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</div>
					{/if}
				</button>

				<!-- Translation Section -->
				<button
					onclick={toggle_translation}
					class="mb-6 w-full rounded-2xl border border-white/20 bg-white/15 p-4 text-center text-lg shadow-xl backdrop-blur-md transition-all duration-300 {show_translation
						? 'text-white'
						: 'font-semibold text-white/90 hover:scale-[1.02] hover:bg-white/25'}"
				>
					{#if show_translation}
						🌐 {question.translation}
					{:else}
						<div class="flex items-center justify-center gap-2">
							<span>🌐 Translation</span>
							<svg
								class="h-5 w-5 text-white/70"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</div>
					{/if}
				</button>
			</div>

			<!-- Recording Section -->
			<div
				class="border-b border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 backdrop-blur-lg"
			>
				<h3 class="mb-4 text-center text-xl font-bold text-white drop-shadow-lg">🎤 Speak</h3>
				<div class="flex flex-col items-center gap-6">
					<button
						onclick={toggle_recording}
						class="flex h-20 w-20 items-center justify-center rounded-full border border-white/30 backdrop-blur-md transition-all duration-300 {is_recording
							? 'animate-pulse bg-red-500/40 shadow-red-500/50 hover:bg-red-500/60'
							: 'bg-white/20 hover:scale-110 hover:bg-white/30'} text-white shadow-2xl hover:shadow-white/50 active:scale-95"
					>
						<svg class="h-10 w-10 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
							{#if is_recording}
								<rect x="6" y="6" width="12" height="12" rx="2" />
							{:else}
								<path
									d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"
								/>
								<path
									d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"
								/>
							{/if}
						</svg>
					</button>

					<div
						class="w-full rounded-2xl border border-white/20 bg-white/15 p-4 text-center text-lg shadow-xl backdrop-blur-md transition-all duration-300 {user_transcript
							? 'text-white'
							: 'font-semibold text-white/90'}"
					>
						💬 {user_transcript ? user_transcript : 'Your Speech'}
					</div>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex flex-wrap items-center justify-center gap-3 bg-white/5 p-6 backdrop-blur-lg">
				<button
					onclick={toggle_like}
					class="flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 font-semibold backdrop-blur-md transition-all duration-300 hover:scale-105 {liked
						? 'bg-red-500/40 text-white shadow-lg shadow-red-500/30'
						: 'bg-white/15 text-white hover:bg-white/25'}"
				>
					{liked ? '❤️' : '🤍'}
					{liked ? 'Liked' : 'Like'}
				</button>

				<button
					onclick={retry}
					class="flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-6 py-3 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/25"
				>
					🔄 Retry
				</button>

				<button
					onclick={next_question}
					class="flex items-center gap-2 rounded-xl border border-white/30 bg-white/25 px-8 py-3 font-semibold text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/35 hover:shadow-white/50 active:scale-95"
				>
					Next →
				</button>
			</div>
		</div>
	</div>
</div>
