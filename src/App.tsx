import { useEffect } from 'react';
import { motion, MotionConfig, useScroll, useSpring } from 'framer-motion';
import { useRoute } from './lib/hash';
import TopBar from './components/TopBar';
import HomePage from './pages/HomePage';
import StoriesPage from './pages/StoriesPage';
import StoryPage from './pages/StoryPage';
import MapPage from './pages/MapPage';
import TimePage from './pages/TimePage';
import PeoplePage from './pages/PeoplePage';
import JournalPage from './pages/JournalPage';
import BooksPage from './pages/BooksPage';

export default function App() {
  const { parts, params } = useRoute();
  const section = parts[0] ?? '';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [section, parts[1]]);

  let page;
  switch (section) {
    case 'stories':
      page = parts[1] ? <StoryPage id={parts[1]} level={params.get('level')} /> : <StoriesPage book={params.get('book')} />;
      break;
    case 'books':
      page = <BooksPage />;
      break;
    case 'map':
      page = <MapPage routeId={params.get('route')} />;
      break;
    case 'time':
      page = <TimePage />;
      break;
    case 'people':
      page = <PeoplePage />;
      break;
    case 'journal':
      page = <JournalPage />;
      break;
    default:
      page = <HomePage />;
  }

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <MotionConfig reducedMotion="user">
      <motion.div className="reading-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <a className="skip" href="#main">דילוג לתוכן</a>
      <TopBar active={section} />
      <main id="main" className="page">
        <motion.div key={`${section}-${parts[1] ?? ''}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          {page}
        </motion.div>
      </main>
      <footer className="foot">
        <p>
          מקור הטקסט: המקרא לפי הכתיב. כל פרשנות מסומנת בסוגה שלה: טקסט, רמז, מדרש, פרשנות מסורתית או קבלה.
        </p>
      </footer>
    </MotionConfig>
  );
}
