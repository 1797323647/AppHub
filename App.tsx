
import React, { useState, useMemo } from 'react';
import { Search, Download, Star, Sparkles, X, Share2, Check, AlertCircle, HelpCircle, Wifi } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { APPS, CATEGORIES } from './constants';
import { AppItem } from './types';

// Components
const Header: React.FC<{ onShare: () => void }> = ({ onShare }) => (
  <header className="bg-white border-b sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200">
          A
        </div>
        <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          AppHub
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          onClick={onShare}
          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
          title="分享此网页"
        >
          <Share2 size={20} />
        </button>
        <button className="hidden sm:block bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-shadow">
          提交应用
        </button>
      </div>
    </div>
  </header>
);

const AppCard: React.FC<{ app: AppItem }> = ({ app }) => {
  return (
    <div className="group bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-inner border border-gray-50">
          <img src={app.icon} alt={app.name} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
          <Star size={12} className="text-yellow-500 fill-yellow-500 mr-1" />
          <span className="text-xs font-bold text-yellow-700">{app.rating.toFixed(1)}</span>
        </div>
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{app.name}</h3>
      <p className="text-xs text-gray-500 line-clamp-2 mb-5 h-8">
        {app.description}
      </p>
      
      <div className="flex flex-wrap gap-2">
        {app.downloads.map((dl) => (
          <a
            key={dl.platform}
            href={dl.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          >
            <Download size={10} className="mr-1" />
            {dl.platform}
          </a>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{name: string, reason: string}[]>([]);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const filteredApps = useMemo(() => {
    return APPS.filter((app) => {
      const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            app.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'AppHub - 全球主流应用下载导航',
        url: url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      });
    }
  };

  const handleAiRecommendation = async () => {
    setShowAiModal(true);
    setAiError(null);
    
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      setAiError("请在 Vercel 环境变量中设置 API_KEY 以使用 AI 推荐功能。");
      return;
    }

    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "帮我推荐 5 个当前全球非常流行且实用的主流应用程序，包含理由。JSON格式。",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                reason: { type: Type.STRING },
              },
              required: ["name", "reason"]
            }
          }
        }
      });
      setAiSuggestions(JSON.parse(response.text || '[]'));
    } catch (error) {
      setAiError("AI 服务连接失败，可能因地区网络原因受限。");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-100">
      <Header onShare={handleShare} />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-12 md:py-20 px-4 overflow-hidden bg-white">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
              探索更高效的<br />
              <span className="text-indigo-600">数字生活方式</span>
            </h1>
            <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
              精选全球主流应用官方下载链接，告别不安全来源。
            </p>
            
            <div className="max-w-xl mx-auto relative">
              <div className="relative flex items-center bg-white rounded-2xl shadow-lg p-1.5 border border-gray-100">
                <Search className="ml-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="搜索应用..."
                  className="w-full px-3 py-2 outline-none text-base text-gray-700 bg-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                  onClick={handleAiRecommendation}
                  className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-all"
                >
                  <Sparkles size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex overflow-x-auto space-x-3 py-4 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex-shrink-0 flex items-center px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
                  }`}
                >
                  <span className="mr-2 text-base">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Apps Grid */}
        <section className="py-8 px-4 max-w-7xl mx-auto">
          {filteredApps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredApps.map(app => <AppCard key={app.id} app={app} />)}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <Search className="text-gray-200 mx-auto mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900">暂无结果</h3>
            </div>
          )}
        </section>
      </main>

      {/* Footer Connectivity Notice */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8 text-sm">
            <div className="flex items-center space-x-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
              <Wifi size={14} className="text-green-500" />
              <span>大陆访问受限？建议绑定自定义域名或使用网络工具</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
              <HelpCircle size={14} className="text-blue-400" />
              <span>数据均来自应用官方渠道</span>
            </div>
          </div>
          <p className="text-xs mb-2">© 2024 AppHub. Built for global users.</p>
          <p className="text-[10px] opacity-50">Deployed via Vercel. Domains ending in .vercel.app may be unstable in certain regions.</p>
        </div>
      </footer>

      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 text-sm">
          <Check size={16} className="text-green-400" />
          <span>链接已复制</span>
        </div>
      )}

      {showAiModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAiModal(false)}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-5 border-b flex items-center justify-between bg-indigo-600 text-white">
              <div className="flex items-center space-x-2">
                <Sparkles size={18} />
                <h3 className="font-bold">AI 智能发现</h3>
              </div>
              <button onClick={() => setShowAiModal(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 max-h-[70vh] overflow-y-auto no-scrollbar">
              {isAiLoading ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-sm text-gray-500 text-center px-4">AI 正在努力思考... <br/>(若网络不佳，加载可能稍慢)</p>
                </div>
              ) : aiError ? (
                <div className="text-center py-6">
                  <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 px-6 leading-relaxed">{aiError}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {aiSuggestions.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{item.name}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{item.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
