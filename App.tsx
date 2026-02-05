
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Globe, Download, Star, Sparkles, X, Share2, Check, AlertCircle } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { APPS, CATEGORIES } from './constants';
import { AppItem, Category } from './types';

// Components
const Header: React.FC<{ onShare: () => void }> = ({ onShare }) => (
  <header className="bg-white border-b sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
          A
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          AppHub
        </span>
      </div>
      <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-500">
        <a href="#" className="text-indigo-600 border-b-2 border-indigo-600 pb-1">主页</a>
        <a href="#" className="hover:text-indigo-600 transition-colors">热门榜单</a>
        <a href="#" className="hover:text-indigo-600 transition-colors">分类</a>
      </nav>
      <div className="flex items-center space-x-3">
        <button 
          onClick={onShare}
          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
          title="分享此网页"
        >
          <Share2 size={20} />
        </button>
        <button className="hidden sm:block bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-shadow shadow-md hover:shadow-lg">
          提交应用
        </button>
      </div>
    </div>
  </header>
);

const AppCard: React.FC<{ app: AppItem }> = ({ app }) => {
  return (
    <div className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-inner border border-gray-50 bg-white">
          <img src={app.icon} alt={app.name} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
          <Star size={14} className="text-yellow-500 fill-yellow-500 mr-1" />
          <span className="text-xs font-bold text-yellow-700">{app.rating.toFixed(1)}</span>
        </div>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{app.name}</h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-6 h-10">
        {app.description}
      </p>
      
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {app.downloads.map((dl) => (
            <a
              key={dl.platform}
              href={dl.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <Download size={12} className="mr-1.5" />
              {dl.platform}
            </a>
          ))}
        </div>
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

  const featuredApps = useMemo(() => APPS.filter(app => app.featured), []);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    });
  };

  const handleAiRecommendation = async () => {
    setShowAiModal(true);
    setAiError(null);
    
    if (!process.env.API_KEY) {
      setAiError("由于未配置 API Key，无法使用 AI 功能。");
      return;
    }

    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "帮我推荐 5 个除了微信、TikTok、Notion 以外的当前非常流行或实用的主流应用程序名（包含中文名），简要说明理由。以JSON数组格式返回，包含'name'和'reason'属性。",
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
      const data = JSON.parse(response.text);
      setAiSuggestions(data);
    } catch (error) {
      console.error("AI Error:", error);
      setAiError("AI 推荐暂时不可用，请稍后再试。");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <Header onShare={handleShare} />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden bg-white">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10"></div>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
              找到你的<br />
              <span className="text-indigo-600">下一款必备应用</span>
            </h1>
            <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-2xl mx-auto">
              收录全球主流应用程序下载链接。安全、高效、美观。一键直达官方下载页面。
            </p>
            
            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute inset-0 bg-indigo-200 blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
              <div className="relative flex items-center bg-white rounded-2xl shadow-xl p-2 border border-gray-100">
                <Search className="ml-4 text-gray-400" size={24} />
                <input
                  type="text"
                  placeholder="搜索应用程序、功能或平台..."
                  className="w-full px-4 py-3 outline-none text-lg text-gray-700 bg-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                  onClick={handleAiRecommendation}
                  className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-all flex items-center space-x-2"
                >
                  <Sparkles size={20} />
                  <span className="hidden sm:inline font-medium">AI 推荐</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="bg-gray-50 py-10 sticky top-16 z-40 border-b border-gray-200/50 backdrop-blur-md bg-white/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto space-x-4 pb-2 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex-shrink-0 flex items-center px-6 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 translate-y-[-2px]'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
                  }`}
                >
                  <span className="mr-2">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Section */}
        {selectedCategory === 'all' && !searchTerm && (
          <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  精选推荐 <Sparkles className="ml-2 text-indigo-500" size={20} />
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredApps.map(app => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Main Grid */}
        <section className="py-12 bg-gray-50 min-h-[400px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory === 'all' ? '全部应用' : CATEGORIES.find(c => c.id === selectedCategory)?.name}
                <span className="ml-3 text-sm font-normal text-gray-400">({filteredApps.length} 款)</span>
              </h2>
            </div>
            
            {filteredApps.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredApps.map(app => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <Search className="text-gray-300" size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-900">未找到相关应用</h3>
                <p className="text-gray-500">试试搜索“办公”或者切换分类浏览。</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
                <span className="text-xl font-bold text-gray-900">AppHub</span>
              </div>
              <p className="text-gray-500 max-w-sm mb-6 leading-relaxed">
                AppHub 致力于让寻找好软件变得更简单。我们只推荐经过验证的、主流的应用程序官方下载地址，保护您的数字资产安全。
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                  <Globe size={18} />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6">分类目录</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                {CATEGORIES.slice(1, 5).map(c => (
                  <li key={c.id}><button onClick={() => setSelectedCategory(c.id)} className="hover:text-indigo-600 text-left">{c.name}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6">帮助与支持</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-indigo-600">提交新应用</a></li>
                <li><a href="#" className="hover:text-indigo-600">服务条款</a></li>
                <li><a href="#" className="hover:text-indigo-600">关于我们</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2024 AppHub Global. 纯前端演示项目。</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="text-xs">支持中文/English</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 animate-in slide-in-from-bottom-4 duration-300">
          <Check size={18} className="text-green-400" />
          <span className="font-medium">链接已复制，去分享给好友吧！</span>
        </div>
      )}

      {/* AI Suggestions Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAiModal(false)}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b flex items-center justify-between bg-indigo-600 text-white">
              <div className="flex items-center space-x-2">
                <Sparkles size={20} />
                <h3 className="font-bold text-lg">AI 智能推荐</h3>
              </div>
              <button onClick={() => setShowAiModal(false)} className="hover:bg-white/20 p-1 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {isAiLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500 font-medium">Gemini 正在为您挑选精选应用...</p>
                </div>
              ) : aiError ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="bg-red-50 p-4 rounded-full text-red-500 mb-4">
                    <AlertCircle size={32} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">出错了</h4>
                  <p className="text-gray-500 text-sm mb-6 max-w-xs">{aiError}</p>
                  <button 
                    onClick={() => setShowAiModal(false)}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
                  >
                    关闭
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {aiSuggestions.map((item: any, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-indigo-200 transition-colors">
                      <h4 className="font-bold text-gray-900 mb-1">{item.name}</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.reason}</p>
                    </div>
                  ))}
                  <button 
                    onClick={() => setShowAiModal(false)}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors mt-4"
                  >
                    太棒了，知道了
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
