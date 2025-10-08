<script lang="ts">
	let current_question = 1;
	let total_questions = 10;
	let is_playing = false;

	let audio_element: HTMLAudioElement;

	function play_audio(): void {
		if (!audio_element) return;

		audio_element.play();
		is_playing = true;
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
	<div class="mx-auto max-w-2xl">
		<!-- Progress Bar -->
		<div class="mb-8">
			<div class="mb-2 flex items-center justify-between text-sm font-medium text-gray-700">
				<span>Progress</span>
				<span>Question {current_question} of {total_questions}</span>
			</div>
			<div class="h-3 overflow-hidden rounded-full bg-gray-200">
				<div
					class="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
					style="width: {(current_question / total_questions) * 100}%"
				></div>
			</div>
		</div>

		<!-- Main Card -->
		<div class="overflow-hidden rounded-2xl bg-white shadow-xl">
			<!-- Audio Section-->
			<div class="border-b border-gray-100 bg-gradient-to-br from-indigo-50 to-blue-50 p-8">
				<h2 class="mb-6 text-center text-2xl font-bold text-gray-800">🔊 Listen to the Audio</h2>
				<div class="flex justify-center">
					<button
						onclick={play_audio}
						class="group relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
					>
						<svg class="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
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
					src="https://www.springin.org/wp-content/uploads/2022/07/%E5%A4%A7%E6%AD%A3%E8%A7%A32.mp3"
					onended={() => (is_playing = false)}
				></audio>
			</div>
		</div>
	</div>
</div>
