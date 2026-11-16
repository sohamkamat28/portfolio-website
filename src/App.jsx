import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useNavigationType, useParams } from "react-router";
import {
  AnimatePresence, motion, MotionConfig, useMotionValue, useReducedMotion, useSpring, useTransform,
} from "motion/react";
import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
import { ArrowUpRight } from "@phosphor-icons/react/ArrowUpRight";
import { CaretDown } from "@phosphor-icons/react/CaretDown";
import { ChatCircleDots } from "@phosphor-icons/react/ChatCircleDots";
import { EnvelopeSimple } from "@phosphor-icons/react/EnvelopeSimple";
import { FileText } from "@phosphor-icons/react/FileText";
import { FolderSimple } from "@phosphor-icons/react/FolderSimple";
import { GithubLogo } from "@phosphor-icons/react/GithubLogo";
import { House } from "@phosphor-icons/react/House";
import { LinkedinLogo } from "@phosphor-icons/react/LinkedinLogo";
import { MapPin } from "@phosphor-icons/react/MapPin";
import { MoonStars } from "@phosphor-icons/react/MoonStars";
import { Notebook } from "@phosphor-icons/react/Notebook";
import { Phone } from "@phosphor-icons/react/Phone";
import { Sun } from "@phosphor-icons/react/Sun";
import { WhatsappLogo } from "@phosphor-icons/react/WhatsappLogo";
import { XLogo } from "@phosphor-icons/react/XLogo";
import {
  books, certifications, education, experience, fun, honours, posts, profile,
  projects, repositories, sectionLinks, skills,
} from "./content";
import GitHubActivity from "./Activity";
import { PixelBackdrop } from "./Decorations";
import HandwrittenGreeting from "./HandwrittenGreeting";

const pageTitles = {
  "/projects": "Projects",
  "/open-source": "Open Source",
  "/certifications": "Certifications",
  "/blog": "Blog",
};
const legacyAnchors = { top: "hero", journey: "education", "github-activity": "activity" };
const emailHref = `mailto:${profile.email}`;
const phoneHref = `tel:${profile.phone.replaceAll(" ", "")}`;
const easeOut = [0.22, 1, 0.36, 1];
const sectionSpring = { type: "spring", stiffness: 420, damping: 34, mass: 0.7 };

function RouteEffects() {
  const { pathname, hash, key } = useLocation();
  const reduced = useReducedMotion();
  const navigation = useNavigationType();
  const scrollPositions = useRef(new Map());

  useEffect(() => {
    const restore = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => { window.history.scrollRestoration = restore; };
  }, []);

  useLayoutEffect(() => {
    const title = pageTitles[pathname] ?? (pathname === "/" ? "AI and Data Science" : "Page not found");
    const article = posts.find((post) => pathname === `/blog/${post.slug}`);
    document.title = `${article?.title ?? title} | ${profile.name}`;
    const meta = document.querySelector('meta[property="og:title"]');
    meta?.setAttribute("content", document.title);
    const canonical = new URL(pathname, profile.website).href;
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonical);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", canonical);
    const previousOffset = navigation === "POP" ? scrollPositions.current.get(key) : undefined;
    if (previousOffset !== undefined) {
      window.scrollTo({ top: previousOffset, behavior: "instant" });
    } else if (hash) {
      const id = hash.slice(1);
      const target = document.getElementById(legacyAnchors[id] ?? id);
      target?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
      target?.focus({ preventScroll: true });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    const recordScroll = () => scrollPositions.current.set(key, window.scrollY);
    window.addEventListener("scroll", recordScroll, { passive: true });
    return () => window.removeEventListener("scroll", recordScroll);
  }, [pathname, hash, key, navigation, reduced]);

  return null;
}

function Reveal({ children, className, delay = 0, immediate = false, blur = immediate }) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  const visible = { opacity: 1, y: 0, ...(blur && { filter: "blur(0px)" }) };
  return (
    <motion.div className={className}
      initial={{ opacity: 0, y: immediate ? 6 : 20, ...(blur && { filter: "blur(6px)" }) }}
      animate={immediate ? visible : undefined}
      whileInView={immediate ? undefined : visible}
      viewport={{ once: true, amount: "some", margin: "0px 0px -36px 0px" }}
      transition={immediate ? { duration: 0.4, ease: easeOut, delay } : {
        default: { ...sectionSpring, delay },
        opacity: { duration: 0.18, ease: easeOut, delay },
      }}>
      {children}
    </motion.div>
  );
}

function Section({ id, className = "", children }) {
  return <section id={id} tabIndex={-1} className={className} aria-labelledby={`${id}-title`}>{children}</section>;
}

function SectionIndex() {
  const [active, setActive] = useState("about");
  const reduced = useReducedMotion();

  useEffect(() => {
    let frame = 0;
    const sections = sectionLinks.map(([id]) => document.getElementById(id)).filter(Boolean);
    const track = () => {
      const guide = window.innerHeight * 0.45;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const atBottom = maxScroll > 0 && window.scrollY >= maxScroll - 2;
      const current = sections.findLast((section) => section.getBoundingClientRect().top <= guide);
      setActive((atBottom ? sections.at(-1) : current)?.id ?? "about");
      frame = 0;
    };
    const requestTrack = () => {
      if (!frame) frame = window.requestAnimationFrame(track);
    };
    const resize = new ResizeObserver(requestTrack);
    const main = document.getElementById("main-content");
    if (main) resize.observe(main);
    requestTrack();
    window.addEventListener("scroll", requestTrack, { passive: true });
    window.addEventListener("resize", requestTrack);
    return () => {
      resize.disconnect();
      window.removeEventListener("scroll", requestTrack);
      window.removeEventListener("resize", requestTrack);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav className="section-index" aria-label="Page sections">
      {sectionLinks.map(([id, label]) => (
        <Link key={id} to={{ hash: `#${id}` }} replace aria-current={active === id ? "location" : undefined}>
          <span className="section-index-label">{label}</span>
          <motion.span className="section-index-line" aria-hidden="true" initial={false}
            animate={{ width: active === id ? 44 : 28 }} whileHover={reduced ? undefined : { width: 44 }}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 24 }} />
        </Link>
      ))}
    </nav>
  );
}

function DockItem({ title, icon: Icon, to, href, onClick, disabled, pointer }) {
  const item = useRef(null);
  const width = useTransform(pointer, (pointerX) => {
    if (!Number.isFinite(pointerX) || !item.current) return 40;
    const bounds = item.current.getBoundingClientRect();
    const distance = Math.abs(pointerX - (bounds.left + bounds.width / 2));
    return 40 + 20 * Math.max(0, 1 - distance / 140);
  });
  const spring = useSpring(width, { mass: 0.1, stiffness: 150, damping: 12 });
  const animatedWidth = useTransform(spring, (value) => `${value}px`);
  const children = <><Icon size={17} aria-hidden="true" /><span className="dock-tooltip" aria-hidden="true">{title}</span></>;
  const props = { className: "dock-item", "aria-label": title };

  let control;
  if (disabled) control = <button {...props} type="button" aria-disabled="true">{children}</button>;
  else if (onClick) control = <button {...props} onClick={onClick} type="button">{children}</button>;
  else if (to) control = <NavLink {...props} to={to} end>{children}</NavLink>;
  else control = <a {...props} href={href} target={href?.startsWith("mailto:") ? undefined : "_blank"} rel="noreferrer">{children}</a>;

  return <motion.div ref={item} className="dock-slot" style={{ "--dock-item-width": animatedWidth }}>{control}</motion.div>;
}

function Dock({ theme, toggleTheme }) {
  const pointer = useMotionValue(Infinity);
  const reduced = useReducedMotion();
  const onPointerMove = (event) => {
    if (!reduced && event.pointerType === "mouse" && window.innerWidth >= 640) {
      pointer.set(event.clientX);
    }
  };

  return (
    <nav className="dock" aria-label="Portfolio navigation"
      onPointerMove={onPointerMove} onPointerLeave={() => pointer.set(Infinity)}
      onPointerCancel={() => pointer.set(Infinity)}>
      <DockItem pointer={pointer} title="Home" icon={House} to="/" />
      <DockItem pointer={pointer} title="Projects" icon={FolderSimple} to="/projects" />
      <DockItem pointer={pointer} title="Blog" icon={Notebook} to="/blog" />
      <DockItem pointer={pointer} title="Resume" icon={FileText} href={profile.resume} />
      <span className="dock-divider" aria-hidden="true" />
      <DockItem pointer={pointer} title="GitHub" icon={GithubLogo} href={profile.github} />
      <DockItem pointer={pointer} title="LinkedIn" icon={LinkedinLogo} href={profile.linkedin} />
      <DockItem pointer={pointer} title={profile.x ? "X" : "X profile unavailable"} icon={XLogo} href={profile.x} disabled={!profile.x} />
      <DockItem pointer={pointer} title="Email" icon={EnvelopeSimple} href={emailHref} />
      <span className="dock-divider" aria-hidden="true" />
      <DockItem pointer={pointer} title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        icon={theme === "dark" ? MoonStars : Sun} onClick={toggleTheme} />
    </nav>
  );
}

const prompt = `Research ${profile.name}, an AI and Data Science student and product builder based in ${profile.location}. Use the public portfolio (${profile.website}) and GitHub (${profile.github}) as primary sources. Give a concise, factual overview of projects, technical strengths, and verified achievements. Cite your sources and identify details you could not verify.`;
const assistants = [
  ["ChatGPT", "https://chatgpt.com/?hints=search&q="],
  ["Claude", "https://claude.ai/new?q="],
  ["Perplexity", "https://www.perplexity.ai/search?q="],
  ["Gemini", "https://gemini.google.com/app?q="],
];

function AssistantMenu() {
  const [open, setOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const container = useRef(null);
  const button = useRef(null);
  const firstLink = useRef(null);
  const label = `Ask an AI about ${profile.name}`;

  useEffect(() => {
    if (!open) return undefined;
    firstLink.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onPointer = (event) => {
      if (!container.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyStatus("Prompt copied");
    } catch {
      setCopyStatus("Select the prompt below to copy it");
    }
  }

  return (
    <div className="assistant" ref={container}>
      <AnimatePresence>
        {open && <motion.div className="assistant-popover" id="assistant-menu" role="dialog" aria-label={label}
          initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }} transition={{ duration: 0.18 }}>
          <h2>Ask an AI about me</h2>
          <p>Ask your favorite assistant about my work.</p>
          <div className="assistant-links">
            {assistants.map(([name, url], index) => (
              <a key={name} ref={index === 0 ? firstLink : undefined}
                href={url + encodeURIComponent(prompt)} target="_blank" rel="noreferrer"
                aria-label={`Ask ${name} about ${profile.name}`}>
                {name} <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
          <button className="copy-prompt" type="button" onClick={copyPrompt}>copy the prompt instead</button>
          <span role="status" className="copy-status">{copyStatus}</span>
          {copyStatus.startsWith("Select") && <textarea readOnly aria-label="Assistant prompt" value={prompt} />}
        </motion.div>}
      </AnimatePresence>
      <button ref={button} className="assistant-trigger" type="button" aria-label={label} aria-expanded={open}
        aria-haspopup="dialog" aria-controls={open ? "assistant-menu" : undefined}
        onClick={() => { setCopyStatus(""); setOpen(!open); }}>
        <ChatCircleDots size={23} aria-hidden="true" />
      </button>
    </div>
  );
}

function Hero() {
  return (
    <>
      <Section id="hero" className="hero">
        <HandwrittenGreeting />
        <Reveal immediate>
          <div className="hero-name">
            <span className="hero-label hero-label--work">BUILDS THINGS</span>
            <h1 id="hero-title">
              I’m <span className="name-outline">
                {profile.name}
                <span className="name-frame" aria-hidden="true">
                  <span /><span /><span /><span />
                </span>
              </span>.
            </h1>
            <span className="hero-label hero-label--location"><MapPin size={12} aria-hidden="true" /> {profile.location.toUpperCase()}</span>
          </div>
        </Reveal>
        <Reveal immediate delay={0.04}>
          <p>
            AI &amp; Data Science Student. Passionate about designing, building
            <br className="tagline-break" />{" "}and <mark>solving real-world problems</mark> through AI systems
          </p>
        </Reveal>
      </Section>
      <Reveal className="resume-row" immediate delay={0.08} blur={false}>
        <a className="resume-button" href={profile.resume} download>Download Resume</a>
      </Reveal>
    </>
  );
}

const aboutTabs = ["Professional", "Fun"];

function About() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);
  const reduced = useReducedMotion();

  function onTabKey(event) {
    const direction = { ArrowLeft: (active + 1) % 2, ArrowRight: (active + 1) % 2, Home: 0, End: 1 };
    if (!(event.key in direction)) return;
    event.preventDefault();
    const next = direction[event.key];
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <Section id="about" className="about">
      <Reveal immediate delay={0.12}>
        <div className="folder-tabs" role="tablist" aria-label="About me" onKeyDown={onTabKey}>
          {aboutTabs.map((label, index) => (
            <button ref={(element) => { tabRefs.current[index] = element; }} key={label}
              type="button" role="tab" id={`about-tab-${index}`} aria-controls="about-panel"
              aria-selected={active === index} tabIndex={active === index ? 0 : -1}
              onClick={() => setActive(index)}>{label}</button>
          ))}
        </div>
        <div className="folder-surface">
          <div className="folder-panel" id="about-panel" role="tabpanel" aria-labelledby={`about-tab-${active}`} tabIndex={0}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active} initial={reduced ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: reduced ? 0 : 0.22, ease: "easeOut" }}>
                <h2 id="about-title"><span>{active ? "Also" : "About"} <em>me</em></span></h2>
                {active === 0 ? (
                  <p>
                    I’m pursuing a <Link to="#education">B.Tech in Artificial Intelligence and Data Science</Link> at K.J. Somaiya School of Engineering.
                    I like <mark>building useful products</mark> and giving real problems enough structure to solve them.
                    My work spans <span className="inline-underline">machine learning, NLP, and data analysis</span>,
                    from <Link to="#work">defining product requirements in digital health</Link> to <Link to="#projects">shipping AI and data applications</Link>.
                    I’m based in Thane and open to remote and India-based opportunities.
                  </p>
                ) : fun && <p>{fun}</p>}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function SmallTitle({ id, children }) {
  return <h2 id={`${id}-title`} className="small-title"><span>{children}</span></h2>;
}

function Badge({ value, className = "" }) {
  return <span aria-hidden="true" className={`identity-badge ${className}`}>{value}</span>;
}

function Education() {
  return (
    <Section id="education" className="compact-section">
      <Reveal><SmallTitle id="education">Education</SmallTitle></Reveal>
      <div className="education-list">
        {education.map((entry, index) => {
          const Tag = entry.href ? "a" : "div";
          return (
            <Reveal key={entry.institution} delay={index * 0.05}>
              <Tag className="education-item" href={entry.href} target={entry.href ? "_blank" : undefined} rel={entry.href ? "noreferrer" : undefined}>
                <Badge value={entry.badge} className={`education-badge--${index}`} />
                <div className="education-meta">
                  <h3>{entry.institution}</h3><p>{entry.details}</p>
                </div>
                <time>{entry.date}</time>
              </Tag>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

function Role({ role, expanded }) {
  const [open, setOpen] = useState(expanded);
  const reduced = useReducedMotion();
  const panelId = `role-${role.title.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  return (
    <div className="experience-role">
      <button className="role-trigger" type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(!open)}>
        <span className="role-caret"><CaretDown size={12} weight="bold" /></span>
        <span className="role-text">
          <strong>{role.title}</strong>
          <span>{role.start} – {role.current ? "Present" : role.end}{role.location && ` · ${role.location}`}</span>
        </span>
      </button>
      <motion.div id={panelId} aria-hidden={!open} initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 0.2, ease: "easeOut" }} className="role-collapse">
        <ul>{role.details.map((item) => <li key={item}>{item}</li>)}</ul>
      </motion.div>
    </div>
  );
}

function Experience() {
  return (
    <Section id="work" className="compact-section">
      <Reveal><SmallTitle id="work">Work Experience</SmallTitle></Reveal>
      <div className="experience-list">
        {experience.map((entry) => (
          <Reveal key={entry.organization}>
            <article className="experience-item">
              <div className="employer"><Badge value={entry.badge} className="employer-badge" /><h3>{entry.organization}</h3>
                {entry.roles.some((role) => role.current) && <span className="current-dot" aria-label="Current employer" />}
              </div>
              <div className="experience-roles">
                {entry.roles.map((role, index) => <Role key={role.title} role={role} expanded={index === 0 && role.current} />)}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Skills() {
  return (
    <Section id="skills" className="compact-section">
      <Reveal>
        <SmallTitle id="skills">Skills</SmallTitle>
        <ul className="skill-pills">
          {skills.map((skill) => <li key={skill}>{skill}</li>)}
        </ul>
      </Reveal>
    </Section>
  );
}

function Activity() {
  return (
    <Section id="activity" className="compact-section activity-section">
      <Reveal>
        <SmallTitle id="activity">Activity</SmallTitle>
        <GitHubActivity />
      </Reveal>
    </Section>
  );
}

function SectionIntro({ id, label, children, description, tone = "", serif = false, page = false }) {
  const Heading = page ? "h1" : "h2";
  return (
    <Reveal className={`section-intro ${serif ? "section-intro--serif" : ""}`} immediate={page}>
      <span className={`section-kicker ${tone && `section-kicker--${tone}`}`}>{label}</span>
      <Heading id={`${id}-title`}>{children}</Heading>
      {description && <p>{description}</p>}
    </Reveal>
  );
}

function MoreLink({ to, children }) {
  return <Reveal className="more-row"><Link className="more-link" to={to}>{children} <ArrowRight size={15} aria-hidden="true" /></Link></Reveal>;
}

function OutLink({ href, children, label, className = "" }) {
  if (!href) return null;
  return <a className={className} href={href} target="_blank" rel="noreferrer" aria-label={label}>{children}</a>;
}

function Tags({ values, className = "" }) {
  if (!values?.length) return null;
  return <ul className={`tags ${className}`}>{values.map((tag) => <li key={tag}>{tag}</li>)}</ul>;
}

function ProjectImage({ project, index, number = false }) {
  return (
    <div className="project-media">
      {project.image ? (
        <img src={project.image} srcSet={project.imageSmall ? `${project.imageSmall} 640w, ${project.image} 1280w` : undefined}
          sizes="(max-width: 640px) 90vw, 500px" alt={project.imageAlt} loading="lazy" width="1280" height="720" />
      ) : number && <div className="project-number" aria-hidden="true"><span>Project</span><strong>{String(index + 1).padStart(2, "0")}</strong></div>}
    </div>
  );
}

function ProjectLinks({ project, full = false }) {
  if (!project.live && !project.github) return null;
  return (
    <div className={`project-links ${full ? "project-links--full" : ""}`}>
      <OutLink href={project.live} label={`Open ${project.name} live site`}><ArrowUpRight size={12} /> {full ? "Live" : "Website"}</OutLink>
      <OutLink href={project.github} label={`View ${project.name} source on GitHub`}><GithubLogo size={12} /> {full ? "GitHub" : "Source"}</OutLink>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      {project.live ? (
        <OutLink href={project.live} label={`Preview ${project.name}`}><ProjectImage project={project} /></OutLink>
      ) : <ProjectImage project={project} />}
      <div className="project-card-body">
        <h3>{project.name}</h3>
        {project.date && <time>{project.date}</time>}
        <p>{project.description}</p>
        <Tags values={project.stack} />
        <ProjectLinks project={project} />
      </div>
    </article>
  );
}

function ProjectSection() {
  return (
    <Section id="projects" className="feature-section">
      <SectionIntro id="projects" label="My Projects" tone="yellow"
        description="Selected projects across applied AI, machine learning, and data products.">
        Here’s what I’ve been <span className="heading-mark heading-mark--blue">up to!</span>
      </SectionIntro>
      <div className="project-grid">
        {projects.slice(0, 4).map((project, index) => (
          <Reveal key={project.name} delay={(index % 2) * 0.07}><ProjectCard project={project} /></Reveal>
        ))}
      </div>
      <MoreLink to="/projects">Show all {projects.length} projects</MoreLink>
    </Section>
  );
}

function Timeline({ entries, type }) {
  return (
    <ul className={`timeline timeline--${type}`}>
      {entries.map((entry, index) => (
        <li key={entry.title}>
          <Reveal className="timeline-entry">
            <Badge value={entry.badge} className={`timeline-badge--${index % 3}`} />
            <div>
              {entry.date && <time>{entry.date}</time>}
              <h3>{entry.title}</h3>
              {entry.subtitle && <p className="timeline-subtitle">{entry.subtitle}</p>}
              {entry.description && <p>{entry.description}</p>}
              {entry.credential && <p className="credential">Credential ID {entry.credential}</p>}
              <Tags values={entry.tags} />
            </div>
            <OutLink className="credential-link" href={entry.href} label={`Open credential for ${entry.title}`}><ArrowUpRight size={14} /></OutLink>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

function Honours() {
  return (
    <Section id="honours" className="feature-section">
      <SectionIntro id="honours" label="Honours" tone="slate">
        Pushing Limits, Earning <span className="heading-mark heading-mark--yellow">Laurels</span>
      </SectionIntro>
      <Timeline type="honours" entries={honours} />
    </Section>
  );
}

function RepositoryCard({ repo, mirror = false }) {
  return (
    <article className="repository-card">
      <div className="repository-media">
        {repo.image ? <img src={repo.image} alt="" loading="lazy" /> : <strong>{repo.owner && `${repo.owner}/`}{repo.name}</strong>}
      </div>
      <div className="repository-content">
        <h3>{mirror ? repo.name : <OutLink href={repo.href}>{repo.name}</OutLink>}</h3>
        {repo.parent && <p>Forked from {mirror ? repo.parent.name : <OutLink href={repo.parent.href}>{repo.parent.name}</OutLink>}</p>}
        {repo.description && <p>{repo.description}</p>}
        <div className="repository-meta">{repo.language} {Number.isFinite(repo.stars) && ` ☆ ${repo.stars.toLocaleString()}`}</div>
      </div>
    </article>
  );
}

function OpenSource() {
  return (
    <Section id="open-source" className="feature-section open-source">
      <SectionIntro id="open-source" label="Open Source" tone="green">
        Building in the <span className="heading-mark heading-mark--green">Open</span>
      </SectionIntro>
      <div className="repository-band"><Reveal>
        {repositories.length ? <div className="repository-marquee">
          <div className="repository-group">{repositories.map((repo) => <RepositoryCard key={repo.name} repo={repo} />)}</div>
          <div className="repository-group repository-group--copy" aria-hidden="true">
            {repositories.map((repo) => <RepositoryCard key={repo.name} repo={repo} mirror />)}
          </div>
        </div> : <div className="repository-empty" />}
      </Reveal></div>
      <MoreLink to="/open-source">View all repositories</MoreLink>
    </Section>
  );
}

function Certifications() {
  return (
    <Section id="certifications" className="feature-section">
      <SectionIntro id="certifications" label="Licenses & Certifications" tone="slate">
        Always Learning <span className="heading-mark heading-mark--green">Something New</span>
      </SectionIntro>
      <Timeline type="certifications" entries={certifications.slice(0, 4)} />
      <MoreLink to="/certifications">Show all {certifications.length} certifications</MoreLink>
    </Section>
  );
}

function Books() {
  const [selected, setSelected] = useState(null);
  return (
    <Section id="books" className="books">
      <Reveal>
        <SmallTitle id="books">Bookshelf</SmallTitle>
        <div className="books-display">
          <div className="shelf" role="group" aria-labelledby="books-title">
            {books.map((book) => (
              <button key={book.title} type="button" aria-pressed={selected === book.title}
                aria-label={`${book.title}, by ${book.author}`}
                style={{ "--book-color": book.color }}
                onClick={() => setSelected(selected === book.title ? null : book.title)}>
                {book.cover && <img src={book.cover} alt="" loading="lazy" />}
                <span>{book.title}</span>
              </button>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function Contact() {
  return (
    <Section id="contact" className="feature-section contact">
      <SectionIntro id="contact" label="Contact" tone="blue">
        <span className="heading-mark heading-mark--blue">Connect</span> with me
      </SectionIntro>
      <Reveal>
        <p>Get in touch by <a href={emailHref}>email</a>, connect with me on <OutLink href={profile.linkedin}>LinkedIn</OutLink>, or explore my work on <OutLink href={profile.github}>GitHub</OutLink>.</p>
        <div className="contact-links">
          <a href={phoneHref} aria-label={`Call ${profile.name}`}><Phone size={16} /> {profile.phone}</a>
          <OutLink href={profile.whatsapp}><WhatsappLogo size={16} /> WhatsApp</OutLink>
        </div>
      </Reveal>
    </Section>
  );
}

function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="home page-column">
      <SectionIndex />
      <Hero />
      <About />
      <Education />
      <Experience />
      <Skills />
      <Activity />
      <ProjectSection />
      <Honours />
      <OpenSource />
      <Certifications />
      <Books />
      <Contact />
    </main>
  );
}

function ProjectPage() {
  return (
    <main id="main-content" tabIndex={-1} className="page-column inner-page inner-page--pixels">
      <SectionIntro id="projects-page" label="My Projects" page description="Applied AI, data exploration, and tools that make complex work easier.">
        Things I’ve Built
      </SectionIntro>
      <div role="region" aria-label="Projects" className="project-list">
        {projects.map((project, index) => (
          <Reveal key={project.name}>
            <article className="project-detail">
              <ProjectImage project={project} index={index} number />
              <div>
                <div className="project-detail-heading">
                  <h2>{project.name}</h2>
                  <ProjectLinks project={project} full />
                </div>
                {project.date && <time>{project.date}</time>}
                <p>{project.description}</p>
                <h3>Technologies Used:</h3>
                <Tags values={project.stack} />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </main>
  );
}

function RepositoryPage() {
  return (
    <main id="main-content" tabIndex={-1} className="page-column inner-page">
      <SectionIntro id="repos-page" label="Open Source" serif page>Building in the Open</SectionIntro>
      <div className="repository-grid">{repositories.map((repo) => <RepositoryCard key={repo.name} repo={repo} />)}</div>
    </main>
  );
}

function CertificationPage() {
  return (
    <main id="main-content" tabIndex={-1} className="page-column inner-page">
      <SectionIntro id="certs-page" label="Licenses & Certifications" serif page
        description="Coursework and programs I’ve completed in data analysis and visualization.">
        Things I’ve Learned
      </SectionIntro>
      <Timeline type="certifications" entries={certifications} />
    </main>
  );
}

function BlogPage() {
  return (
    <main id="main-content" tabIndex={-1} className="page-column inner-page inner-page--pixels">
      <SectionIntro id="blog-page" label="My Blog" serif page>Thoughts, Stories &amp; Ideas</SectionIntro>
      <div className="blog-list">
        {posts.map((post) => (
          <Reveal key={post.slug}>
            <Link className="blog-card" to={`/blog/${post.slug}`}>
              {post.cover && <img src={post.cover} alt="" loading="lazy" />}
              <div>
                <h2>{post.title}</h2>{post.description && <p>{post.description}</p>}
                {post.date && <time>{post.date}</time>} <span>{profile.name}</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </main>
  );
}

function BlogArticle() {
  const { slug } = useParams();
  const post = posts.find((entry) => entry.slug === slug);
  if (!post) return <NotFound />;
  return (
    <main id="main-content" tabIndex={-1} className="page-column article-page">
      <article>
        <header className="article-header">
          {post.topic && <span>{post.topic}</span>}
          <h1>{post.title}</h1>
          {post.description && <p>{post.description}</p>}
          <div>{post.date && <time>{post.date}</time>} <span>{profile.name}</span></div>
        </header>
        {post.cover && <img className="article-cover" src={post.cover} alt={post.coverAlt ?? ""} />}
        <div className="article-flow">{post.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
      </article>
      <Link className="more-link" to="/blog">Back to blog</Link>
    </main>
  );
}

function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="page-column inner-page not-found">
      <SectionIntro id="missing" label="404" page>Page not found</SectionIntro>
      <Link className="more-link" to="/">Back to home <ArrowRight size={15} /></Link>
    </main>
  );
}

function getInitialTheme() {
  try { return localStorage.getItem("soham-portfolio-theme") === "light" ? "light" : "dark"; }
  catch { return "dark"; }
}

function Portfolio() {
  const [theme, setTheme] = useState(getInitialTheme);
  const { pathname } = useLocation();
  const kind = pathname === "/" ? "sky" : pathname === "/projects" ? "teal" : pathname === "/blog" ? "violet" : null;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0a0b0c" : "#ffffff");
    try { localStorage.setItem("soham-portfolio-theme", theme); }
    catch { /* The theme remains active for this visit. */ }
  }, [theme]);

  return (
    <>
      <RouteEffects />
      <a className="skip-link" href="#main-content">Skip to content</a>
      {kind && <PixelBackdrop kind={kind} theme={theme} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/open-source" element={<RepositoryPage />} />
        <Route path="/certifications" element={<CertificationPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogArticle />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {pathname === "/" && <AssistantMenu />}
      <Dock theme={theme} toggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")} />
    </>
  );
}

export default function App() {
  return <BrowserRouter><MotionConfig reducedMotion="user"><Portfolio /></MotionConfig></BrowserRouter>;
}
