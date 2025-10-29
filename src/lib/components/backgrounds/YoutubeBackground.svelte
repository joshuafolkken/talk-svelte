<script lang="ts">
	interface Props {
		video_id?: string | undefined
		time?: string | undefined
	}

	// const { video_id = 'dQw4w9WgXcQ', time = '0' }: Props = $props()
	const { video_id = 'FWG3Dfss3Jc', time = '0' }: Props = $props() // cspell:disable-line
	const time_in_seconds = $state(time.endsWith('s') ? time.slice(0, -1) : time)
	let youtube_parameters = $state('')

	function update_youtube_parameters(): void {
		youtube_parameters = [
			'autoplay=1',
			'mute=1',
			'loop=1',
			`playlist=${video_id}`,
			'controls=0',
			'rel=0',
			'modestbranding=1',
			'playsinline=1',
			'enablejsapi=1',
			`start=${time_in_seconds}`,
		].join('&')
	}

	$effect(() => {
		update_youtube_parameters()
	})

	const youtube_url = $derived(`https://www.youtube.com/embed/${video_id}?${youtube_parameters}`)
</script>

<div class="fixed inset-0 -z-10 overflow-hidden">
	<div class="absolute inset-0">
		<iframe
			data-testid="youtube-background"
			class="absolute top-1/2 left-1/2 h-[56.25vw] min-h-screen w-[177.77vh] min-w-screen -translate-x-1/2 -translate-y-1/2"
			src={youtube_url}
			title="Background video"
			allow="autoplay; encrypted-media"
			allowfullscreen
			aria-hidden="true"
		></iframe>

		<div class="absolute inset-0 bg-black/40"></div>

		<div
			class="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20"
		></div>
	</div>
</div>

<style>
	/* Disable pointer events and remove border for background iframe */
	iframe {
		pointer-events: none;
		border: none;
	}
</style>
