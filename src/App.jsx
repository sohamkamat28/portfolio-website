import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  DownloadSimple,
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
  List,
  Moon,
  Phone,
  Sun,
  WhatsappLogo,
  X,
} from "@phosphor-icons/react";

const projects = [
  {
    name: "ResumeLens ATS",
    kicker: "AI resume intelligence",
    description:
      "Parses resumes, evaluates ATS structure and skill evidence, and compares applications with job descriptions using NLP and structured LLM output.",
    stack: ["FastAPI", "Next.js", "Supabase", "Groq", "spaCy"],
    image: "/assets/resumelens-1280.webp",
    imageSmall: "/assets/resumelens-640.webp",
    imageAlt: "ResumeLens ATS resume analysis interface",
    live: "https://resumelens-ats.vercel.app/",
    domain: "resumelens-ats.vercel.app",
    github: "https://github.com/sohamkamat28/ATS_SCORER",
    className: "project-card project-card--resumelens",
  },
  {
    name: "MedSimplify",
    kicker: "Medical report intelligence",
    description:
      "Turns report text and scans into readable medical terms using OCR, biomedical entity recognition, and a verified 370-term glossary.",
    stack: ["Python", "Dash", "Tesseract", "Hugging Face"],
    image: "/assets/medsimplify-1280.webp",
    imageSmall: "/assets/medsimplify-640.webp",
    imageAlt: "MedSimplify medical report analyzer interface",
    live: "https://medlife-topaz.vercel.app/",
    domain: "medlife-topaz.vercel.app",
    github: "https://github.com/sohamkamat28/medlife",
    className: "project-card project-card--medsimplify",
  },
  {
    name: "StockSense",
    kicker: "Explainable market modeling",
    description:
      "Predicts next-session stock direction from nine engineered indicators with walk-forward testing, confidence scores, and decision-path explanations.",
    stack: ["Flask", "scikit-learn", "yfinance", "D3.js"],
    image: "/assets/stocksense-1280.webp",
    imageSmall: "/assets/stocksense-640.webp",
    imageAlt: "StockSense market signal and decision-tree interface",
    live: "https://stocksense-rho-ochre.vercel.app/",
    domain: "stocksense-rho-ochre.vercel.app",
    github: "https://github.com/sohamkamat28/StockSense",
    className: "project-card project-card--stocksense",
  },
  {
    name: "Spotify Analytics",
    kicker: "Music data exploration",
    description:
      "Explores 2,000 tracks across 18 attributes and segments songs by applying K-means clustering and PCA to nine audio features.",
    stack: ["Streamlit", "Plotly", "Pandas", "PCA"],
    image: "/assets/spotify-1280.webp",
    imageSmall: "/assets/spotify-640.webp",
    imageAlt: "Spotify music analytics dashboard",
    live: "https://spotify-trends-dashboard.streamlit.app/",
    domain: "spotify-trends-dashboard.streamlit.app",
    github: "https://github.com/sohamkamat28/SpotifyDashboard",
    className: "project-card project-card--spotify",
  },
];

const skillGroups = [
  {
    title: "Machine Learning",
    items: [
      "scikit-learn",
      "Classification",
      "Clustering",
      "Feature engineering",
      "Model evaluation",
      "PCA",
    ],
    className: "skill-block skill-block--large",
  },
  {
    title: "AI and NLP",
    items: ["Hugging Face", "spaCy", "OCR", "Groq API", "Natural Language Processing"],
    className: "skill-block skill-block--accent",
  },
  {
    title: "Data",
    items: ["Pandas", "NumPy", "Plotly", "Matplotlib", "Seaborn", "Power BI", "Tableau"],
    className: "skill-block",
  },
  {
    title: "Applications",
    items: ["FastAPI", "Flask", "Streamlit", "Dash", "React", "Next.js", "REST APIs"],
    className: "skill-block skill-block--wide",
  },
  {
    title: "Systems and Tools",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Supabase", "Git", "Vercel", "Render"],
    className: "skill-block",
  },
];

function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function ProjectVisual({ src, srcSmall, alt, href, name, domain }) {
  const [status, setStatus] = useState("loading");

  return (
    <a
      className={`project-visual project-visual--${status}`}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open the live ${name} project`}
    >
      {status === "loading" && <div className="image-skeleton" aria-hidden="true" />}
      {status === "error" && (
        <div className="image-error" role="status">
          Preview unavailable. Use the project links below.
        </div>
      )}
      <div className="project-window">
        <div className="project-window-bar" aria-hidden="true">
          <span className="window-dots"><i /><i /><i /></span>
          <span>{domain}</span>
          <ArrowUpRight size={13} weight="bold" />
        </div>
        <div className="project-window-screen">
          <picture>
            <source media="(max-width: 767px)" srcSet={srcSmall} />
            <img
              src={src}
              alt={alt}
              width="1280"
              height="720"
              loading="lazy"
              onLoad={() => setStatus("ready")}
              onError={() => setStatus("error")}
            />
          </picture>
        </div>
      </div>
    </a>
  );
}

function Header({ theme, onThemeToggle }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <a className="monogram" href="#top" aria-label="SK - Soham Kamat home" onClick={closeMenu}>
        SK
      </a>
      <div className="nav-capsule">
        <nav id="primary-navigation" className={menuOpen ? "nav-links is-open" : "nav-links"} aria-label="Primary navigation">
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#work" onClick={closeMenu}>Work</a>
          <a href="#journey" onClick={closeMenu}>Journey</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
          <a className="nav-resume" href="/Soham_Kamat_Resume.pdf" target="_blank" rel="noreferrer" onClick={closeMenu}>
            Resume
          </a>
        </nav>
        <div className="nav-actions">
          <button className="icon-button" type="button" onClick={onThemeToggle} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
            {theme === "dark" ? <Sun size={18} weight="regular" /> : <Moon size={18} weight="regular" />}
          </button>
          <button className="icon-button menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-controls="primary-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>
            {menuOpen ? <X size={20} weight="regular" /> : <List size={20} weight="regular" />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const nameRef = useRef(null);

  const handleNamePointerMove = (event) => {
    const name = nameRef.current;
    if (
      !name
      || window.matchMedia("(pointer: coarse)").matches
      || window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    const bounds = name.getBoundingClientRect();
    name.style.setProperty("--cursor-x", `${event.clientX - bounds.left}px`);
    name.style.setProperty("--cursor-y", `${event.clientY - bounds.top}px`);
    name.classList.add("is-active");

    name.querySelectorAll(".hero-letter").forEach((letter) => {
      const letterBounds = letter.getBoundingClientRect();
      const centerX = letterBounds.left + letterBounds.width / 2;
      const centerY = letterBounds.top + letterBounds.height / 2;
      const distance = Math.hypot(event.clientX - centerX, (event.clientY - centerY) * 0.7);
      const influence = Math.max(0, 1 - distance / 150);
      letter.style.setProperty("--letter-scale", String(1 - influence * 0.84));
    });
  };

  const resetName = () => {
    const name = nameRef.current;
    if (!name) return;
    name.classList.remove("is-active");
    name.querySelectorAll(".hero-letter").forEach((letter) => {
      letter.style.removeProperty("--letter-scale");
    });
  };

  const renderName = (name) => (
    <span className="hero-name-line" aria-hidden="true">
      {name.split("").map((letter, index) => (
        <span className="hero-letter" key={`${letter}-${index}`}>{letter}</span>
      ))}
    </span>
  );

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-copy">
        <p className="hero-eyebrow">AI engineer · Data scientist · Product builder</p>
        <h1
          className="hero-name"
          id="hero-title"
          aria-label="Soham Kamat"
          ref={nameRef}
          onPointerMove={handleNamePointerMove}
          onPointerLeave={resetName}
        >
          {renderName("SOHAM")}
          {renderName("KAMAT")}
        </h1>
        <p className="hero-intro">Designing AI systems that solve real problems and deliver clear value.</p>
        <div className="hero-actions">
          <a className="button button--solid" href="#work">
            View work <ArrowRight size={18} weight="regular" />
          </a>
          <a className="button button--outline" href="/Soham_Kamat_Resume.pdf" target="_blank" rel="noreferrer">
            Resume <DownloadSimple size={18} weight="regular" />
          </a>
          <a className="button button--outline" href="https://github.com/sohamkamat28" target="_blank" rel="noreferrer">
            GitHub <GithubLogo size={18} weight="regular" />
          </a>
        </div>
      </div>
      <div className="hero-role" aria-hidden="true">
        <span>Machine Learning</span>
        <span>Applied AI</span>
        <span>Data Products</span>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section about" id="about">
      <div className="section-shell">
        <div className="about-grid">
          <div className="about-manifesto" data-reveal>
            <h2>About me</h2>
          </div>
          <div className="about-copy" data-reveal>
            <p className="about-lead">
              I&apos;m an AI and Data Science undergraduate who likes owning the whole problem—from raw data and model choices to APIs, interfaces, and deployment.
            </p>
            <div className="about-notes">
              <p>
                At K.J. Somaiya School of Engineering, I&apos;m building a strong technical base while maintaining a 9.98 CGPA. Outside class, I use projects to test whether an idea can survive contact with real users.
              </p>
              <p>
                That approach runs through ResumeLens, MedSimplify, StockSense, and Spotify Analytics. Different domains, same standard: make the result understandable, useful, and honest about what the model can do.
              </p>
            </div>
            <p className="about-location">Based in Thane, India · Open to international, remote, and India-based opportunities.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section className="section work" id="work">
      <div className="section-shell">
        <div className="section-heading" data-reveal>
          <h2>Projects</h2>
          <p>Selected systems where machine learning, data, and product engineering meet.</p>
        </div>

        <div className="project-grid" id="project-grid">
          {projects.map((project, index) => (
            <article className={project.className} key={project.name} data-reveal>
              <ProjectVisual
                src={project.image}
                srcSmall={project.imageSmall}
                alt={project.imageAlt}
                href={project.live}
                name={project.name}
                domain={project.domain}
              />
              <div className="project-content">
                <div>
                  <div className="project-card-meta">
                    <p className="project-kicker">{project.kicker}</p>
                    <span>0{index + 1}</span>
                  </div>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </div>
                <div>
                  <ul className="tag-list" aria-label={`${project.name} technologies`}>
                    {project.stack.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <div className="project-actions">
                    <a href={project.live} target="_blank" rel="noreferrer">Live <ArrowUpRight size={16} /></a>
                    <a href={project.github} target="_blank" rel="noreferrer">GitHub <GithubLogo size={16} /></a>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {[5, 6].map((number) => (
            <article className="future-project" key={number} aria-label={`Reserved project slot ${number}`}>
              <span>0{number}</span>
              <div>
                <strong>Future build</strong>
                <p>Reserved for a project currently in development.</p>
              </div>
            </article>
          ))}

          <article className="security-project" data-reveal>
            <div className="security-title">
              <p>Network security simulation</p>
              <h3>Secure Banking Communication</h3>
            </div>
            <p>
              A three-process Python socket system with a banking client, bidirectional MITM proxy, and server. It demonstrates plaintext interception, a 10,000-PIN brute-force keyspace, and a protected Diffie-Hellman channel.
            </p>
            <div className="security-facts" aria-label="Verified project details">
              <span><strong>2048-bit</strong> Diffie-Hellman</span>
              <span><strong>AES-256-CBC</strong> encryption</span>
              <span><strong>7 tests</strong> passed</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section className="section journey" id="journey">
      <div className="section-shell journey-grid">
        <div className="journey-heading" data-reveal>
          <h2>Journey</h2>
          <p>Education and experience.</p>
        </div>
        <div className="journey-list">
          <article data-reveal>
            <div className="journey-meta"><span>Experience</span></div>
            <h3>Intern</h3>
            <p className="journey-org">Purple Ribbon Healthcare</p>
          </article>
          <article data-reveal>
            <div className="journey-meta"><span>2024-2028</span><span>Mumbai</span></div>
            <h3>B.Tech in Artificial Intelligence and Data Science</h3>
            <p className="journey-org">K.J. Somaiya School of Engineering</p>
            <p>Current CGPA: 9.98/10</p>
          </article>
          <article data-reveal>
            <div className="journey-meta"><span>2024</span><span>Thane</span></div>
            <h3>Maharashtra HSC Board</h3>
            <p className="journey-org">95.66% and top rank in Thane District</p>
          </article>
          <article data-reveal>
            <div className="journey-meta"><span>2022</span><span>Thane</span></div>
            <h3>ICSE</h3>
            <p className="journey-org">98.2% and elected Head Boy at Euroschool</p>
          </article>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className="section skills" id="skills">
      <div className="section-shell">
        <div className="section-heading" data-reveal>
          <h2>Skills</h2>
          <p>Tools and methods.</p>
        </div>
        <div className="skills-grid" id="capability-list">
          {skillGroups.map((group) => (
            <article className={group.className} key={group.title} data-reveal>
              <h3>{group.title}</h3>
              <div className="skill-words">
                {group.items.map((item) => <span key={item}>{item}</span>)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Recognition() {
  return (
    <section className="section recognition" id="recognition">
      <div className="section-shell recognition-layout">
        <div className="recognition-lead" data-reveal>
          <h2>Recognition</h2>
          <p>Awards and community work.</p>
        </div>
        <article className="recognition-feature" data-reveal>
          <span>IDEA 2.0, PSBs Hackathon Series</span>
          <h3>SENTINEL</h3>
          <p>
            Waitlisted among 1,500+ submissions for a team ideation entry addressing Zombie API risk in banking. The concept used eBPF monitoring, Isolation Forest, NetworkX, and AWS Bedrock.
          </p>
        </article>
        <div className="recognition-notes">
          <article data-reveal>
            <h3>Data Visualization</h3>
            <p>Simplilearn certification, 2026</p>
          </article>
          <article data-reveal>
            <h3>SQL for Analyst</h3>
            <p>DevTown with Google Developer Group and MSIT, 2025</p>
          </article>
          <article data-reveal>
            <h3>Crowdfunding Volunteer</h3>
            <p>Supported a Fueladream and Rotary Club campaign distributing 45-liter water wheels to women in rural India.</p>
            <a href="https://www.fueladream.com/home/campaign/41405" target="_blank" rel="noreferrer">Campaign <ArrowUpRight size={15} /></a>
          </article>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div className="section-shell contact-layout" data-reveal>
        <h2>Contact</h2>
        <p>Open to AI engineering, machine learning, data science, and software opportunities.</p>
        <div className="contact-cards">
          <a className="contact-card" href="mailto:kamatsoham28@gmail.com">
            <EnvelopeSimple size={22} weight="regular" />
            <span>Mail</span>
            <strong>kamatsoham28@gmail.com</strong>
            <ArrowUpRight size={16} weight="regular" />
          </a>
          <a className="contact-card" href="https://www.linkedin.com/in/sohamkamat28/" target="_blank" rel="noreferrer">
            <LinkedinLogo size={22} weight="regular" />
            <span>LinkedIn</span>
            <strong>sohamkamat28</strong>
            <ArrowUpRight size={16} weight="regular" />
          </a>
          <a className="contact-card" href="tel:+919833383225">
            <Phone size={22} weight="regular" />
            <span>Phone</span>
            <strong>+91 9833383225</strong>
            <ArrowUpRight size={16} weight="regular" />
          </a>
          <a className="contact-card" href="https://wa.me/919833383225" target="_blank" rel="noreferrer">
            <WhatsappLogo size={22} weight="regular" />
            <span>WhatsApp</span>
            <strong>Message me</strong>
            <ArrowUpRight size={16} weight="regular" />
          </a>
        </div>
      </div>
    </section>
  );
}

function GitHubActivity() {
  const [chartError, setChartError] = useState(false);
  const cacheDay = new Date().toISOString().slice(0, 10);
  const profileUrl = "https://github.com/sohamkamat28";
  const chartUrl = `https://ghchart.rshah.org/d8ef55/sohamkamat28?date=${cacheDay}`;

  return (
    <section className="section github-activity" id="github-activity">
      <div className="section-shell">
        <div className="github-heading" data-reveal>
          <div>
            <h2>GitHub activity</h2>
          </div>
          <a href={profileUrl} target="_blank" rel="noreferrer">
            View GitHub <ArrowUpRight size={16} weight="bold" />
          </a>
        </div>
        <a
          className="contribution-chart"
          id="contribution-grid"
          href={profileUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="View Soham Kamat's contribution activity on GitHub"
          data-reveal
        >
          {!chartError ? (
            <img
              src={chartUrl}
              alt="Soham Kamat's GitHub contribution grid for the past year"
              width="900"
              height="150"
              loading="lazy"
              onError={() => setChartError(true)}
            />
          ) : (
            <span>Contribution grid unavailable. Open the GitHub profile to view current activity.</span>
          )}
        </a>
        <p className="github-refresh-note">Synced from GitHub · refreshes automatically</p>
      </div>
    </section>
  );
}

function ScrollProgress() {
  const progressRef = useRef(null);

  useEffect(() => {
    let frame;
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      progressRef.current?.style.setProperty("--scroll-progress", String(progress));
      frame = undefined;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div className="scroll-progress" ref={progressRef} aria-hidden="true" />;
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    const saved = window.localStorage.getItem("soham-portfolio-theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useReveal();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("soham-portfolio-theme", theme);
  }, [theme]);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <ScrollProgress />
      <Header theme={theme} onThemeToggle={() => setTheme((value) => value === "dark" ? "light" : "dark")} />
      <main id="main-content">
        <Hero />
        <About />
        <Work />
        <Journey />
        <Skills />
        <Recognition />
        <GitHubActivity />
        <Contact />
      </main>
    </>
  );
}
