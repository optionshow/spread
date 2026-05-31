import React, { useState, useEffect, useMemo } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  TrendingUp as TrendIcon,
  Calendar, 
  DollarSign, 
  Percent, 
  Search, 
  ExternalLink, 
  RefreshCw,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  ReferenceLine
} from "recharts";

// TypeScript definitions for parsed data
export interface PerformanceRecord {
  id: number;
  week: string;
  weeklyPnL: number;       // numeric P&L in TWD
  weeklyPnLStr: string;    // raw string (e.g. "18,211")
  weeklyPercent: number;   // numeric weekly % (e.g. 4.6 for 4.6%)
  weeklyPercentStr: string;// raw string (e.g. "4.6%")
  cumulativePnL: number;   // numeric cumulative P/L
  cumulativePnLStr: string;// raw string (e.g. "$18,211")
  cumulativePercent: number; // numeric cumulative %
  cumulativePercentStr: string; // raw string (e.g. "4.6%")
}

export interface PerformanceSummary {
  strategyName: string;
  sampleName: string;
  initialCapital: number;
  initialCapitalStr: string;
  totalPercentStr: string;
  totalPercent: number;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Clean raw strings and parse numbers
const cleanNumber = (val: string): number => {
  if (!val) return 0;
  // strip formatting like $, % and spaces
  const cleaned = val.replace(/[\$"%,\s]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

export const PerformanceStats: React.FC = () => {
  const [records, setRecords] = useState<PerformanceRecord[]>([]);
  const [summary, setSummary] = useState<PerformanceSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const csvUrl = "https://docs.google.com/spreadsheets/d/1GjsqJI7ivGiT3xZQ6VJ2Sy7rQ42ePfC1I6NKiNMRxCU/export?format=csv&gid=0";

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(csvUrl);
        if (!response.ok) {
          throw new Error("無法從 Google 雲端硬碟讀取試算表資料。請檢查網路連接或稍後再試。");
        }
        const csvText = await response.text();
        const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);

        if (lines.length < 2) {
          throw new Error("試算表格式不正確或內容為空。");
        }

        // Parse Row 1 (Header 1: Metadata Summary)
        // e.g. 智能交易,樣本,"$400,000",,,140.7%
        const row1Cols = parseCSVLine(lines[0]);
        const initialCapVal = row1Cols[2] ? cleanNumber(row1Cols[2]) : 400000;
        const totalPctVal = row1Cols[5] ? cleanNumber(row1Cols[5]) : 140.7;

        const currentSummary: PerformanceSummary = {
          strategyName: row1Cols[0] || "智能交易",
          sampleName: row1Cols[1] || "樣本",
          initialCapital: initialCapVal,
          initialCapitalStr: row1Cols[2] || "$400,000",
          totalPercentStr: row1Cols[5] || "140.7%",
          totalPercent: totalPctVal
        };

        // Parse list rows starting from Row 3 (Index 2)
        // Header row was "序號,週次,單週損益,單週％,累積損益,累積％"
        const parsedRecords: PerformanceRecord[] = [];

        for (let i = 2; i < lines.length; i++) {
          const cols = parseCSVLine(lines[i]);
          if (cols.length < 4) continue;

          const serialId = parseInt(cols[0], 10);
          const week = cols[1];

          // We skip empty rows or formulas without week names
          if (isNaN(serialId) || !week) {
            continue;
          }

          const weeklyPnL = cleanNumber(cols[2]);
          const weeklyPercent = cleanNumber(cols[3]);
          const cumulativePnL = cleanNumber(cols[4]);
          const cumulativePercent = cleanNumber(cols[5]);

          parsedRecords.push({
            id: serialId,
            week: week,
            weeklyPnL,
            weeklyPnLStr: cols[2],
            weeklyPercent,
            weeklyPercentStr: cols[3],
            cumulativePnL,
            cumulativePnLStr: cols[4],
            cumulativePercent,
            cumulativePercentStr: cols[5],
          });
        }

        if (active) {
          setRecords(parsedRecords);
          setSummary(currentSummary);
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Fetch performance error:", err);
        if (active) {
          setError(err.message || "發生未知錯誤，無法解析資料。");
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [refreshTrigger]);

  // Derived Analytics Cards Stats
  const stats = useMemo(() => {
    if (records.length === 0) return null;

    const totalWeeks = records.length;
    const winWeeks = records.filter(r => r.weeklyPnL > 0).length;
    const lossWeeks = records.filter(r => r.weeklyPnL < 0).length;
    const flatWeeks = records.filter(r => r.weeklyPnL === 0).length;

    const winRate = (winWeeks / totalWeeks) * 100;

    let maxWeeklyProfit = -Infinity;
    let maxWeeklyLoss = Infinity;
    let maxWeeklyProfitWeek = "";
    let maxWeeklyLossWeek = "";

    records.forEach(r => {
      if (r.weeklyPnL > maxWeeklyProfit) {
        maxWeeklyProfit = r.weeklyPnL;
        maxWeeklyProfitWeek = r.week;
      }
      if (r.weeklyPnL < maxWeeklyLoss) {
        maxWeeklyLoss = r.weeklyPnL;
        maxWeeklyLossWeek = r.week;
      }
    });

    const finalRecord = records[records.length - 1];
    const totalAccumProfit = finalRecord ? finalRecord.cumulativePnL : 0;
    const totalAccumPercent = finalRecord ? finalRecord.cumulativePercent : 0;

    return {
      totalWeeks,
      winWeeks,
      lossWeeks,
      flatWeeks,
      winRate,
      maxWeeklyProfit,
      maxWeeklyProfitWeek,
      maxWeeklyLoss,
      maxWeeklyLossWeek,
      totalAccumProfit,
      totalAccumPercent,
    };
  }, [records]);

  // Handle Search Filter for dynamic table Search
  const filteredRecords = useMemo(() => {
    return records.filter(r => 
      r.week.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toString().includes(searchQuery)
    );
  }, [records, searchQuery]);

  // Currency formats
  const formatTWD = (value: number) => {
    if (value === 0) return "$ 0";
    const sign = value < 0 ? "-" : "";
    return `${sign}$ ${Math.abs(Math.round(value)).toLocaleString("zh-TW")}`;
  };

  const formatPercent = (val: number) => {
    return `${val > 0 ? "+" : ""}${val.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Title block - Minimal and Elegant white background */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
            <Award className="w-5.5 h-5.5 text-rose-500" />
            台指選擇權價差交易績效統計
          </h2>
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
            此頁面即時鏈結 Google Sheets 工作表數據，讀取交易記錄以自動生成戰略績效指標、累積報酬曲線與勝率分析。
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center p-20 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-sm">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <span className="absolute animate-ping w-8 h-8 rounded-full bg-rose-500/20"></span>
            <RefreshCw className="w-6 h-6 text-rose-500 animate-spin" />
          </div>
          <p className="text-sm text-slate-500 font-medium animate-pulse">正在載入試算表歷史績效數據中...</p>
        </div>
      )}

      {error && (
        <div className="p-6 bg-rose-50 border border-rose-205 rounded-2xl flex flex-col md:flex-row md:items-center gap-4 shadow-sm">
          <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6 text-rose-600" />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="text-sm font-bold text-rose-900">讀取資料時發生錯誤</h4>
            <p className="text-xs text-rose-700 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && summary && stats && (
        <div className="space-y-8 animate-fade-in">
          
          {/* KPI Analytics Metric Cards Bento Box - White background */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Account & Initial Capital */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 relative overflow-hidden shadow-sm">
              <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-16 h-16 bg-blue-500/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[10px] font-bold uppercase tracking-wider">初始配置資金 (樣本)</span>
                <DollarSign className="w-4.5 h-4.5 text-blue-500" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xl font-mono font-extrabold text-slate-900 block">
                  {formatTWD(summary.initialCapital)}
                </span>
                <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-bold uppercase tracking-wider inline-block">
                  Account Base
                </span>
              </div>
            </div>

            {/* Card 2: Cumulative Profit / Loss TWD - Red represents profit */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 relative overflow-hidden shadow-sm">
              <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-16 h-16 bg-rose-500/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[10px] font-bold uppercase tracking-wider">歷史累計淨損益</span>
                <TrendingUp className="w-4.5 h-4.5 text-rose-500" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xl font-mono font-extrabold text-rose-600 block">
                  {formatTWD(stats.totalAccumProfit)}
                </span>
                <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded font-bold uppercase tracking-wider inline-block">
                  Net Earnings
                </span>
              </div>
            </div>

            {/* Card 3: Return Rate % - Red represents profit */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 relative overflow-hidden shadow-sm">
              <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-16 h-16 bg-rose-500/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[10px] font-bold uppercase tracking-wider">歷史累計總報酬率</span>
                <Percent className="w-4.5 h-4.5 text-rose-500" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xl font-mono font-extrabold text-rose-600 block">
                  {formatPercent(stats.totalAccumPercent)}
                </span>
                <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded font-bold uppercase tracking-wider inline-block">
                  Total ROI
                </span>
              </div>
            </div>

            {/* Card 4: Win rate & Active Weeks */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 relative overflow-hidden shadow-sm">
              <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-16 h-16 bg-amber-550/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[10px] font-bold uppercase tracking-wider">單週勝率 / 承作週數</span>
                <Calendar className="w-4.5 h-4.5 text-amber-500" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xl font-mono font-extrabold text-slate-900 block">
                  {stats.winRate.toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-500 block font-medium">
                  共 {stats.totalWeeks} 交易週 | {stats.winWeeks}勝 {stats.lossWeeks}敗 {stats.flatWeeks}平
                </span>
              </div>
            </div>

          </div>

          {/* Graphical Section: Line & Bar Chart Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Cumulative Profit Area Chart (left, 7cols) - White themed with Red stroke */}
            <div className="p-5 lg:col-span-7 bg-white border border-slate-200 shadow-sm space-y-4 rounded-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-rose-500" />
                    歷史累積報酬增長曲線
                  </h4>
                  <p className="text-xs text-slate-400">
                    模擬 $400,000 初始資金，累積總計盈利增加趨勢。
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 border border-slate-200 rounded">
                  Cumulative PnL Curve
                </span>
              </div>
              
              <div className="h-[280px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={records}
                    margin={{ top: 5, right: 5, left: 10, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis 
                      dataKey="week" 
                      stroke="#475569" 
                      fontSize={10}
                      tickLine={false}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickSize={6}
                    />
                    <YAxis 
                      stroke="#475569" 
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `${Math.round(val/10000)}萬`}
                    />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        borderColor: '#e2e8f0',
                        borderRadius: '0.75rem',
                        fontSize: '11px',
                        color: '#1e293b'
                      }}
                      formatter={(value: any) => [formatTWD(Number(value)), '累積淨利益']}
                      labelFormatter={(label) => `交易週次: ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="cumulativePnL" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorPnL)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weekly P/L Bar Chart (right, 5cols) - Red positive profit, green negative loss */}
            <div className="p-5 lg:col-span-5 bg-white border border-slate-200 shadow-sm space-y-4 rounded-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                    <Percent className="w-4 h-4 text-rose-500" />
                    單週損益波動分佈 (TWD)
                  </h4>
                  <p className="text-xs text-slate-400">
                    每一週次獨立之盈虧金額 (紅色為獲利，綠色為損益回吐)。
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 border border-slate-200 rounded">
                  Weekly Variance
                </span>
              </div>

              <div className="h-[280px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={records}
                    margin={{ top: 5, right: 5, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis 
                      dataKey="week" 
                      stroke="#475569" 
                      fontSize={9}
                      tickLine={false}
                      axisLine={{ stroke: '#cbd5e1' }}
                    />
                    <YAxis 
                      stroke="#475569" 
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `${Math.round(val/1000)}k`}
                    />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        borderColor: '#e2e8f0',
                        borderRadius: '0.75rem',
                        fontSize: '11px',
                        color: '#1e293b'
                      }}
                      formatter={(value: any) => [formatTWD(Number(value)), '單週損益']}
                      labelFormatter={(label) => `交易週次: ${label}`}
                    />
                    <ReferenceLine y={0} stroke="#cbd5e1" />
                    <Bar dataKey="weeklyPnL">
                      {records.map((entry, index) => {
                        const isPositive = entry.weeklyPnL >= 0;
                        return (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={isPositive ? "#ef4444" : "#10b981"} 
                            fillOpacity={0.8}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Deep Performance Report Indicators Card - White theme, Taiwanese red/green convention */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm text-slate-700">
            <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider border-b border-slate-200 pb-2.5">
              進階量化交易分析 (Advanced Tactical Reporting)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-xs">
              <div className="space-y-1 bg-slate-50 p-4 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">單週最大獲利</span>
                <span className="font-mono text-rose-600 font-bold text-base block">
                  {formatTWD(stats.maxWeeklyProfit)}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  成立於週次: <b>{stats.maxWeeklyProfitWeek}</b>
                </span>
              </div>
              <div className="space-y-1 bg-slate-50 p-4 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">單週最大回撤</span>
                <span className="font-mono text-emerald-600 font-bold text-base block">
                  {formatTWD(stats.maxWeeklyLoss)}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  成立於週次: <b>{stats.maxWeeklyLossWeek}</b>
                </span>
              </div>
              <div className="space-y-1 bg-slate-50 p-4 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">單週平均淨利 (期望值)</span>
                <span className="font-mono text-rose-600 font-bold text-base block">
                  {formatTWD(stats.totalAccumProfit / stats.totalWeeks)}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  單週預估平均報酬亮點
                </span>
              </div>
              <div className="space-y-1 bg-slate-50 p-4 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">交易獲利穩定係數 (盈虧比)</span>
                <span className="font-mono text-indigo-600 font-bold text-base block">
                  {Math.abs(stats.winWeeks / (stats.lossWeeks || 1)).toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  每承受一週虧損，對應的獲利週次比
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Detailed Database Table - Double Font Size & White background */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm space-y-4 p-5">
            
            {/* Search Input and Status summary */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-1.5 font-display">
                  歷史全紀錄明細數據
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  可承載至第 102 列之交易清單，排除空白儲存格與公式冗餘項。
                </p>
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-72">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜尋週次 (例如: 10W4)..."
                  className="bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl py-1.5 pl-9 pr-4 w-full text-xs text-slate-705 focus:outline-none focus:ring-1 focus:ring-teal-500/10 transition-all font-mono"
                />
              </div>
            </div>

            {/* Scrollable Container with Table - Font size set to matching text-xs, height doubled to 840px */}
            <div className="overflow-x-auto max-h-[840px] rounded-xl border border-slate-200 shadow-inner custom-scrollbar">
              <table className="w-full text-xs text-left border-collapse font-sans">
                <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200 sticky top-0 z-10 font-bold">
                  <tr>
                    <th scope="col" className="px-4 py-2 border-r border-slate-200">序號</th>
                    <th scope="col" className="px-4 py-2 border-r border-slate-200">交易週次</th>
                    <th scope="col" className="px-4 py-2 text-right border-r border-slate-200">單週損益 (TWD)</th>
                    <th scope="col" className="px-4 py-2 text-right border-r border-slate-200">單週報酬 %</th>
                    <th scope="col" className="px-4 py-2 text-right border-r border-slate-200">累積損益 (TWD)</th>
                    <th scope="col" className="px-4 py-2 text-right">累積報酬 %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((item) => {
                      const isWeeklyProfit = item.weeklyPnL > 0;
                      const isWeeklyLoss = item.weeklyPnL < 0;

                      return (
                        <tr 
                          key={item.id} 
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-4 py-2 text-slate-500 border-r border-slate-200/50">{item.id}</td>
                          <td className="px-4 py-2 text-slate-700 font-bold border-r border-slate-200/50">
                            <span className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                              {item.week}
                            </span>
                          </td>
                          <td className={`px-4 py-2 text-right font-bold border-r border-slate-200/50 ${
                            isWeeklyProfit ? "text-rose-600" : isWeeklyLoss ? "text-emerald-600" : "text-slate-500"
                          }`}>
                            {item.weeklyPnLStr}
                          </td>
                          <td className={`px-4 py-2 text-right font-bold border-r border-slate-200/50 ${
                            isWeeklyProfit ? "text-rose-600" : isWeeklyLoss ? "text-emerald-600" : "text-slate-500"
                          }`}>
                            {item.weeklyPercentStr}
                          </td>
                          <td className="px-4 py-2 text-right font-bold text-slate-700 border-r border-slate-200/50">
                            {item.cumulativePnLStr}
                          </td>
                          <td className="px-4 py-2 text-right font-extrabold text-rose-600">
                            {item.cumulativePercentStr}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                        查無任何匹配此搜尋字串 "{searchQuery}" 的週次記錄
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Total rows counter */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
              <span>* 單週損益 % 與 累積報酬 % 均以試算表之 A1 初始配置資金分母為計算基礎。</span>
              <span className="font-mono font-bold uppercase">
                篩選出: {filteredRecords.length} / {records.length} 筆資料
              </span>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};
