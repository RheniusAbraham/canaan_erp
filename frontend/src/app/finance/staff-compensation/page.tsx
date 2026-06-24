"use client";

import { useMemo, useState } from "react";
import { CompensationTable, type CompensationPerson } from "@/components/compensation/CompensationTable";
import { PaymentDialog } from "@/components/compensation/PaymentDialog";
import { TransactionHistoryDialog } from "@/components/compensation/TransactionHistoryDialog";
import { initialStaff } from "@/lib/staff-data";
import { staffStatuses, initialStaffTransactions } from "@/lib/compensation-data";
import type { CompensationTransaction } from "@/types/compensation";

export default function StaffCompensationPage() {
  const [transactions, setTransactions] = useState<CompensationTransaction[]>(initialStaffTransactions);
  const [paymentTarget, setPaymentTarget] = useState<CompensationPerson | null>(null);
  const [historyTarget, setHistoryTarget] = useState<CompensationPerson | null>(null);

  const people: CompensationPerson[] = useMemo(
    () =>
      initialStaff.map((staff) => ({
        id: staff.id,
        photoUrl: staff.photoUrl,
        name: staff.name,
        status: staffStatuses[staff.id] ?? "Active",
      })),
    []
  );

  function handlePaySalary(person: CompensationPerson) {
    setPaymentTarget(person);
  }

  function handleSavePayment(payment: { amount: number; date: string; note: string }) {
    if (!paymentTarget) return;
    setTransactions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        personId: paymentTarget.id,
        type: "Salary",
        amount: payment.amount,
        date: payment.date,
        note: payment.note,
      },
    ]);
    setPaymentTarget(null);
  }

  return (
    <div className="animate-stagger flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Staff Compensation</h1>
        <p className="mt-1 text-sm text-gray-500">Pay salaries to staff members</p>
      </div>

      <CompensationTable
        people={people}
        showAdvance={false}
        onPayAdvance={() => {}}
        onPaySalary={handlePaySalary}
        onViewHistory={setHistoryTarget}
        photoLabel="Staff Photo"
        nameLabel="Staff Name"
      />

      <PaymentDialog
        open={paymentTarget !== null}
        onClose={() => setPaymentTarget(null)}
        onSave={handleSavePayment}
        type="Salary"
        personName={paymentTarget?.name ?? ""}
      />

      <TransactionHistoryDialog
        open={historyTarget !== null}
        onClose={() => setHistoryTarget(null)}
        personName={historyTarget?.name ?? ""}
        transactions={transactions.filter((transaction) => transaction.personId === historyTarget?.id)}
      />
    </div>
  );
}
