export function extractYouTubeId(url: string): string | null {
  try {
    const urlObj = new URL(url);

    // Handle youtu.be format
    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.slice(1);
    }

    // Handle youtube.com formats
    if (
      urlObj.hostname === "www.youtube.com" ||
      urlObj.hostname === "youtube.com"
    ) {
      // Standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
      if (urlObj.pathname === "/watch") {
        return urlObj.searchParams.get("v");
      }

      // Embed URL: https://www.youtube.com/embed/VIDEO_ID
      if (urlObj.pathname.startsWith("/embed/")) {
        return urlObj.pathname.split("/embed/")[1];
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}
