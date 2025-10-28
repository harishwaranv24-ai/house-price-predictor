import { useEffect, useState } from 'react';
import { House, supabase } from '../lib/supabase';
import { BarChart3, Database } from 'lucide-react';

export function DataVisualization() {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHouses();
  }, []);

  async function loadHouses() {
    const { data, error } = await supabase
      .from('houses')
      .select('*')
      .order('actual_price', { ascending: true });

    if (data && !error) {
      setHouses(data);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Training Data</h2>
        </div>
        <p className="text-gray-400">Loading data...</p>
      </div>
    );
  }

  const maxPrice = Math.max(...houses.map(h => h.actual_price));

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-cyan-400" />
        <h2 className="text-2xl font-bold text-white">Training Data Distribution</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-gray-300">Dataset Size</span>
          </div>
          <p className="text-3xl font-bold text-white">{houses.length} houses</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Price Distribution</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {houses.map((house, index) => {
              const width = (house.actual_price / maxPrice) * 100;
              const formattedPrice = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(house.actual_price);

              return (
                <div key={house.id || index} className="group">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-800/30 rounded-lg overflow-hidden border border-gray-700/50 hover:border-cyan-500/30 transition-all">
                      <div
                        className="h-10 bg-gradient-to-r from-cyan-500/40 to-blue-500/40 flex items-center justify-end pr-3 transition-all duration-300"
                        style={{ width: `${width}%` }}
                      >
                        <span className="text-xs font-semibold text-white">
                          {formattedPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 ml-1 group-hover:text-gray-400 transition-colors">
                    {house.square_feet} sq ft • {house.bedrooms} bed • {house.bathrooms} bath
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
            <p className="text-xs text-gray-400 mb-1">Min Price</p>
            <p className="text-lg font-semibold text-cyan-400">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0
              }).format(Math.min(...houses.map(h => h.actual_price)))}
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
            <p className="text-xs text-gray-400 mb-1">Max Price</p>
            <p className="text-lg font-semibold text-cyan-400">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0
              }).format(maxPrice)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
