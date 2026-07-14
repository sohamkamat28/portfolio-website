import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fetchGitHubContributions } from "./lib/github-contributions.js";

function githubContributionsApi() {
  return {
    name: "github-contributions-api",
    configureServer(server) {
      server.middlewares.use("/api/github-contributions", async (_request, response) => {
        try {
          const activity = await fetchGitHubContributions("sohamkamat28");
          response.statusCode = 200;
          response.setHeader("Content-Type", "application/json; charset=utf-8");
          response.setHeader("Cache-Control", "no-store");
          response.end(JSON.stringify(activity));
        } catch (error) {
          response.statusCode = 502;
          response.setHeader("Content-Type", "application/json; charset=utf-8");
          response.end(JSON.stringify({
            error: error instanceof Error ? error.message : "GitHub activity is temporarily unavailable.",
          }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), githubContributionsApi()],
});
