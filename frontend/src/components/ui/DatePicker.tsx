"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type DatePickerProps = {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDateDisplay(dateStr: string) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
}

export function DatePicker({ value, onChange, placeholder = "Select date", className, disabled }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // View state for the calendar
  const initialDate = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  // Reset view to selected date when opened
  useEffect(() => {
    if (isOpen) {
      const d = value ? new Date(value) : new Date();
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [isOpen, value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleSelectDate = (day: number) => {
    const formattedMonth = String(viewMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    onChange(`${viewYear}-${formattedMonth}-${formattedDay}`);
    setIsOpen(false);
  };

  const setToday = () => {
    const today = new Date();
    const formattedMonth = String(today.getMonth() + 1).padStart(2, '0');
    const formattedDay = String(today.getDate()).padStart(2, '0');
    onChange(`${today.getFullYear()}-${formattedMonth}-${formattedDay}`);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  // Fill array for the calendar grid
  const grid = [];
  
  // Previous month trailing days
  const prevMonthDays = getDaysInMonth(viewYear, viewMonth === 0 ? 11 : viewMonth - 1);
  for (let i = 0; i < firstDay; i++) {
    grid.push({
      day: prevMonthDays - firstDay + i + 1,
      isCurrentMonth: false
    });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    grid.push({
      day: i,
      isCurrentMonth: true
    });
  }
  
  // Next month leading days (fill to complete weeks)
  const remainingCells = (7 - (grid.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    grid.push({
      day: i,
      isCurrentMonth: false
    });
  }

  // Check if a cell is selected
  const isSelected = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth || !value) return false;
    const formattedMonth = String(viewMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    return value === `${viewYear}-${formattedMonth}-${formattedDay}`;
  };

  // Check if a cell is today
  const isToday = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return false;
    const today = new Date();
    return today.getDate() === day && today.getMonth() === viewMonth && today.getFullYear() === viewYear;
  };

  return (
    <div className={cn("relative inline-block w-full sm:w-auto", className)} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full min-w-[140px] items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
          disabled ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "text-gray-700 hover:-translate-y-0.5 hover:shadow-md hover:bg-white/90"
        )}
      >
        <span>{value ? formatDateDisplay(value) : placeholder}</span>
        <CalendarIcon className="h-4 w-4 text-gray-600" />
      </button>

      <div 
        className={cn(
          "absolute right-0 top-full z-50 mt-2 w-64 origin-top-right rounded-xl border border-blue-200/60 bg-blue-50/70 p-4 shadow-[0_12px_40px_rgba(37,99,235,0.15)] backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]",
          isOpen && !disabled 
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 scale-50 -translate-y-4 pointer-events-none rotate-3"
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-blue-950">
            {MONTHS[viewMonth]}, {viewYear}
          </h2>
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="flex h-5 w-5 items-center justify-center rounded text-blue-600/70 hover:bg-blue-100/50 hover:text-blue-900 transition-colors"
            >
              <ChevronUp className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="flex h-5 w-5 items-center justify-center rounded text-blue-600/70 hover:bg-blue-100/50 hover:text-blue-900 transition-colors"
            >
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="text-[11px] font-semibold text-blue-700/70">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {grid.map((cell, index) => {
            const selected = isSelected(cell.day, cell.isCurrentMonth);
            const today = isToday(cell.day, cell.isCurrentMonth);
            return (
              <button
                key={index}
                type="button"
                disabled={!cell.isCurrentMonth}
                onClick={() => cell.isCurrentMonth && handleSelectDate(cell.day)}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md text-xs transition-colors",
                  !cell.isCurrentMonth && "text-blue-300 cursor-default",
                  cell.isCurrentMonth && !selected && !today && "text-blue-950 hover:bg-white/60 hover:text-blue-700",
                  cell.isCurrentMonth && today && !selected && "bg-white/60 font-semibold text-blue-600",
                  selected && "bg-blue-600 font-semibold text-white shadow-sm hover:bg-blue-700"
                )}
              >
                {cell.day}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-blue-200/50 pt-3">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={setToday}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Today
          </button>
        </div>
      </div>
    </div>
  );
}
