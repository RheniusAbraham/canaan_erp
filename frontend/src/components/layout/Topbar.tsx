"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ChevronRight, Search, Bell, ChevronDown } from "lucide-react";
import { sidebarSections } from "@/lib/nav-config";
import { cn } from "@/lib/utils";

function getPageLabel(pathname: string): string {
  for (const section of sidebarSections) {
    for (const item of section.items) {
      if (item.href === pathname) return item.label;
    }
  }
  return "Dashboard";
}

export function Topbar() {
  const pathname = usePathname();
  const breadcrumbs = [{ label: "Home", href: "/" }, { label: getPageLabel(pathname) }];

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/50 bg-white/60 backdrop-blur-xl px-6 shadow-sm">
      <nav className="flex items-center gap-2 text-[15px]">
        <Link href="/" className="text-gray-400 hover:text-gray-900 transition-all duration-300 hover:-translate-y-0.5 hover:scale-110">
          <Home className="h-4 w-4" />
        </Link>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <span key={crumb.label} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-gray-300" />
              {crumb.href && !isLast ? (
                <Link href={crumb.href} className="text-gray-500 hover:text-gray-900 transition-colors duration-300">
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className={isLast ? "font-semibold text-gray-900" : "text-gray-500"}
                >
                  {crumb.label}
                </span>
              )}
            </span>
          );
        })}
      </nav>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search jobs, LR, trips..."
            className="w-64 rounded-full border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05),0_4px_6px_-2px_rgba(0,0,0,0.025)] placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-blue-200 focus:w-72"
          />
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] focus:outline-none focus:ring-4 focus:ring-blue-500/10"
        >
          <Bell className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
          <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500 shadow-sm border border-white"></span>
          </span>
        </button>

        <div className="h-8 w-px bg-gray-200" />

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="group relative flex items-center gap-2.5 rounded-full border border-white/60 bg-white/60 p-1 pr-4 shadow-[0_2px_10px_rgba(0,0,0,0.05)] backdrop-blur-md transition-all duration-300 hover:bg-white hover:shadow-md hover:-translate-y-0.5 after:absolute after:-inset-2"
          >
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?seed=FleetManager&backgroundColor=e2e8f0"
              alt="User avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-[14px] font-semibold text-gray-900">Fleet Manager</span>
            <ChevronDown className={cn("h-4 w-4 text-gray-900 transition-transform duration-200", isProfileOpen ? "rotate-180" : "")} />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-48 origin-top-right rounded-2xl border border-white/60 bg-white/95 p-2 shadow-[0_10px_40px_rgba(0,0,0,0.1)] backdrop-blur-2xl focus:outline-none z-50">
              <div className="flex flex-col gap-1 animate-stagger">
                <button
                  className="relative block w-full rounded-xl px-4 py-2.5 text-left text-[15px] font-medium text-gray-700 transition-all duration-500 ease-out hover:-translate-y-1 hover:bg-white/80 hover:text-gray-900 hover:shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-transparent hover:border-white/50 after:absolute after:-inset-2"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Profile
                </button>
                <button
                  className="relative block w-full rounded-xl px-4 py-2.5 text-left text-[15px] font-medium text-red-600 transition-all duration-500 ease-out hover:-translate-y-1 hover:bg-red-50/80 hover:shadow-[0_4px_15px_rgba(239,68,68,0.1)] border border-transparent hover:border-red-100/50 after:absolute after:-inset-2"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
