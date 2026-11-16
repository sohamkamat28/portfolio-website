import { useEffect, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react/ArrowUpRight";
import { profile } from "./content";

const monthFormatter = new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC" });

function toUtcDate(date) {
  return new Date(`${date}T00:00:00Z`);
}

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function buildContributionWeeks(days) {
  if (!days.length) return [];

  const orderedDays = [...days].sort((left, right) => left.date.localeCompare(right.date));
  const contributionByDate = new Map(orderedDays.map((day) => [day.date, day]));
  const start = toUtcDate(orderedDays[0].date);
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());

  const end = toUtcDate(orderedDays.at(-1).date);
  end.setUTCDate(end.getUTCDate() + (6 - end.getUTCDay()));

  const weeks = [];
  for (const cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 7)) {
    const week = [];
    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const date = new Date(cursor);
      date.setUTCDate(date.getUTCDate() + dayIndex);
      week.push(contributionByDate.get(toDateKey(date)) ?? null);
    }
    weeks.push(week);
  }

  return weeks;
}

export default function GitHubActivity() {
  const [activity, setActivity] = useState({ status: "loading", total: 0, days: [] });
  const profileUrl = profile.github;
  const weeks = buildContributionWeeks(activity.days);

  useEffect(() => {
    const controller = new AbortController();

    const loadActivity = async () => {
      try {
        const refreshWindow = Math.floor(Date.now() / 300000);
        const response = await fetch(`/api/github-contributions?refresh=${refreshWindow}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("GitHub activity request failed.");
        const nextActivity = await response.json();
        if (!Array.isArray(nextActivity.days) || !nextActivity.days.length || !Number.isFinite(nextActivity.total)) {
          throw new Error("GitHub activity response was empty.");
        }
        setActivity({ status: "ready", total: nextActivity.total, days: nextActivity.days });
      } catch (error) {
        if (error.name !== "AbortError") {
          setActivity((current) => ({ ...current, status: "error" }));
        }
      }
    };

    loadActivity();
    const refreshTimer = window.setInterval(loadActivity, 300000);

    return () => {
      controller.abort();
      window.clearInterval(refreshTimer);
    };
  }, []);

  return (
    <div className="github-activity" id="github-activity">
      <div
        className={`contribution-chart contribution-chart--${activity.status}`}
        id="contribution-grid"
        role="region"
        aria-label={activity.status === "ready" ? `${activity.total} GitHub contributions in the last year` : "Soham Kamat's GitHub contribution activity"}
      >
        {activity.status === "loading" && <div className="contribution-loading" role="status">Loading GitHub activity…</div>}

        {activity.status === "ready" && (
          <div className="github-calendar">
            <div className="calendar-months" aria-hidden="true">
              {weeks.map((week, index) => {
                const month = week.find(Boolean)?.date.slice(0, 7);
                const previousMonth = index > 0 ? weeks[index - 1].find(Boolean)?.date.slice(0, 7) : null;
                const label = month && month !== previousMonth ? monthFormatter.format(toUtcDate(`${month}-01`)) : "";
                return <span key={`month-${index}`}>{label}</span>;
              })}
            </div>

            <div className="calendar-body">
              <div className="calendar-weeks" aria-hidden="true">
                {weeks.map((week, weekIndex) => (
                  <div className="calendar-week" key={`week-${weekIndex}`}>
                    {week.map((day, dayIndex) => day ? (
                      <span
                        className={`contribution-day contribution-day--level-${day.level}`}
                        title={day.label}
                        key={day.date}
                      />
                    ) : <span className="contribution-day contribution-day--empty" key={`empty-${weekIndex}-${dayIndex}`} />)}
                  </div>
                ))}
              </div>
            </div>

            <div className="calendar-footer">
              <div className="calendar-legend" aria-label="Contribution intensity from less to more">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((level) => <i className={`contribution-day contribution-day--level-${level}`} key={level} />)}
                <span>More</span>
              </div>
              <p>{activity.total.toLocaleString()} contributions in the last year</p>
            </div>
          </div>
        )}

        {activity.status === "error" && (
          <a className="contribution-error" href={profileUrl} target="_blank" rel="noreferrer">
            GitHub activity is temporarily unavailable. View the live profile <ArrowUpRight size={15} />
          </a>
        )}
      </div>
    </div>
  );
}
