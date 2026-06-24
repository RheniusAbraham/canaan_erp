"use client";

import { useMemo, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { cn } from "@/lib/utils";
import type { CompensationTransaction, CompensationTransactionType } from "@/types/compensation";

type TransactionHistoryDialogProps = {
  open: boolean;
  onClose: () => void;
  personName: string;
  transactions: CompensationTransaction[];
  showTypeFilters?: boolean;
};

type FilterValue = "All" | CompensationTransactionType;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function TransactionHistoryDialog({
  open,
  onClose,
  personName,
  transactions,
  showTypeFilters,
}: TransactionHistoryDialogProps) {
  const [filter, setFilter] = useState<FilterValue>("All");

  const filteredTransactions = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => (a.date < b.date ? 1 : -1));
    if (filter === "All") return sorted;
    return sorted.filter((transaction) => transaction.type === filter);
  }, [transactions, filter]);

  return (
    <Dialog open={open} onClose={onClose} title={`Transaction History - ${personName}`}>
      <div className="flex flex-col gap-4">
        {showTypeFilters && (
          <div className="flex flex-wrap gap-2">
            {(["All", "Advance", "Salary"] as FilterValue[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium shadow-sm transition-all",
                  filter === value
                    ? "bg-blue-600 text-white shadow-blue-200"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                {value}
              </button>
            ))}
          </div>
        )}

        {filteredTransactions.length === 0 ? (
          <div className="rounded-xl border border-white/80 bg-white/90 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl text-center text-sm text-gray-500 transition-all duration-300">
            No transactions yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/80 bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Amount
                  </th>
                  {showTypeFilters && (
                    <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Trip Number
                    </th>
                  )}
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="group transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:bg-white/80 relative hover:z-10 cursor-pointer">
                    <td className="px-4 py-3 text-gray-600">{formatDate(transaction.date)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-medium",
                          transaction.type === "Advance"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-green-50 text-green-700"
                        )}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {formatCurrency(transaction.amount)}
                    </td>
                    {showTypeFilters && (
                      <td className="px-4 py-3 text-gray-600">{transaction.tripNumber || "—"}</td>
                    )}
                    <td className="px-4 py-3 text-gray-600">{transaction.note || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </Dialog>
  );
}
