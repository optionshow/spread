import React, { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Loader2, 
  Activity, 
  ShieldAlert, 
  RefreshCw,
  Clock
} from "lucide-react";

export const TestChartView: React.FC = () => {
  const SOURCE_URL = "https://script.google.com/macros/s/AKfycbyQVGpIhvtsmJM6opiss-rlLSH8lsGUL0q4xMoaYbb5iqbALe8AkCEvWEo41nEj1Ws/exec";

  // State management
  const [currentScale, setCurrentScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [fileName, setFileName] = useState<string>("載入中...");
  const [updatedTime, setUpdatedTime] = useState<string>("");
  const [lastCheckTime, setLastCheckTime] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);

  // Trigger custom notification toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Fetch the latest image from the macro
  const fetchImage = async () => {
    setLoading(true);
    try {
      const response = await fetch(SOURCE_URL);
      const data = await response.json();
      
      if (data.id) {
        setImgSrc(`https://drive.google.com/thumbnail?id=${data.id}&sz=w1600`);
        setFileName(data.name || "測試影像");
        setUpdatedTime(data.updated || "未知時間");
      } else {
        setFileName("讀取失敗：無效的影像ID");
      }
    } catch (e) {
      console.error(e);
      setFileName("讀取失敗 (請檢查網路或 API 狀態)");
    } finally {
      setLoading(false);
      setLastCheckTime(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    document.title = "自動更新圖片測試";

    // Block right-click menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerToast("此頁面已啟用保護，無法執行此操作。");
    };
    document.addEventListener("contextmenu", handleContextMenu);

    // Block Ctrl+S, Ctrl+P, Ctrl+U
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "p" || e.key === "u")) {
        e.preventDefault();
        triggerToast("此頁面已啟用保護，無法進行儲存、列印或查看原始碼。");
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Initial fetch
    fetchImage();

    // Auto update every 10 minutes (600,000 ms)
    const interval = setInterval(fetchImage, 600000);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(interval);
    };
  }, []);

  const handleZoom = (factor: number) => {
    setCurrentScale((prev) => Math.min(3.0, Math.max(0.5, prev * factor)));
  };

  const handleResetZoom = () => {
    setCurrentScale(1.0);
  };

  return (
    <div className="bg-white rounded-3xl border border-sky-150 p-5 sm:p-7 shadow-xl max-w-7xl w-full relative transition-all duration-300 font-sans select-none antialiased text-slate-800">
      
      {/* Warning Banner */}
      <div className="bg-rose-50 border border-rose-150 rounded-2xl p-4 flex items-start gap-3 mb-6 animate-pulse">
        <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="font-extrabold text-rose-700 text-sm sm:text-base leading-snug">
            &lt;測試用&gt; 圖片僅供參考，不代表未來獲利，需自行謹慎評估！
          </h4>
          <p className="text-xs text-rose-600 font-medium">
            本視窗所載之任何歷史圖表或數據資料，不具備預測未來損益之功能，交易期權請務必嚴格控管保證金及風險。
          </p>
        </div>
      </div>

        {/* Action Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-sky-100 pb-5 mb-5 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight flex items-center gap-2">
                {fileName}
                {loading && <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />}
              </h1>
              <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                來源更新時間: {updatedTime || "載入中..."}
              </p>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleZoom(1.2)}
              disabled={loading}
              title="放大 ＋"
              className="p-2.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100/80 rounded-xl text-indigo-700 transition-all flex items-center justify-center active:scale-95 disabled:opacity-50"
            >
              <ZoomIn className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => handleZoom(0.8)}
              disabled={loading}
              title="縮小 －"
              className="p-2.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100/80 rounded-xl text-indigo-700 transition-all flex items-center justify-center active:scale-95 disabled:opacity-50"
            >
              <ZoomOut className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={handleResetZoom}
              disabled={loading}
              title="重設縮放"
              className="p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 transition-all flex items-center justify-center active:scale-95 disabled:opacity-50"
            >
              <RotateCcw className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={fetchImage}
              disabled={loading}
              title="手動刷新"
              className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-emerald-700 transition-all flex items-center justify-center active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4.5 h-4.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Image Container with Scroll & Cropped limits */}
        <div className="overflow-auto border border-sky-100 rounded-2xl max-h-[140vh] bg-slate-50 relative p-4 flex items-start justify-center shadow-inner min-h-[600px]">
          {loading && !imgSrc && (
            <div className="absolute inset-0 bg-white/75 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <span className="text-xs font-bold text-slate-600">正在連接雲端更新最新圖表...</span>
            </div>
          )}

          {imgSrc ? (
            <div 
              className="overflow-hidden relative transition-all duration-250 ease-in-out border border-slate-150/50 rounded-xl shadow-sm bg-white"
              style={{ width: `${currentScale * 100}%` }}
            >
              <img 
                src={imgSrc} 
                alt="測試影像" 
                draggable={false}
                className="transition-all duration-250 ease-in-out select-none"
                style={{
                  marginTop: `-${currentScale * 7}%`,
                  marginBottom: `-${currentScale * 7}%`,
                  width: "100%",
                  height: "auto",
                  display: "block",
                  pointerEvents: "none"
                }}
              />
            </div>
          ) : (
            !loading && (
              <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-2">
                <AlertTriangle className="w-10 h-10 text-slate-300" />
                <span className="text-sm font-semibold">尚無圖表可顯示，請點擊右上方手動刷新。</span>
              </div>
            )
          )}
        </div>

        {/* Footer info bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500 font-medium pt-4 mt-4 border-t border-slate-100 gap-2">
          <span>最後同步時間: {lastCheckTime || "未同步"}</span>
          <span className="text-slate-400">網頁受安全防護保護 • 嚴禁未經授權拷貝列印</span>
        </div>

      {/* Floating Toast Notification */}
      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-2 transition-all duration-300 z-50 ${
          showToast ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-4 invisible"
        }`}
      >
        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
        <span>{toastMessage}</span>
      </div>

    </div>
  );
};
