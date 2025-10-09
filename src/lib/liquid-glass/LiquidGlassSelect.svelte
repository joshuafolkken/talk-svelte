<script lang="ts">
	import './glass-style.css';
	let { children } = $props();
</script>

<div class="glass-wrap m-1">
	<div class="glass-select-wrapper">
		<select class="glass">
			{@render children?.()}
		</select>
		<div class="glass-overlay"></div>
		<div class="glass-border"></div>
	</div>
	<div class="glass-shadow"></div>
</div>
