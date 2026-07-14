import { fetchGitHubContributions } from "../lib/github-contributions.js";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed." });
  }

  try {
    const activity = await fetchGitHubContributions("sohamkamat28");
    response.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return response.status(200).json(activity);
  } catch (error) {
    response.setHeader("Cache-Control", "no-store");
    return response.status(502).json({
      error: error instanceof Error ? error.message : "GitHub activity is temporarily unavailable.",
    });
  }
}
