<script lang="ts">
  import html2canvas from "html2canvas-pro";
  import { extractYouTubeId } from "../lib/extractYoutubeId";
  import ExportButton from "./ExportButton.svelte";
  import TrashIcon from "./TrashIcon.svelte";

  interface Day {
    label: string;
    videos: string[];
    youtubeThumbnailUrls: string[];
  }

  let days: Day[] = $state([
    {
      label: "Montag",
      videos: [],
      youtubeThumbnailUrls: [],
    },
    {
      label: "Dienstag",
      videos: [],
      youtubeThumbnailUrls: [],
    },
    {
      label: "Mittwoch",
      videos: [],
      youtubeThumbnailUrls: [],
    },
    {
      label: "Donnerstag",
      videos: [],
      youtubeThumbnailUrls: [],
    },
    {
      label: "Freitag",
      videos: [],
      youtubeThumbnailUrls: [],
    },
    {
      label: "Samstag",
      videos: [],
      youtubeThumbnailUrls: [],
    },
    {
      label: "Sonntag",
      videos: [],
      youtubeThumbnailUrls: [],
    },
  ]);

  let canGenerate = $derived(
    days.some((d) => d.videos.filter(Boolean).length > 0),
  );
  let isGenerating = $state(false);

  let illustrations = [
    "fitness.png",
    "grass.png",
    "relaxation.png",
    "skateboard.png",
    "stars.png",
    "workout.png",
  ];

  function removeVideo(dayIndex: number, videoIndex: number) {
    const youtubeId = extractYouTubeId(days[dayIndex].videos[videoIndex]);
    if (youtubeId) {
      days[dayIndex].youtubeThumbnailUrls = days[
        dayIndex
      ].youtubeThumbnailUrls.filter((url) => !url.includes(youtubeId));
    }
    days[dayIndex].videos.splice(videoIndex, 1);
  }

  async function generateCover() {
    isGenerating = true;

    // Add thumbnail urls
    days = days.map((d) => ({
      ...d,
      youtubeThumbnailUrls: d.videos
        .map((v) => {
          const youtubeId = extractYouTubeId(v);
          if (!youtubeId) return null;
          return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
        })
        .filter((ytu) => ytu !== null),
    }));

    await new Promise((resolve) => setTimeout(resolve, 1000));

    html2canvas(document.querySelector("#capture") as HTMLElement, {
      useCORS: true,
      width: 2560,
      height: 1440,
    }).then((canvas) => {
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/jpeg");
      a.download = "playlist-cover.jpeg";
      a.click();
    });

    isGenerating = false;
  }

  function init(el: HTMLElement) {
    el.focus();
  }
</script>

<div class="grid grid-cols-1 items-start gap-4 pb-24 md:grid-cols-2">
  {#each days as day, dayIndex}
    <div
      class="border-border space-y-4 rounded-xl bg-white p-4 text-sm shadow"
      id={day.label.toLowerCase()}
    >
      <div>
        <span class="leading-none font-medium">{day.label}</span>
      </div>
      <div>
        <div class="space-y-3">
          {#each day.videos as video, videoIndex}
            <div class="flex items-center gap-2">
              <input
                type="text"
                bind:value={day.videos[videoIndex]}
                placeholder="YouTube URL"
                class="h-9 w-full rounded-md border border-zinc-400 px-3 text-base"
                use:init
              />
              <button
                aria-label="Löschen"
                class="cursor-pointer text-rose-700 [&>svg]:size-5"
                onclick={() => removeVideo(dayIndex, videoIndex)}
              >
                <TrashIcon />
              </button>
            </div>
          {/each}
        </div>
      </div>
      <div>
        <button
          class="bg-feather-400 rounded-md px-2 py-1 text-sm font-medium text-white"
          onclick={() => {
            day.videos.push("");
          }}>Hinzufügen</button
        >
      </div>
    </div>
  {/each}
</div>

{#if isGenerating}
  <div
    id="capture"
    class="relative h-[1440px] w-[2560px] border bg-[#FDF2E8] p-20 font-mono"
  >
    <div class="grid grid-cols-4 gap-x-12 gap-y-48">
      {#each days as day}
        <div>
          <h2 class="mb-8 text-2xl font-bold text-[#c27a4f]">{day.label}</h2>
          <div class="grid grid-cols-2 gap-4">
            {#each day.youtubeThumbnailUrls as thumbnailUrl}
              <img src={thumbnailUrl} alt="" />
            {/each}
          </div>
        </div>
      {/each}
    </div>

    <!-- Pick a random illustration -->
    <img
      src={`/illustrations/${illustrations[(illustrations.length * Math.random()) | 0]}`}
      alt=""
      class="absolute right-20 bottom-20 w-[500px]"
    />
  </div>
{/if}

<ExportButton
  onclick={generateCover}
  aria-busy={isGenerating}
  disabled={isGenerating || !canGenerate}
>
  {#if isGenerating}
    <div role="status">
      <svg
        aria-hidden="true"
        class="size-4 animate-spin fill-sky-700 text-white"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span class="sr-only">Loading...</span>
    </div>
  {/if}
  <span>Cover erstellen</span>
</ExportButton>
