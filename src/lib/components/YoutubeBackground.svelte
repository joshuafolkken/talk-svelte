<script lang="ts">
	interface Props {
		youtube_id?: string
	}

	let { youtube_id = 'dQw4w9WgXcQ' }: Props = $props()

	const youtube_url = `https://www.youtube.com/embed/${youtube_id}?autoplay=1&mute=1&loop=1&playlist=${youtube_id}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`
</script>

<div class="absolute inset-0 -z-10 overflow-hidden">
	<!-- YouTube背景 -->
	<div class="absolute inset-0">
		<!-- iframeを画面全体にフィット -->
		<iframe
			class="absolute top-1/2 left-1/2 h-[56.25vw] min-h-screen w-[177.77vh] min-w-full -translate-x-1/2 -translate-y-1/2"
			src={youtube_url}
			title="Background video"
			frameborder="0"
			allow="autoplay; encrypted-media"
			allowfullscreen
		></iframe>

		<!-- オーバーレイ（コンテンツを見やすくする） -->
		<div class="absolute inset-0 bg-black/40"></div>

		<!-- オプション：グラデーションオーバーレイ -->
		<div
			class="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20"
		></div>
	</div>
</div>

<style>
	/* 既存のアニメーション */
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

	.animate-gradient {
		animation: gradient-rotate 20s ease-in-out infinite;
	}

	/* iframeのポインターイベントを無効化（背景なのでクリック不可に） */
	iframe {
		pointer-events: none;
	}
</style>
