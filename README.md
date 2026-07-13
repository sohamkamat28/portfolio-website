# Soham Kamat - Portfolio

A responsive, accessible portfolio for Soham Kamat's AI, machine learning, and data science work. The site uses an editorial typographic hero, concise project case studies, live GitHub activity, light and dark themes, and real project screenshots.

The mobile layout is intentionally composed for touch screens, with safe-area support, large tap targets, compact project cards, a swipeable GitHub contribution grid, and responsive typography down to 320px-wide devices.

## Run locally

```bash
npm install
npm run dev
```

Create and preview the production build:

```bash
npm run build
npm run preview
```

## Project structure

- `src/App.jsx` contains the portfolio content and React components.
- `src/styles.css` contains the design system, responsive layouts, themes, and motion.
- `public/assets` contains optimized project imagery.
- `public/Soham_Kamat_Resume.pdf` is the downloadable resume.

## Deployment

The project is Vite-based and ready for Vercel. Use `npm run build` as the build command and `dist` as the output directory.
