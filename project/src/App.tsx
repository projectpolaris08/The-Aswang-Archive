import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CreaturesPage from './pages/CreaturesPage';
import CreatureDetailPage from './pages/CreatureDetailPage';
import ShamansHealersPage from './pages/shamanHealersPage';
import ShamanDetailPage from './pages/ShamanDetailPage';
import StoriesPage from './pages/StoriesPage';
import StoryDetailPage from './pages/StoryDetailPage';
import RegionsPage from './pages/RegionsPage';
import RegionDetailPage from './pages/RegionDetailPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

// ScrollToTop component that will handle smooth scroll behavior
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // This enables smooth scrolling
    });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="creatures" element={<CreaturesPage />} />
          <Route path="creatures/:id" element={<CreatureDetailPage />} />
          <Route path="shamans-healers" element={<ShamansHealersPage />} />
          <Route path="shamans-healers/:id" element={<ShamanDetailPage />} />
          <Route path="stories" element={<StoriesPage />} />
          <Route path="stories/:id" element={<StoryDetailPage />} />
          <Route path="regions" element={<RegionsPage />} />
          <Route path="regions/:id" element={<RegionDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;