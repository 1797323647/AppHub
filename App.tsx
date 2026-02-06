
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Download, Star, Sparkles, X, Share2, Check, AlertCircle, ShieldCheck, Globe, Zap } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { APPS, CATEGORIES } from './constants';
import { AppItem } from './types';

// Components
const Header: React.FC<{ onShare: () => void }> = ({ onShare }) => (
  <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200">
          A
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 leading-none">
            AppHub
          </span>
          <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">Global Directory</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          onClick={onShare}
          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
          title="分享此网页"
        >
          <Share2 size={20} />
        </button>
        <button className="hidden sm:block bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-all shadow-md hover:shadow-indigo-200">
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
        <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-inner border border-gray-50 group-hover:scale-105 transition-transform">
          <img src={app.icon} alt={app.name} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
          <Star size={12} className="text-yellow-500 fill-yellow-500 mr-1" />
          <span className="text-xs font-bold text-yellow-700">{app.rating.toFixed(1)}</span>
        </div>
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{app.name}</h3>
      <p className="text-xs text-gray-500 line-clamp-2 mb-5 h-8 leading-relaxed">
        {app.description}
      </p>
      
      <div className="flex flex-wrap gap-2">
        {app.downloads.map((dl) => (
          <a
            key={dl.platform}
            href={dl.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-600 hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
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
    const url = "https://cccccccc.xyz";
    if (navigator.share) {
      navigator.share({
        title: 'AppHub - 官方认证应用导航站',
        text: '我发现了一个超赞的全球主流应用下载站，推荐给你！',
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
      setAiError("请先在 Vercel 环境变量中配置 API_KEY。");
      return;
    }

    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "帮我推荐 5 个当前全球非常流行且实用的主流应用程序，包含理由。以JSON数组格式返回，包含'name'和'reason'属性。",
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
      setAiError("AI 服务连接超时，请检查您的网络连接或 API Key 状态。");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-100">
      <Header onShare={handleShare} />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 px-4 overflow-hidden bg-white">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-5">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500 rounded-full blur-[120px]"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-bold mb-6">
              <Zap size={14} className="fill-indigo-600" />
              <span>官方域名 cccccccc.xyz 已正式启用</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
              探索更高效的<br />
              <span className="text-indigo-600">数字生活方式</span>
            </h1>
            <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto font-medium">
              精选全球主流应用官方渠道，每一个链接都经过安全扫描。
            </p>
            
            <div className="max-w-xl mx-auto relative px-2">
              <div className="relative flex items-center bg-white rounded-2xl shadow-2xl p-2 border border-gray-100">
                <Search className="ml-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="搜索全球热门应用..."
                  className="w-full px-3 py-2 outline-none text-base text-gray-700 bg-transparent font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                  onClick={handleAiRecommendation}
                  className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-all flex items-center shadow-lg shadow-indigo-100 group"
                >
                  <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Navigation */}
        <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex overflow-x-auto space-x-2 py-4 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex-shrink-0 flex items-center px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                      : 'bg-transparent text-gray-500 hover:bg-slate-50'
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
        <section className="py-12 px-4 max-w-7xl mx-auto">
          {filteredApps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredApps.map(app => <AppCard key={app.id} app={app} />)}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-slate-300" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">未找到相关应用</h3>
              <p className="text-gray-400 text-sm mt-1">请尝试其他关键词或分类</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer with Security Badges */}
      <footer className="bg-white border-t border-slate-100 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2 mb-4 text-indigo-600">
                <ShieldCheck size={24} />
                <span className="font-bold">官方渠道</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                AppHub 仅收录官方发行链接，确保您的下载安全，远离恶意软件与流氓弹窗。
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2 mb-4 text-indigo-600">
                <Globe size={24} />
                <span className="font-bold">多平台覆盖</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                无论您使用 Windows、macOS、iOS 还是 Android，都能在此找到最适合您的版本。
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2 mb-4 text-indigo-600">
                <Zap size={24} />
                <span className="font-bold">极速下载</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                直连开发者官方下载地址，享受无限制的原始下载带宽，安全更快捷。
              </p>
            </div>
          </div>
          
          <div className="border-t border-slate-50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 text-xs font-medium">
              © 2024 AppHub Directory. 您的数字生活助手。
            </div>
            <div className="flex items-center space-x-6 text-xs text-slate-400 font-bold uppercase tracking-wider">
               <span className="flex items-center"><Check size={12} className="text-green-500 mr-1" /> 已通过 cccccccc.xyz 身份验证</span>
               <span className="flex items-center"><Check size={12} className="text-green-500 mr-1" /> 阿里云 DNS 托管</span>
            </div>
          </div>
        </div>
      </footer>

      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-gray-900/90 backdrop-blur-md text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center space-x-3 text-sm animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Check size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold">链接已成功复制</span>
            <span className="text-[10px] text-gray-400">官方网址 cccccccc.xyz 已准备好分享</span>
          </div>
        </div>
      )}

      {/* AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowAiModal(false)}></div>
          <div className="relative bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold leading-none">AI 智能发现</h3>
                  <span className="text-[10px] opacity-70">Gemini 3 Pro 驱动</span>
                </div>
              </div>
              <button onClick={() => setShowAiModal(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto no-scrollbar">
              {isAiLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <Sparkles size={16} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" />
                  </div>
                  <p className="text-sm font-bold text-slate-400 mt-6 text-center">正在为您搜寻全球最新应用...</p>
                </div>
              ) : aiError ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={32} className="text-red-400" />
                  </div>
                  <p className="text-sm text-gray-600 px-8 leading-relaxed font-medium">{aiError}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {aiSuggestions.map((item, idx) => (
                    <div key={idx} className="group bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                         <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                         <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-md font-bold">推荐</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">{item.reason}</p>
                    </div>
                  ))}
                  <div className="bg-indigo-50 p-4 rounded-2xl flex items-center space-x-3 mt-6">
                    <Globe size={16} className="text-indigo-600" />
                    <p className="text-[10px] text-indigo-700 font-bold leading-tight">以上内容为 AI 智能生成。如需下载，请直接在主页面搜索对应应用名称。</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
