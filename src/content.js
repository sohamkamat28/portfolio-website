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
    details: "B.Tech in Artificial Intelligence and Data Science · CGPA 9.98/10",
    date: "2024 – Present",
    href: "https://kjsce.somaiya.edu/en/",
  },
  {
    institution: "Maharashtra HSC Board",
    logo: "/assets/education/state-board.webp",
    details: "Higher Secondary Certificate · 95.33% · Top rank in Thane District",
    date: "2024",
  },
  {
    institution: "EuroSchool Thane",
    logo: "/assets/education/euroschool.svg",
    details: "ICSE · 98.2% · Elected Head Boy",
    date: "2012 – 2022",
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
    subtitle: "Team Rust-eze · 3 members",
    badge: "A",
    description: "Participated in the business entity resolution challenge, matching noisy business records across multiple data sources.",
  },
  {
    title: "Smart India Hackathon",
    date: "2026",
    subtitle: "Cleared the institutional round · Ranked 32 out of 150 teams",
    badge: "S",
    description: "Built VaultMind, a money-mule detection platform combining machine learning and transaction-network analysis to flag suspicious accounts and support financial investigations.",
  },
  {
    title: "IDEA 2.0, PSBs Hackathon Series",
    date: "2026",
    subtitle: "Waitlisted among 1,500+ submissions",
    badge: "I",
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

export const fun = "";
export const books = [];
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
];
