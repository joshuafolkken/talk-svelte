<script lang="ts">
	import './glass-style.css';
	let { children } = $props();
</script>

<div class="glass-wrap m-1">
	<button class="glass">
		{@render children?.()}
	</button>
	<div class="glass-shadow"></div>
</div>
