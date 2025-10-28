import { DollarSign, TrendingUp } from 'lucide-react';

interface PredictionResultProps {
  price: number | null;
}

export function PredictionResult({ price }: PredictionResultProps) {
  if (price === null) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Predicted Price</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-400">Enter property details to get a price prediction</p>
        </div>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);

  const priceRange = {
    low: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price * 0.95),
    high: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price * 1.05)
  };

  return (
    <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-2xl p-8 border border-cyan-500/30 shadow-2xl animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="w-6 h-6 text-cyan-400" />
        <h2 className="text-2xl font-bold text-white">Predicted Price</h2>
      </div>

      <div className="text-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-cyan-500/30">
            <div className="flex items-center justify-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-cyan-400" />
            </div>
            <p className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {formattedPrice}
            </p>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <p className="text-sm text-gray-400 mb-3">Estimated Price Range</p>
          <div className="flex justify-between items-center text-lg">
            <span className="text-gray-300">{priceRange.low}</span>
            <span className="text-gray-500">-</span>
            <span className="text-gray-300">{priceRange.high}</span>
          </div>
          <p className="text-xs text-gray-500 mt-3">±5% confidence interval</p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
            <p className="text-xs text-gray-400 mb-1">Low</p>
            <p className="text-sm font-semibold text-gray-300">{priceRange.low}</p>
          </div>
          <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/30">
            <p className="text-xs text-cyan-400 mb-1">Expected</p>
            <p className="text-sm font-semibold text-white">{formattedPrice}</p>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
            <p className="text-xs text-gray-400 mb-1">High</p>
            <p className="text-sm font-semibold text-gray-300">{priceRange.high}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
