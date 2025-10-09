<script lang="ts">
	// import { onMount } from 'svelte';

	// State management
	let currentQuestion = 1
	let totalQuestions = 10
	let showTranscript = false
	let showTranslation = false
	let isPlaying = false
	let isRecording = false
	let hasRecording = false
	let userTranscript = 'Yay!'
	let liked = false

	// Audio elements
	let audioElement: HTMLAudioElement
	let recordedAudio: HTMLAudioElement
	let mediaRecorder: MediaRecorder
	let audioChunks: Blob[] = []

	// Sample data (replace with real data)
	const questionData = {
		audioUrl: '/audio/question-1.mp3',
		transcript: 'How are you doing today?',
		translation: '今日の調子はどうですか？',
	}

	// Play audio
	function playAudio() {
		if (audioElement) {
			audioElement.play()
			isPlaying = true
		}
	}

	// Toggle transcript
	function toggleTranscript() {
		showTranscript = !showTranscript
	}

	// Toggle translation
	function toggleTranslation() {
		showTranslation = !showTranslation
	}

	// Start/stop recording
	async function toggleRecording() {
		if (!isRecording) {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
				mediaRecorder = new MediaRecorder(stream)
				audioChunks = []

				mediaRecorder.ondataavailable = (event) => {
					audioChunks.push(event.data)
				}

				mediaRecorder.onstop = () => {
					const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
					const audioUrl = URL.createObjectURL(audioBlob)
					recordedAudio = new Audio(audioUrl)
					hasRecording = true
					// TODO: Send to speech recognition API
				}

				mediaRecorder.start()
				isRecording = true
			} catch (error) {
				console.error('Error accessing microphone:', error)
			}
		} else {
			mediaRecorder.stop()
			isRecording = false
		}
	}

	// Play recorded audio
	function playRecording() {
		if (recordedAudio) {
			recordedAudio.play()
		}
	}

	// Toggle like
	function toggleLike() {
		liked = !liked
	}

	// Retry question
	function retry() {
		showTranscript = false
		showTranslation = false
		hasRecording = false
		userTranscript = ''
	}

	// Next question
	function nextQuestion() {
		if (currentQuestion < totalQuestions) {
			currentQuestion++
			retry()
		}
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
	<div class="mx-auto max-w-2xl">
		<!-- Progress Bar -->
		<div class="mb-8">
			<div class="mb-2 flex items-center justify-between text-sm font-medium text-gray-700">
				<span>Progress</span>
				<span>Question {currentQuestion} of {totalQuestions}</span>
			</div>
			<div class="h-3 overflow-hidden rounded-full bg-gray-200">
				<div
					class="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
					style="width: {(currentQuestion / totalQuestions) * 100}%"
				></div>
			</div>
		</div>

		<!-- Main Card -->
		<div class="overflow-hidden rounded-2xl bg-white shadow-xl">
			<!-- Audio Section -->
			<div class="border-b border-gray-100 bg-gradient-to-br from-indigo-50 to-blue-50 p-8">
				<h2 class="mb-6 text-center text-2xl font-bold text-gray-800">🔊 Listen to the Audio</h2>
				<div class="flex justify-center">
					<button
						onclick={playAudio}
						class="group relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
					>
						<svg class="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
							{#if isPlaying}
								<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
							{:else}
								<path d="M8 5v14l11-7z" />
							{/if}
						</svg>
					</button>
				</div>
				<audio
					bind:this={audioElement}
					src={questionData.audioUrl}
					onended={() => (isPlaying = false)}
				></audio>
			</div>

			<!-- Transcript Section -->
			<div class="border-b border-gray-100 p-6">
				<button
					onclick={toggleTranscript}
					class="w-full rounded-lg bg-gray-50 p-4 text-left transition-colors hover:bg-gray-100"
				>
					<div class="flex items-center justify-between">
						<span class="font-semibold text-gray-800">
							📝 Transcript {showTranscript ? '(Hide)' : '(Click to show)'}
						</span>
						<svg
							class="h-5 w-5 text-gray-600 transition-transform {showTranscript
								? 'rotate-180'
								: ''}"
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
				</button>
				{#if showTranscript}
					<div class="mt-4 rounded-lg bg-blue-50 p-4 text-lg text-gray-800">
						"{questionData.transcript}"
					</div>
				{/if}
			</div>

			<!-- Translation Section -->
			<div class="border-b border-gray-100 p-6">
				<button
					onclick={toggleTranslation}
					class="w-full rounded-lg bg-gray-50 p-4 text-left transition-colors hover:bg-gray-100"
				>
					<div class="flex items-center justify-between">
						<span class="font-semibold text-gray-800">
							🌐 Translation {showTranslation ? '(Hide)' : '(Click to show)'}
						</span>
						<svg
							class="h-5 w-5 text-gray-600 transition-transform {showTranslation
								? 'rotate-180'
								: ''}"
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
				</button>
				{#if showTranslation}
					<div class="mt-4 rounded-lg bg-green-50 p-4 text-lg text-gray-800">
						{questionData.translation}
					</div>
				{/if}
			</div>

			<!-- Recording Section -->
			<div class="border-b border-gray-100 bg-gradient-to-br from-purple-50 to-pink-50 p-8">
				<h3 class="mb-4 text-center text-xl font-bold text-gray-800">🎤 Your Response</h3>
				<div class="flex flex-col items-center gap-4">
					<button
						onclick={toggleRecording}
						class="flex h-20 w-20 items-center justify-center rounded-full transition-all duration-200 {isRecording
							? 'animate-pulse bg-red-500 hover:bg-red-600'
							: 'bg-gradient-to-br from-purple-500 to-pink-600 hover:scale-105'} text-white shadow-lg hover:shadow-xl active:scale-95"
					>
						<svg class="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
							{#if isRecording}
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
					<span class="text-sm font-medium text-gray-700">
						{isRecording ? 'Recording... (Click to stop)' : 'Click to record'}
					</span>

					{#if hasRecording}
						<button
							onclick={playRecording}
							class="mt-2 flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-purple-600 shadow transition-colors hover:bg-purple-50"
						>
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M8 5v14l11-7z" />
							</svg>
							Play your recording
						</button>
					{/if}

					{#if userTranscript}
						<div class="mt-4 w-full rounded-lg bg-white p-4 text-gray-800">
							<p class="mb-1 text-sm font-medium text-gray-600">Your speech:</p>
							<p class="text-lg">"{userTranscript}"</p>
						</div>
					{/if}
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex flex-wrap items-center justify-center gap-3 p-6">
				<button
					onclick={toggleLike}
					class="flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all {liked
						? 'bg-red-500 text-white hover:bg-red-600'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
				>
					{liked ? '❤️' : '🤍'}
					{liked ? 'Liked' : 'Like'}
				</button>

				<button
					onclick={retry}
					class="flex items-center gap-2 rounded-lg bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-200"
				>
					🔄 Retry
				</button>

				<button
					onclick={nextQuestion}
					class="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
				>
					Next Question →
				</button>
			</div>
		</div>

		<!-- Tips Section (Optional) -->
		<div class="mt-6 rounded-xl bg-white/80 p-6 shadow">
			<h4 class="mb-2 font-bold text-gray-800">💡 Tips:</h4>
			<ul class="space-y-1 text-sm text-gray-600">
				<li>• Listen to the audio as many times as you need</li>
				<li>• Try to repeat what you hear before checking the transcript</li>
				<li>• Record your pronunciation and compare with the original</li>
			</ul>
		</div>
	</div>
</div>
