import React, { useState, useEffect } from "react";
import { 
  Thermometer, 
  Coins, 
  ArrowRightLeft, 
  Info, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  RotateCcw
} from "lucide-react";

export const TemperatureAdjustment: React.FC = () => {
  // Retrieve base portfolio capital from localStorage (falling back to 400000 as default)
  const [baseCapital, setBaseCapital] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("opt_spread_customCapital");
      return saved ? parseInt(saved, 10) : 400000;
    } catch (e) {
      return 400000;
    }
  });

  // Listen to custom capital changes from localStorage to keep percentages dynamically correct
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem("opt_spread_customCapital");
        if (saved) {
          setBaseCapital(parseInt(saved, 10));
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    // Also poll occasionally since storage events only trigger on other tabs
    const interval = setInterval(handleStorageChange, 1500);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Interactive state with user requested defaults
  const [marketTemp, setMarketTemp] = useState<number>(65); // Market option temp default = 65%
  const [holdingTemp, setHoldingTemp] = useState<number>(17); // Holding temp default = 17%
  const [tolerance, setTolerance] = useState<number>(40); // Tolerance default = 40%
  const [availableFunds, setAvailableFunds] = useState<number>(380000); // Available funds default = 380,000
  const [reservedFunds, setReservedFunds] = useState<number>(320000); // Reserved safety balance default = 320,000

  // Simulation animation states
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSteps, setSimulationSteps] = useState<string[]>([]);

  // Format helper for money
  const formatTWD = (value: number) => {
    return `$ ${Math.round(value).toLocaleString("zh-TW")}`;
  };

  // Range calculations: Tolerance can allow bounds to exceed 0% ~ 100%
  const minAcceptable = marketTemp - tolerance;
  const maxAcceptable = marketTemp + tolerance;
  const isWithin = holdingTemp >= minAcceptable && holdingTemp <= maxAcceptable;

  // Decide needed temperature movement
  let directionToTarget: "none" | "up" | "down" = "none";
  let targetTemp = holdingTemp;
  if (holdingTemp < minAcceptable) {
    directionToTarget = "up"; // Need to make more bullish (increase holding temp)
    targetTemp = minAcceptable;
  } else if (holdingTemp > maxAcceptable) {
    directionToTarget = "down"; // Need to make more bearish (decrease holding temp)
    targetTemp = maxAcceptable;
  }

  // Check funds status
  const hasAdequateFunds = availableFunds > reservedFunds;

  // Action determination
  let actionTitle = "";
  let actionDetails = "";
  let actionType: "maintain" | "buy_bullish" | "buy_bearish" | "close_bearish" | "close_bullish" = "maintain";

  if (isWithin) {
    actionTitle = "維持現狀 (No Action)";
    actionDetails = `持倉溫度 (${holdingTemp}%) 處於市場多空溫度容許區間 [${minAcceptable}% ~ ${maxAcceptable}%] 內。此時不做任何動作，能有效防止多空轉換或雜訊盤整時頻繁過度交易 (Overtrading)，節省交易摩擦成本與滑價損耗。`;
    actionType = "maintain";
  } else {
    if (directionToTarget === "up") {
      // Need to move temp up (more bullish / increase temp)
      if (hasAdequateFunds) {
        actionTitle = "主動加倉多單 / 賣權看多價差 (加強多頭)";
        actionDetails = `持倉溫度 (${holdingTemp}%) 低於安全容許下限 (${minAcceptable}%)。考慮到目前可用資金大於保留安全餘額，系統建議【主動增開多單部位】（如賣權看多價差），逐步建立多頭倉位，直到持倉溫度調升回安全區間。`;
        actionType = "buy_bullish";
      } else {
        actionTitle = "被動平倉空單 / 買權看空價差 (釋放資金)";
        actionDetails = `持倉溫度 (${holdingTemp}%) 低於安全容許下限 (${minAcceptable}%)。此時可用資金低於安全保留餘額，系統嚴禁加開新倉，建議應透過【平倉部分空單部位】（如買權看空價差）來釋放保證金並收回可用資金，同時被動調升持倉溫度。`;
        actionType = "close_bearish";
      }
    } else {
      // Need to move temp down (more bearish / decrease temp)
      if (hasAdequateFunds) {
        actionTitle = "主動加倉空單 / 買權看空價差 (加強空頭)";
        actionDetails = `持倉溫度 (${holdingTemp}%) 高於安全容許上限 (${maxAcceptable}%)。考慮到目前可用資金大於保留安全餘額，系統建議【主動增開空單部位】（如買權看空價差），逐步建立空頭倉位，直到持倉溫度調降回安全區間。`;
        actionType = "buy_bearish";
      } else {
        actionTitle = "被動平倉多單 / 賣權看多價差 (釋放資金)";
        actionDetails = `持倉溫度 (${holdingTemp}%) 高於安全容許上限 (${maxAcceptable}%)。此時可用資金低於安全保留餘額，系統嚴禁加開新倉，建議應透過【平倉部分多單部位】（如賣權看多價差）來釋放保證金並收回可用資金，同時被動調降持倉溫度。`;
        actionType = "close_bullish";
      }
    }
  }

  // Run auto rebalance simulation (increment/decrement by 2% for visual smoothness)
  const handleAutoRebalance = () => {
    if (isSimulating || isWithin) return;
    setIsSimulating(true);
    setSimulationSteps([]);

    const steps: string[] = [];
    const isBullishAdjustment = directionToTarget === "up";
    const fundsMessage = hasAdequateFunds 
      ? `💰 資金評估：當前可用資金 (${formatTWD(availableFunds)}) 大於保留餘額 (${formatTWD(reservedFunds)})，採【主動增倉】策略。`
      : `⚠️ 資金評估：當前可用資金 (${formatTWD(availableFunds)}) 小於保留餘額 (${formatTWD(reservedFunds)})，採【安全平倉】策略。`;
    
    steps.push(fundsMessage);

    if (isBullishAdjustment) {
      if (hasAdequateFunds) {
        steps.push(`📈 動作：主動建立【賣權看多價差】合約，逐步增開多頭...`);
        steps.push(`🔄 執行：逐步將多空持倉溫度自 ${holdingTemp}% 往上調升。`);
      } else {
        steps.push(`🛑 動作：平倉現有之【買權看空價差】空頭合約釋放資金...`);
        steps.push(`🔄 執行：保證金回流，持倉溫度被動調升至安全區間。`);
      }
    } else {
      if (hasAdequateFunds) {
        steps.push(`📉 動作：主動建立【買權看空價差】合約，逐步增開空頭...`);
        steps.push(`🔄 執行：逐步將多空持倉溫度自 ${holdingTemp}% 往下調降。`);
      } else {
        steps.push(`🛑 動作：平倉現有之【賣權看多價差】多頭合約釋放資金...`);
        steps.push(`🔄 執行：保證金回流，持倉溫度被動調降至安全區間。`);
      }
    }

    let current = holdingTemp;
    const interval = setInterval(() => {
      if (isBullishAdjustment) {
        current += 2;
        if (current >= minAcceptable) {
          current = minAcceptable;
          clearInterval(interval);
          steps.push(`✅ 調整完成：持倉溫度已回復至 ${current}%，落入合理的安全緩衝區 [${minAcceptable}% ~ ${maxAcceptable}%]！`);
          setHoldingTemp(current);
          setIsSimulating(false);
        } else {
          steps.push(`⚡ 調倉中... 當前持倉溫度變更為: ${current}%`);
        }
      } else {
        current -= 2;
        if (current <= maxAcceptable) {
          current = maxAcceptable;
          clearInterval(interval);
          steps.push(`✅ 調整完成：持倉溫度已回復至 ${current}%，落入合理的安全緩衝區 [${minAcceptable}% ~ ${maxAcceptable}%]！`);
          setHoldingTemp(current);
          setIsSimulating(false);
        } else {
          steps.push(`⚡ 調倉中... 當前持倉溫度變更為: ${current}%`);
        }
      }
      setSimulationSteps([...steps]);
    }, 200);
  };

  // Quick presets helper
  const handleReset = () => {
    setMarketTemp(65);
    setHoldingTemp(17);
    setTolerance(40);
    setAvailableFunds(380000);
    setReservedFunds(320000);
    setSimulationSteps([]);
    setIsSimulating(false);
  };

  // Spectrum bounds to handle spillover safely (e.g. min -20% to max 120%)
  const specMin = -20;
  const specMax = 120;
  const getPercentOnSpectrum = (val: number) => {
    const pct = ((val - specMin) / (specMax - specMin)) * 100;
    return Math.min(100, Math.max(0, pct));
  };

  // Capital percentage values
  const availablePct = baseCapital > 0 ? ((availableFunds / baseCapital) * 100).toFixed(0) : "0";
  const reservedPct = baseCapital > 0 ? ((reservedFunds / baseCapital) * 100).toFixed(0) : "0";

  return (
    <div className="bg-white border border-sky-150 p-6 rounded-2xl shadow-sm space-y-6 relative overflow-hidden transition-all hover:shadow-md" id="temp-adjustment-card">
      
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-sky-100 pb-4 gap-4">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 font-display">
            <span className="p-1.5 bg-rose-50 rounded-lg text-rose-500">
              <Thermometer className="w-5 h-5 animate-pulse" />
            </span>
            多空溫度調節機制 (持倉與市場溫度比對)
          </h3>
          <p className="text-xs text-slate-500">
            針對期權持倉部位與市場即時選擇權多空溫度的落差比對，透過設定「容許值（Tolerance）」建立雙向緩衝區，杜絕過度交易與追高殺低的雜訊干擾。
          </p>
        </div>
        <button
          onClick={handleReset}
          className="text-xs flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 font-semibold px-2.5 py-1.5 bg-slate-50 hover:bg-indigo-50/50 rounded-lg border border-slate-200 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          重置模擬
        </button>
      </div>

      {/* Grid Layout: Control Sliders (Left) & Core Logic (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Interactive Sliders Pane (Left, 5 cols) */}
        <div className="lg:col-span-5 space-y-5 bg-sky-50/30 p-5 rounded-2xl border border-sky-100/60">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-3 bg-sky-500 rounded-sm"></span>
            模擬參數控制台
          </h4>

          {/* 1. Holding Temp Slider (First now) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">
                目前持倉多空溫度 (0% ~ 100%)
              </span>
              <span className={`font-mono font-extrabold px-2 py-0.5 rounded ${holdingTemp >= 50 ? "text-rose-600 bg-rose-50" : "text-emerald-600 bg-emerald-50"}`}>
                {holdingTemp}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={holdingTemp}
              onChange={(e) => setHoldingTemp(parseInt(e.target.value, 10))}
              disabled={isSimulating}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-mono">
              <span>0% (滿倉空頭)</span>
              <span>50% (中立無持倉)</span>
              <span>100% (滿倉多頭)</span>
            </div>
          </div>

          {/* 2. Market Option Temp Slider (Second now) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                市場選擇權多空溫度 (0% ~ 100%)
              </span>
              <span className={`font-mono font-extrabold px-2 py-0.5 rounded ${marketTemp >= 50 ? "text-rose-600 bg-rose-50" : "text-emerald-600 bg-emerald-50"}`}>
                {marketTemp}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={marketTemp}
              onChange={(e) => setMarketTemp(parseInt(e.target.value, 10))}
              disabled={isSimulating}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-mono">
              <span>0% (極度看空)</span>
              <span>50% (多空中立)</span>
              <span>100% (極度看多)</span>
            </div>
          </div>

          {/* 3. Tolerance Value Slider (Third now) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                多空溫度容許值 (Tolerance Range)
                <span className="group relative">
                  <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-950 text-white text-[10px] p-2 rounded shadow-lg w-48 z-20 font-sans normal-case">
                    在市場多空溫度基礎上，往上下延伸的容許波動範圍。此區間內不做任何調倉。允許區間超越 0% 或 100% 邊界。
                  </span>
                </span>
              </span>
              <span className="font-mono font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                ± {tolerance}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={tolerance}
              onChange={(e) => setTolerance(parseInt(e.target.value, 10))}
              disabled={isSimulating}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-mono">
              <span>±0% (無緩衝)</span>
              <span>±25% (標準)</span>
              <span>±100% (極寬緩衝)</span>
            </div>
          </div>

          <div className="border-t border-sky-100/60 pt-4 grid grid-cols-2 gap-4">
            {/* 4. Available Balance Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                帳戶可用金額 (TWD)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="10000"
                  min="0"
                  value={availableFunds}
                  onChange={(e) => setAvailableFunds(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  disabled={isSimulating}
                  className="w-full font-mono text-xs font-bold border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 bg-white focus:outline-none focus:border-indigo-500"
                />
                <span className="absolute right-2 top-1.5 text-[10px] text-slate-400 font-mono">
                  ({availablePct}%)
                </span>
              </div>
            </div>

            {/* 5. Reserved Balance Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                安全保留可用餘額 (TWD)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="10000"
                  min="0"
                  value={reservedFunds}
                  onChange={(e) => setReservedFunds(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  disabled={isSimulating}
                  className="w-full font-mono text-xs font-bold border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 bg-white focus:outline-none focus:border-indigo-500"
                />
                <span className="absolute right-2 top-1.5 text-[10px] text-slate-400 font-mono">
                  ({reservedPct}%)
                </span>
              </div>
            </div>
          </div>

          {/* Fund status notification indicator */}
          <div className={`p-3 rounded-xl border flex items-start gap-2 text-xs font-medium ${
            hasAdequateFunds 
              ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
              : "bg-amber-50 border-amber-100 text-amber-800"
          }`}>
            <Coins className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold">
                資金狀態：{hasAdequateFunds ? "可用餘額充足" : "可用餘額低於安全保留底線"}
              </div>
              <div className="text-[10px] leading-relaxed opacity-90">
                {hasAdequateFunds 
                  ? `可用資金 (${availablePct}%) 大於保留金額 (${reservedPct}%)，允許建立正確方向之價差新部位。`
                  : "可用餘額不足，不允許建立新部位。若超出容許值，僅允許透過「平倉」現有反向部位進行被動溫度調整。"
                }
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Simulation Gauge & Explanation (Right, 7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          
          {/* 1D Spectrum Visualization */}
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
              <span>雙向多空溫度光譜軸 (Real-time Spectrum)</span>
              <span className="text-[10px] text-slate-400 font-mono lowercase">drag sliders to simulate</span>
            </h4>

            <div className="relative pt-6 pb-2">
              {/* Central axis background line */}
              <div className="h-2.5 w-full bg-slate-200 rounded-full relative">
                
                {/* 1. Shaded Market Tolerance Zone (Allowed boundary) */}
                <div 
                  className="absolute h-full bg-indigo-500/15 border-l border-r border-indigo-400/40 transition-all duration-150"
                  style={{
                    left: `${getPercentOnSpectrum(minAcceptable)}%`,
                    width: `${getPercentOnSpectrum(maxAcceptable) - getPercentOnSpectrum(minAcceptable)}%`
                  }}
                />

                {/* Left/Right extreme and middle tags */}
                <div 
                  className="absolute -bottom-5 text-[8.5px] text-slate-500 font-mono font-bold"
                  style={{ left: `${getPercentOnSpectrum(0)}%`, transform: "translateX(-50%)" }}
                >
                  0% (空)
                </div>
                <div 
                  className="absolute -bottom-5 text-[8.5px] text-slate-500 font-mono font-bold"
                  style={{ left: `${getPercentOnSpectrum(50)}%`, transform: "translateX(-50%)" }}
                >
                  50% (中立)
                </div>
                <div 
                  className="absolute -bottom-5 text-[8.5px] text-slate-500 font-mono font-bold"
                  style={{ left: `${getPercentOnSpectrum(100)}%`, transform: "translateX(-50%)" }}
                >
                  100% (多)
                </div>
              </div>

              {/* 2. Marker: Market Option Temp */}
              <div 
                className="absolute top-1.5 -translate-x-1/2 flex flex-col items-center transition-all duration-150 z-10"
                style={{ left: `${getPercentOnSpectrum(marketTemp)}%` }}
              >
                <div className="bg-indigo-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                  市場: {marketTemp}%
                </div>
                <div className="w-1.5 h-1.5 bg-indigo-600 rotate-45 -mt-0.5" />
                <div className="w-0.5 h-6 bg-indigo-600/30 -mt-0.5" />
              </div>

              {/* 3. Marker: Current Holding Temp */}
              <div 
                className="absolute top-12 -translate-x-1/2 flex flex-col items-center transition-all duration-150 z-20"
                style={{ left: `${getPercentOnSpectrum(holdingTemp)}%` }}
              >
                <div className="w-0.5 h-5 bg-rose-500/40" />
                <div className="w-1.5 h-1.5 bg-rose-500 rotate-45" />
                <div className={`text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm ${
                  isWithin ? "bg-emerald-500" : "bg-rose-500 animate-pulse"
                }`}>
                  持倉: {holdingTemp}%
                </div>
              </div>
            </div>

            {/* Range readout */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-t border-slate-200/60 pt-3 mt-4 text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-indigo-500/20 border border-indigo-400/40 rounded-sm inline-block"></span>
                <span>系統容許保護區間: <b>{minAcceptable}% ~ {maxAcceptable}%</b></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full inline-block ${isWithin ? "bg-emerald-500" : "bg-rose-500 animate-ping"}`}></span>
                <span>當前狀態: <b className={isWithin ? "text-emerald-600" : "text-rose-600"}>
                  {isWithin ? "落在容許區間內 (安全維持)" : "超出容許值 (急需調倉)"}
                </b></span>
              </div>
            </div>

          </div>

          {/* Adjustment Rules & Trigger actions */}
          <div className="space-y-4">
            
            {/* Dynamic Status Title */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
              isWithin 
                ? "bg-emerald-50 border-emerald-100 text-slate-800" 
                : "bg-rose-50 border-rose-100 text-slate-800"
            }`}>
              {isWithin ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider text-white ${
                    isWithin ? "bg-emerald-600" : "bg-rose-600"
                  }`}>
                    {isWithin ? "SAFE" : "DISCREPANCY DETECTED"}
                  </span>
                  <h5 className="font-bold text-slate-900 text-sm">{actionTitle}</h5>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {actionDetails}
                </p>
              </div>
            </div>

            {/* Instruction Logic Step cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-600">
              <div className="p-3 border border-slate-100 rounded-xl space-y-1 bg-slate-50/50">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  1. 區間內 (持倉對齊市場)
                </span>
                <p className="leading-relaxed text-slate-500">
                  當持倉多空溫度落在容許範圍內，不執行任何調倉，防止高摩擦成本與過度頻繁交易。
                </p>
              </div>
              <div className="p-3 border border-slate-100 rounded-xl space-y-1 bg-slate-50/50">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  2. 區間外 & 可用 &gt; 保留
                </span>
                <p className="leading-relaxed text-slate-500">
                  當可用資金大於安全保留底線時，發出指令並<b>主動加倉正確方向部位</b>，直到持倉重回容許區間內。
                </p>
              </div>
              <div className="p-3 border border-slate-100 rounded-xl space-y-1 bg-slate-50/50">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  3. 區間外 & 可用 &lt; 保留
                </span>
                <p className="leading-relaxed text-slate-500">
                  當可用餘額不足時，嚴禁開新倉。強制透過<b>平倉相反方向部位</b>來釋放資金並被動對齊溫度。
                </p>
              </div>
            </div>

          </div>

          {/* Simulated Auto-Rebalance Trigger */}
          <div className="space-y-3">
            <button
              onClick={handleAutoRebalance}
              disabled={isSimulating || isWithin}
              className={`w-full font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                isWithin 
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200" 
                  : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] shadow-md hover:shadow-indigo-500/10"
              }`}
            >
              <ArrowRightLeft className={`w-4 h-4 ${isSimulating ? "animate-spin" : ""}`} />
              {isSimulating ? "動態多空溫控調倉模擬中..." : isWithin ? "多空對齊中，暫不需執行自動調倉" : "一鍵執行：動態溫控平衡調倉"}
            </button>

            {/* Simulation steps console log layout */}
            {simulationSteps.length > 0 && (
              <div className="bg-slate-900 text-sky-300 p-5 rounded-2xl font-mono text-sm sm:text-base space-y-3 shadow-inner border border-slate-800 max-h-[250px] overflow-y-auto">
                <div className="text-xs text-slate-400 border-b border-slate-800 pb-2 flex items-center justify-between">
                  <span>SYSTEM REBALANCE LOG (自動對齊調倉模擬日誌)</span>
                  <span className="animate-pulse text-emerald-400 font-bold">● RUNNING</span>
                </div>
                {simulationSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 animate-fadeIn font-semibold leading-relaxed text-sm sm:text-base">
                    <ChevronRight className="w-5 h-5 shrink-0 mt-0.5 text-indigo-400" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
