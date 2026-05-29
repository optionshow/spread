import { useState, useMemo } from "react";
import { Header, StrategyGuide } from "./components/Header";
import { ControlPanel } from "./components/ControlPanel";
import { ResultSection } from "./components/ResultSection";
import { RiskCharts } from "./components/RiskCharts";
import { calculateSpreadMetrics } from "./utils/calculations";
import { SpreadParams } from "./types";
import { 
  Settings2, 
  Calculator,
  Activity,
} from "lucide-react";

export default function App() {
  // Main selected parameters
  const [params, setParams] = useState<SpreadParams>({
    strikeDifference: 100, // default 100
    premium: 25,           // default 25
    targetReturnRate: 1.5, // default 1.5%
  });

  // Strategy direction (bull put spread vs bear call spread)
  const [strategy, setStrategy] = useState<"bull" | "bear">("bull");

  // Active calculations
  const results = useMemo(() => {
    return calculateSpreadMetrics(params);
  }, [params]);

  // Custom currency formatter
  const formatTWD = (value: number) => {
    return `NT$ ${Math.round(value).toLocaleString("zh-TW")}`;
  };

  const formatPercentVal = (val: number): string => {
    const rounded = Math.round(val * 10) / 10;
    if (rounded % 1 === 0) {
      return `${Math.round(rounded)}%`;
    }
    return `${rounded.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans antialiased flex flex-col selection:bg-teal-500/30 selection:text-teal-200">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Top Feature: Strategy Guide Banner */}
        <StrategyGuide />

        {/* Core Calculation Controls & Individual Calculations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Column Left: Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-indigo-400" />
                交易模型控制台
              </h2>
              <span className="text-[10px] text-slate-500 font-mono">2026 QUANT LAB</span>
            </div>
            
            <ControlPanel 
              params={params} 
              onChange={setParams} 
              strategy={strategy} 
              setStrategy={setStrategy} 
            />

            {/* Quick Summary Card - Bento Glass style */}
            <div className="bento-card p-5 bg-slate-900 border border-slate-800 text-white shadow-lg flex flex-col justify-between h-44 relative overflow-hidden">
              <div className={`absolute right-0 bottom-0 translate-x-12 translate-y-12 w-32 h-32 ${strategy === 'bull' ? 'bg-rose-500/5' : 'bg-emerald-500/5'} rounded-full blur-2xl pointer-events-none`}></div>
              
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] ${strategy === 'bull' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'} px-2 py-0.5 rounded font-bold uppercase tracking-wider`}>
                    目前決策摘要
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">REALTIME ASSESSMENT</span>
                </div>
                <h4 className="text-base font-bold mt-2.5 font-display text-slate-100 flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${strategy === 'bull' ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-ping'}`}></span>
                  {strategy === "bull" ? "賣權看多價差 (Put Spread)" : "買權看空價差 (Call Spread)"} (收 {params.premium} 點)
                </h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-normal">
                  於履約差 <b className="text-slate-200">{params.strikeDifference} 點</b> 框架下承作，預期年化/單期獲利率為 <b>{formatPercentVal(params.targetReturnRate)}</b>。
                  系統推算每組防震配資規模為 <b className="text-violet-400 font-mono font-bold">{formatTWD(results.capitalCost)}</b>。
                </p>
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-2 flex justify-end border-t border-slate-800/80 pt-2.5">
                <span>剩餘保留可用餘額：<b className="text-emerald-400">{Math.round(results.availableBalancePercent * 100)}%</b></span>
              </div>
            </div>
          </div>

          {/* Column Right: Active Selected Result Panel */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xs font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2 px-1">
              <Calculator className="w-4 h-4 text-emerald-400" />
              目前選定價差試算值 ({params.strikeDifference} 點價差)
            </h2>
            <ResultSection params={params} results={results} />
          </div>

        </div>

        {/* Action interactive Graphical analysis panel */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 p-1">
            <h2 className="text-xs font-bold uppercase text-slate-300 tracking-widest flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-emerald-400 animate-pulse" />
              數據視覺化與策略抗震模擬 (Visualizer Models)
            </h2>
            <span className="text-[10px] text-slate-500 font-mono">BENTO GRID GRAPHICS</span>
          </div>
          <RiskCharts params={params} results={results} strategy={strategy} />
        </div>

      </main>

      <footer className="bg-slate-950 border-t border-slate-900 mt-20 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <p className="font-mono tracking-wider text-[10px] text-slate-400 uppercase">
            © 2026 QUANTITATIVE FINTECH STRATEGY LAB // TAIEX OPTIONS ASSESSMENT
          </p>
          <p className="text-slate-450 leading-relaxed max-w-3xl mx-auto text-[11px] font-sans">
            免責聲明：本金融評估軟體提供之所有模擬試算、動態停損階梯、可用安全保證金配置與保利回吐降部位點數，均係基於歷史公式與設定參數進行之理想化科學數學計算，不构成任何真實證券期權交易策略之推介或投資諮詢建議。期權交易具備高財務槓桿之高風險特質，進場承作前應妥善精算部位流動性與安全配資界線。
          </p>
        </div>
      </footer>
    </div>
  );
}
