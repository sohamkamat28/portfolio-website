export const profile = {
  name: "Soham Kamat",
  location: "Thane, India",
  email: "kamatsoham28@gmail.com",
  phone: "+91 9833383225",
  github: "https://github.com/sohamkamat28",
  linkedin: "https://www.linkedin.com/in/sohamkamat28/",
  whatsapp: "https://wa.me/919833383225",
  resume: "/Soham_Kamat_Resume.pdf",
  website: "https://sohamkamat.xyz",
  summary: "AI and Data Science student building practical machine learning systems, data products, and intelligent web applications.",
};

export const sectionLinks = [
  ["about", "About"],
  ["education", "Education"],
  ["work", "Experience"],
  ["skills", "Skills"],
  ["activity", "Activity"],
  ["projects", "Projects"],
  ["honours", "Honours"],
  ["open-source", "Open Source"],
  ["certifications", "Certifications"],
  ["books", "Books"],
  ["contact", "Contact"],
];

export const education = [
  {
    institution: "K.J. Somaiya School of Engineering",
    logo: "/assets/education/somaiya.svg",
    details: "B.Tech in Artificial Intelligence and Data Science · Credit-weighted GPA 9.97/10 through Semester III",
    date: "2024 – Present",
    transcript: "/Soham_Kamat_College_Transcript.pdf",
  },
  {
    institution: "Maharashtra HSC Board",
    logo: "/assets/education/state-board.webp",
    details: "Higher Secondary Certificate · Science · 572/600 · 95.33%",
    date: "2024",
    transcript: "/Soham_Kamat_Class_12_Transcript.pdf",
  },
  {
    institution: "EuroSchool Thane",
    logo: "/assets/education/euroschool.svg",
    details: "ICSE · 98.2% best-five average · Pass Certificate Awarded",
    date: "2012 – 2022",
    transcript: "/Soham_Kamat_Class_10_Transcript.pdf",
  },
];

export const experience = [
  {
    organization: "Purple Ribbon Healthcare",
    logo: "/assets/purple-ribbon-logo.png",
    roles: [
      {
        title: "Technical Product Intern, Digital Health",
        start: "June 2026",
        end: "August 2026",
        current: false,
        details: [
          "Led product definition for Purple Ribbon’s transition from offline healthcare coordination to an app-based platform. Authored the product requirements for role-based workflows, module interactions, and operational handoffs.",
          "Designed wireframes for four core app modules covering patient requests, nurse and caregiver allocation, and service coordination.",
        ],
      },
    ],
  },
];

export const skills = [
  "Python", "SQL", "JavaScript", "C++", "C", "scikit-learn", "Hugging Face",
  "spaCy", "NLP", "OCR", "Classification", "Clustering", "Feature Engineering",
  "Model Evaluation", "PCA", "Pandas", "NumPy", "Matplotlib", "Seaborn",
  "Plotly", "Power BI", "Tableau", "FastAPI", "Flask", "Streamlit", "Dash",
  "React", "Next.js", "HTML", "CSS", "REST APIs", "PostgreSQL", "MySQL",
  "MongoDB", "Supabase", "Vercel", "Render", "Git", "GitHub", "Groq API",
];

export const honours = [
  {
    title: "Amazon ML Challenge",
    date: "2026",
    subtitle: "Placed in approximately the top 10% of 32,000 teams",
    logo: "/assets/honours/amazon.webp",
    description: "Participated in the business entity resolution challenge, matching noisy business records across multiple data sources.",
  },
  {
    title: "Smart India Hackathon",
    date: "2026",
    subtitle: "Cleared the institutional round · Ranked 32 out of 150 teams",
    logo: "/assets/honours/sih.webp",
    description: "Built VaultMind, a money-mule detection platform combining machine learning and transaction-network analysis to flag suspicious accounts and support financial investigations.",
  },
  {
    title: "IDEA 2.0, PSBs Hackathon Series",
    date: "2026",
    subtitle: "Waitlisted among 1,500+ submissions",
    logo: "/assets/honours/idea.webp",
    logoDark: true,
    description: "Submitted SENTINEL as a team ideation entry.",
  },
];

export const certifications = [
  {
    title: "Introduction to Data Visualization",
    date: "2026",
    subtitle: "Simplilearn",
    badge: "S",
    tags: ["Data Visualization"],
  },
  {
    title: "SQL for Analyst",
    date: "2025",
    subtitle: "DevTown × Google Developer Group and MSIT",
    badge: "D",
    tags: ["SQL"],
  },
];

export const fun = [
  [
    "Away from the keyboard, I’m a ",
    { highlight: "marathoner at heart" },
    ". I’ve completed a ",
    { highlight: "10K" },
    ", so I’m quite literally in it for the long run. That patience comes in handy with cricket. I love playing it, and I can happily watch a ",
    { highlight: "Test match all day" },
    ". Five days for one result has never sounded unreasonable to me.",
  ],
  [
    "I also enjoy ",
    { highlight: "building websites for local businesses" },
    ". There’s something rewarding about helping a neighbourhood business tell its story and make a good first impression online.",
  ],
  [
    "When there’s music, I’m happy to trade the keyboard for the ",
    { highlight: "dance floor" },
    ". Good footwork deserves a life beyond the cricket pitch.",
  ],
  [
    "I love ",
    { highlight: "reading non-fiction" },
    ", especially when a book gives me a fresh perspective. That curiosity carries over to my watchlist, where ",
    { highlight: "movies and series based on true events" },
    " usually get first pick.",
  ],
];
export const books = [
  {
    title: "Atomic Habits", author: "James Clear",
    cover: "/assets/books/atomic-habits.webp",
    color: "#eee9da", ink: "#433628", height: 224, width: 148, tilt: -5,
  },
  {
    title: "Think and Win Like Virat", author: "Sfurti Sahare",
    cover: "/assets/books/think-and-win-like-virat.webp",
    color: "#215b77", ink: "#fff16a", height: 236, width: 154, tilt: -2,
  },
  {
    title: "Rich Dad Poor Dad", author: "Robert T. Kiyosaki",
    cover: "/assets/books/rich-dad-poor-dad.webp",
    color: "#573267", ink: "#ffed72", height: 220, width: 147, tilt: 0,
  },
  {
    title: "Gurudev: On the Plateau of the Peak", author: "Bhanumathi Narasimhan",
    spineTitle: "On the Plateau of the Peak",
    cover: "/assets/books/gurudev.webp",
    color: "#276443", ink: "#fff1a2", height: 240, width: 150, tilt: 3,
  },
  {
    title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson",
    cover: "/assets/books/subtle-art.webp",
    color: "#f26816", ink: "#211e1c", height: 228, width: 152, tilt: 5,
  },
];
export const personalCollections = [
  { id: "reading", title: "Books", items: books },
  { id: "running-certificates", title: "Running certificates", items: [] },
  { id: "running-medals", title: "Medals", items: [] },
];
export const repositories = [
  {
    name: "Recordly",
    owner: "webadderallorg",
    href: "https://github.com/sohamkamat28/Recordly",
    parent: { name: "webadderallorg/Recordly", href: "https://github.com/webadderallorg/Recordly" },
    avatar: "/assets/open-source/recordly-avatar.webp",
    description: "Create polished demo videos without editing skills. Available on Mac, Windows, and Linux.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 37297,
    contribution: {
      number: 1181,
      status: "Merged",
      href: "https://github.com/webadderallorg/Recordly/pull/1181",
      summary: "Removed unused bundled wallpapers and added coverage for legacy wallpaper fallbacks.",
    },
  },
  {
    name: "datasets",
    owner: "huggingface",
    href: "https://github.com/sohamkamat28/datasets",
    parent: { name: "huggingface/datasets", href: "https://github.com/huggingface/datasets" },
    avatar: "/assets/open-source/huggingface-avatar.webp",
    description: "Fast, efficient tools for loading, processing, and sharing datasets for AI models.",
    language: "Python",
    languageColor: "#3572a5",
    stars: 22182,
    contribution: {
      number: 9031,
      status: "Open",
      href: "https://github.com/huggingface/datasets/pull/9031",
      summary: "Proposed a fix for Arrow writer crashes when nested lists start with null.",
    },
  },
];
export const posts = [];

export const projects = [
  {
    name: "ResumeLens ATS",
    kicker: "AI resume intelligence",
    description:
      "Parses resumes, evaluates ATS structure and skill evidence, and compares applications with job descriptions using NLP and structured LLM output.",
    stack: ["FastAPI", "Next.js", "Supabase", "Groq", "spaCy"],
    image: "/assets/resumelens-1280.webp",
    imageSmall: "/assets/resumelens-640.webp",
    imageHeight: 783,
    imageAlt: "Updated ResumeLens interface with its dark landing page and complete example resume report",
    live: "https://resumelens-ats.vercel.app/",
    github: "https://github.com/sohamkamat28/ATS_SCORER",
  },
  {
    name: "AI Gym Coach",
    kicker: "Real-time exercise intelligence",
    description:
      "Tracks form and repetitions for five exercises from a live camera feed, then delivers concise AI voice coaching and records workout progress.",
    stack: ["MediaPipe", "OpenCV", "Streamlit", "WebRTC", "Groq"],
    image: "/assets/ai-gym-coach-1280.webp",
    imageSmall: "/assets/ai-gym-coach-640.webp",
    imageHeight: 938,
    imageAlt: "Complete AI Gym Coach introduction with its live app button and exercise tracking overview",
    live: "https://ai-gym-bot.netlify.app/",
    github: "https://github.com/sohamkamat28/AI-GYM_COACH",
  },
  {
    name: "Eureka",
    kicker: "Research discovery and retrieval",
    description:
      "Combines paper and conference discovery from Crossref, arXiv, and web scraping, with TF-IDF search, deduplication, bookmarks, and CSV exports.",
    stack: ["FastAPI", "SQLite", "scikit-learn", "Beautiful Soup"],
    image: "/assets/eureka-1280.webp",
    imageSmall: "/assets/eureka-640.webp",
    imageHeight: 800,
    imageAlt: "Eureka project cover showing its research-discovery workspace, source integrations, and search features",
    github: "https://github.com/yajask-maker/Webscrap_proj_Sem5",
  },
  {
    name: "SceneDNA",
    kicker: "Multimodal visual intelligence",
    description:
      "Analyses a reference image’s composition, lighting, colour, and materials to build reusable visual blueprints, prompts, and style variations.",
    stack: ["React", "TypeScript", "Gemini", "Supabase", "TanStack Start"],
    image: "/assets/scenedna-1280.webp",
    imageSmall: "/assets/scenedna-640.webp",
    imageHeight: 800,
    imageAlt: "SceneDNA project cover with its complete example reference image and visual-analysis dimensions",
    live: "https://scene-dna-studio.vercel.app/",
    github: "https://github.com/sohamkamat28/SceneDNA",
  },
  {
    name: "StockSense",
    kicker: "Explainable market modeling",
    description:
      "Predicts next-session stock direction from nine engineered indicators with walk-forward testing, confidence scores, and decision-path explanations.",
    stack: ["Flask", "scikit-learn", "yfinance", "D3.js"],
    image: "/assets/stocksense-1280.webp",
    imageSmall: "/assets/stocksense-640.webp",
    imageHeight: 838,
    imageAlt: "Complete StockSense market console with ticker selection and its illustrative signal preview",
    live: "https://stocksense-rho-ochre.vercel.app/",
    github: "https://github.com/sohamkamat28/StockSense",
  },
  {
    name: "MedSimplify",
    kicker: "Medical report intelligence",
    description:
      "Turns report text and scans into readable medical terms using OCR, biomedical entity recognition, and a verified 370-term glossary.",
    stack: ["Python", "Dash", "Tesseract", "Hugging Face"],
    image: "/assets/medsimplify-1280.webp",
    imageSmall: "/assets/medsimplify-640.webp",
    imageHeight: 721,
    imageAlt: "MedLife medical report analyzer with its complete introduction and report review image",
    live: "https://medlife-topaz.vercel.app/",
    github: "https://github.com/sohamkamat28/medlife",
  },
  {
    name: "YouTube Video Analyser",
    kicker: "Video-to-notes intelligence",
    description:
      "Turns public YouTube videos into timestamped summaries, study guides, and key takeaways with Gemini, caption-based fallback, and downloadable Markdown notes.",
    stack: ["Python", "Streamlit", "Gemini", "Agno", "Groq"],
    image: "/assets/youtube-1280.webp",
    imageSmall: "/assets/youtube-640.webp",
    imageHeight: 812,
    imageAlt: "YouTube Video Analyser interface with its complete video-link form and report-style controls",
    live: "https://youtube-video-analyser.streamlit.app/",
    github: "https://github.com/sohamkamat28/YouTube-video-analyser",
  },
  {
    name: "Spotify Analytics",
    kicker: "Music data exploration",
    description:
      "Explores 2,000 tracks across 18 attributes and segments songs by applying K-means clustering and PCA to nine audio features.",
    stack: ["Streamlit", "Plotly", "Pandas", "PCA"],
    image: "/assets/spotify-1280.webp",
    imageSmall: "/assets/spotify-640.webp",
    imageHeight: 826,
    imageAlt: "Spotify Analytics dashboard with catalog filters and fully visible popularity charts",
    live: "https://spotify-trends-dashboard.streamlit.app/",
    github: "https://github.com/sohamkamat28/SpotifyDashboard",
  },
];
