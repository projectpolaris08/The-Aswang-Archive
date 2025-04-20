import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CreaturesPage from './pages/CreaturesPage';
import CreatureDetailPage from './pages/CreatureDetailPage';
import StoriesPage from './pages/StoriesPage';
import StoryDetailPage from './pages/StoryDetailPage';
import RegionsPage from './pages/RegionsPage';
import RegionDetailPage from './pages/RegionDetailPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="creatures" element={<CreaturesPage />} />
          <Route path="creatures/:id" element={<CreatureDetailPage />} />
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