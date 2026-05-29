import React from "react";
import { ShieldCheck, TrendingUp, HelpCircle, BookOpen } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-50 font-display flex items-center gap-1.5 leading-none">
                台指選擇權價差評估與風控系統
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-medium">
                  v1.2.2
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Taiex Options Spread Expected Return & Financial Risk Controller
              </p>
            </div>
          </div>

          {/* Quick Stats/Metadata Badge */}
          <div className="flex items-center gap-3 self-start sm:self-center">
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-lg shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              台指期貨即時試算中 (NT$50/點)
            </span>
            <div className="text-[11px] text-slate-500 font-mono hidden md:block">
              更新時間: 2026-05-29
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export const StrategyGuide: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
      
      <div className="relative z-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800/80 border border-slate-700/50 rounded-full text-xs font-semibold text-teal-300">
          <BookOpen className="w-3.5 h-3.5 text-teal-400" />
          金融小講堂：複式價差單風控概念
        </div>
        
        <h3 className="text-lg font-bold font-display tracking-tight text-white sm:text-xl">
          為什麼需要嚴格試算「投入資金成本」與「停損防波堤」？
        </h3>
        
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          在期權市場中，複式單賣方價差 (Credit Spread) 雖然能有效縮減保證金，且勝率普遍較高，但當大盤發生超預期跳空或急拉急殺時，由於權利金成交點數會隨趨勢倍數飆升，若缺乏精算分配資金與降部位依據，往往會出現重大虧損。
          本系統結合<b>獲利回吐降部位機制</b>、<b>保留最大點數額度</b>，以及<b>五維度階梯式停損點</b>，確保能協助您在承作跨式、勒式或單邊看多/看空價差時，能更科學地評估每組合約所需的真實現金緩衝！
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">1. 防守原則</span>
            <p className="text-xs font-semibold text-slate-200">
              可用安全餘額應維持大於 25%，過度加槓桿易遭市場強制斷尾。
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">2. 保利點數</span>
            <p className="text-xs font-semibold text-slate-200">
              保留最大點數額 ({`0.2 * 成交價`}) 是為了在回檔時保護既得利潤。
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">3. 停損限制</span>
            <p className="text-xs font-semibold text-slate-200">
              不論是幾倍停損，點數絕不會超過履約價差差額，應以此做為最壞預期。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
