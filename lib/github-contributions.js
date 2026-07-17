const GITHUB_PROFILE_ORIGIN = "https://github.com";
const GITHUB_API_ORIGIN = "https://api.github.com";

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

function contributionEventDate(event) {
  if (!event?.created_at) return null;

  const countsAsContribution =
    (event.type === "PullRequestEvent" && event.payload?.action === "opened")
    || (event.type === "IssuesEvent" && event.payload?.action === "opened")
    || (event.type === "PullRequestReviewEvent" && event.payload?.action === "created")
    || (event.type === "DiscussionEvent" && event.payload?.action === "created");

  return countsAsContribution ? event.created_at.slice(0, 10) : null;
}

export function parseGitHubContributionEvents(events) {
  const contributionCounts = new Map();
  const seenEvents = new Set();

  for (const event of Array.isArray(events) ? events : []) {
    if (!event?.id || seenEvents.has(event.id)) continue;
    seenEvents.add(event.id);

    const date = contributionEventDate(event);
    if (date) contributionCounts.set(date, (contributionCounts.get(date) ?? 0) + 1);
  }

  return contributionCounts;
}

function contributionLevelForCount(count, calendarDays) {
  if (count <= 0) return 0;

  const maximumByLevel = new Map();
  for (const day of calendarDays) {
    if (day.level > 0) {
      maximumByLevel.set(day.level, Math.max(maximumByLevel.get(day.level) ?? 0, day.count));
    }
  }

  for (let level = 1; level <= 4; level += 1) {
    const maximum = maximumByLevel.get(level);
    if (maximum && count <= maximum) return level;
  }

  return 4;
}

function contributionLabel(date, count) {
  const formattedDate = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));

  return `${count === 1 ? "1 contribution" : `${count} contributions`} on ${formattedDate}.`;
}

export function reconcileGitHubActivity(activity, events) {
  const eventCounts = parseGitHubContributionEvents(events);
  let total = activity.total;

  const days = activity.days.map((day) => {
    const eventCount = eventCounts.get(day.date) ?? 0;
    if (eventCount <= day.count) return day;

    total += eventCount - day.count;
    return {
      ...day,
      count: eventCount,
      level: contributionLevelForCount(eventCount, activity.days),
      label: contributionLabel(day.date, eventCount),
    };
  });

  return { total, days };
}

async function fetchGitHubPublicEvents(username) {
  const response = await fetch(`${GITHUB_API_ORIGIN}/users/${encodeURIComponent(username)}/events/public?per_page=100`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "Soham-Kamat-Portfolio",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub event request failed with ${response.status}.`);
  }

  return response.json();
}

export async function fetchGitHubContributions(username) {
  const [calendarResponse, eventsResult] = await Promise.all([
    fetch(`${GITHUB_PROFILE_ORIGIN}/users/${encodeURIComponent(username)}/contributions`, {
      headers: {
        Accept: "text/html",
        "User-Agent": "Soham-Kamat-Portfolio",
      },
    }),
    fetchGitHubPublicEvents(username).catch(() => []),
  ]);

  if (!calendarResponse.ok) {
    throw new Error(`GitHub contribution request failed with ${calendarResponse.status}.`);
  }

  const calendar = parseGitHubContributions(await calendarResponse.text());
  const activity = reconcileGitHubActivity(calendar, eventsResult);
  return {
    ...activity,
    fetchedAt: new Date().toISOString(),
  };
}
