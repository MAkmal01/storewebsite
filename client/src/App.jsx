import { useState, useEffect } from 'react';
import { 
  Database, 
  Server, 
  Layers, 
  ShoppingBag, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { checkHealth } from './api/client';

export default function App() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await checkHealth();
      setHealthData(data);
    } catch (err) {
      console.error('Error fetching health status:', err);
      setError(err.response?.data?.message || err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const isDbConnected = healthData?.database?.status === 'connected';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Store Website
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                MERN Stack
              </span>
            </div>
          </div>
          
          <button
            onClick={fetchHealth}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 active:bg-slate-800 text-slate-300 rounded-lg border border-slate-700 transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Status
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5" /> Environment Successfully Initialized
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            MERN Stack Environment Ready
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Your full-stack modern architecture is configured and ready for building your e-commerce store website.
          </p>
        </div>

        {/* Stack Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Frontend Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
                <Layers className="w-6 h-6" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" /> Online
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">React Frontend</h3>
            <p className="text-xs text-slate-400 mb-4">Vite + React 19 + Tailwind CSS</p>
            <div className="text-xs text-slate-500 space-y-1">
              <p>• Dev Server: Port 5173</p>
              <p>• API Proxy: Active (/api → :5000)</p>
            </div>
          </div>

          {/* Backend Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
                <Server className="w-6 h-6" />
              </div>
              {loading ? (
                <span className="text-xs text-slate-400 animate-pulse">Checking...</span>
              ) : healthData?.status === 'ok' ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <AlertCircle className="w-3.5 h-3.5" /> Offline
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Express Server</h3>
            <p className="text-xs text-slate-400 mb-4">Node.js + Express + CORS + Dotenv</p>
            <div className="text-xs text-slate-500 space-y-1">
              <p>• Server Port: 5000</p>
              <p>• Uptime: {healthData?.uptime || 'N/A'}</p>
            </div>
          </div>

          {/* Database Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <Database className="w-6 h-6" />
              </div>
              {loading ? (
                <span className="text-xs text-slate-400 animate-pulse">Checking...</span>
              ) : isDbConnected ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <AlertCircle className="w-3.5 h-3.5" /> Disconnected
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-white mb-1">MongoDB Database</h3>
            <p className="text-xs text-slate-400 mb-4">Mongoose ODM Local Instance</p>
            <div className="text-xs text-slate-500 space-y-1">
              <p>• Database: {healthData?.database?.name || 'store_website'}</p>
              <p>• Host: {healthData?.database?.host || '127.0.0.1:27017'}</p>
            </div>
          </div>
        </div>

        {/* Health Check Diagnostics banner if error */}
        {error && (
          <div className="p-4 mb-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Backend Connection Notice</p>
              <p className="text-rose-300/90 text-xs mt-0.5">{error}</p>
              <p className="text-rose-400/80 text-xs mt-2">Ensure the server is running by executing <code className="bg-rose-950/60 px-1 py-0.5 rounded text-rose-200">npm run dev</code> in the project root.</p>
            </div>
          </div>
        )}

        {/* Project Architecture & Next Steps */}
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" /> Next Steps & Architecture
          </div>
          <h2 className="text-xl font-bold text-white mb-4">Ready to start developing your store features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <p className="font-semibold text-slate-200 mb-1">1. Models & Schemas</p>
              <p className="text-xs text-slate-400">Create schemas in <code className="text-indigo-300">server/src/models/</code> for Products, Categories, Users, and Orders.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <p className="font-semibold text-slate-200 mb-1">2. RESTful API Routes</p>
              <p className="text-xs text-slate-400">Define controllers and endpoints in <code className="text-indigo-300">server/src/routes/</code> with input validation.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <p className="font-semibold text-slate-200 mb-1">3. Frontend UI & Storefront</p>
              <p className="text-xs text-slate-400">Build components in <code className="text-indigo-300">client/src/components/</code> with product cards, cart, and checkout.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
        MERN Stack Project Environment • Created for Store Website
      </footer>
    </div>
  );
}
