import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight } from "@phosphor-icons/react/ArrowUpRight";
import { profile } from "./content";

const monthFormatter = new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC" });
const dayFormatter = new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

function contributionLabel(day) {
  return `${day.count.toLocaleString()} ${day.count === 1 ? "contribution" : "contributions"} on ${dayFormatter.format(toUtcDate(day.date))}`;
}

function tooltipPosition(element) {
  const container = element.closest(".contribution-chart");
  if (!element.isConnected || !container) return null;
  const bounds = element.getBoundingClientRect();
  const chart = container.getBoundingClientRect();
  if (bounds.right <= chart.left || bounds.left >= chart.right || bounds.bottom < 0 || bounds.top > window.innerHeight) return null;
  const halfWidth = Math.min(290, window.innerWidth - 24) / 2;
  const above = bounds.top >= 56;
  return {
    left: Math.max(halfWidth + 12, Math.min(bounds.left + bounds.width / 2, window.innerWidth - halfWidth - 12)),
    top: above ? bounds.top - 9 : bounds.bottom + 9,
    above,
  };
}

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
  const [tooltip, setTooltip] = useState(null);
  const [focusedDate, setFocusedDate] = useState(null);
  const tooltipId = useId();
  const chart = useRef(null);
  const dayButtons = useRef(new Map());
  const tooltipAnchor = useRef(null);
  const interaction = useRef("pointer");
  const profileUrl = profile.github;
  const weeks = buildContributionWeeks(activity.days);
  const days = weeks.flat().filter(Boolean);
  const tabStop = days.find((day) => day.date === focusedDate)?.date ?? days.at(-1)?.date;

  const showTooltip = (day, element) => {
    tooltipAnchor.current = { day, element };
    const position = tooltipPosition(element);
    setTooltip(position ? { day, ...position } : null);
  };

  const hideTooltip = () => {
    tooltipAnchor.current = null;
    setTooltip(null);
  };

  const moveFocus = (event, day) => {
    const index = days.findIndex((entry) => entry.date === day.date);
    const offsets = { ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1 };
    let next;
    if (event.key in offsets) next = Math.max(0, Math.min(days.length - 1, index + offsets[event.key]));
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = days.length - 1;
    else return;
    event.preventDefault();
    interaction.current = "keyboard";
    setFocusedDate(days[next].date);
    const button = dayButtons.current.get(days[next].date);
    if (button) {
      button.focus();
      showTooltip(days[next], button);
    }
  };

  useEffect(() => {
    if (activity.status === "ready" && chart.current) chart.current.scrollLeft = chart.current.scrollWidth;
  }, [activity.status]);

  useEffect(() => {
    const dismiss = () => {
      tooltipAnchor.current = null;
      setTooltip(null);
    };
    const reposition = () => {
      const anchor = tooltipAnchor.current;
      if (!anchor) return;
      const position = tooltipPosition(anchor.element);
      if (!position) dismiss();
      else setTooltip({ day: anchor.day, ...position });
    };
    const outsidePointer = (event) => {
      if (!chart.current?.contains(event.target)) dismiss();
    };
    const escape = (event) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    document.addEventListener("pointerdown", outsidePointer);
    document.addEventListener("keydown", escape);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
      document.removeEventListener("pointerdown", outsidePointer);
      document.removeEventListener("keydown", escape);
    };
  }, []);

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
        ref={chart}
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
              <div className="calendar-weeks" role="group" aria-label="Daily contributions. Use arrow keys to move between days.">
                {weeks.map((week, weekIndex) => (
                  <div className="calendar-week" key={`week-${weekIndex}`}>
                    {week.map((day, dayIndex) => day ? (
                      <button
                        type="button"
                        className={`contribution-day contribution-day--level-${day.level}`}
                        aria-label={contributionLabel(day)}
                        aria-describedby={tooltip?.day.date === day.date ? tooltipId : undefined}
                        tabIndex={tabStop === day.date ? 0 : -1}
                        ref={(element) => {
                          if (element) dayButtons.current.set(day.date, element);
                          else dayButtons.current.delete(day.date);
                        }}
                        onPointerEnter={(event) => {
                          if (event.pointerType !== "touch" && interaction.current === "pointer") showTooltip(day, event.currentTarget);
                        }}
                        onPointerMove={(event) => {
                          if (event.pointerType === "touch") return;
                          interaction.current = "pointer";
                          if (tooltipAnchor.current?.day.date !== day.date) showTooltip(day, event.currentTarget);
                        }}
                        onPointerLeave={(event) => {
                          if (interaction.current === "pointer" && document.activeElement !== event.currentTarget && tooltipAnchor.current?.day.date === day.date) hideTooltip();
                        }}
                        onPointerDown={() => {
                          interaction.current = "pointer";
                        }}
                        onFocus={(event) => {
                          if (event.currentTarget.matches(":focus-visible")) interaction.current = "keyboard";
                          setFocusedDate(day.date);
                          showTooltip(day, event.currentTarget);
                        }}
                        onBlur={() => {
                          if (tooltipAnchor.current?.day.date === day.date) hideTooltip();
                        }}
                        onClick={(event) => showTooltip(day, event.currentTarget)}
                        onKeyDown={(event) => moveFocus(event, day)}
                        key={day.date}
                      />
                    ) : <span className="contribution-day contribution-day--empty" aria-hidden="true" key={`empty-${weekIndex}-${dayIndex}`} />)}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {activity.status === "error" && (
          <a className="contribution-error" href={profileUrl} target="_blank" rel="noreferrer">
            GitHub activity is temporarily unavailable. View the live profile <ArrowUpRight size={15} />
          </a>
        )}
      </div>
      {activity.status === "ready" && (
        <>
          <p className="calendar-scroll-hint">Swipe to explore the full year</p>
          <div className="calendar-footer">
            <div className="calendar-legend" aria-label="Contribution intensity from less to more">
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((level) => <i className={`contribution-day contribution-day--level-${level}`} key={level} />)}
              <span>More</span>
            </div>
            <p>{activity.total.toLocaleString()} contributions in the last year</p>
          </div>
        </>
      )}
      {activity.status === "ready" && tooltip && createPortal(
        <div id={tooltipId} role="tooltip" className="contribution-tooltip" data-side={tooltip.above ? "top" : "bottom"}
          style={{ left: tooltip.left, top: tooltip.top }}>
          {contributionLabel(tooltip.day)}
        </div>,
        document.body,
      )}
    </div>
  );
}
