<script>
	import { APP, JOSHUA_STUDIO } from '$lib/constants/app'
</script>

<div
	class="fixed right-2 bottom-2 rounded-md bg-black/30 px-2 py-1 text-xs text-white/60 transition duration-300 select-none hover:bg-black/70 hover:text-white/90"
	role="presentation"
	aria-hidden="true"
>
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a href={APP.GITHUB_URL} target="_blank">
		{APP.NAME} v{APP.VERSION} &copy; {JOSHUA_STUDIO.NAME}
	</a>
</div>
