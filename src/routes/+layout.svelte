<script lang="ts">
  import '../app.css';

  let { children } = $props();
</script>

<svelte:head>
  <title>Shavasana</title>
</svelte:head>

{@render children()}
