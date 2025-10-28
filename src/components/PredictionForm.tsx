import { useState } from 'react';
import { Home, Calculator } from 'lucide-react';
import { RegressionModel, predict } from '../lib/regression';
import { supabase } from '../lib/supabase';

interface PredictionFormProps {
  model: RegressionModel | null;
  onPrediction: (price: number) => void;
}

export function PredictionForm({ model, onPrediction }: PredictionFormProps) {
  const [formData, setFormData] = useState({
    square_feet: 2000,
    bedrooms: 3,
    bathrooms: 2,
    year_built: 2015,
    lot_size: 6000,
    garage_spaces: 2,
    location_score: 7.5
  });

  const [isCalculating, setIsCalculating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!model) return;

    setIsCalculating(true);

    const predictedPrice = predict(model, formData);
    onPrediction(predictedPrice);

    await supabase.from('predictions').insert({
      ...formData,
      predicted_price: predictedPrice
    });

    setTimeout(() => setIsCalculating(false), 600);
  };

  const handleChange = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Home className="w-6 h-6 text-cyan-400" />
        <h2 className="text-2xl font-bold text-white">Property Details</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex justify-between">
              <span>Square Feet</span>
              <span className="text-cyan-400">{formData.square_feet.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min="800"
              max="5000"
              step="50"
              value={formData.square_feet}
              onChange={(e) => handleChange('square_feet', Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex justify-between">
              <span>Bedrooms</span>
              <span className="text-cyan-400">{formData.bedrooms}</span>
            </label>
            <input
              type="range"
              min="1"
              max="8"
              step="1"
              value={formData.bedrooms}
              onChange={(e) => handleChange('bedrooms', Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex justify-between">
              <span>Bathrooms</span>
              <span className="text-cyan-400">{formData.bathrooms}</span>
            </label>
            <input
              type="range"
              min="1"
              max="6"
              step="0.5"
              value={formData.bathrooms}
              onChange={(e) => handleChange('bathrooms', Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex justify-between">
              <span>Year Built</span>
              <span className="text-cyan-400">{formData.year_built}</span>
            </label>
            <input
              type="range"
              min="1980"
              max="2024"
              step="1"
              value={formData.year_built}
              onChange={(e) => handleChange('year_built', Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex justify-between">
              <span>Lot Size (sq ft)</span>
              <span className="text-cyan-400">{formData.lot_size.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min="2000"
              max="20000"
              step="500"
              value={formData.lot_size}
              onChange={(e) => handleChange('lot_size', Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex justify-between">
              <span>Garage Spaces</span>
              <span className="text-cyan-400">{formData.garage_spaces}</span>
            </label>
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={formData.garage_spaces}
              onChange={(e) => handleChange('garage_spaces', Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-300 flex justify-between">
              <span>Location Score</span>
              <span className="text-cyan-400">{formData.location_score.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.1"
              value={formData.location_score}
              onChange={(e) => handleChange('location_score', Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <p className="text-xs text-gray-500 mt-1">1 = Poor Location, 10 = Premium Location</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={!model || isCalculating}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Calculator className={`w-5 h-5 ${isCalculating ? 'animate-pulse' : ''}`} />
          {isCalculating ? 'Calculating...' : 'Predict House Price'}
        </button>
      </form>
    </div>
  );
}
