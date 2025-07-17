import React from 'react';
import { CheckCircleIcon, ArrowLeftIcon, ShoppingCartIcon } from 'lucide-react';
export const PillowRecommendation = ({
  measurements,
  onReset
}) => {
  const getPillowRecommendation = () => {
    const {
      neckLength,
      neckWidth,
      sleepPosition
    } = measurements;
    let heightScore = neckLength * 0.7 + neckWidth * 0.3;
    if (sleepPosition === 'side') {
      heightScore += 1;
    } else if (sleepPosition === 'stomach') {
      heightScore -= 1.5;
    }
    if (heightScore < 4) {
      return {
        type: 'Low Profile',
        firmness: sleepPosition === 'stomach' ? 'Soft' : 'Medium-Soft',
        height: '2-3"',
        material: 'Down or Memory Foam',
        imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        description: 'A flatter pillow ideal for stomach sleepers or those with a shorter neck-to-shoulder distance.'
      };
    } else if (heightScore < 6) {
      return {
        type: 'Medium Profile',
        firmness: 'Medium',
        height: '3-5"',
        material: 'Memory Foam or Hybrid',
        imageUrl: 'https://images.unsplash.com/photo-1631006387899-06240b7f6414?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        description: 'A balanced pillow suitable for most back sleepers and those with average measurements.'
      };
    } else {
      return {
        type: 'High Profile',
        firmness: sleepPosition === 'side' ? 'Firm' : 'Medium-Firm',
        height: '5-7"',
        material: 'Latex or Dense Memory Foam',
        imageUrl: 'https://images.unsplash.com/photo-1629949009710-f7bae3541d99?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        description: 'A taller pillow ideal for side sleepers or those with a larger neck-to-shoulder distance.'
      };
    }
  };
  const recommendation = getPillowRecommendation();
  return <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-lg shadow-gray-200/50 overflow-hidden">
      <div className="p-8 sm:p-10">
        <div className="flex items-center mb-8">
          <CheckCircleIcon className="h-8 w-8 text-blue-500" />
          <h2 className="ml-3 text-3xl font-medium text-gray-900">
            Your Perfect Match
          </h2>
        </div>
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-1/2">
            <img src={recommendation.imageUrl} alt={`${recommendation.type} pillow`} className="w-full h-auto rounded-2xl shadow-lg" />
          </div>
          <div className="lg:w-1/2">
            <h3 className="text-2xl font-medium text-gray-900 mb-3">
              {recommendation.type}
            </h3>
            <p className="text-gray-600 font-light text-lg mb-8">
              {recommendation.description}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[{
              label: 'Firmness',
              value: recommendation.firmness
            }, {
              label: 'Height',
              value: recommendation.height
            }, {
              label: 'Material',
              value: recommendation.material
            }, {
              label: 'Best For',
              value: `${measurements.sleepPosition.charAt(0).toUpperCase() + measurements.sleepPosition.slice(1)} Sleepers`
            }].map(item => <div key={item.label} className="backdrop-blur-md bg-gray-50/50 p-4 rounded-xl">
                  <span className="block text-sm text-gray-500 mb-1">
                    {item.label}
                  </span>
                  <span className="font-medium text-gray-900">
                    {item.value}
                  </span>
                </div>)}
            </div>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-center p-4 rounded-2xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all">
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Shop Now
              </button>
              <button onClick={onReset} className="w-full flex items-center justify-center p-4 rounded-2xl text-gray-600 bg-gray-100/50 hover:bg-gray-200/50 transition-all">
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Take New Measurements
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};