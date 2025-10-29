
import { useState, useMemo } from 'react';
import { FEATURE_REGISTRY, getFeaturesByCategory, getFeaturesByStatus, type FeatureMetadata } from '@/app/features/registry';

export function useFeatures() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const allFeatures = useMemo(() => Object.values(FEATURE_REGISTRY), []);

  const filteredFeatures = useMemo(() => {
    let features = allFeatures;

    // Filter by category
    if (activeCategory !== 'all') {
      features = getFeaturesByCategory(activeCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      features = features.filter(f => 
        f.name.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query)
      );
    }

    return features;
  }, [allFeatures, activeCategory, searchQuery]);

  const featuresByStatus = useMemo(() => ({
    live: getFeaturesByStatus('live'),
    beta: getFeaturesByStatus('beta'),
    comingSoon: getFeaturesByStatus('coming-soon')
  }), []);

  return {
    allFeatures,
    filteredFeatures,
    featuresByStatus,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory
  };
}
