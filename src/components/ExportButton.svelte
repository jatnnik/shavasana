<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  let props: HTMLButtonAttributes = $props();
</script>

<button
  {...props}
  class={[
    "fixed bottom-8 left-1/2 inline-flex -translate-x-1/2 cursor-pointer items-center space-x-2 rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white shadow-xl transition-colors hover:bg-sky-700 disabled:bg-sky-700",
    props.class,
  ]}
>
  {@render props.children?.()}
</button>
