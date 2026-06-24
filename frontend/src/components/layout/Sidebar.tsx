"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Truck, LogOut } from "lucide-react";
import { sidebarSections } from "@/lib/nav-config";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[280px] shrink-0 flex-col border-r border-white/50 bg-white/60 backdrop-blur-xl shadow-sm">
      <div className="flex items-center gap-3 border-b border-white/50 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
          <Truck className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-base font-bold leading-tight text-gray-900">
            TransportERP
          </p>
          <p className="text-[11px] font-medium tracking-wide text-gray-500">
            FLEET MANAGEMENT
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {sidebarSections.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="px-3 pb-2 text-[11px] font-bold tracking-wider text-blue-600 uppercase">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-[15px] font-medium transition-all duration-500 ease-out hover:-translate-y-1",
                        isActive
                          ? "border border-blue-200/60 bg-blue-50/60 backdrop-blur-md text-blue-700 shadow-[0_4px_20px_rgba(37,99,235,0.15)] hover:shadow-[0_8px_25px_rgba(37,99,235,0.2)]"
                          : "border border-transparent text-gray-600 hover:border-white/30 hover:bg-white/40 hover:backdrop-blur-sm hover:text-gray-900 hover:shadow-[0_4px_15px_rgba(0,0,0,0.05)]"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-3 border-t border-white/50 px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          U
        </div>
        <span className="flex-1 text-sm font-medium text-gray-700">
          Fleet Manager
        </span>
        <button
          type="button"
          aria-label="Log out"
          className="text-gray-400 hover:text-gray-600"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
