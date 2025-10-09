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

<div class="relative min-h-screen overflow-hidden px-4 py-12">
	<!-- Background with vibrant colors and ANIMATION -->
	<div class="absolute inset-0 -z-10">
		<!-- アニメーションするグラデーション背景 -->
		<div
			class="animate-gradient absolute inset-0"
			style="background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab); background-size: 400% 400%;"
		></div>

		<!-- 浮遊するブロブ（それぞれ異なるアニメーション） -->
		<div
			class="animate-float absolute top-10 left-10 h-72 w-72 rounded-full bg-cyan-400 opacity-50 blur-3xl"
		></div>
		<div
			class="animate-float-reverse absolute top-40 right-20 h-96 w-96 rounded-full bg-yellow-300 opacity-40 blur-3xl"
		></div>
		<div
			class="animate-float-slow absolute bottom-20 left-1/3 h-80 w-80 rounded-full bg-green-400 opacity-50 blur-3xl"
		></div>

		<!-- 動く縞模様パターン -->
		<div class="absolute inset-0 opacity-40">
			<div
				class="h-full w-full animate-pulse"
				style="background: repeating-linear-gradient(
				45deg,
				transparent,
				transparent 50px,
				rgba(255,255,255,0.1) 50px,
				rgba(255,255,255,0.1) 100px
			);"
			></div>
		</div>
	</div>

	<div class="mx-auto max-w-xl">
		<!-- Progress Bar -->
		<div class="mb-12">
			<div class="mb-3 flex items-center justify-between">
				<h1
					class="text-3xl font-bold tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
				>
					Talk
				</h1>
				<span class="text-sm font-bold text-white drop-shadow-md"
					>{current_question} / {total_questions}</span
				>
			</div>
			<div
				class="h-2 overflow-hidden rounded-full border border-white/40 shadow-xl"
				style="background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px);"
			>
				<div
					class="h-full rounded-full bg-white shadow-lg transition-all duration-500"
					style="width: {(current_question / total_questions) * 100}%"
				></div>
			</div>
		</div>

		<!-- Main Card with STRONG Glass Effect -->
		<div
			class="overflow-hidden rounded-3xl border-2 border-white/40 shadow-2xl"
			style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px) saturate(180%);"
		>
			<!-- Audio Section-->
			<div class="border-b border-white/25 p-12" style="background: rgba(255, 255, 255, 0.05);">
				<h2
					class="mb-8 text-center text-sm font-bold tracking-widest text-white uppercase drop-shadow-md"
				>
					Listen
				</h2>
				<div class="mb-8 flex justify-center">
					<button
						onclick={play_audio}
						class="group relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/50 text-white shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95"
						style="background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px);"
					>
						<svg class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
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
					class="mb-4 w-full rounded-xl border-2 p-5 text-center shadow-lg transition-all duration-300 {show_transcript
						? 'border-white/60 text-white'
						: 'border-white/30 text-white/90 hover:border-white/50'}"
					style="background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px);"
				>
					{#if show_transcript}
						<span class="text-base font-bold drop-shadow">{question.transcript}</span>
					{:else}
						<div class="flex items-center justify-center gap-2">
							<span class="text-sm font-semibold">Transcript</span>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
					class="w-full rounded-xl border-2 p-5 text-center shadow-lg transition-all duration-300 {show_translation
						? 'border-white/60 text-white'
						: 'border-white/30 text-white/90 hover:border-white/50'}"
					style="background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px);"
				>
					{#if show_translation}
						<span class="text-base font-bold drop-shadow">{question.translation}</span>
					{:else}
						<div class="flex items-center justify-center gap-2">
							<span class="text-sm font-semibold">Translation</span>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
			<div class="border-b border-white/25 p-12" style="background: rgba(255, 255, 255, 0.05);">
				<h3
					class="mb-8 text-center text-sm font-bold tracking-widest text-white uppercase drop-shadow-md"
				>
					Speak
				</h3>
				<div class="flex flex-col items-center gap-6">
					<button
						onclick={toggle_recording}
						class="flex h-20 w-20 items-center justify-center rounded-full shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 {is_recording
							? 'border-2 border-red-300/60 bg-red-500 text-white'
							: 'border-2 border-white/50 text-white'}"
						style={is_recording
							? ''
							: 'background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px);'}
					>
						<svg class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
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
						class="w-full rounded-xl border-2 p-5 text-center shadow-lg transition-all duration-300 {user_transcript
							? 'border-white/60 text-white'
							: 'border-white/30 text-white/90'}"
						style="background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px);"
					>
						<span class="text-base font-semibold drop-shadow"
							>{user_transcript ? user_transcript : 'Your Speech'}</span
						>
					</div>
				</div>
			</div>

			<!-- Action Buttons -->
			<div
				class="flex flex-wrap items-center justify-center gap-3 p-8"
				style="background: rgba(255, 255, 255, 0.05);"
			>
				<button
					onclick={toggle_like}
					class="flex items-center gap-2 rounded-full border-2 px-6 py-2.5 text-sm font-bold shadow-xl transition-all hover:scale-105 {liked
						? 'border-red-300/60 bg-red-500 text-white'
						: 'border-white/40 text-white hover:border-white/60'}"
					style={liked ? '' : 'background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px);'}
				>
					<svg
						class="h-4 w-4"
						fill={liked ? 'currentColor' : 'none'}
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
						/>
					</svg>
					{liked ? 'Liked' : 'Like'}
				</button>

				<button
					onclick={retry}
					class="flex items-center gap-2 rounded-full border-2 border-white/40 px-6 py-2.5 text-sm font-bold text-white shadow-xl transition-all hover:scale-105 hover:border-white/60"
					style="background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px);"
				>
					<svg
						class="h-4 w-4"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
						/>
					</svg>
					Retry
				</button>

				<button
					onclick={next_question}
					class="flex items-center gap-2 rounded-full border-2 border-white/60 px-8 py-2.5 text-sm font-bold text-white shadow-xl transition-all hover:scale-105 hover:border-white/80 active:scale-95"
					style="background: rgba(255, 255, 255, 0.25); backdrop-filter: blur(10px);"
				>
					Next
					<svg
						class="h-4 w-4"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
					</svg>
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	/* グラデーション回転アニメーション */
	@keyframes gradient-rotate {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	/* ブロブが浮遊するアニメーション */
	@keyframes float {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
		}
		33% {
			transform: translate(30px, -30px) scale(1.1);
		}
		66% {
			transform: translate(-20px, 20px) scale(0.9);
		}
	}

	@keyframes float-reverse {
		0%,
		100% {
			transform: translate(0, 0) rotate(0deg);
		}
		50% {
			transform: translate(-40px, 40px) rotate(180deg);
		}
	}

	@keyframes float-slow {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
		}
		50% {
			transform: translate(20px, -40px) scale(1.15);
		}
	}

	/* 回転するグラデーション */
	.animate-gradient {
		background-size: 400% 400%;
		animation: gradient-rotate 15s ease infinite;
	}

	.animate-float {
		animation: float 20s ease-in-out infinite;
	}

	.animate-float-reverse {
		animation: float-reverse 25s ease-in-out infinite;
	}

	.animate-float-slow {
		animation: float-slow 30s ease-in-out infinite;
	}
</style>
