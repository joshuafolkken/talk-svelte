<script lang="ts">
	interface Props {
		video_id?: string | undefined
		time?: string | undefined
	}

	const { video_id = 'dQw4w9WgXcQ', time = '0' }: Props = $props()
	const time_in_seconds = time.endsWith('s') ? time.slice(0, -1) : time

	const youtube_params = [
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

	const youtube_url = `https://www.youtube.com/embed/${video_id}?${youtube_params}`
</script>

<div class="fixed inset-0 -z-10 overflow-hidden">
	<div class="absolute inset-0">
		<iframe
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
