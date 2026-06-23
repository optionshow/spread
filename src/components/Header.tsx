import React from "react";
import { ShieldCheck, TrendingUp, HelpCircle, BookOpen, Calculator, Network } from "lucide-react";

interface HeaderProps {
  activeTab: "main" | "stats";
  setActiveTab: (tab: "main" | "stats") => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="border-b border-sky-100 bg-white/95 text-slate-800 backdrop-blur-md sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-display flex items-center gap-1.5 leading-none text-slate-900">
                台指選擇權價差評估與風控系統
                <span className="text-[10px] border px-2 py-0.5 rounded font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  v1.2.3
                </span>
              </h1>
            </div>
          </div>

          {/* Buttons container aligned to the right */}
          <div className="flex items-center gap-2.5 self-start sm:self-center">
            <button
              onClick={() => {
                window.open(`${window.location.origin}${window.location.pathname}?page=guide`, "_blank");
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 border shadow-sm bg-white text-slate-750 border-sky-200 hover:bg-sky-50"
            >
              <HelpCircle className="w-4 h-4 text-sky-500" />
              介面解說
            </button>

            <button
              onClick={() => {
                window.open(`${window.location.origin}${window.location.pathname}?page=mindmap`, "_blank");
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 border shadow-sm bg-white text-slate-750 border-sky-200 hover:bg-sky-50"
            >
              <Network className="w-4 h-4 text-emerald-600" />
              心智圖
            </button>

            <button
              onClick={() => setActiveTab(activeTab === "main" ? "stats" : "main")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 border shadow-sm ${
                activeTab === "stats"
                  ? "bg-teal-500 text-white border-teal-400 font-bold shadow-teal-500/15 hover:bg-teal-600"
                  : "bg-white text-slate-750 border-sky-200 hover:bg-sky-50"
              }`}
            >
              {activeTab === "stats" ? (
                <>
                  <Calculator className="w-4 h-4 text-white" />
                  返回試算評估
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  績效統計
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export const StrategyGuide: React.FC = () => {
  return (
    <div className="bento-card p-6 bg-gradient-to-br from-sky-50 to-sky-100/40 border border-sky-150 text-slate-800 rounded-2xl shadow-sm relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
      
      <div className="relative z-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-sky-200 rounded-full text-xs font-semibold text-teal-750">
          <BookOpen className="w-3.5 h-3.5 text-teal-600" />
          金融小講堂：複式價差單風控概念
        </div>
        
        <h3 className="text-lg font-bold font-display tracking-tight text-slate-900 sm:text-xl">
          為什麼需要嚴格試算「投入資金成本」與「停損防波堤」？
        </h3>
        
        <p className="text-xs text-slate-650 leading-relaxed max-w-4xl">
          在期權市場中，複式單賣方價差 (Credit Spread) 雖然能有效縮減保證金，且勝率普遍較高，但當大盤發生超預期跳空或急拉急殺時，由於權利金成交點數會隨趨勢倍數飆升，若缺乏精算分配資金與降部位依據，往往會出現重大虧損。
          本系統結合<b>獲利回吐降部位機制</b>、<b>保留最大點數額度</b>，以及<b>五維度階梯式停損點</b>，確保能協助您在承作跨式、勒式或單邊看多/看空價差時，能更科學地評估每組合約所需的真實現金緩衝！
        </p>


      </div>
    </div>
  );
};
