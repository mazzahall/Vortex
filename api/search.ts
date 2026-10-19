import type { VercelRequest, VercelResponse } from "@vercel/node";

interface YouTubeItem {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails?: { medium?: { url: string }; default?: { url: string } };
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const q = String(req.query.q ?? "").trim();
  if (!q) return res.status(400).json({ error: "Missing query 'q'" });

  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "YOUTUBE_API_KEY belum di-set di Vercel" });
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.search = new URLSearchParams({
    part: "snippet",
    type: "video",
    videoCategoryId: "10", // kategori Music
    maxResults: "20",
    q,
    key,
  }).toString();

  try {
    const r = await fetch(url);
    const data = await r.json();

    if (!r.ok) {
      return res
        .status(r.status)
        .json({ error: data?.error?.message ?? "YouTube API error" });
    }

    const results = ((data.items ?? []) as YouTubeItem[]).map((i) => ({
      id: i.id.videoId,
      title: i.snippet.title,
      channel: i.snippet.channelTitle,
      thumbnail:
        i.snippet.thumbnails?.medium?.url ?? i.snippet.thumbnails?.default?.url ?? "",
    }));

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    return res.status(200).json(results);
  } catch {
    return res.status(500).json({ error: "Search failed" });
  }
}