<script>
	import { APP, AUTHOR } from '$lib/constants/app'
</script>

<div
	class="rounded-md px-2 py-0.5 text-2xl text-[11px] text-white/50 drop-shadow-sm transition duration-1000 select-none hover:bg-black/20 hover:text-white/90"
	role="presentation"
	aria-hidden="true"
>
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a href={AUTHOR.WEBSITE_URL} target="_blank">
		{APP.NAME} v{APP.VERSION} &copy; {AUTHOR.NAME}
	</a>
</div>
