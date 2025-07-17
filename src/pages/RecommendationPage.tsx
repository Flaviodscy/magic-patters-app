import React from 'react';
import { PillowRecommendation } from '../components/PillowRecommendation';
export const RecommendationPage = ({
  measurements,
  onReset
}) => {
  return <PillowRecommendation measurements={measurements} onReset={onReset} />;
};