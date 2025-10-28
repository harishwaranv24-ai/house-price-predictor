import { RegressionModel } from '../lib/regression';
import { TrendingUp, Activity } from 'lucide-react';

interface ModelStatsProps {
  model: RegressionModel | null;
}

export function ModelStats({ model }: ModelStatsProps) {
  if (!model) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Model Statistics</h2>
        </div>
        <p className="text-gray-400">Loading model...</p>
      </div>
    );
  }

  const rSquaredPercent = (model.rSquared * 100).toFixed(2);

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-cyan-400" />
        <h2 className="text-2xl font-bold text-white">Model Statistics</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/20">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-cyan-300">R² Score</h3>
          </div>
          <p className="text-4xl font-bold text-white">{rSquaredPercent}%</p>
          <p className="text-sm text-gray-400 mt-2">Model accuracy measure</p>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            Feature Coefficients
          </h3>
          {model.featureNames.map((name, index) => (
            <div key={name} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-gray-600 transition-all">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-medium capitalize">
                  {name.replace(/_/g, ' ')}
                </span>
                <span className="text-cyan-400 font-mono text-sm">
                  {model.coefficients[index].toFixed(4)}
                </span>
              </div>
            </div>
          ))}

          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/30">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 font-semibold">Intercept</span>
              <span className="text-blue-400 font-mono text-sm">
                {model.intercept.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
