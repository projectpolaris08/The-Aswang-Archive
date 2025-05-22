import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedCreatures from '../components/home/FeaturedCreatures';
import FeaturedStories from '../components/home/FeaturedStories';
import RegionsSection from '../components/home/RegionsSection';
import Newsletter from '../components/home/Newsletter';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <FeaturedCreatures />
      <FeaturedStories />
      <RegionsSection />
      <Newsletter />
    </>
  );
};

export default HomePage;