import React from 'react';
import { MeasurementForm } from '../components/MeasurementForm';
export const MeasurementPage = ({
  onSubmit
}) => {
  return <MeasurementForm onSubmit={onSubmit} />;
};