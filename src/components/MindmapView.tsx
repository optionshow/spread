import React, { useEffect, useRef, useState } from "react";

export const MindmapView: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [chartInstance, setChartInstance] = useState<any>(null);

  useEffect(() => {
    document.title = "心智圖";

    // Load ECharts script dynamically
    const scriptId = "echarts-script-cdn";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initChart = () => {
      setIsScriptLoaded(true);
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js";
      script.async = true;
      script.onload = initChart;
      document.body.appendChild(script);
    } else {
      if ((window as any).echarts) {
        initChart();
      } else {
        script.addEventListener("load", initChart);
      }
    }

    // Add Google Fonts for Noto Sans TC
    const fontLink = document.createElement("link");
    fontLink.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    return () => {
      if (script) {
        script.removeEventListener("load", initChart);
      }
      try {
        fontLink.remove();
      } catch (e) {
        // Safe check
      }
    };
  }, []);

  const data = {
    name: "智能交易\n設定與功能",
    children: [
      {
        name: "交易總覽",
        itemStyle: { color: "#10b981" }, // Green
        children: [
          { name: "連線中/交易中\n(狀態顯示，通常不需變動)" },
          {
            name: "權益總值",
            children: [
              { name: "最真實的資金狀況\n(已扣除手續費/稅金)" },
              { name: "括號顯示獲利％" }
            ]
          },
          { name: "可用金額\n(用於保留可用餘額判斷)" },
          { name: "損益點數\n(參考用，未扣除手續費/稅金)" },
          { name: "持倉成本\n(所有部位的總成本點數)" },
          {
            name: "即時總點",
            children: [
              { name: "所有部位目前的總價值點數" },
              { name: "獲利時點數減少，\n虧損時點數增加" },
              { name: "Sell Call + Sell Put\n價差的最後點數總和" }
            ]
          },
          {
            name: "持倉溫度 (0-100)",
            children: [
              { name: "顯示目前部位的多空偏向" },
              { name: "0=偏空(全Sell Call)\n100=偏多(全Sell Put)\n50=中立" },
              { name: "C/P比例計算" }
            ]
          },
          {
            name: "歸零預期總報酬(%)",
            children: [
              { name: "持倉部位全部歸零的預估" },
              { name: "若持倉部位無法歸零\n則%不準確(重要!)" }
            ]
          }
        ]
      },
      {
        name: "智能報價",
        itemStyle: { color: "#f59e0b" }, // Yellow/Orange
        children: [
          {
            name: "各周選項",
            children: [
              { name: "MX1, MX2, MX4, MX5\nMXO=月選/第三週" },
              { name: "期交所規定，\n通常只開放近兩週+月選" }
            ]
          },
          {
            name: "交易行為",
            children: [
              { name: "判斷市場Call/Put的買賣偏向\n(SC vs BC, BP vs SP)" },
              { name: "箭頭及顏色表示趨勢\n(紅/上=漲, 綠/下=跌)" }
            ]
          },
          {
            name: "當盤數值",
            children: [
              { name: "綜合市場所有部位\n計算出的單一數值" },
              { name: "正數偏多，負數偏空" },
              { name: "單筆增減±3000\n(有大單，訂閱智能報價會提醒)" }
            ]
          }
        ]
      },
      {
        name: "基本設定",
        itemStyle: { color: "#3b82f6" }, // Blue
        children: [
          {
            name: "保留可用餘額",
            children: [
              { name: "低於設定金額時不建立新部位" },
              { name: "可設定百分比或金額" }
            ]
          },
          {
            name: "動態Sell價上限/下限",
            children: [
              { name: "設定時換算出的賣出Sell價,\n不是價差的成交價" },
              { name: "動態Sell價結果低於設定價下限,\n不下單" },
              { name: "動態Sell價結果高於設定價上限,\n自動降低為設定值" }
            ]
          },
          {
            name: "委託讓價",
            children: [
              { name: "平衡成交與滑價" },
              { name: "不影響市場行情變動" },
              { name: "設定越大,越容易成交\n(委託價 = 成交價 + 讓價)" }
            ]
          }
        ]
      },
      {
        name: "方向判斷",
        itemStyle: { color: "#8b5cf6" }, // Purple
        children: [
          {
            name: "四種判斷策略",
            children: [
              { name: "合計方向：\nCall與Put交易行為方向一致時才交易" },
              { name: "多空溫度：\n市場多空溫度達到設定數值時交易" },
              { name: "逆勢多空溫度：\n高低於設定值,做逆勢部位" },
              { name: "期貨價格：\n可自行設定價格" }
            ]
          },
          { name: "條件勾選：\n可勾選多項，需同時符合條件" },
          {
            name: "主觀判斷方向",
            children: [
              { name: "可透過 多空溫度或期貨價格,\n設定自己想要成交的方向" }
            ]
          }
        ]
      },
      {
        name: "多空溫度調整",
        itemStyle: { color: "#ec4899" }, // Pink
        children: [
          {
            name: "設定力道 (%)",
            children: [
              { name: "參考市場多空溫度的權重" },
              { name: "100%完全相信市場，\n0%完全不相信市場" }
            ]
          },
          {
            name: "容許範圍",
            children: [
              { name: "設定不動作範圍 (如 +/- 40點)" },
              { name: "避免頻繁調整部位" }
            ]
          },
          {
            name: "調整機制",
            children: [
              { name: "比較持倉溫度與市場溫度" },
              { name: "超出範圍時自動調整：\n可用金額足夠時加倉，不足時平倉" },
              { name: "平倉優先處理點數最高的危險部位" }
            ]
          }
        ]
      },
      {
        name: "交易條件",
        itemStyle: { color: "#ef4444" }, // Red
        children: [
          {
            name: "生命總值增減 (%)",
            children: [
              { name: "觸發交易的時機點" }
            ]
          },
          {
            name: "動態Sell價設定",
            children: [
              { name: "決定賣出部位(Sell)的履約價" },
              { name: "計算：生命總值 / 設定值 = 動態Sell價" },
              { name: "建議日夜盤開盤可更新設定" }
            ]
          },
          {
            name: "價外點數",
            children: [
              { name: "決定買入部位(Buy)的履約價間距" },
              { name: "建議設定50/100/150點\n(與資金有關，100點最普遍適用)" },
              { name: "程式自動尋找對應價位買入" }
            ]
          }
        ]
      },
      {
        name: "停損停利",
        itemStyle: { color: "#6366f1" }, // Indigo
        children: [
          {
            name: "各別設置",
            children: [
              { name: "可針對 Call/Put 的 Sell/Buy 單獨設定" },
              { name: "通常使用預設值" }
            ]
          },
          {
            name: "保利降部位1/2",
            children: [
              { name: "權益總值獲利%達到設定值時觸發" },
              { name: "平倉直到剩餘點數\n低於「保留點數」" },
              { name: "保利狀態下不建立新部位" }
            ]
          },
          {
            name: "虧損降部位",
            children: [
              { name: "權益總值虧損%達到設定值時觸發" },
              { name: "平倉直到剩餘點數\n低於「保留點數」" },
              { name: "虧損狀態下不建立新部位" }
            ]
          }
        ]
      },
      {
        name: "即時總點管控",
        itemStyle: { color: "#0d9488" }, // Teal
        children: [
          { name: "整體部位總點數達到數值時停損" },
          { name: "若超過數值，平倉最高點數部位" },
          { name: "數值需依當前本金調整" },
          {
            name: "定時平倉",
            children: [
              { name: "例如：結算日盤 12:55" },
              { name: "設定即時總點數值，超過時平倉" },
              { name: "此設定隔天自動取消" }
            ]
          }
        ]
      }
    ]
  };

  useEffect(() => {
    if (!isScriptLoaded || !chartRef.current || !(window as any).echarts) return;

    const echarts = (window as any).echarts;
    const myChart = echarts.init(chartRef.current);
    setChartInstance(myChart);

    const option = {
      tooltip: {
        trigger: "item",
        triggerOn: "mousemove",
        formatter: "{b}"
      },
      series: [
        {
          type: "tree",
          data: [data],
          top: "5%",
          left: "10%",
          bottom: "5%",
          right: "20%",
          symbolSize: 10,
          roam: true,
          symbol: function (value: any, params: any) {
            if (params.data.children && params.data.children.length > 0) {
              return "circle";
            } else {
              return "none";
            }
          },
          layout: "orthogonal",
          orient: "LR",
          label: {
            position: "left",
            verticalAlign: "middle",
            align: "right",
            fontSize: 14,
            fontFamily: "Noto Sans TC",
            fontWeight: "bold",
            backgroundColor: "#f9fafb",
            padding: [4, 8],
            borderRadius: 4
          },
          leaves: {
            label: {
              position: "right",
              verticalAlign: "middle",
              align: "left",
              backgroundColor: "#fff",
              borderColor: "#cbd5e1",
              borderWidth: 1,
              borderRadius: 6,
              padding: [6, 10],
              fontSize: 13,
              color: "#333",
              shadowBlur: 2,
              shadowColor: "rgba(0,0,0,0.1)",
              lineHeight: 18
            }
          },
          emphasis: {
            focus: "descendant"
          },
          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750,
          itemStyle: {
            borderColor: "#555",
            borderWidth: 1
          },
          lineStyle: {
            color: "#94a3b8",
            curveness: 0.5,
            width: 2
          },
          initialTreeDepth: 1
        }
      ]
    };

    myChart.setOption(option);

    const handleResize = () => {
      myChart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      myChart.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [isScriptLoaded]);

  const restoreView = () => {
    if (chartInstance) {
      chartInstance.dispatchAction({
        type: "restore"
      });
      chartInstance.setOption({
        series: [{
          data: [data],
          initialTreeDepth: 1
        }]
      });
    }
  };

  const expandAll = () => {
    if (chartInstance) {
      chartInstance.setOption({
        series: [{
          data: [data],
          initialTreeDepth: -1
        }]
      });
    }
  };

  return (
    <div className="bg-[#f0f9ff] text-gray-800 min-h-screen flex flex-col relative overflow-hidden w-full h-screen font-sans">
      {/* Floating Header */}
      <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg z-30 border-l-[5px] border-blue-600 border border-gray-100 max-w-[calc(100%-40px)]">
        <h1 className="text-xl font-bold text-gray-800 leading-snug">智能交易設定與功能詳解</h1>
        <p className="text-xs text-gray-500 mt-1 font-medium">滑鼠拖曳移動，滾輪縮放，點擊節點展開</p>
      </div>

      {/* Chart Container */}
      <div 
        ref={chartRef} 
        className="w-full h-full flex-1 cursor-grab active:cursor-grabbing" 
        style={{ minHeight: "500px" }}
      />

      {/* Bottom Left Toolbar with controls only, Home and Line links removed as requested */}
      <div className="absolute bottom-5 left-5 flex gap-3 z-30 items-center flex-wrap">
        <button 
          onClick={restoreView}
          className="bg-white hover:bg-gray-50 text-gray-600 font-bold border border-gray-200 px-4 py-2 rounded-lg text-sm shadow-md transition-all hover:-translate-y-0.5"
        >
          還原收合
        </button>
        <button 
          onClick={expandAll}
          className="bg-white hover:bg-gray-50 text-gray-600 font-bold border border-gray-200 px-4 py-2 rounded-lg text-sm shadow-md transition-all hover:-translate-y-0.5"
        >
          全部展開
        </button>
      </div>
    </div>
  );
};
