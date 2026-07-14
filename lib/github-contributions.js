const GITHUB_PROFILE_ORIGIN = "https://github.com";

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&#39;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

export function parseGitHubContributions(html) {
  const totalMatch = html.match(/<h2[^>]*id="js-contribution-activity-description"[^>]*>[\s\S]*?([\d,]+)\s+contributions/i);
  const total = totalMatch ? Number(totalMatch[1].replaceAll(",", "")) : 0;
  const days = [];
  const dayPattern = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="([0-4])"[^>]*>[\s\S]*?<tool-tip[^>]*>([^<]+)<\/tool-tip>/g;

  for (const match of html.matchAll(dayPattern)) {
    const label = decodeHtml(match[3].trim());
    const countMatch = label.match(/([\d,]+) contributions?/i);

    days.push({
      date: match[1],
      level: Number(match[2]),
      count: countMatch ? Number(countMatch[1].replaceAll(",", "")) : 0,
      label,
    });
  }

  if (!days.length) {
    throw new Error("GitHub returned an unreadable contribution calendar.");
  }

  days.sort((a, b) => a.date.localeCompare(b.date));

  return { total, days };
}

export async function fetchGitHubContributions(username) {
  const response = await fetch(`${GITHUB_PROFILE_ORIGIN}/users/${encodeURIComponent(username)}/contributions`, {
    headers: {
      Accept: "text/html",
      "User-Agent": "Soham-Kamat-Portfolio",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub contribution request failed with ${response.status}.`);
  }

  const activity = parseGitHubContributions(await response.text());
  return {
    ...activity,
    fetchedAt: new Date().toISOString(),
  };
}
