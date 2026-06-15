import React, { useState, useEffect } from "react";

export const InterfaceExplanation: React.FC = () => {
  const [isTrading, setIsTrading] = useState(true);
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Checkbox linked state controls to match original HTML's dynamic interactivity
  const [isTempAdjustChecked, setIsTempAdjustChecked] = useState(false);
  const [isScBcStopLossChecked, setIsScBcStopLossChecked] = useState(false);
  const [isSpBpStopLossChecked, setIsSpBpStopLossChecked] = useState(false);
  const [isScBcPriceStopLossChecked, setIsScBcPriceStopLossChecked] = useState(false);
  const [isSpBpPriceStopLossChecked, setIsSpBpPriceStopLossChecked] = useState(false);

  const [isScBcProfitChecked, setIsScBcProfitChecked] = useState(false);
  const [isSpBpProfitChecked, setIsSpBpProfitChecked] = useState(false);
  const [isBaoli1Checked, setIsBaoli1Checked] = useState(false);
  const [isBaoli2Checked, setIsBaoli2Checked] = useState(false);
  const [isLossDropChecked, setIsLossDropChecked] = useState(false);

  const [isDayOpenChecked, setIsDayOpenChecked] = useState(false);
  const [isNightOpenChecked, setIsNightOpenChecked] = useState(false);
  const [isInstantControlChecked, setIsInstantControlChecked] = useState(false);
  const [isLossDropTotalChecked, setIsLossDropTotalChecked] = useState(false);

  // Tooltip popup mouse tracking state
  const [tooltip, setTooltip] = useState<{
    text: string;
    visible: boolean;
    x: number;
    y: number;
  }>({
    text: "",
    visible: false,
    x: 0,
    y: 0,
  });

  const nextWednesdayDate = (() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday=0, Monday=1, etc.
    let daysUntilWednesday = 3 - dayOfWeek;
    if (daysUntilWednesday <= 0) {
      daysUntilWednesday += 7;
    }
    const nextWed = new Date(today);
    nextWed.setDate(today.getDate() + daysUntilWednesday);
    const year = nextWed.getFullYear();
    const month = String(nextWed.getMonth() + 1).padStart(2, "0");
    const day = String(nextWed.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  })();

  useEffect(() => {
    document.title = "介面解說";

    // Inject Material Icons Outlined stylesheets of Google Fonts safely
    const linkFonts = document.createElement("link");
    linkFonts.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap";
    linkFonts.rel = "stylesheet";
    document.head.appendChild(linkFonts);

    const linkIcons = document.createElement("link");
    linkIcons.href = "https://fonts.googleapis.com/icon?family=Material+Icons+Outlined";
    linkIcons.rel = "stylesheet";
    document.head.appendChild(linkIcons);

    return () => {
      try {
        document.head.removeChild(linkFonts);
        document.head.removeChild(linkIcons);
      } catch (e) {
        // ignore issues on dismantle
      }
    };
  }, []);

  const handleTooltipShow = (text: string, e: React.MouseEvent) => {
    setTooltip({
      text,
      visible: true,
      x: e.clientX,
      y: e.clientY + 20,
    });
  };

  const handleTooltipMove = (e: React.MouseEvent) => {
    let targetX = e.clientX + 10;
    let targetY = e.clientY + 20;

    // Boundary prevention
    if (targetX + 250 > window.innerWidth) {
      targetX = e.clientX - 260;
    }
    if (targetY + 120 > window.innerHeight) {
      targetY = e.clientY - 130;
    }

    setTooltip(prev => ({
      ...prev,
      x: targetX,
      y: targetY,
    }));
  };

  const handleTooltipHide = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  return (
    <div className="bg-[#f3f4f6] font-sans text-gray-800 min-h-screen flex flex-col antialiased">
      {/* Dynamic Global Tooltip */}
      {tooltip.visible && (
        <div
          style={{
            position: "fixed",
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            backgroundColor: "rgba(31, 41, 55, 0.98)",
            color: "#fff",
            padding: "12px",
            borderRadius: "6.5px",
            fontSize: "13px",
            lineHeight: "1.6",
            zIndex: 10000,
            pointerEvents: "none",
            maxWidth: "250px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1)",
            border: "1px solid #4b5563",
            textAlign: "justify",
          }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Styles Injection */}
      <style>{`
        .term-tooltip {
          cursor: help;
          border-bottom: 1px dashed #9ca3af;
        }
        /* Custom disabled state for inputs */
        input:disabled, select:disabled {
          background-color: #e2e8f0 !important;
          cursor: not-allowed;
          opacity: 0.7;
        }
      `}</style>

      {/* Navbar with "回到首頁" and "聯繫LINE" REMOVED */}
      <nav id="nav-guide" className="bg-[#2c3e50] text-white px-4 md:px-6 py-3 flex justify-between items-center shadow-md z-30 sticky top-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1 hover:bg-white/10 rounded transition"
          >
            <span className="material-icons-outlined">menu</span>
          </button>
          <span className="material-icons-outlined text-3xl hidden md:block">cloud_queue</span>
          <h2 className="text-sm md:text-lg font-medium">選擇權智能交易</h2>
        </div>
        <div className="flex items-center space-x-4">
          <button className="hover:bg-white/10 p-1 rounded-full transition ml-2">
            <span className="material-icons-outlined">account_circle</span>
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Overlay on mobile */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          id="sidebar"
          className={`transform transition-transform duration-300 absolute lg:relative z-20 w-64 h-full bg-white border-r border-gray-200 flex flex-col overflow-y-auto shadow-lg lg:shadow-none ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-4 space-y-4">
            {/* Start/Stop Button */}
            <button
              id="toggle-trading-btn"
              onClick={() => setIsTrading(!isTrading)}
              className={`w-full text-white font-bold py-3 rounded shadow transition flex items-center justify-center space-x-2 ${
                isTrading ? "bg-[#ef4444] hover:bg-red-600" : "bg-[#22c55e] hover:bg-emerald-600"
              }`}
            >
              {!isTrading && <span className="material-icons-outlined">play_arrow</span>}
              <span>{isTrading ? "■ 停止交易" : "開始交易"}</span>
            </button>
          </div>

          {/* Transaction Overview Section */}
          <div className="px-4 py-2">
            <h3 className="font-bold text-gray-900 mb-2 px-2">交易總覽</h3>
            <nav className="space-y-1 text-sm text-gray-600">
              <div className="block px-2 py-2 rounded hover:bg-gray-100 border-b border-gray-100 flex justify-between group">
                <span
                  className="term-tooltip"
                  onMouseEnter={(e) => handleTooltipShow("連線中=與券商連線正常", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  連線狀態
                </span>
                <span className="font-medium text-gray-750">連線中</span>
              </div>
              <div className="block px-2 py-2 rounded hover:bg-gray-100 border-b border-gray-100 flex justify-between">
                <span
                  className="term-tooltip"
                  onMouseEnter={(e) => handleTooltipShow("交易中=下單機運作正常", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  交易狀態
                </span>
                <span className="font-medium text-gray-750">
                  {isTrading ? "交易中" : "交易停止"}
                </span>
              </div>
              <div className="block px-2 py-2 rounded hover:bg-gray-100 border-b border-gray-100 flex justify-between">
                <span
                  className="term-tooltip"
                  onMouseEnter={(e) => handleTooltipShow("最真實的資金狀況(已扣除手續費/稅金)，括號顯示獲利％", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  權益總值
                </span>
                <span className="font-mono text-gray-750 text-right">350,856（0.2％）</span>
              </div>
              <div className="block px-2 py-2 rounded hover:bg-gray-100 border-b border-gray-100 flex justify-between">
                <span
                  className="term-tooltip"
                  onMouseEnter={(e) => handleTooltipShow("用於保留可用餘額判斷，低於設定金額時不建立新部位", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  可用金額
                </span>
                <span className="font-mono text-gray-750 text-right">243,468 (70 %)</span>
              </div>
              <div className="block px-2 py-2 rounded hover:bg-gray-100 border-b border-gray-100 flex justify-between">
                <span
                  className="term-tooltip"
                  onMouseEnter={(e) => handleTooltipShow("所有部位的總成本點數", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  持倉成本
                </span>
                <span className="font-mono text-gray-750">186</span>
              </div>
              <div className="block px-2 py-2 rounded hover:bg-gray-100 border-b border-gray-100 flex justify-between">
                <span
                  className="term-tooltip"
                  onMouseEnter={(e) => handleTooltipShow("所有部位目前的總價值點數。獲利時點數減少，虧損時點數增加", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  即時總點
                </span>
                <span className="font-mono text-gray-750">161</span>
              </div>
              <div className="block px-2 py-2 rounded hover:bg-gray-100 border-b border-gray-100 flex justify-between">
                <span
                  className="term-tooltip"
                  onMouseEnter={(e) => handleTooltipShow("Sell Call 與 Buy Call 價差點數總和", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  SCBC 總點
                </span>
                <span className="font-mono text-gray-750">0</span>
              </div>
              <div className="block px-2 py-2 rounded hover:bg-gray-100 border-b border-gray-100 flex justify-between">
                <span
                  className="term-tooltip"
                  onMouseEnter={(e) => handleTooltipShow("Sell Put 與 Buy Put 價差點數總和", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  SPBP 總點
                </span>
                <span className="font-mono text-gray-750">161</span>
              </div>
              <div className="block px-2 py-2 rounded hover:bg-gray-100 border-b border-gray-100 flex justify-between">
                <span
                  className="term-tooltip"
                  onMouseEnter={(e) => handleTooltipShow("顯示目前部位的多空偏向 (0=偏空, 100=偏多, 50=中立)", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  持倉溫度
                </span>
                <span className="font-mono text-gray-750">100 %</span>
              </div>
              <div className="block px-2 py-2 rounded hover:bg-gray-100 border-b border-gray-100 flex justify-between">
                <span
                  className="term-tooltip"
                  onMouseEnter={(e) => handleTooltipShow("目前持有的合約口數", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  持倉數量
                </span>
                <span className="font-mono text-xs text-gray-750">SP:23 BP:23</span>
              </div>
              <div className="block px-2 py-2 rounded hover:bg-gray-100 border-b border-gray-100 flex justify-between">
                <span
                  className="term-tooltip"
                  onMouseEnter={(e) => handleTooltipShow("已平倉的次數", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  平倉次數
                </span>
                <span className="font-mono text-gray-750">0</span>
              </div>
              <div className="block px-2 py-2 rounded hover:bg-gray-100">
                <div className="flex justify-between w-full">
                  <span
                    className="term-tooltip"
                    onMouseEnter={(e) => handleTooltipShow("若持倉部位全部歸零的預估獲利%", e)}
                    onMouseMove={handleTooltipMove}
                    onMouseLeave={handleTooltipHide}
                  >
                    歸零預期總報酬
                  </span>
                  <span className="font-mono text-gray-750">2.3 %</span>
                </div>
              </div>
            </nav>
          </div>

          {/* Intelligent Quotes Section */}
          <div className="px-4 py-2 mt-4 border-t border-gray-200 pb-8 animate-fade-in">
            <div className="flex flex-col mb-2 px-2">
              <h3
                className="font-bold text-gray-900 term-tooltip self-start"
                onMouseEnter={(e) => handleTooltipShow("市場行情分析工具，提供多空判斷依據", e)}
                onMouseMove={handleTooltipMove}
                onMouseLeave={handleTooltipHide}
              >
                智能報價
              </h3>
              <span className="text-xs text-gray-500 font-mono mt-0.5">2026/01/12 13:18:36</span>
            </div>
            <nav className="space-y-1 text-sm text-gray-650">
              <div className="px-2 py-2 rounded hover:bg-gray-100 border-b border-gray-100 flex justify-between items-center">
                <span>TX2 期貨價格</span>
                <span className="font-mono font-bold text-[#ef4444]">30,643 ▲ 255</span>
              </div>
              <div className="px-2 py-2 rounded hover:bg-gray-100 border-b border-gray-100 flex justify-between items-center">
                <span
                  className="term-tooltip"
                  onMouseEnter={(e) => handleTooltipShow("判斷市場 Call 的買賣偏向", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  買權成交行為
                </span>
                <span className="font-mono text-[#ef4444]">Buy ▲</span>
              </div>
              <div className="px-2 py-2 rounded hover:bg-gray-100 border-b border-gray-100 flex justify-between items-center">
                <span
                  className="term-tooltip"
                  onMouseEnter={(e) => handleTooltipShow("判斷市場 Put 的買賣偏向", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  賣權成交行為
                </span>
                <span className="font-mono text-[#ef4444]">Sell ▲</span>
              </div>
              <div className="px-2 py-2 rounded hover:bg-gray-100 border-b border-gray-100 flex justify-between items-center">
                <span
                  className="term-tooltip"
                  onMouseEnter={(e) => handleTooltipShow("綜合市場所有部位計算出的單一數值，正數偏多，負數偏空", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  當盤數值
                </span>
                <span className="font-mono text-gray-700">22,142</span>
              </div>
              <div className="px-2 py-2 rounded hover:bg-gray-100 border-b border-gray-100 flex justify-between items-center">
                <span
                  className="term-tooltip"
                  onMouseEnter={(e) => handleTooltipShow("市場多空溫度，達到設定數值時交易", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  多空溫度
                </span>
                <span className="font-mono text-[#ef4444]">67 %</span>
              </div>
              <div className="px-2 py-2 rounded hover:bg-gray-100 border-b border-gray-100 flex justify-between items-center">
                <span
                  className="term-tooltip animate-pulse"
                  onMouseEnter={(e) => handleTooltipShow("觸發交易的時機點，與前一分鐘超過設定值，則送出委託（可設定正數或負數，0＝全部符合）", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  生命總值 (增減%)
                </span>
                <span className="font-mono text-gray-700">4,837 (0.1%)</span>
              </div>
              <div className="px-2 py-2 rounded hover:bg-gray-100 border-b border-gray-100 flex justify-between items-center">
                <span
                  className="term-tooltip"
                  onMouseEnter={(e) => handleTooltipShow("生命總值的平均狀態", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  生命平均值(現況%)
                </span>
                <span className="font-mono text-gray-700">28%</span>
              </div>
            </nav>
            <div className="mt-3 px-2 text-[10px] text-gray-400 leading-tight">
              ＊報價源由券商提供，經系統計算後呈現
            </div>
          </div>
        </aside>

        {/* Main Content Pane */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#f3f4f6]">
          {/* Performance Chart */}
          <div className="bg-white rounded-md shadow-sm border border-gray-200">
            <button
              onClick={() => setIsChartOpen(!isChartOpen)}
              className="w-full px-4 py-3 flex justify-between items-center text-left font-bold text-gray-700 hover:bg-gray-50 transition"
            >
              <span className="flex items-center space-x-2">
                <span
                  className="term-tooltip"
                  onMouseEnter={(e) => handleTooltipShow("累積損益的變化趨勢", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  績效走勢圖
                </span>
              </span>
              <span
                className="material-icons-outlined text-gray-400 transition-transform duration-200"
                style={{ transform: isChartOpen ? "rotate(0deg)" : "rotate(180deg)" }}
              >
                expand_less
              </span>
            </button>
            {isChartOpen && (
              <div id="chart-content" className="p-4 border-t border-gray-100">
                <div className="h-41 bg-gray-50 rounded border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <span className="material-icons-outlined text-4xl mb-2">insert_chart_outlined</span>
                    <p className="text-sm">使用 Recharts / D3 即時演算繪製</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Transaction Details */}
          <div className="bg-white rounded-md shadow-sm border border-gray-200">
            <button
              onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              className="w-full px-4 py-3 flex justify-between items-center text-left font-bold text-gray-700 hover:bg-gray-50 transition"
            >
              <span className="flex items-center space-x-2">
                <span
                  className="term-tooltip"
                  onMouseEnter={(e) => handleTooltipShow("詳細的成交紀錄", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  交易明細
                </span>
              </span>
              <span
                className="material-icons-outlined text-gray-400 transition-transform duration-200"
                style={{ transform: isDetailsOpen ? "rotate(0deg)" : "rotate(180deg)" }}
              >
                expand_less
              </span>
            </button>
            {isDetailsOpen && (
              <div id="details-content" className="p-4 border-t border-gray-100">
                <div className="h-41 bg-gray-50 rounded border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <span className="material-icons-outlined text-4xl mb-2">receipt_long</span>
                    <p className="text-sm">尚無合約明細資料</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Basic Settings */}
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
              <h3 className="font-bold text-gray-800 flex items-center space-x-2">
                <span
                  className="term-tooltip"
                  onMouseEnter={(e) => handleTooltipShow("資金與契約的基礎配置", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  基本設定
                </span>
              </h3>
              <button className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded transition border border-gray-300">
                <span>💾</span>
                <span>儲存</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  <span
                    className="term-tooltip"
                    onMouseEnter={(e) => handleTooltipShow("選擇要交易的合約月份或週別 (如近週三)", e)}
                    onMouseMove={handleTooltipMove}
                    onMouseLeave={handleTooltipHide}
                  >
                    交易商品契約
                  </span>
                </label>
                <div className="relative">
                  <select
                    id="contract-select"
                    className="w-full bg-gray-100 border-none rounded text-sm p-2 pr-8 focus:ring-1 focus:ring-[#20b981]"
                    disabled
                  >
                    <option value={nextWednesdayDate}>近週三 ({nextWednesdayDate})</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  <span
                    className="term-tooltip"
                    onMouseEnter={(e) => handleTooltipShow("設定結算後是否自動切換到下一個契約", e)}
                    onMouseMove={handleTooltipMove}
                    onMouseLeave={handleTooltipHide}
                  >
                    結算自動換契約
                  </span>
                </label>
                <select className="w-full bg-gray-100 border-none rounded text-sm p-2 focus:ring-1 focus:ring-[#2c3e50]">
                  <option>固定近週三</option>
                  <option>固定近週五</option>
                  <option>近週三&lt;=&gt;近週五</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  <span
                    className="term-tooltip"
                    onMouseEnter={(e) => handleTooltipShow("投入的資金成本，入金增加/出金減少", e)}
                    onMouseMove={handleTooltipMove}
                    onMouseLeave={handleTooltipHide}
                  >
                    投入資金成本
                  </span>
                </label>
                <input
                  className="w-full bg-gray-100 border-none rounded text-sm p-2 focus:ring-1 focus:ring-[#2c3e50]"
                  type="text"
                  defaultValue="350,000"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  <span
                    className="term-tooltip"
                    onMouseEnter={(e) => handleTooltipShow("低於設定金額時不建立新部位，可設定百分比或金額", e)}
                    onMouseMove={handleTooltipMove}
                    onMouseLeave={handleTooltipHide}
                  >
                    保留可用餘額
                  </span>
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    className="flex-1 bg-gray-100 border-none rounded-l text-sm p-2 focus:ring-1 focus:ring-[#2c3e50]"
                    type="text"
                    defaultValue="70"
                  />
                  <select className="bg-gray-200 border-none text-sm px-3 py-2 rounded-r w-20 focus:ring-1 focus:ring-[#2c3e50] cursor-pointer text-center">
                    <option>%</option>
                    <option>元</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  <span
                    className="term-tooltip"
                    onMouseEnter={(e) => handleTooltipShow("程式掃描行情的頻率 (秒)", e)}
                    onMouseMove={handleTooltipMove}
                    onMouseLeave={handleTooltipHide}
                  >
                    交易檢查週期秒數 (Min: 10)
                  </span>
                </label>
                <input
                  className="w-full bg-gray-100 border-none rounded text-sm p-2 focus:ring-1 focus:ring-[#2c3e50]"
                  type="number"
                  min="10"
                  defaultValue="33"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  <span
                    className="term-tooltip"
                    onMouseEnter={(e) => handleTooltipShow("連續平倉時的緩衝時間 (秒)", e)}
                    onMouseMove={handleTooltipMove}
                    onMouseLeave={handleTooltipHide}
                  >
                    平倉間隔秒數 (Min: 4)
                  </span>
                </label>
                <input
                  className="w-full bg-gray-100 border-none rounded text-sm p-2 focus:ring-1 focus:ring-[#2c3e50]"
                  type="number"
                  min="4"
                  defaultValue="17"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  <span
                    className="term-tooltip"
                    onMouseEnter={(e) => handleTooltipShow("動態Sell價低於此數值不下單", e)}
                    onMouseMove={handleTooltipMove}
                    onMouseLeave={handleTooltipHide}
                  >
                    動態 Sell 價下限 (不下單)
                  </span>
                </label>
                <input
                  className="w-full bg-gray-100 border-none rounded text-sm p-2 focus:ring-1 focus:ring-[#2c3e50]"
                  type="text"
                  defaultValue="4"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  <span
                    className="term-tooltip"
                    onMouseEnter={(e) => handleTooltipShow("動態Sell價高於此數值自動降低為設定值", e)}
                    onMouseMove={handleTooltipMove}
                    onMouseLeave={handleTooltipHide}
                  >
                    動態 Sell 價上限 (有下單)
                  </span>
                </label>
                <input
                  className="w-full bg-gray-100 border-none rounded text-sm p-2 focus:ring-1 focus:ring-[#2c3e50]"
                  type="text"
                  defaultValue="50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  <span
                    className="term-tooltip"
                    onMouseEnter={(e) => handleTooltipShow("平衡成交機制，讓價越大越容易成交", e)}
                    onMouseMove={handleTooltipMove}
                    onMouseLeave={handleTooltipHide}
                  >
                    委託讓價
                  </span>
                </label>
                <input
                  className="w-full bg-gray-100 border-none rounded text-sm p-2 focus:ring-1 focus:ring-[#2c3e50]"
                  type="text"
                  defaultValue="0.5"
                />
              </div>
            </div>
          </div>

          {/* Direction Judgment */}
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
              <h3 className="font-bold text-gray-800 flex items-center space-x-2">
                <span
                  className="term-tooltip"
                  onMouseEnter={(e) => handleTooltipShow("決定進場方向的策略，勾選需同時符合", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  方向判斷 (勾選需同時符合)
                </span>
              </h3>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-1 cursor-pointer select-none text-sm text-gray-600 hover:text-[#2c3e50]">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#2c3e50] focus:ring-[#2c3e50] h-4 w-4"
                  />
                  <span
                    className="term-tooltip"
                    onMouseEnter={(e) => handleTooltipShow("符合（交易商品契約與結算自動換契約）相同的示範設定做單次複製參數", e)}
                    onMouseMove={handleTooltipMove}
                    onMouseLeave={handleTooltipHide}
                  >
                    單次複製參數
                  </span>
                </label>
                <button className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded transition border border-gray-300">
                  <span>💾</span>
                  <span>儲存</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2 group">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    className="rounded border-gray-300 text-[#2c3e50] focus:ring-[#2c3e50]"
                    type="checkbox"
                    defaultChecked
                  />
                  <span
                    className="text-sm font-bold term-tooltip"
                    onMouseEnter={(e) => handleTooltipShow("Call與Put交易行為方向一致時才交易", e)}
                    onMouseMove={handleTooltipMove}
                    onMouseLeave={handleTooltipHide}
                  >
                    合計方向
                  </span>
                </label>
                <div className="flex text-xs text-white text-center h-8">
                  <div className="flex-1 bg-[#ef4444] flex items-center justify-center rounded-l shadow-sm">
                    同時向上做多
                  </div>
                  <div className="flex-1 bg-[#22c55e] flex items-center justify-center rounded-r shadow-sm">
                    同時向下做空
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    className="rounded border-gray-300 text-[#2c3e50] focus:ring-[#2c3e50]"
                    type="checkbox"
                  />
                  <span
                    className="text-sm font-bold term-tooltip"
                    onMouseEnter={(e) => handleTooltipShow("市場多空溫度達到設定數值時交易", e)}
                    onMouseMove={handleTooltipMove}
                    onMouseLeave={handleTooltipHide}
                  >
                    多空溫度
                  </span>
                </label>
                <div className="flex text-xs text-center h-8">
                  <input
                    type="number"
                    className="flex-1 w-0 bg-gray-200 border-none rounded-l text-center p-0 text-gray-800 focus:ring-1 focus:ring-inset focus:ring-[#2c3e50] placeholder-gray-400"
                    placeholder=""
                  />
                  <div className="flex-1 w-0 bg-[#ef4444] text-white flex items-center justify-center">
                    以上做多
                  </div>
                  <input
                    type="number"
                    className="flex-1 w-0 bg-gray-200 border-none text-center p-0 text-gray-800 focus:ring-1 focus:ring-inset focus:ring-[#2c3e50] placeholder-gray-400"
                    placeholder=""
                  />
                  <div className="flex-1 w-0 bg-[#22c55e] text-white flex items-center justify-center rounded-r">
                    以下做空
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    className="rounded border-gray-300 text-[#2c3e50] focus:ring-[#2c3e50]"
                    type="checkbox"
                  />
                  <span
                    className="text-sm font-bold term-tooltip"
                    onMouseEnter={(e) => handleTooltipShow("高低於設定值,做逆勢部位", e)}
                    onMouseMove={handleTooltipMove}
                    onMouseLeave={handleTooltipHide}
                  >
                    逆勢多空溫度
                  </span>
                </label>
                <div className="flex text-xs text-center h-8">
                  <input
                    type="number"
                    className="flex-1 w-0 bg-gray-200 border-none rounded-l text-center p-0 text-gray-800 focus:ring-1 focus:ring-inset focus:ring-[#2c3e50] placeholder-gray-400"
                    placeholder=""
                  />
                  <div className="flex-1 w-0 bg-[#22c55e] text-white flex items-center justify-center">
                    以上做空
                  </div>
                  <input
                    type="number"
                    className="flex-1 w-0 bg-gray-200 border-none text-center p-0 text-gray-800 focus:ring-1 focus:ring-inset focus:ring-[#2c3e50] placeholder-gray-400"
                    placeholder=""
                  />
                  <div className="flex-1 w-0 bg-[#ef4444] text-white flex items-center justify-center rounded-r">
                    以下做多
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    className="rounded border-gray-300 text-[#2c3e50] focus:ring-[#2c3e50]"
                    type="checkbox"
                  />
                  <span
                    className="text-sm font-bold term-tooltip"
                    onMouseEnter={(e) => handleTooltipShow("可自行設定價格作為多空分界", e)}
                    onMouseMove={handleTooltipMove}
                    onMouseLeave={handleTooltipHide}
                  >
                    期貨價格
                  </span>
                </label>
                <div className="flex text-xs text-center h-8">
                  <input
                    type="number"
                    className="flex-1 w-0 bg-gray-200 border-none rounded-l text-center p-0 text-gray-800 focus:ring-1 focus:ring-inset focus:ring-[#2c3e50] placeholder-gray-400"
                    placeholder=""
                  />
                  <div className="flex-1 w-0 bg-[#ef4444] text-white flex items-center justify-center">
                    以上做多
                  </div>
                  <input
                    type="number"
                    className="flex-1 w-0 bg-gray-200 border-none text-center p-0 text-gray-800 focus:ring-1 focus:ring-inset focus:ring-[#2c3e50] placeholder-gray-400"
                    placeholder=""
                  />
                  <div className="flex-1 w-0 bg-[#22c55e] text-white flex items-center justify-center rounded-r">
                    以下做空
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    className="rounded border-gray-300 text-[#2c3e50] focus:ring-[#2c3e50]"
                    type="checkbox"
                  />
                  <span
                    className="text-sm font-bold term-tooltip"
                    onMouseEnter={(e) => handleTooltipShow("高低於設定值,做逆勢部位", e)}
                    onMouseMove={handleTooltipMove}
                    onMouseLeave={handleTooltipHide}
                  >
                    逆勢期貨價格
                  </span>
                </label>
                <div className="flex text-xs text-center h-8">
                  <input
                    type="number"
                    className="flex-1 w-0 bg-gray-200 border-none rounded-l text-center p-0 text-gray-800 focus:ring-1 focus:ring-inset focus:ring-[#2c3e50] placeholder-gray-400"
                    placeholder=""
                  />
                  <div className="flex-1 w-0 bg-[#22c55e] text-white flex items-center justify-center">
                    以上做空
                  </div>
                  <input
                    type="number"
                    className="flex-1 w-0 bg-gray-200 border-none text-center p-0 text-gray-800 focus:ring-1 focus:ring-inset focus:ring-[#2c3e50] placeholder-gray-400"
                    placeholder=""
                  />
                  <div className="flex-1 w-0 bg-[#ef4444] text-white flex items-center justify-center rounded-r">
                    以下做多
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Temperature Adjustment */}
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4" id="temp-adjust-section">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
              <h3 className="font-bold text-gray-800 flex items-center space-x-2">
                <span
                  className="term-tooltip"
                  onMouseEnter={(e) => handleTooltipShow("將部位溫度調整至貼近市場，避免偏離過大，可用金額大於保留可用餘額時建立新倉，小於就平倉", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  多空溫度調整
                </span>
              </h3>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-1 cursor-pointer select-none text-sm text-gray-600 hover:text-[#2c3e50]">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#2c3e50] focus:ring-[#2c3e50] h-4 w-4"
                  />
                  <span
                    className="term-tooltip"
                    onMouseEnter={(e) => handleTooltipShow("符合（交易商品契約與結算自動換契約）相同的示範設定做單次複製參數", e)}
                    onMouseMove={handleTooltipMove}
                    onMouseLeave={handleTooltipHide}
                  >
                    單次複製參數
                  </span>
                </label>
                <button className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded transition border border-gray-300">
                  <span>💾</span>
                  <span>儲存</span>
                </button>
              </div>
            </div>
            <div className="mb-3">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  id="cb-temp-adjust"
                  className="rounded border-gray-300 text-[#2c3e50] focus:ring-[#2c3e50]"
                  type="checkbox"
                  checked={isTempAdjustChecked}
                  onChange={(e) => setIsTempAdjustChecked(e.target.checked)}
                />
                <span className="text-sm font-bold">啟用多空溫度調整</span>
              </label>
            </div>
            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity duration-300 ${
                isTempAdjustChecked ? "" : "pointer-events-none opacity-50"
              }`}
              id="temp-adjust-inputs"
            >
              <div className="flex rounded-md shadow-sm">
                <span
                  className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-[#3b82f6] bg-[#3b82f6]/80 text-white text-xs font-bold min-w-[80px] justify-center term-tooltip cursor-help"
                  onMouseEnter={(e) => handleTooltipShow("參考市場多空溫度的權重 (100%完全相信市場，0%完全不相信市場)", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  設定力道
                </span>
                <div className="flex-1 min-w-0 relative">
                  <select
                    className="w-full border-none bg-gray-105 text-sm p-2 rounded-none focus:ring-inset focus:ring-1 focus:ring-[#3b82f6]"
                    disabled={!isTempAdjustChecked}
                  >
                    <option>100 %</option>
                    <option>80 %</option>
                    <option>50 %</option>
                  </select>
                  <span className="absolute right-2 top-2 material-icons-outlined text-gray-500 text-sm pointer-events-none">
                    expand_more
                  </span>
                </div>
                <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-[#3b82f6] bg-[#3b82f6]/80 text-white text-xs">
                  =
                </span>
              </div>
              <div className="flex rounded-md shadow-sm">
                <span
                  className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-[#3b82f6] bg-[#3b82f6]/80 text-white text-xs font-bold min-w-[80px] justify-center term-tooltip cursor-help"
                  onMouseEnter={(e) => handleTooltipShow("設定不動作範圍 (如 +/- 40點)，避免頻繁調整部位", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  容許範圍
                </span>
                <div className="flex-1 min-w-0 relative">
                  <select
                    className="w-full border-none bg-gray-105 text-sm p-2 rounded-none focus:ring-inset focus:ring-1 focus:ring-[#3b82f6]"
                    disabled={!isTempAdjustChecked}
                  >
                    <option>40</option>
                    <option>35</option>
                    <option>30</option>
                  </select>
                  <span className="absolute right-2 top-2 material-icons-outlined text-gray-500 text-sm pointer-events-none">
                    expand_more
                  </span>
                </div>
                <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-[#3b82f6] bg-[#3b82f6]/80 text-white text-xs">
                  =
                </span>
              </div>
            </div>
          </div>

          {/* Trading Conditions */}
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
              <h3 className="font-bold text-gray-800 flex items-center space-x-2">
                <span
                  className="term-tooltip"
                  onMouseEnter={(e) => handleTooltipShow("決定進場時機與價位", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  交易條件
                </span>
              </h3>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-1 cursor-pointer select-none text-sm text-gray-600 hover:text-[#2c3e50]">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#2c3e50] focus:ring-[#2c3e50] h-4 w-4"
                  />
                  <span>單次複製參數</span>
                </label>
                <button className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded transition border border-gray-300">
                  <span>💾</span>
                  <span>儲存</span>
                </button>
              </div>
            </div>

            <div className="flex items-stretch rounded mb-4 overflow-hidden shadow-sm h-9">
              <div
                className="bg-[#2c3e50] text-white px-4 flex items-center text-sm font-medium whitespace-nowrap term-tooltip cursor-help"
                onMouseEnter={(e) => handleTooltipShow("觸發交易的時機點，與前一分鐘超過設定值，則送出委託（可設定正數或負數，0＝全部符合）", e)}
                onMouseMove={handleTooltipMove}
                onMouseLeave={handleTooltipHide}
              >
                生命總值與前期增減
              </div>
              <input
                type="text"
                className="flex-1 bg-white border-gray-300 text-sm px-3 text-center focus:ring-inset focus:ring-1 focus:ring-[#2c3e50] border-y border-r-0"
                placeholder="輸入數值"
              />
              <button className="bg-[#2c3e50] hover:bg-[#34495e] text-white text-xs px-6 font-bold transition flex items-center whitespace-nowrap">
                % 執行
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Buy Side */}
              <div>
                <div className="bg-[#ef4444] text-white text-sm font-bold p-2 rounded-t flex items-center justify-between">
                  <span>做多：溫漲做莊 SP+BP</span>
                  <span className="material-icons-outlined text-sm opacity-70">trending_up</span>
                </div>
                <div className="bg-gray-50 border border-t-0 border-gray-200 p-3 space-y-3 rounded-b">
                  <div className="flex shadow-sm rounded">
                    <span className="bg-[#2c3e50] text-white text-xs flex items-center px-2 rounded-l min-w-[80px]">
                      生命總值 /
                    </span>
                    <input
                      className="flex-1 bg-gray-100 border-none text-xs text-center"
                      disabled
                      type="text"
                      defaultValue="3000"
                    />
                    <span
                      className="bg-[#2c3e50] text-white text-xs flex items-center px-2 rounded-r min-w-[80px] justify-center term-tooltip cursor-help"
                      onMouseEnter={(e) => handleTooltipShow("決定賣出部位(Sell)的履約價，計算方式：生命總值 / 設定值 = 動態Sell價", e)}
                      onMouseMove={handleTooltipMove}
                      onMouseLeave={handleTooltipHide}
                    >
                      = 動態 Sell 價
                    </span>
                  </div>
                  <div className="flex shadow-sm rounded">
                    <span
                      className="bg-[#2c3e50] text-white text-xs flex items-center px-2 rounded-l min-w-[80px] term-tooltip cursor-help"
                      onMouseEnter={(e) => handleTooltipShow("決定買入部位(Buy)的履約價間距，建議設定100點", e)}
                      onMouseMove={handleTooltipMove}
                      onMouseLeave={handleTooltipHide}
                    >
                      複式單 BP 價外
                    </span>
                    <div className="flex-1 relative bg-gray-100">
                      <select className="w-full bg-transparent border-none text-xs h-full pl-2 pr-6">
                        <option>50</option>
                        <option>100</option>
                        <option>150</option>
                        <option>200</option>
                        <option>250</option>
                        <option>300</option>
                      </select>
                      <span className="absolute right-1 top-1.5 material-icons-outlined text-gray-500 text-xs pointer-events-none">
                        expand_more
                      </span>
                    </div>
                    <span className="bg-[#2c3e50] text-white text-xs flex items-center px-2 rounded-r min-w-[40px] justify-center">
                      點
                    </span>
                  </div>
                </div>
              </div>

              {/* Sell Side */}
              <div>
                <div className="bg-[#22c55e] text-white text-sm font-bold p-2 rounded-t flex items-center justify-between">
                  <span>做空：溫跌做莊 SC+BC</span>
                  <span className="material-icons-outlined text-sm opacity-70">trending_down</span>
                </div>
                <div className="bg-gray-50 border border-t-0 border-gray-200 p-3 space-y-3 rounded-b">
                  <div className="flex shadow-sm rounded">
                    <span className="bg-[#2c3e50] text-white text-xs flex items-center px-2 rounded-l min-w-[80px]">
                      生命總值 /
                    </span>
                    <input
                      className="flex-1 bg-gray-100 border-none text-xs text-center"
                      disabled
                      type="text"
                      defaultValue="3000"
                    />
                    <span
                      className="bg-[#2c3e50] text-white text-xs flex items-center px-2 rounded-r min-w-[80px] justify-center term-tooltip cursor-help"
                      onMouseEnter={(e) => handleTooltipShow("決定賣出部位(Sell)的履約價，計算方式：生命總值 / 設定值 = 動態Sell價", e)}
                      onMouseMove={handleTooltipMove}
                      onMouseLeave={handleTooltipHide}
                    >
                      = 動態 Sell 價
                    </span>
                  </div>
                  <div className="flex shadow-sm rounded">
                    <span
                      className="bg-[#2c3e50] text-white text-xs flex items-center px-2 rounded-l min-w-[80px] term-tooltip cursor-help"
                      onMouseEnter={(e) => handleTooltipShow("決定買入部位(Buy)的履約價間距，建議設定100點", e)}
                      onMouseMove={handleTooltipMove}
                      onMouseLeave={handleTooltipHide}
                    >
                      複式單 BC 價外
                    </span>
                    <div className="flex-1 relative bg-gray-100">
                      <select className="w-full bg-transparent border-none text-xs h-full pl-2 pr-6">
                        <option>50</option>
                        <option>100</option>
                        <option>150</option>
                        <option>200</option>
                        <option>250</option>
                        <option>300</option>
                      </select>
                      <span className="absolute right-1 top-1.5 material-icons-outlined text-gray-500 text-xs pointer-events-none">
                        expand_more
                      </span>
                    </div>
                    <span className="bg-[#2c3e50] text-white text-xs flex items-center px-2 rounded-r min-w-[40px] justify-center">
                      點
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stop Loss / Take Profit */}
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
              <h3 className="font-bold text-gray-800 flex items-center space-x-2">
                <span
                  className="term-tooltip"
                  onMouseEnter={(e) => handleTooltipShow("風險控制與獲利了結", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  停損停利
                </span>
              </h3>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-1 cursor-pointer select-none text-sm text-gray-600 hover:text-[#2c3e50]">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#2c3e50] focus:ring-[#2c3e50] h-4 w-4"
                  />
                  <span>單次複製參數</span>
                </label>
                <button className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded transition border border-gray-300">
                  <span>💾</span>
                  <span>儲存</span>
                </button>
              </div>
            </div>

            {/* Stop Loss Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-6">
              <div className="group">
                <label className="flex items-center space-x-2 cursor-pointer mb-2 select-none">
                  <input
                    className="rounded border-gray-300 text-[#2c3e50] focus:ring-[#2c3e50]"
                    type="checkbox"
                    checked={isScBcStopLossChecked}
                    onChange={(e) => setIsScBcStopLossChecked(e.target.checked)}
                  />
                  <span className="text-sm font-bold">SC+BC 停損</span>
                </label>
                <div
                  className={`flex h-8 shadow-sm rounded transition-opacity ${
                    isScBcStopLossChecked ? "" : "pointer-events-none opacity-50"
                  }`}
                >
                  <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-l w-1/3">
                    虧損 / 成交價 &lt;=
                  </span>
                  <input
                    className="flex-1 bg-gray-100 border-none text-xs text-center focus:ring-1 focus:ring-[#f59e0b]"
                    disabled={!isScBcStopLossChecked}
                    type="number"
                    defaultValue="-333"
                  />
                  <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-r w-10 justify-center">
                    %
                  </span>
                </div>
              </div>

              <div className="group">
                <label className="flex items-center space-x-2 cursor-pointer mb-2 select-none">
                  <input
                    className="rounded border-gray-300 text-[#2c3e50] focus:ring-[#2c3e50]"
                    type="checkbox"
                    checked={isSpBpStopLossChecked}
                    onChange={(e) => setIsSpBpStopLossChecked(e.target.checked)}
                  />
                  <span className="text-sm font-bold">SP+BP 停損</span>
                </label>
                <div
                  className={`flex h-8 shadow-sm rounded transition-opacity ${
                    isSpBpStopLossChecked ? "" : "pointer-events-none opacity-50"
                  }`}
                >
                  <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-l w-1/3">
                    虧損 / 成交價 &lt;=
                  </span>
                  <input
                    className="flex-1 bg-gray-100 border-none text-xs text-center focus:ring-1 focus:ring-[#f59e0b]"
                    disabled={!isSpBpStopLossChecked}
                    type="number"
                    defaultValue="-333"
                  />
                  <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-r w-10 justify-center">
                    %
                  </span>
                </div>
              </div>

              <div className="group">
                <label className="flex items-center space-x-2 cursor-pointer mb-2 select-none">
                  <input
                    className="rounded border-gray-300 text-[#2c3e50] focus:ring-[#2c3e50]"
                    type="checkbox"
                    checked={isScBcPriceStopLossChecked}
                    onChange={(e) => setIsScBcPriceStopLossChecked(e.target.checked)}
                  />
                  <span
                    className="text-sm font-bold term-tooltip"
                    onMouseEnter={(e) => handleTooltipShow("以履約價差為100％，目前點數超過設定％則停損（不考慮成本）", e)}
                    onMouseMove={handleTooltipMove}
                    onMouseLeave={handleTooltipHide}
                  >
                    SC+BC 價差點數 % 停損 (Max 100%)
                  </span>
                </label>
                <div
                  className={`flex h-8 shadow-sm rounded transition-opacity ${
                    isScBcPriceStopLossChecked ? "" : "pointer-events-none opacity-50"
                  }`}
                >
                  <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-l w-1/3">
                    現價 &gt;= 價差點數的
                  </span>
                  <input
                    className="flex-1 bg-gray-100 border-none text-xs text-center focus:ring-1 focus:ring-[#f59e0b]"
                    disabled={!isScBcPriceStopLossChecked}
                    type="number"
                    defaultValue="55"
                  />
                  <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-r w-10 justify-center">
                    %
                  </span>
                </div>
              </div>

              <div className="group">
                <label className="flex items-center space-x-2 cursor-pointer mb-2 select-none">
                  <input
                    className="rounded border-gray-300 text-[#2c3e50] focus:ring-[#2c3e50]"
                    type="checkbox"
                    checked={isSpBpPriceStopLossChecked}
                    onChange={(e) => setIsSpBpPriceStopLossChecked(e.target.checked)}
                  />
                  <span
                    className="text-sm font-bold term-tooltip"
                    onMouseEnter={(e) => handleTooltipShow("以履約價差為100％，目前點數超過設定％則停損（不考慮成本）", e)}
                    onMouseMove={handleTooltipMove}
                    onMouseLeave={handleTooltipHide}
                  >
                    SP+BP 價差點數 % 停損 (Max 100%)
                  </span>
                </label>
                <div
                  className={`flex h-8 shadow-sm rounded transition-opacity ${
                    isSpBpPriceStopLossChecked ? "" : "pointer-events-none opacity-50"
                  }`}
                >
                  <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-l w-1/3">
                    現價 &gt;= 價差點數的
                  </span>
                  <input
                    className="flex-1 bg-gray-100 border-none text-xs text-center focus:ring-1 focus:ring-[#f59e0b]"
                    disabled={!isSpBpPriceStopLossChecked}
                    type="number"
                    defaultValue="55"
                  />
                  <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-r w-10 justify-center">
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Take Profit Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-4">
                <div className="group">
                  <label className="flex items-center space-x-2 cursor-pointer mb-2 select-none">
                    <input
                      className="rounded border-gray-300 text-[#2c3e50] focus:ring-[#2c3e50]"
                      type="checkbox"
                      checked={isScBcProfitChecked}
                      onChange={(e) => setIsScBcProfitChecked(e.target.checked)}
                    />
                    <span className="text-sm font-bold">SC+BC 停利 (Max 100%)</span>
                  </label>
                  <div
                    className={`flex h-8 shadow-sm rounded transition-opacity ${
                      isScBcProfitChecked ? "" : "pointer-events-none opacity-50"
                    }`}
                  >
                    <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-l w-1/3">
                      獲利 / 成交價 &gt;=
                    </span>
                    <input
                      className="flex-1 bg-gray-100 border-none text-xs text-center focus:ring-1 focus:ring-[#f59e0b]"
                      disabled={!isScBcProfitChecked}
                      type="number"
                      defaultValue="85"
                    />
                    <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-r w-10 justify-center">
                      %
                    </span>
                  </div>
                </div>

                <div className="group">
                  <label className="flex items-center space-x-2 cursor-pointer mb-2 select-none">
                    <input
                      className="rounded border-gray-300 text-[#2c3e50] focus:ring-[#2c3e50]"
                      type="checkbox"
                      checked={isBaoli1Checked}
                      onChange={(e) => setIsBaoli1Checked(e.target.checked)}
                    />
                    <span
                      className="text-sm font-bold term-tooltip"
                      onMouseEnter={(e) => handleTooltipShow("權益總值獲利%達到設定值時觸發，平倉鎖住獲利", e)}
                      onMouseMove={handleTooltipMove}
                      onMouseLeave={handleTooltipHide}
                    >
                      保利降部位 1
                    </span>
                  </label>
                  <div
                    className={`space-y-2 transition-opacity ${
                      isBaoli1Checked ? "" : "pointer-events-none opacity-50"
                    }`}
                  >
                    <div className="flex h-8 shadow-sm rounded">
                      <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-l w-1/4">
                        獲利 % &gt;=
                      </span>
                      <input
                        className="flex-1 bg-gray-100 border-none text-xs text-center"
                        disabled={!isBaoli1Checked}
                        type="number"
                        defaultValue="1"
                      />
                      <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-r w-1/3 justify-center">
                        % 平倉最高價
                      </span>
                    </div>
                    <div className="flex h-8 shadow-sm rounded">
                      <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-l w-1/4">
                        保留
                      </span>
                      <input
                        className="flex-1 bg-gray-100 border-none text-xs text-center"
                        disabled={!isBaoli1Checked}
                        type="number"
                        placeholder="20"
                      />
                      <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-r w-1/3 justify-center">
                        點以下不平倉
                      </span>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="flex items-center space-x-2 cursor-pointer mb-2 select-none">
                    <input
                      className="rounded border-gray-300 text-[#2c3e50] focus:ring-[#2c3e50]"
                      type="checkbox"
                      checked={isLossDropChecked}
                      onChange={(e) => setIsLossDropChecked(e.target.checked)}
                    />
                    <span
                      className="text-sm font-bold term-tooltip"
                      onMouseEnter={(e) => handleTooltipShow("權益總值虧損%達到設定值時觸發，平倉控制風險", e)}
                      onMouseMove={handleTooltipMove}
                      onMouseLeave={handleTooltipHide}
                    >
                      虧損降部位
                    </span>
                  </label>
                  <div
                    className={`space-y-2 transition-opacity ${
                      isLossDropChecked ? "" : "pointer-events-none opacity-50"
                    }`}
                  >
                    <div className="flex h-8 shadow-sm rounded">
                      <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-l w-1/4">
                        虧損 % &lt;=
                      </span>
                      <input
                        className="flex-1 bg-gray-100 border-none text-xs text-center"
                        disabled={!isLossDropChecked}
                        type="number"
                        defaultValue="-4"
                      />
                      <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-r w-1/3 justify-center">
                        % 平倉最高價
                      </span>
                    </div>
                    <div className="flex h-8 shadow-sm rounded">
                      <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-l w-1/4">
                        保留
                      </span>
                      <input
                        className="flex-1 bg-gray-100 border-none text-xs text-center"
                        disabled={!isLossDropChecked}
                        type="number"
                        placeholder="10"
                      />
                      <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-r w-1/3 justify-center">
                        點以下不平倉
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="group">
                  <label className="flex items-center space-x-2 cursor-pointer mb-2 select-none">
                    <input
                      className="rounded border-gray-300 text-[#2c3e50] focus:ring-[#2c3e50]"
                      type="checkbox"
                      checked={isSpBpProfitChecked}
                      onChange={(e) => setIsSpBpProfitChecked(e.target.checked)}
                    />
                    <span className="text-sm font-bold">SP+BP 停利 (Max 100%)</span>
                  </label>
                  <div
                    className={`flex h-8 shadow-sm rounded transition-opacity ${
                      isSpBpProfitChecked ? "" : "pointer-events-none opacity-50"
                    }`}
                  >
                    <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-l w-1/3">
                      獲利 / 成交價 &gt;=
                    </span>
                    <input
                      className="flex-1 bg-gray-100 border-none text-xs text-center focus:ring-1 focus:ring-[#f59e0b]"
                      disabled={!isSpBpProfitChecked}
                      type="number"
                      defaultValue="85"
                    />
                    <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-r w-10 justify-center">
                      %
                    </span>
                  </div>
                </div>

                <div className="group">
                  <label className="flex items-center space-x-2 cursor-pointer mb-2 select-none">
                    <input
                      className="rounded border-gray-300 text-[#2c3e50] focus:ring-[#2c3e50]"
                      type="checkbox"
                      checked={isBaoli2Checked}
                      onChange={(e) => setIsBaoli2Checked(e.target.checked)}
                    />
                    <span className="text-sm font-bold">保利降部位 2</span>
                  </label>
                  <div
                    className={`space-y-2 transition-opacity ${
                      isBaoli2Checked ? "" : "pointer-events-none opacity-50"
                    }`}
                  >
                    <div className="flex h-8 shadow-sm rounded">
                      <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-l w-1/4">
                        獲利 % &gt;=
                      </span>
                      <input
                        className="flex-1 bg-gray-100 border-none text-xs text-center"
                        disabled={!isBaoli2Checked}
                        type="number"
                        defaultValue="2.5"
                      />
                      <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-r w-1/3 justify-center">
                        % 平倉最高價
                      </span>
                    </div>
                    <div className="flex h-8 shadow-sm rounded">
                      <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-l w-1/4">
                        保留
                      </span>
                      <input
                        className="flex-1 bg-gray-100 border-none text-xs text-center"
                        disabled={!isBaoli2Checked}
                        type="number"
                        placeholder="20"
                      />
                      <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-r w-1/3 justify-center">
                        點以下不平倉
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instant Total Point Control */}
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
              <h3 className="font-bold text-gray-800 flex items-center space-x-2">
                <span
                  className="term-tooltip"
                  onMouseEnter={(e) => handleTooltipShow("整體部位總點數達到數值時停損", e)}
                  onMouseMove={handleTooltipMove}
                  onMouseLeave={handleTooltipHide}
                >
                  即時總點管控
                </span>
              </h3>
              <button className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded transition border border-gray-300">
                <span>💾</span>
                <span>儲存</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="group">
                <label className="flex items-center space-x-2 cursor-pointer mb-2 select-none">
                  <input
                    className="rounded border-gray-300 text-[#2c3e50] focus:ring-[#2c3e50]"
                    type="checkbox"
                    checked={isDayOpenChecked}
                    onChange={(e) => setIsDayOpenChecked(e.target.checked)}
                  />
                  <span
                    className="text-sm font-bold term-tooltip"
                    onMouseEnter={(e) => handleTooltipShow("在特定時間(如12:45)檢查並平倉", e)}
                    onMouseMove={handleTooltipMove}
                    onMouseLeave={handleTooltipHide}
                  >
                    日盤定時平倉最高價 (收盤自動關閉)
                  </span>
                </label>
                <div
                  className={`flex h-8 items-center space-x-1 transition-opacity ${
                    isDayOpenChecked ? "" : "pointer-events-none opacity-50"
                  }`}
                >
                  <select
                    className="flex-1 bg-gray-100 border-none text-xs h-full rounded px-1 min-w-0"
                    disabled={!isDayOpenChecked}
                  >
                    <option>09</option>
                    <option>10</option>
                    <option>11</option>
                    <option defaultValue="12">12</option>
                  </select>
                  <span className="font-bold text-gray-500 shrink-0">:</span>
                  <select
                    className="flex-1 bg-gray-100 border-none text-xs h-full rounded px-1 min-w-0"
                    disabled={!isDayOpenChecked}
                  >
                    <option>00</option>
                    <option>15</option>
                    <option>30</option>
                    <option defaultValue="45">45</option>
                  </select>
                  <span className="text-gray-500 mx-1 shrink-0">~</span>
                  <button className="flex-1 bg-[#f59e0b] text-white text-xs px-2 h-full rounded hover:bg-amber-600 whitespace-nowrap min-w-0 flex items-center justify-center">
                    即時總點 &gt;=
                  </button>
                  <input
                    className="flex-1 bg-gray-100 border-none text-xs h-full rounded text-center min-w-0"
                    disabled={!isDayOpenChecked}
                    type="text"
                    defaultValue="48"
                  />
                </div>
              </div>

              <div className="group">
                <label className="flex items-center space-x-2 cursor-pointer mb-2 select-none">
                  <input
                    className="rounded border-gray-300 text-[#2c3e50] focus:ring-[#2c3e50]"
                    type="checkbox"
                    checked={isNightOpenChecked}
                    onChange={(e) => setIsNightOpenChecked(e.target.checked)}
                  />
                  <span
                    className="text-sm font-bold term-tooltip"
                    onMouseEnter={(e) => handleTooltipShow("在特定時間檢查並平倉", e)}
                    onMouseMove={handleTooltipMove}
                    onMouseLeave={handleTooltipHide}
                  >
                    夜盤定時平倉最高價 (收盤自動關閉)
                  </span>
                </label>
                <div
                  className={`flex h-8 items-center space-x-1 transition-opacity ${
                    isNightOpenChecked ? "" : "pointer-events-none opacity-50"
                  }`}
                >
                  <select
                    className="flex-1 bg-gray-100 border-none text-xs h-full rounded px-1 min-w-0"
                    disabled={!isNightOpenChecked}
                  >
                    <option>23</option>
                    <option>00</option>
                    <option defaultValue="01">01</option>
                  </select>
                  <span className="font-bold text-gray-500 shrink-0">:</span>
                  <select
                    className="flex-1 bg-gray-100 border-none text-xs h-full rounded px-1 min-w-0"
                    disabled={!isNightOpenChecked}
                  >
                    <option>00</option>
                    <option defaultValue="05">05</option>
                    <option>10</option>
                    <option>15</option>
                  </select>
                  <span className="text-gray-500 mx-1 shrink-0">~</span>
                  <button className="flex-1 bg-[#f59e0b] text-white text-xs px-2 h-full rounded hover:bg-amber-600 whitespace-nowrap min-w-0 flex items-center justify-center">
                    即時總點 &gt;=
                  </button>
                  <input
                    className="flex-1 bg-gray-100 border-none text-xs h-full rounded text-center min-w-0"
                    disabled={!isNightOpenChecked}
                    type="text"
                    defaultValue="114"
                  />
                </div>
              </div>

              <div className="group">
                <label className="flex items-center space-x-2 cursor-pointer mb-2 select-none">
                  <input
                    className="rounded border-gray-300 text-[#2c3e50] focus:ring-[#2c3e50]"
                    type="checkbox"
                    checked={isInstantControlChecked}
                    onChange={(e) => setIsInstantControlChecked(e.target.checked)}
                  />
                  <span
                    className="text-sm font-bold term-tooltip"
                    onMouseEnter={(e) => handleTooltipShow("整體部位總點數達到數值時停損，若超過數值，平倉最高點數部位", e)}
                    onMouseMove={handleTooltipMove}
                    onMouseLeave={handleTooltipHide}
                  >
                    即時總點管控
                  </span>
                </label>
                <div
                  className={`flex h-8 shadow-sm rounded transition-opacity ${
                    isInstantControlChecked ? "" : "pointer-events-none opacity-50"
                  }`}
                >
                  <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-l min-w-[80px]">
                    即時總點 &gt;=
                  </span>
                  <input
                    className="flex-1 bg-gray-100 border-none text-xs text-center"
                    disabled={!isInstantControlChecked}
                    type="text"
                    placeholder="1000"
                  />
                  <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-r min-w-[80px] justify-center">
                    平倉最高價
                  </span>
                </div>
              </div>

              <div className="group">
                <label className="flex items-center space-x-2 cursor-pointer mb-2 select-none">
                  <input
                    className="rounded border-gray-300 text-[#2c3e50] focus:ring-[#2c3e50]"
                    type="checkbox"
                    checked={isLossDropTotalChecked}
                    onChange={(e) => setIsLossDropTotalChecked(e.target.checked)}
                  />
                  <span className="text-sm font-bold">虧損降總點</span>
                </label>
                <div
                  className={`space-y-2 transition-opacity ${
                    isLossDropTotalChecked ? "" : "pointer-events-none opacity-50"
                  }`}
                >
                  <div className="flex h-8 shadow-sm rounded">
                    <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-l w-24">
                      虧損 % &lt;=
                    </span>
                    <input
                      className="flex-1 bg-gray-100 border-none text-xs text-center"
                      disabled={!isLossDropTotalChecked}
                      type="text"
                      placeholder="30"
                    />
                    <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-r w-24">
                      % 平倉最高價
                    </span>
                  </div>
                  <div className="flex h-8 w-3/4 shadow-sm rounded">
                    <span className="bg-[#f59e0b] text-white text-xs flex items-center px-2 rounded-l min-w-[80px]">
                      即時總點降到
                    </span>
                    <input
                      className="flex-1 bg-gray-100 border-none text-xs text-center"
                      disabled={!isLossDropTotalChecked}
                      type="text"
                      placeholder="500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
