<div class="absolute inset-0 -z-10" data-testid="animated-background">
	<div class="animate-gradient absolute inset-0"></div>

	<div
		class="animate-float absolute top-10 left-10 h-72 w-72 rounded-full bg-cyan-400 opacity-50 blur-3xl"
	></div>
	<div
		class="animate-float-reverse absolute top-40 right-20 h-96 w-96 rounded-full bg-yellow-300 opacity-40 blur-3xl"
	></div>
	<div
		class="animate-float-slow absolute bottom-20 left-1/3 h-80 w-80 rounded-full bg-green-400 opacity-50 blur-3xl"
	></div>

	<div class="absolute inset-0 opacity-40">
		<div class="stripe-pattern h-full w-full animate-pulse"></div>
	</div>
</div>

<style>
	/* Gradient rotation animation */
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

	/* Floating blob animations */
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

	/* Rotating gradient */
	.animate-gradient {
		background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
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

	.stripe-pattern {
		background: repeating-linear-gradient(
			45deg,
			transparent,
			transparent 50px,
			rgba(255, 255, 255, 0.1) 50px,
			rgba(255, 255, 255, 0.1) 100px
		);
	}
</style>
