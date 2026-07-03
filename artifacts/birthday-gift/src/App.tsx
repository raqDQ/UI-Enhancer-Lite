import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Router as WouterRouter, Route, Switch } from 'wouter';
import PageOne from './pages/PageOne';
import PageTwo from './pages/PageTwo';
import PageThree from './pages/PageThree';

const pageVariants = {
  enter: { x: '100%', opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
};

function AppContent() {
  const [page, setPage] = useState(0);

  const goNext = () => setPage((p) => Math.min(p + 1, 2));

  return (
    <div className="h-[100dvh] w-full overflow-hidden relative bg-[#FAF5EE]">
      <AnimatePresence mode="wait">
        {page === 0 && (
          <motion.div
            key="page-one"
            className="absolute inset-0"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <PageOne onNext={goNext} />
          </motion.div>
        )}

        {page === 1 && (
          <motion.div
            key="page-two"
            className="absolute inset-0"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <PageTwo onNext={goNext} isActive />
          </motion.div>
        )}

        {page === 2 && (
          <motion.div
            key="page-three"
            className="absolute inset-0"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <PageThree isActive />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Switch>
        <Route path="/" component={AppContent} />
        <Route component={AppContent} />
      </Switch>
    </WouterRouter>
  );
}

export default App;
