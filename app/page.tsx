"use client";

import React, { useEffect, useMemo, useState } from "react";

type OrderItem = {
  id: string;
  productName: string;
  quantity: number;
};

type Sale = {
  id: number;
  date: string;
  platform: "TikTok" | "Shopee";
  sales: number;
  orders: number;
  items: OrderItem[];
  productSummary?: string;
  liveHours: number;
  isNoSales?: boolean;
};

type PlatformKey =
  | "facebook"
  | "instagram"
  | "telegram"
  | "tiktok-farming"
  | "tiktok-live"
  | "shopee-live";

type Page =
  | "dashboard"
  | "sales-entry"
  | "sales-history"
  | PlatformKey
  | "schedule";

type TableData = Record<string, Record<string, string>>;

const SALES_KEY = "mamariam-sales-dashboard-data-v3";

const POPULAR_PRODUCTS = [
  "Susu Mamariam (Original)",
  "Susu Mamariam (Coklat)",
  "Susu Mamariam (Kurma)",
  "Mandian Herba Mamariam",
  "Minyak Setemika Mamariam",
  "Jus Mamariam Premium",
  "Combo Set A (Susu + Mandian)",
  "Combo Set B (Full Set)",
];

const PLATFORM_COLUMNS: Record<
  PlatformKey,
  { title: string; icon: string; columns: string[] }
> = {
  facebook: {
    title: "Facebook",
    icon: "🔵",
    columns: [
      "Ads On/Off",
      "Leads Ads",
      "Comment Replies",
      "FB Personal - Video",
      "FB Personal - Poster",
      "FB Page - Video",
      "FB Page - Poster",
    ],
  },
  instagram: {
    title: "Instagram",
    icon: "🟣",
    columns: [
      "Focus Grow Susu YGrow",
      "Current Post",
      "Followers",
      "Following",
      "Add Highlight",
      "Morning",
      "Afternoon",
      "Evening",
      "Draft Copywriting",
    ],
  },
  telegram: {
    title: "Telegram",
    icon: "🔷",
    columns: [
      "Focus Grow Susu YGrow",
      "Update Subscribers",
      "Poster",
      "Afternoon",
      "Draft Copywriting",
    ],
  },
  "tiktok-farming": {
    title: "TikTok Farming",
    icon: "⚫",
    columns: [
      "Daily Content Draft",
      "Poster Posting",
      "Caption Text",
      "Followers",
      "Likes",
    ],
  },
  "tiktok-live": {
    title: "TikTok Live",
    icon: "🎵",
    columns: [
      "Live Schedule",
      "Total Live Hours",
      "Live Start",
      "Live End",
      "Total Sales",
    ],
  },
  "shopee-live": {
    title: "Shopee Live",
    icon: "🟠",
    columns: [
      "Live Schedule",
      "Total Live Hours",
      "Live Start",
      "Live End",
      "Total Sales",
    ],
  },
};

const LIVE_SCHEDULE = [
  { day: "Sunday", time: "2:00 PM – 3:30 PM" },
  { day: "Monday", time: "12:35 PM – 2:05 PM" },
  { day: "Tuesday", time: "3:00 PM – 4:30 PM" },
  { day: "Wednesday", time: "4:45 PM – 5:30 PM" },
  { day: "Thursday", time: "4:30 PM – 5:30 PM" },
];

function formatRM(value: number) {
  return `RM ${value.toFixed(2)}`;
}

function getToday() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

function getWeekStart() {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().split("T")[0];
}

function getMonthStart() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

function getLast7Days() {
  const result: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push(d.toISOString().split("T")[0]);
  }
  return result;
}

const MALAY_DAYS = [
  "Ahad",
  "Isnin",
  "Selasa",
  "Rabu",
  "Khamis",
  "Jumaat",
  "Sabtu",
];

function getDaysInMonth(year: number, month: number) {
  const date = new Date(year, month - 1, 1);
  const days: { dateStr: string; dayName: string; dayNum: number }[] = [];

  while (date.getMonth() === month - 1) {
    const yearStr = date.getFullYear();
    const monthStr = String(date.getMonth() + 1).padStart(2, "0");
    const dayStr = String(date.getDate()).padStart(2, "0");
    const dateStr = `${yearStr}-${monthStr}-${dayStr}`;

    days.push({
      dateStr,
      dayName: MALAY_DAYS[date.getDay()],
      dayNum: date.getDate(),
    });
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export default function Home() {
  const [page, setPage] = useState<Page>("dashboard");
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedSales = localStorage.getItem(SALES_KEY);
    if (savedSales) {
      try {
        setSalesData(JSON.parse(savedSales));
      } catch (e) {
        console.error("Failed to parse saved sales", e);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(SALES_KEY, JSON.stringify(salesData));
    }
  }, [salesData, mounted]);

  function addSale(sale: Omit<Sale, "id">) {
    setSalesData((prev) => [
      ...prev,
      {
        ...sale,
        id: Date.now(),
      },
    ]);
  }

  function deleteSale(id: number) {
    if (!window.confirm("Are you sure you want to delete this sales record?")) return;
    setSalesData((prev) => prev.filter((sale) => sale.id !== id));
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#fdf7f4] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-[#e8a598] border-t-transparent animate-spin" />
          <div className="text-[#8c5243] font-semibold tracking-wide text-sm">
            Loading Mamariam Workspace...
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fdf7f4] via-[#fbf0eb] to-[#f8e7e1] text-[#4a352f] font-sans antialiased">
      <div className="flex min-h-screen">
        <Sidebar page={page} setPage={setPage} />

        <section className="flex-1 min-w-0 pb-12">
          {page === "dashboard" && (
            <Dashboard salesData={salesData} setPage={setPage} />
          )}

          {page === "sales-entry" && (
            <SalesEntry addSale={addSale} setPage={setPage} />
          )}

          {page === "sales-history" && (
            <SalesHistory salesData={salesData} deleteSale={deleteSale} />
          )}

          {page === "schedule" && <SchedulePage />}

          {page in PLATFORM_COLUMNS && (
            <ExcelTodoPage platformKey={page as PlatformKey} />
          )}
        </section>
      </div>
    </main>
  );
}

function Sidebar({
  page,
  setPage,
}: {
  page: Page;
  setPage: (page: Page) => void;
}) {
  const mainNav: { id: Page; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "✨" },
    { id: "sales-entry", label: "Sales Entry", icon: "➕" },
    { id: "sales-history", label: "Sales History", icon: "🧾" },
    { id: "schedule", label: "Live Schedule", icon: "🗓️" },
  ];

  const platformNav: { id: PlatformKey; label: string; icon: string }[] = [
    { id: "facebook", label: "Facebook", icon: "🔵" },
    { id: "instagram", label: "Instagram", icon: "🟣" },
    { id: "telegram", label: "Telegram", icon: "🔷" },
    { id: "tiktok-farming", label: "TikTok Farming", icon: "⚫" },
    { id: "tiktok-live", label: "TikTok Live", icon: "🎵" },
    { id: "shopee-live", label: "Shopee Live", icon: "🟠" },
  ];

  return (
    <aside className="hidden lg:flex w-[270px] bg-white/70 backdrop-blur-xl border-r border-[#f3d3c8]/60 flex-col sticky top-0 h-screen z-20 shadow-[4px_0_24px_rgba(200,120,100,0.05)]">
      <div className="p-6 border-b border-[#f3d3c8]/50 bg-gradient-to-r from-white/80 to-[#fdf2ee]/50">
        <div className="inline-flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#d97c65] to-[#f2aa99] flex items-center justify-center text-white text-lg shadow-md shadow-[#d97c65]/30 font-bold">
            🌸
          </div>
          <div>
            <div className="text-xl font-black tracking-tight text-[#5a3227]">
              Mamariam
            </div>
            <span className="text-[10px] bg-[#fceee8] text-[#b86149] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-[#f0c8bc]">
              HQ Workspace
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#b38e83] px-3 mb-2.5">
            Main Menu
          </div>
          <div className="space-y-1">
            {mainNav.map((menu) => {
              const active = page === menu.id;
              return (
                <button
                  key={menu.id}
                  onClick={() => setPage(menu.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-[#9e5341] to-[#ba6854] text-white shadow-lg shadow-[#9e5341]/25 font-semibold"
                      : "text-[#6e534b] hover:bg-[#faeae4] hover:text-[#8c5243]"
                  }`}
                >
                  <span className="text-base">{menu.icon}</span>
                  {menu.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#b38e83] px-3 mb-2.5">
            To-Do Sheets
          </div>
          <div className="space-y-1">
            {platformNav.map((menu) => {
              const active = page === menu.id;
              return (
                <button
                  key={menu.id}
                  onClick={() => setPage(menu.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-[#9e5341] to-[#ba6854] text-white shadow-lg shadow-[#9e5341]/25 font-semibold"
                      : "text-[#6e534b] hover:bg-[#faeae4] hover:text-[#8c5243]"
                  }`}
                >
                  <span className="text-base">{menu.icon}</span>
                  {menu.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-[#f3d3c8]/50 bg-gradient-to-b from-[#fffaf8] to-[#fbf0eb]">
        <div className="rounded-2xl bg-white/80 backdrop-blur-md p-3.5 flex items-center gap-3 border border-[#f0d0c5] shadow-sm">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8c5243] to-[#c47764] text-white flex items-center justify-center font-extrabold text-sm shadow-sm shrink-0">
            HH
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-[#4a2e26] truncate">
              Humairah Hazimah
            </div>
            <div className="text-[11px] text-[#9a786d] truncate">
              Personal Space Dashboard
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function PageHeader({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle: string;
  badge?: string;
}) {
  return (
    <header className="px-6 md:px-10 py-6 border-b border-[#f3d3c8]/60 bg-white/60 backdrop-blur-md sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#4a2e26] tracking-tight">
              {title}
            </h1>
            {badge && (
              <span className="bg-[#fceee8] text-[#8c5243] text-xs font-bold px-3 py-1 rounded-full border border-[#f0c8bc] shadow-xs">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-[#917167] mt-1 font-medium">{subtitle}</p>
        </div>
      </div>
    </header>
  );
}

function ExcelTodoPage({ platformKey }: { platformKey: PlatformKey }) {
  const config = PLATFORM_COLUMNS[platformKey];

  const [selectedMonth, setSelectedMonth] = useState("2026-09");
  const [data, setData] = useState<TableData>({});

  const storageKey = useMemo(() => {
    return `mamariam-todo-${platformKey}-${selectedMonth}`;
  }, [platformKey, selectedMonth]);

  const [year, month] = useMemo(() => {
    const parts = selectedMonth.split("-");
    return [parseInt(parts[0], 10) || 2026, parseInt(parts[1], 10) || 9];
  }, [selectedMonth]);

  const daysList = useMemo(() => {
    return getDaysInMonth(year, month);
  }, [year, month]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse spreadsheet data", e);
        setData({});
      }
    } else {
      setData({});
    }
  }, [storageKey]);

  const handleCellChange = (dateStr: string, colName: string, val: string) => {
    const updated = {
      ...data,
      [dateStr]: {
        ...(data[dateStr] || {}),
        [colName]: val,
      },
    };
    setData(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const monthLabel = useMemo(() => {
    const d = new Date(year, month - 1, 1);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }, [year, month]);

  return (
    <>
      <PageHeader
        title={`${config.icon} ${config.title}`}
        subtitle={`Daily activity spreadsheet tracking for ${config.title}`}
        badge="To-Do Spreadsheet"
      />

      <div className="p-6 md:p-10 space-y-6">
        <div className="bg-white/80 backdrop-blur-md border border-[#f3d3c8] rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="text-xs font-bold text-[#8c675c] uppercase tracking-wider block mb-1">
                Select Month & Year
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border border-[#e0cdc5] rounded-xl px-4 py-2.5 text-sm font-medium text-[#4a2e26] bg-[#fffaf8] outline-none focus:ring-2 focus:ring-[#8c5243]/30 transition"
              />
            </div>

            <div className="hidden sm:block border-l border-[#f0ded5] h-10 mx-2" />

            <div className="hidden sm:block">
              <span className="text-xs text-[#9e7a6f] block font-medium">
                Active Period
              </span>
              <span className="text-lg font-bold text-[#5a382e] capitalize">
                {monthLabel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#8c675c] bg-[#faf0eb] px-3.5 py-2 rounded-xl font-medium border border-[#f0ded5]">
            <span>💡</span>
            <span>All entries are automatically saved to local storage.</span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md border border-[#f3d3c8] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto max-h-[70vh] custom-scrollbar">
            <table className="w-full text-sm border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gradient-to-r from-[#f8ede8] to-[#f4e2da] text-[#5c3b31] border-b border-[#e8d5cc] sticky top-0 z-10 shadow-sm">
                  <th className="py-3.5 px-4 font-bold text-left sticky left-0 bg-[#f8ede8] border-r border-[#e8d5cc] w-28 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                    Date
                  </th>
                  <th className="py-3.5 px-4 font-bold text-left sticky left-28 bg-[#f8ede8] border-r border-[#e8d5cc] w-28 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                    Day
                  </th>
                  {config.columns.map((col) => (
                    <th
                      key={col}
                      className="py-3.5 px-4 font-bold text-left min-w-[170px] border-r border-[#e8d5cc] last:border-r-0 whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3e6df]">
                {daysList.map(({ dateStr, dayName, dayNum }) => {
                  const isRedDay = dayName === "Jumaat" || dayName === "Sabtu";

                  return (
                    <tr
                      key={dateStr}
                      className={`hover:bg-[#faefe9] transition-colors ${
                        isRedDay ? "bg-red-50/50" : "bg-white/50"
                      }`}
                    >
                      <td className="py-2 px-4 font-semibold text-[#5c3b31] border-r border-[#eddcd3] sticky left-0 bg-inherit z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                        {dayNum} {monthLabel.split(" ")[0]}
                      </td>

                      {/* RED BOLD HIGHLIGHT FOR JUMAAT & SABTU */}
                      <td className="py-2 px-4 border-r border-[#eddcd3] sticky left-28 bg-inherit z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-xs ${
                            isRedDay
                              ? "text-red-600 font-black bg-red-100/80 border border-red-200 tracking-wide"
                              : "text-[#6b4e45] font-semibold"
                          }`}
                        >
                          {dayName}
                        </span>
                      </td>

                      {config.columns.map((col) => {
                        const cellValue = data[dateStr]?.[col] || "";
                        return (
                          <td
                            key={col}
                            className="p-1 border-r border-[#f1e2da] last:border-r-0"
                          >
                            <input
                              type="text"
                              value={cellValue}
                              onChange={(e) =>
                                handleCellChange(dateStr, col, e.target.value)
                              }
                              placeholder="-"
                              className="w-full h-full px-3 py-1.5 bg-transparent border border-transparent rounded-lg text-sm text-[#4a2e26] focus:bg-white focus:border-[#8c5243]/50 focus:ring-1 focus:ring-[#8c5243]/50 outline-none transition"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

function Dashboard({
  salesData,
  setPage,
}: {
  salesData: Sale[];
  setPage: (page: Page) => void;
}) {
  const today = getToday();
  const weekStart = getWeekStart();
  const monthStart = getMonthStart();

  const todaySales = salesData
    .filter((x) => x.date === today)
    .reduce((a, b) => a + b.sales, 0);

  const weekSales = salesData
    .filter((x) => x.date >= weekStart)
    .reduce((a, b) => a + b.sales, 0);

  const monthSales = salesData
    .filter((x) => x.date >= monthStart)
    .reduce((a, b) => a + b.sales, 0);

  const totalSales = salesData.reduce((a, b) => a + b.sales, 0);
  const totalOrders = salesData.reduce((a, b) => a + b.orders, 0);
  const totalHours = salesData.reduce((a, b) => a + b.liveHours, 0);

  const last7Days = getLast7Days();

  const chartData = last7Days.map((date) => ({
    date,
    sales: salesData
      .filter((x) => x.date === date)
      .reduce((a, b) => a + b.sales, 0),
  }));

  const tikTokSales = salesData
    .filter((x) => x.platform === "TikTok")
    .reduce((a, b) => a + b.sales, 0);

  const shopeeSales = salesData
    .filter((x) => x.platform === "Shopee")
    .reduce((a, b) => a + b.sales, 0);

  // Aggregated top product items sold (quantity)
  const productStats = useMemo(() => {
    const map: Record<string, { quantity: number }> = {};

    salesData.forEach((s) => {
      if (s.items && s.items.length > 0) {
        s.items.forEach((item) => {
          const name = item.productName.trim() || "General Products";
          if (!map[name]) map[name] = { quantity: 0 };
          map[name].quantity += Number(item.quantity) || 1;
        });
      } else if (s.productSummary && !s.isNoSales) {
        const name = s.productSummary.trim() || "General Products";
        if (!map[name]) map[name] = { quantity: 0 };
        map[name].quantity += s.orders || 1;
      }
    });

    return Object.entries(map)
      .map(([name, stat]) => ({ name, ...stat }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 6);
  }, [salesData]);

  const maxProductQty = Math.max(...productStats.map((p) => p.quantity), 1);

  return (
    <>
      <PageHeader
        title="Dashboard Overview"
        subtitle="Comprehensive breakdown of Mamariam sales, product quantities, and live streams"
      />

      <div className="p-6 md:p-10 space-y-8">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <KpiCard
            title="Today's Sales"
            value={formatRM(todaySales)}
            icon="🌤️"
            subtitle="Daily summary"
          />
          <KpiCard
            title="This Week"
            value={formatRM(weekSales)}
            icon="📅"
            subtitle="Past 7 days performance"
          />
          <KpiCard
            title="This Month"
            value={formatRM(monthSales)}
            icon="🗓️"
            subtitle="Current month total"
          />
          <KpiCard
            title="Total Revenue"
            value={formatRM(totalSales)}
            icon="💰"
            subtitle="Accumulated sales"
          />
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <SmallKpi
            title="Total Orders Count"
            value={totalOrders.toLocaleString()}
            icon="📦"
          />
          <SmallKpi
            title="Total Live Hours"
            value={`${totalHours.toFixed(1)} hrs`}
            icon="⏱️"
          />
          <SmallKpi
            title="Avg. Revenue / Live Hour"
            value={
              totalHours > 0
                ? formatRM(totalSales / totalHours)
                : "RM 0.00"
            }
            icon="🚀"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-2xl border border-[#f3d3c8] p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-bold text-lg text-[#4a2e26]">
                  Sales Trend (Last 7 Days)
                </h2>
                <p className="text-xs text-[#9a786d] mt-0.5">
                  Daily revenue progress bar
                </p>
              </div>
            </div>

            <div className="h-[220px] flex items-end gap-3 pt-4">
              {chartData.map((item) => {
                const max = Math.max(
                  ...chartData.map((x) => x.sales),
                  1
                );
                const height =
                  item.sales > 0
                    ? Math.max((item.sales / max) * 160, 14)
                    : 10;

                return (
                  <div
                    key={item.date}
                    className="flex-1 h-full flex flex-col justify-end items-center"
                  >
                    <div className="text-[10px] font-bold text-[#8c5243] mb-1">
                      {item.sales > 0 ? `RM${Math.round(item.sales)}` : ""}
                    </div>
                    <div
                      className="w-full max-w-[42px] rounded-t-xl bg-gradient-to-t from-[#a86553] to-[#d48c78] shadow-sm transition-all duration-300 hover:brightness-110"
                      style={{ height }}
                    />
                    <div className="text-[10px] font-medium text-[#9a786d] mt-2">
                      {item.date.slice(5)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#f3d3c8] p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="font-bold text-lg text-[#4a2e26]">
                By Platform
              </h2>
              <p className="text-xs text-[#9a786d] mt-0.5 mb-6">
                Platform revenue share
              </p>

              <div className="space-y-5">
                <PlatformBar
                  name="TikTok"
                  value={tikTokSales}
                  total={totalSales}
                  color="bg-[#4a2e26]"
                />
                <PlatformBar
                  name="Shopee"
                  value={shopeeSales}
                  total={totalSales}
                  color="bg-[#d47853]"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#f5e5dd] text-xs text-[#9a786d] text-center font-medium">
              Data auto-synced across sessions
            </div>
          </div>
        </div>

        {/* Aggregated Top Products Ordered Chart */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#f3d3c8] p-6 shadow-sm">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h2 className="font-bold text-lg text-[#4a2e26]">
                Top Products Sold (Quantity Breakdown)
              </h2>
              <p className="text-xs text-[#9a786d] mt-0.5">
                Aggregated units sold from multi-product sales entries
              </p>
            </div>
            <span className="text-xs bg-[#faf0eb] text-[#8c5243] font-bold px-3 py-1 rounded-full border border-[#f0ded5]">
              {productStats.length} Unique Products
            </span>
          </div>

          {productStats.length === 0 ? (
            <div className="text-center text-[#9a786d] py-8 text-sm font-medium">
              No product entries logged yet. Add sales under Sales Entry.
            </div>
          ) : (
            <div className="space-y-4">
              {productStats.map((prod) => {
                const percent = Math.round((prod.quantity / maxProductQty) * 100);
                return (
                  <div key={prod.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[#4a2e26]">
                      <span className="flex items-center gap-2">
                        <span>📦</span>
                        {prod.name}
                      </span>
                      <span className="text-[#8c5243]">
                        {prod.quantity} units
                      </span>
                    </div>
                    <div className="h-3.5 bg-[#faf0eb] rounded-full overflow-hidden p-0.5 border border-[#f0ded5]">
                      <div
                        className="h-full bg-gradient-to-r from-[#8c5243] to-[#d48c78] rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Sales Table */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#f3d3c8] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#f3d3c8] flex justify-between items-center">
            <div>
              <h2 className="font-bold text-lg text-[#4a2e26]">
                Recent Sales Entries
              </h2>
              <p className="text-xs text-[#9a786d] mt-0.5">
                Latest 5 sales entries recorded
              </p>
            </div>
            <button
              onClick={() => setPage("sales-entry")}
              className="bg-gradient-to-r from-[#8c5243] to-[#a86553] hover:from-[#734033] hover:to-[#8c5243] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
            >
              + New Sales Entry
            </button>
          </div>

          <div className="overflow-x-auto">
            <SalesTable sales={salesData.slice(-5).reverse()} compact />
          </div>
        </div>
      </div>
    </>
  );
}

function KpiCard({
  title,
  value,
  icon,
  subtitle,
}: {
  title: string;
  value: string;
  icon: string;
  subtitle: string;
}) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#f3d3c8] p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#9a786d]">
          {title}
        </span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-xl md:text-2xl font-black text-[#4a2e26]">
        {value}
      </div>
      <div className="text-[11px] text-[#a88a80] mt-1 font-medium">
        {subtitle}
      </div>
    </div>
  );
}

function SmallKpi({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#f3d3c8] p-4 shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-[#faf0eb] flex items-center justify-center text-xl shrink-0 border border-[#f0ded5]">
        {icon}
      </div>
      <div>
        <div className="text-xs font-semibold text-[#9a786d]">{title}</div>
        <div className="text-lg font-extrabold text-[#4a2e26] mt-0.5">
          {value}
        </div>
      </div>
    </div>
  );
}

function PlatformBar({
  name,
  value,
  total,
  color,
}: {
  name: string;
  value: number;
  total: number;
  color: string;
}) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="flex justify-between text-xs font-bold text-[#4a2e26] mb-1.5">
        <span>{name}</span>
        <span>
          {formatRM(value)}{" "}
          <span className="text-[#9a786d] font-normal">({percent}%)</span>
        </span>
      </div>
      <div className="h-2.5 bg-[#faf0eb] rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function SalesEntry({
  addSale,
  setPage,
}: {
  addSale: (sale: Omit<Sale, "id">) => void;
  setPage: (page: Page) => void;
}) {
  const [date, setDate] = useState(getToday());
  const [platform, setPlatform] = useState<"TikTok" | "Shopee">("TikTok");
  const [liveHours, setLiveHours] = useState("");
  const [salesAmount, setSalesAmount] = useState("");
  const [isNoSales, setIsNoSales] = useState(false);

  // Dynamic multi-product items (Unit price removed)
  const [items, setItems] = useState<OrderItem[]>([
    {
      id: "1",
      productName: "Susu Mamariam",
      quantity: 1,
    },
  ]);

  // Total items ordered count
  const calculatedTotalQty = useMemo(() => {
    if (isNoSales) return 0;
    return items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  }, [items, isNoSales]);

  const addItemRow = () => {
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now() + Math.random()),
        productName: "",
        quantity: 1,
      },
    ]);
  };

  const removeItemRow = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItemRow = (
    id: string,
    field: keyof OrderItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return;

    if (isNoSales) {
      addSale({
        date,
        platform,
        sales: 0,
        orders: 0,
        items: [],
        productSummary: "No Sales / TIADA JUALAN",
        liveHours: Number(liveHours) || 0,
        isNoSales: true,
      });
    } else {
      const summaryStr = items
        .filter((i) => i.productName.trim() !== "")
        .map((i) => `${i.productName} (${i.quantity}x)`)
        .join(", ");

      addSale({
        date,
        platform,
        sales: Number(salesAmount) || 0,
        orders: calculatedTotalQty,
        items: items.filter((i) => i.productName.trim() !== ""),
        productSummary: summaryStr || "General Products",
        liveHours: Number(liveHours) || 0,
        isNoSales: false,
      });
    }

    // Reset form
    setItems([
      {
        id: String(Date.now()),
        productName: "Susu Mamariam (Original)",
        quantity: 1,
      },
    ]);
    setLiveHours("");
    setSalesAmount("");
    setIsNoSales(false);
    alert("Sales entry recorded successfully!");
  }

  return (
    <>
      <PageHeader
        title="Sales Entry"
        subtitle="Record daily live sales and products sold or log 'No Sales' for off days"
      />

      <div className="p-6 md:p-10 max-w-4xl mx-auto">
        <form
          onSubmit={submit}
          className="bg-white/80 backdrop-blur-xl border border-[#f3d3c8] rounded-3xl p-6 md:p-10 shadow-xl shadow-[#8c5243]/5 space-y-8 transition-all"
        >
          {/* General Stream Details */}
          <div className="grid md:grid-cols-3 gap-5 border-b border-[#f5e5dd] pb-6">
            <div>
              <label className="block text-xs font-bold text-[#8c675c] uppercase tracking-wider mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-[#e0cdc5] rounded-xl px-4 py-2.5 text-sm text-[#4a2e26] outline-none focus:ring-2 focus:ring-[#8c5243]/30 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8c675c] uppercase tracking-wider mb-2">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) =>
                  setPlatform(e.target.value as "TikTok" | "Shopee")
                }
                className="w-full border border-[#e0cdc5] rounded-xl px-4 py-2.5 text-sm text-[#4a2e26] outline-none focus:ring-2 focus:ring-[#8c5243]/30 bg-white font-medium"
              >
                <option value="TikTok">TikTok</option>
                <option value="Shopee">Shopee</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8c675c] uppercase tracking-wider mb-2">
                Live Hours
              </label>
              <input
                type="number"
                step="0.1"
                value={liveHours}
                onChange={(e) => setLiveHours(e.target.value)}
                placeholder="e.g. 1.5"
                className="w-full border border-[#e0cdc5] rounded-xl px-4 py-2.5 text-sm text-[#4a2e26] outline-none focus:ring-2 focus:ring-[#8c5243]/30 bg-white"
              />
            </div>
          </div>

          {/* NO SALES TODAY TOGGLE OPTION */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#fff4f0] to-[#fdeee8] border border-[#f0c8bc] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <span className="text-xl">🛑</span>
              <div>
                <div className="text-sm font-bold text-[#5c372d]">
                  No Sales Today (Tiada Jualan)
                </div>
                <div className="text-xs text-[#9a786d]">
                  Enable this toggle if there were 0 sales for this date
                </div>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isNoSales}
                onChange={(e) => setIsNoSales(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#e0cdc5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8c5243]"></div>
            </label>
          </div>

          {/* DYNAMIC PRODUCTS ORDER SECTION (Disabled if No Sales is ON) */}
          {!isNoSales ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#4a2e26]">
                    Products Ordered (Bilangan Order Produk)
                  </h3>
                  <p className="text-xs text-[#9a786d]">
                    Select products and enter quantity sold (No Unit Price required)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addItemRow}
                  className="inline-flex items-center gap-1.5 bg-[#fceee8] hover:bg-[#f8ded3] text-[#8c5243] px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#f0ded5] transition shadow-xs"
                >
                  <span>➕</span>
                  <span>Add Product Item</span>
                </button>
              </div>

              {/* Product Rows */}
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white/70 border border-[#f1e2da] rounded-2xl flex flex-col md:flex-row items-stretch md:items-center gap-3 transition-all"
                  >
                    <span className="text-xs font-bold text-[#9a786d] w-6 shrink-0">
                      #{idx + 1}
                    </span>

                    {/* Product Autocomplete Dropdown */}
                    <div className="flex-1">
                      <input
                        type="text"
                        list="mamariam-product-list"
                        value={item.productName}
                        onChange={(e) =>
                          updateItemRow(item.id, "productName", e.target.value)
                        }
                        placeholder="Select or type Mamariam product..."
                        className="w-full border border-[#e0cdc5] rounded-xl px-3.5 py-2 text-sm text-[#4a2e26] outline-none focus:ring-2 focus:ring-[#8c5243]/30 bg-white"
                        required
                      />
                    </div>

                    {/* Quantity Field */}
                    <div className="w-full md:w-36">
                      <div className="flex items-center border border-[#e0cdc5] rounded-xl overflow-hidden bg-white">
                        <span className="px-3 text-[11px] font-bold text-[#9a786d] bg-[#faf0eb] py-2 border-r border-[#e0cdc5]">
                          Qty
                        </span>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItemRow(
                              item.id,
                              "quantity",
                              Math.max(1, parseInt(e.target.value) || 1)
                            )
                          }
                          className="w-full px-2 py-1 text-center text-sm font-bold text-[#4a2e26] outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Remove Item Row */}
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItemRow(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-xl text-xs font-bold transition shrink-0 self-end md:self-center"
                        title="Remove Item"
                      >
                        ❌
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <datalist id="mamariam-product-list">
                {POPULAR_PRODUCTS.map((prod) => (
                  <option key={prod} value={prod} />
                ))}
              </datalist>

              <div className="p-3.5 bg-[#fef7f4] border border-[#f0ded5] rounded-2xl flex justify-between items-center text-xs text-[#8c5243] font-semibold">
                <span>Total Items Quantity:</span>
                <span className="text-sm font-black text-[#4a2e26]">
                  {calculatedTotalQty} units
                </span>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#faf2ef] border border-dashed border-[#e3c2b8] rounded-2xl text-center text-xs text-[#8c675c] font-medium">
              "No Sales Today" option is selected. Product items list is disabled.
            </div>
          )}

          {/* Total Sales Input Amount */}
          <div className="pt-2 border-t border-[#f5e5dd]">
            <label className="block text-xs font-bold text-[#8c675c] uppercase tracking-wider mb-2">
              Total Revenue Sales Amount (RM)
            </label>
            <input
              type="number"
              step="0.01"
              disabled={isNoSales}
              value={isNoSales ? "0" : salesAmount}
              onChange={(e) => setSalesAmount(e.target.value)}
              placeholder={isNoSales ? "RM 0.00 (No Sales)" : "Enter total RM amount..."}
              className={`w-full border border-[#e0cdc5] rounded-xl px-4 py-3 text-base font-bold text-[#4a2e26] outline-none focus:ring-2 focus:ring-[#8c5243]/30 ${
                isNoSales ? "bg-gray-100/80 cursor-not-allowed" : "bg-white"
              }`}
              required={!isNoSales}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-[#f5e5dd]">
            <button
              type="submit"
              className="bg-gradient-to-r from-[#8c5243] to-[#a86553] hover:from-[#734033] hover:to-[#8c5243] text-white px-8 py-3.5 rounded-xl font-bold text-sm transition shadow-lg shadow-[#8c5243]/20"
            >
              Save Sales Entry
            </button>
            <button
              type="button"
              onClick={() => setPage("sales-history")}
              className="border border-[#e0cdc5] text-[#6e534b] hover:bg-[#faf0eb] px-6 py-3.5 rounded-xl font-semibold text-sm transition"
            >
              View Sales History
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

function SalesHistory({
  salesData,
  deleteSale,
}: {
  salesData: Sale[];
  deleteSale: (id: number) => void;
}) {
  const [platformFilter, setPlatformFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const filtered = salesData.filter((sale) => {
    const platformOk =
      platformFilter === "All" || sale.platform === platformFilter;
    const dateOk = !dateFilter || sale.date === dateFilter;
    return platformOk && dateOk;
  });

  return (
    <>
      <PageHeader
        title="Sales History"
        subtitle="Complete history of recorded daily sales transactions and products"
      />

      <div className="p-6 md:p-10">
        <div className="bg-white/80 backdrop-blur-md border border-[#f3d3c8] rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#f3d3c8] bg-[#fffaf8] flex flex-wrap items-center gap-4">
            <div>
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="border border-[#e0cdc5] rounded-xl px-4 py-2 text-sm font-medium text-[#4a2e26] bg-white outline-none"
              >
                <option value="All">All Platforms</option>
                <option value="TikTok">TikTok</option>
                <option value="Shopee">Shopee</option>
              </select>
            </div>

            <div>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border border-[#e0cdc5] rounded-xl px-4 py-2 text-sm font-medium text-[#4a2e26] bg-white outline-none"
              />
            </div>

            {(platformFilter !== "All" || dateFilter) && (
              <button
                onClick={() => {
                  setPlatformFilter("All");
                  setDateFilter("");
                }}
                className="text-xs text-[#8c5243] font-bold underline px-2 py-1"
              >
                Reset Filters
              </button>
            )}
          </div>

          <SalesTable sales={filtered} deleteSale={deleteSale} />
        </div>
      </div>
    </>
  );
}

function SalesTable({
  sales,
  compact,
  deleteSale,
}: {
  sales: Sale[];
  compact?: boolean;
  deleteSale?: (id: number) => void;
}) {
  if (sales.length === 0) {
    return (
      <div className="p-12 text-center text-[#9a786d] font-medium text-sm">
        No sales records found.
      </div>
    );
  }

  return (
    <table className="w-full text-sm text-left border-collapse">
      <thead>
        <tr className="bg-[#faf0eb] text-[#5c3b31] border-b border-[#f3d3c8]">
          <th className="py-3.5 px-6 font-bold">Date</th>
          <th className="py-3.5 px-6 font-bold">Platform</th>
          <th className="py-3.5 px-6 font-bold">Sales (RM)</th>
          <th className="py-3.5 px-6 font-bold">Total Orders</th>
          <th className="py-3.5 px-6 font-bold">Products Breakdown</th>
          <th className="py-3.5 px-6 font-bold">Live Hours</th>
          {!compact && (
            <th className="py-3.5 px-6 font-bold text-right">Action</th>
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-[#f5e5dd]">
        {sales.map((item) => (
          <tr key={item.id} className="hover:bg-[#faf0eb]/50 transition">
            <td className="py-4 px-6 font-semibold text-[#4a2e26]">
              {item.date}
            </td>
            <td className="py-4 px-6">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  item.platform === "TikTok"
                    ? "bg-[#4a2e26] text-white"
                    : "bg-[#fceee8] text-[#d47853]"
                }`}
              >
                {item.platform}
              </span>
            </td>
            <td className="py-4 px-6 font-bold text-[#8c5243]">
              {formatRM(item.sales)}
            </td>
            <td className="py-4 px-6 font-semibold text-[#6e534b]">
              {item.orders}
            </td>
            <td className="py-4 px-6 font-medium text-[#4a2e26]">
              {item.isNoSales ? (
                <span className="bg-red-50 text-red-600 border border-red-200 px-2.5 py-0.5 rounded-lg text-xs font-extrabold">
                  No Sales / 0 Order
                </span>
              ) : item.items && item.items.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 max-w-xs">
                  {item.items.map((prod, i) => (
                    <span
                      key={i}
                      className="bg-[#fffaf8] border border-[#f0ded5] px-2.5 py-0.5 rounded-lg text-xs font-semibold text-[#6e534b]"
                    >
                      {prod.productName} ({prod.quantity}x)
                    </span>
                  ))}
                </div>
              ) : (
                <span className="bg-[#fffaf8] border border-[#f0ded5] px-2.5 py-0.5 rounded-lg text-xs font-semibold text-[#6e534b]">
                  {item.productSummary || "General"}
                </span>
              )}
            </td>
            <td className="py-4 px-6 font-medium text-[#6e534b]">
              {item.liveHours} hrs
            </td>
            {!compact && deleteSale && (
              <td className="py-4 px-6 text-right">
                <button
                  onClick={() => deleteSale(item.id)}
                  className="text-xs text-red-600 font-bold hover:underline px-2 py-1"
                >
                  Delete
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SchedulePage() {
  return (
    <>
      <PageHeader
        title="Live Schedule"
        subtitle="Official live broadcasting schedule"
      />

      <div className="p-6 md:p-10 max-w-4xl">
        <div className="bg-white/80 backdrop-blur-md border border-[#f3d3c8] rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#f3d3c8] bg-[#fffaf8]">
            <h2 className="font-bold text-lg text-[#4a2e26]">
              Official Live Stream Slot Schedule
            </h2>
            <p className="text-xs text-[#9a786d] mt-1">
              Please adhere to official daily live broadcasting hours
            </p>
          </div>

          <div className="divide-y divide-[#f5e5dd]">
            {LIVE_SCHEDULE.map((item) => (
              <div
                key={item.day}
                className="p-5 flex items-center justify-between hover:bg-[#faf0eb]/40 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fceee8] text-[#8c5243] flex items-center justify-center font-bold text-sm border border-[#f0ded5]">
                    {item.day.slice(0, 3)}
                  </div>
                  <span className="font-bold text-[#4a2e26]">{item.day}</span>
                </div>

                <div className="bg-[#faf0eb] border border-[#f0ded5] text-[#8c5243] px-4 py-2 rounded-xl text-sm font-extrabold">
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}