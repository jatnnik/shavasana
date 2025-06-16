<script lang="ts">
  import yogaMat from '$lib/assets/yoga-mat.png';
  import * as Card from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import * as Resizable from '$lib/components/ui/resizable/';

  interface Weekday {
    label: string;
    youtubeUrls: string[];
  }

  let weekdays: Weekday[] = $state([
    {
      label: 'Montag',
      youtubeUrls: []
    },
    {
      label: 'Dienstag',
      youtubeUrls: []
    },
    {
      label: 'Mittwoch',
      youtubeUrls: []
    },
    {
      label: 'Donnerstag',
      youtubeUrls: []
    },
    {
      label: 'Freitag',
      youtubeUrls: []
    },
    {
      label: 'Samstag',
      youtubeUrls: []
    },
    {
      label: 'Sonntag',
      youtubeUrls: []
    }
  ]);

  function extractYouTubeId(url: string): string | null {
    try {
      const urlObj = new URL(url);

      // Handle youtu.be format
      if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1); // Remove leading slash
      }

      // Handle youtube.com formats
      if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
        // Standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
        if (urlObj.pathname === '/watch') {
          return urlObj.searchParams.get('v');
        }

        // Embed URL: https://www.youtube.com/embed/VIDEO_ID
        if (urlObj.pathname.startsWith('/embed/')) {
          return urlObj.pathname.split('/embed/')[1];
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  }
</script>

<Resizable.PaneGroup direction="vertical" class="!h-screen min-h-[200px]">
  <Resizable.Pane defaultSize={50} minSize={20}>
    <div class="h-full overflow-auto p-6">
      <header>
        <div class="flex items-center space-x-3">
          <div class="grid place-items-center rounded-lg bg-slate-200 p-1.5">
            <img
              src={yogaMat}
              alt="A skeumorphistic illustration of a blue yoga mat."
              height={24}
              width={24}
            />
          </div>
          <span class="font-medium">shavasana</span>
        </div>
      </header>

      <div class="mt-6 grid grid-cols-4 gap-3">
        {#each weekdays as weekday}
          <Card.Root class="w-full">
            <Card.Header>
              <Card.Title>{weekday.label}</Card.Title>
            </Card.Header>
            <Card.Content>
              <Input
                value={weekday.youtubeUrls.at(0)}
                placeholder="YouTube URL"
                onchange={(e) => (weekday.youtubeUrls[0] = e.currentTarget.value)}
              />
            </Card.Content>
          </Card.Root>
        {/each}
      </div>
    </div>
  </Resizable.Pane>

  <Resizable.Handle withHandle />

  <Resizable.Pane defaultSize={50} minSize={20}>
    <div class="grid grid-cols-4 gap-3 p-6">
      {#each weekdays as weekday}
        <div>
          <span class="font-medium">{weekday.label}</span>
          <div class="mt-2 aspect-video overflow-hidden rounded border bg-white/20 shadow-xs">
            {#if weekday.youtubeUrls[0]}
              <img
                src={`https://i.ytimg.com/vi/${extractYouTubeId(weekday.youtubeUrls[0])}/hqdefault.jpg`}
                alt=""
                class="aspect-video w-full object-cover"
              />
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </Resizable.Pane>
</Resizable.PaneGroup>
