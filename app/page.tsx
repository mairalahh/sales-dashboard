"use client";

import { useState } from "react";

const summaryCards = [
  {
    title: "Today's Sales",
    value: "RM 0.00",
    change: "No data yet",
    icon: "💰",
  },
  {
    title: "Total Orders",
    value: "0",
    change: "No orders yet",
    icon: "🛒",
  },
  {
    title: "Sales per Hour",
    value: "RM 0.00",
    change: "No live data",
    icon: "⏱️",
  },
  {
    title: "Total Live Hours",
    value: "0.0 hrs",
    change: "Today",
    icon: "📺",
  },
];

export default function Home() {
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-800">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r border-slate-200 bg-white p-5 md:block">
          <div className="mb-10">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Sales<span className="text-indigo-600">Hub</span>
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Personal Sales Dashboard
            </p>
          </div>

          <nav className="space-y-2">
            {["Dashboard", "Sales Entry", "Sales History"].map((item) => (
              <button
                key={item}
                onClick={() => setActivePage(item)}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  activePage === item
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item === "Dashboard" && "📊 "}
                {item === "Sales Entry" && "➕ "}
                {item === "Sales History" && "📋 "}
                {item}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-10">
            <div className="rounded-2xl bg-slate-900 p-4 text-white">
              <p className="text-xs text-slate-400">Data Source</p>
              <p className="mt-1 text-sm font-semibold">
                Excel Workbook
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Connected dashboard
              </p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <section className="flex-1 p-5 md:p-8">
          {/* Header */}
          <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-indigo-600">
                {new Date().toLocaleDateString("en-MY", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                {activePage}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage and monitor your daily sales performance.
              </p>
            </div>

            <button className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
              + Add Sale
            </button>
          </header>

          {/* Dashboard */}
          {activePage === "Dashboard" && (
            <>
              {/* Summary cards */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-500">
                          {card.title}
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">
                          {card.value}
                        </p>
                      </div>

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
                        {card.icon}
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-slate-400">
                      {card.change}
                    </p>
                  </div>
                ))}
              </div>

              {/* Charts area */}
              <div className="mt-6 grid gap-6 xl:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Sales Trend
                      </h3>
                      <p className="mt-1 text-xs text-slate-400">
                        Daily sales performance
                      </p>
                    </div>

                    <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none">
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>This month</option>
                    </select>
                  </div>

                  <div className="mt-6 flex h-64 items-center justify-center rounded-xl bg-slate-50">
                    <div className="text-center">
                      <div className="text-4xl">📈</div>
                      <p className="mt-3 text-sm font-medium text-slate-600">
                        Sales chart will appear here
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Connected to your Excel data
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-semibold text-slate-900">
                    Platform Sales
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Sales breakdown by platform
                  </p>

                  <div className="mt-8 space-y-5">
                    <div>
                      <div className="mb-2 flex justify-between text-sm">
                        <span>TikTok Live</span>
                        <span className="font-semibold">RM 0.00</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div className="h-2 w-0 rounded-full bg-indigo-600" />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex justify-between text-sm">
                        <span>Shopee Live</span>
                        <span className="font-semibold">RM 0.00</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div className="h-2 w-0 rounded-full bg-orange-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom section */}
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-semibold text-slate-900">
                    Best Selling Products
                  </h3>

                  <div className="mt-5 flex h-40 items-center justify-center rounded-xl bg-slate-50">
                    <p className="text-sm text-slate-400">
                      Product data will appear here
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-semibold text-slate-900">
                    Recent Sales
                  </h3>

                  <div className="mt-5 flex h-40 items-center justify-center rounded-xl bg-slate-50">
                    <p className="text-sm text-slate-400">
                      Recent sales will appear here
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Sales Entry */}
          {activePage === "Sales Entry" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">
                Add Daily Sale
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Enter your sales once. We will connect this form directly to
                your Excel workbook later.
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Platform
                  </label>
                  <select className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500">
                    <option>TikTok Live</option>
                    <option>Shopee Live</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Sales
                  </label>
                  <input
                    type="number"
                    placeholder="RM 0.00"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Orders
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Live Hours
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">
                Save Sale
              </button>
            </div>
          )}

          {/* History */}
          {activePage === "Sales History" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Sales History
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    View and manage your previous sales records.
                  </p>
                </div>

                <input
                  type="date"
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-5 py-4">Date</th>
                      <th className="px-5 py-4">Platform</th>
                      <th className="px-5 py-4">Sales</th>
                      <th className="px-5 py-4">Orders</th>
                      <th className="px-5 py-4">Live Hours</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-12 text-center text-slate-400"
                      >
                        No sales records yet
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}