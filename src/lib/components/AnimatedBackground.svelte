<!-- Enhanced Liquid Glass Background with smooth animations -->
<div class="absolute inset-0 -z-10 overflow-hidden">
	<!-- グラデーション背景 -->
	<div
		class="animate-gradient absolute inset-0"
		style="background: linear-gradient(-45deg, 
			#667eea 0%, 
			#764ba2 25%, 
			#f093fb 50%, 
			#4facfe 75%, 
			#00f2fe 100%
		); background-size: 400% 400%;"
	></div>

	<!-- メッシュグラデーションオーバーレイ -->
	<div
		class="absolute inset-0 opacity-40"
		style="background: radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%),
			radial-gradient(circle at 80% 80%, rgba(255, 103, 132, 0.3), transparent 50%),
			radial-gradient(circle at 40% 20%, rgba(79, 172, 254, 0.3), transparent 50%);"
	></div>

	<!-- 浮遊するブロブ（より柔らかい動き） -->
	<div
		class="animate-float absolute -top-20 -left-20 h-96 w-96 rounded-full opacity-30 blur-[100px]"
		style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"
	></div>
	<div
		class="animate-float-reverse absolute top-1/3 -right-32 h-[500px] w-[500px] rounded-full opacity-25 blur-[120px]"
		style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);"
	></div>
	<div
		class="animate-float-slow absolute -bottom-32 left-1/4 h-[450px] w-[450px] rounded-full opacity-30 blur-[100px]"
		style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);"
	></div>

	<!-- ノイズテクスチャ（より微妙に） -->
	<div
		class="absolute inset-0 opacity-[0.015]"
		style="background-image: url('data:image/svg+xml,%3Csvg viewBox=&quot;0 0 200 200&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cfilter id=&quot;noiseFilter&quot;%3E%3CfeTurbulence type=&quot;fractalNoise&quot; baseFrequency=&quot;0.65&quot; numOctaves=&quot;3&quot; stitchTiles=&quot;stitch&quot;/%3E%3C/filter%3E%3Crect width=&quot;100%25&quot; height=&quot;100%25&quot; filter=&quot;url(%23noiseFilter)&quot;/%3E%3C/svg%3E');"
	></div>
</div>

<style>
	/* より滑らかなグラデーションアニメーション */
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

	/* より自然な浮遊アニメーション */
	@keyframes float {
		0%,
		100% {
			transform: translate(0, 0) scale(1) rotate(0deg);
		}
		33% {
			transform: translate(40px, -40px) scale(1.1) rotate(5deg);
		}
		66% {
			transform: translate(-30px, 30px) scale(0.95) rotate(-5deg);
		}
	}

	@keyframes float-reverse {
		0%,
		100% {
			transform: translate(0, 0) scale(1) rotate(0deg);
		}
		50% {
			transform: translate(-50px, 50px) scale(1.15) rotate(10deg);
		}
	}

	@keyframes float-slow {
		0%,
		100% {
			transform: translate(0, 0) scale(1) rotate(0deg);
		}
		50% {
			transform: translate(30px, -50px) scale(1.2) rotate(-8deg);
		}
	}

	.animate-gradient {
		animation: gradient-rotate 20s ease-in-out infinite;
	}

	.animate-float {
		animation: float 25s ease-in-out infinite;
	}

	.animate-float-reverse {
		animation: float-reverse 30s ease-in-out infinite;
	}

	.animate-float-slow {
		animation: float-slow 35s ease-in-out infinite;
	}
</style>
