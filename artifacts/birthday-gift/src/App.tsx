import { Route, Switch, Router as WouterRouter } from 'wouter';
import PageOne from './pages/PageOne';
import PageTwo from './pages/PageTwo';
import PageThree from './pages/PageThree';

function AppContent() {
  return (
    <div 
      className="h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
      style={{
        scrollBehavior: 'smooth',
      }}
    >
      <section className="snap-start h-[100dvh] w-full">
        <PageOne />
      </section>
      <section className="snap-start h-[100dvh] w-full">
        <PageTwo />
      </section>
      <section className="snap-start h-[100dvh] w-full">
        <PageThree />
      </section>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={AppContent} />
      {/* We route everything else back to / for this single page experience */}
      <Route component={AppContent} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Router />
    </WouterRouter>
  );
}

export default App;
