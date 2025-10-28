import { useEffect, useState } from 'react';
import { Home } from 'lucide-react';
import { supabase, House } from './lib/supabase';
import { RegressionModel, trainModel } from './lib/regression';
import { ModelStats } from './components/ModelStats';
import { PredictionForm } from './components/PredictionForm';
import { PredictionResult } from './components/PredictionResult';
import { DataVisualization } from './components/DataVisualization';

function App() {
  const [model, setModel] = useState<RegressionModel | null>(null);
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAndTrainModel();
  }, []);

  async function loadAndTrainModel() {
    try {
      const { data, error } = await supabase
        .from('houses')
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        const trainedModel = trainModel(data as House[]);
        setModel(trainedModel);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading model...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative">
        <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl shadow-lg">
                <Home className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  House Price Predictor
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Multiple Linear Regression Model
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 space-y-8">
              <PredictionForm model={model} onPrediction={setPredictedPrice} />
              <PredictionResult price={predictedPrice} />
            </div>

            <div className="space-y-8">
              <ModelStats model={model} />
            </div>
          </div>

          <div className="mt-8">
            <DataVisualization />
          </div>
        </main>

        <footer className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-xl mt-16">
          <div className="container mx-auto px-6 py-6">
            <p className="text-center text-gray-500 text-sm">
              Powered by Multiple Linear Regression • Training on {model ? '25 data points' : 'N/A'}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
