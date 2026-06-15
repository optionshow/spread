import { useState, useMemo, useEffect } from "react";
import { Header, StrategyGuide } from "./components/Header";
import { ControlPanel } from "./components/ControlPanel";
import { ResultSection } from "./components/ResultSection";
import { RiskCharts } from "./components/RiskCharts";
import { PerformanceStats } from "./components/PerformanceStats";
import { InterfaceExplanation } from "./components/InterfaceExplanation";
import { calculateSpreadMetrics } from "./utils/calculations";
import { SpreadParams } from "./types";
import { 
  Settings2, 
  Calculator,
  Activity,
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"main" | "stats">("main");

  // Read route query parameter to trigger sub-view
  const [currentView] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("page") || "app";
  });

  // Main selected parameters loaded from localStorage if available
  const [params, setParams] = useState<SpreadParams>(() => {
    try {
      const saved = localStorage.getItem("opt_spread_params");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load params from localStorage:", e);
    }
    return {
      strikeDifference: 100, // default 100
      premium: 20,           // default 20 (20% of 100)
      targetReturnRate: 1.5, // default 1.5%
    };
  });

  // Strategy direction loaded from localStorage if available
  const [strategy, setStrategy] = useState<"bull" | "bear">(() => {
    try {
      const saved = localStorage.getItem("opt_spread_strategy");
      if (saved === "bull" || saved === "bear") {
        return saved;
      }
    } catch (e) {
      console.error("Failed to load strategy from localStorage:", e);
    }
    return "bull";
  });

  // Save params to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("opt_spread_params", JSON.stringify(params));
    } catch (e) {
      console.error("Failed to save params to localStorage:", e);
    }
  }, [params]);

  // Save strategy to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("opt_spread_strategy", strategy);
    } catch (e) {
      console.error("Failed to save strategy to localStorage:", e);
    }
  }, [strategy]);

  // Active calculations
  const results = useMemo(() => {
    return calculateSpreadMetrics(params);
  }, [params]);

  // Custom currency formatter
  const formatTWD = (value: number) => {
    return `$ ${Math.round(value).toLocaleString("zh-TW")}`;
  };

  const formatPercentVal = (val: number): string => {
    const rounded = Math.round(val * 10) / 10;
    if (rounded % 1 === 0) {
      return `${Math.round(rounded)}%`;
    }
    return `${rounded.toFixed(1)}%`;
  };

  if (currentView === "guide") {
    return <InterfaceExplanation />;
  }

  return (
    <div className={`min-h-screen ${activeTab === 'stats' ? 'bg-white text-slate-800' : 'bg-[#0f172a] text-slate-200'} font-sans antialiased flex flex-col selection:bg-teal-500/30 selection:text-teal-200 transition-colors duration-200`}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {activeTab === "main" ? (
          <>
            {/* Top Feature: Strategy Guide Banner */}
            <StrategyGuide />

            {/* 交易模型設定控制台 (橫式框 - 灰白底) */}
            <ControlPanel 
              params={params} 
              onChange={setParams} 
              strategy={strategy} 
              setStrategy={setStrategy} 
            />

            {/* Row Header: 交易決策評估 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-indigo-400" />
                  交易決策評估
                </h2>
                <span className="text-[10px] text-slate-500 font-mono">DECISION DESK</span>
              </div>

              {/* Quick Summary Card - Horizontal Banner Style */}
              <div className="bento-card p-5 bg-slate-900 border border-slate-800 text-white shadow-lg relative overflow-hidden rounded-xl">
                <div className={`absolute right-0 bottom-0 translate-x-12 translate-y-12 w-48 h-48 ${strategy === 'bull' ? 'bg-rose-500/5' : 'bg-emerald-500/5'} rounded-full blur-3xl pointer-events-none`}></div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] ${strategy === 'bull' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'} px-2 py-0.5 rounded font-bold uppercase tracking-wider`}>
                        目前決策摘要
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">REALTIME ASSESSMENT</span>
                    </div>
                    <h4 className="text-base font-bold font-display text-slate-100 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${strategy === 'bull' ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-ping'}`}></span>
                      {strategy === "bull" ? "賣權看多價差 (Put Spread)" : "買權看空價差 (Call Spread)"} (收 {params.premium} 點)
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
                      於履約差 <b className="text-slate-200">{params.strikeDifference} 點</b> 框架下承作，預期年化/單期獲利率為 <b>{formatPercentVal(params.targetReturnRate)}</b>。
                      系統推算每組防震配資規模為 <b className="text-violet-400 font-mono font-bold">{formatTWD(results.capitalCost)}</b>。
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-start sm:items-end justify-center bg-slate-950/60 px-5 py-3 border border-slate-800/80 rounded-xl min-w-[200px] shadow-inner">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">剩餘保留可用餘額</span>
                    <span className="text-base font-mono font-extrabold text-emerald-400 mt-0.5">
                      {Math.round(results.availableBalancePercent * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Calculation Controls & Individual Calculations */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2 px-1">
                <Calculator className="w-4 h-4 text-emerald-400" />
                目前選定價差試算值 ({params.strikeDifference} 點價差)
              </h2>
              <ResultSection params={params} results={results} />
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
          </>
        ) : (
          <PerformanceStats />
        )}

      </main>

      <footer className={`border-t mt-20 py-10 text-xs ${activeTab === 'stats' ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-slate-950 border-slate-900 text-slate-500'} transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <p className={`font-mono tracking-wider text-[10px] uppercase ${activeTab === 'stats' ? 'text-slate-500' : 'text-slate-400'}`}>
            © 2026 QUANTITATIVE FINTECH STRATEGY LAB // TAIEX OPTIONS ASSESSMENT
          </p>
          <p className="leading-relaxed max-w-3xl mx-auto text-[11px] font-sans">
            免責聲明：本金融評估軟體提供之所有模擬試算、動態停損階梯、可用安全保證金配置與保利回吐降部位點數，均係基於歷史公式與設定參數進行之理想化科學數學計算，不构成任何真實證券期權交易策略之推介或投資諮詢建議。期權交易具備高財務槓桿之高風險特質，進場承作前應妥善精算部位流動性與安全配資界線。
          </p>
        </div>
      </footer>
    </div>
  );
}
