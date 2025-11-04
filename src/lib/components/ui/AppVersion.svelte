<script>
	import { APP, JOSHUA_STUDIO } from '$lib/constants/app'
</script>

<div
	class="fixed right-2 bottom-2 text-xs text-gray-400/50 transition duration-300 select-none hover:text-gray-400"
>
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a href={APP.GITHUB_URL} target="_blank">
		{APP.NAME} v{APP.VERSION} &copy; {JOSHUA_STUDIO.NAME}
	</a>
</div>
