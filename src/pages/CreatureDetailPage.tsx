import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { creatures } from '../data/creatures';
import CreatureDetail from '../components/creatures/CreatureDetail';
import CreatureCard from '../components/creatures/CreatureCard';
import { ArrowLeft } from 'lucide-react';

const CreatureDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [relatedCreatures, setRelatedCreatures] = useState([]);

  // Find the selected creature
  const creature = creatures.find(c => c.id === id);

  useEffect(() => {
    if (creature) {
      // Get creatures with same type or origin, excluding current creature
      const related = creatures
        .filter(c => 
          c.id !== creature.id && (c.type === creature.type || c.origin === creature.origin)
        )
        .slice(0, 3);
      
      setRelatedCreatures(related);
    }
  }, [creature]);

  if (!creature) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-300 text-xl mb-4">Creature not found</p>
        <Link 
          to="/creatures" 
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to all creatures
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <Link 
          to="/creatures" 
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to all creatures
        </Link>

        <CreatureDetail creature={creature} />

        {/* Related creatures */}
        {relatedCreatures.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-white mb-8">
              Related Creatures
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedCreatures.map(creature => (
                <CreatureCard key={creature.id} creature={creature} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatureDetailPage;