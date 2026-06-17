"use client";

import { useMemo, useState } from "react";
import { CompensationTable, type CompensationPerson } from "@/components/compensation/CompensationTable";
import { PaymentDialog } from "@/components/compensation/PaymentDialog";
import { TransactionHistoryDialog } from "@/components/compensation/TransactionHistoryDialog";
import { initialDrivers } from "@/lib/driver-data";
import { initialTrips } from "@/lib/trip-data";
import { driverStatuses, initialDriverTransactions } from "@/lib/compensation-data";
import type { CompensationTransaction, CompensationTransactionType } from "@/types/compensation";

export default function DriverCompensationPage() {
  const [transactions, setTransactions] = useState<CompensationTransaction[]>(initialDriverTransactions);
  const [paymentTarget, setPaymentTarget] = useState<CompensationPerson | null>(null);
  const [paymentType, setPaymentType] = useState<CompensationTransactionType>("Salary");
  const [historyTarget, setHistoryTarget] = useState<CompensationPerson | null>(null);

  const people: CompensationPerson[] = useMemo(
    () =>
      initialDrivers.map((driver) => ({
        id: driver.id,
        photoUrl: driver.photoUrl,
        name: driver.name,
        status: driverStatuses[driver.id] ?? "Active",
      })),
    []
  );

  function handlePayAdvance(person: CompensationPerson) {
    setPaymentTarget(person);
    setPaymentType("Advance");
  }

  function handlePaySalary(person: CompensationPerson) {
    setPaymentTarget(person);
    setPaymentType("Salary");
  }

  const tripNumbers = useMemo(() => initialTrips.map((trip) => trip.tripId), []);

  function handleSavePayment(payment: { amount: number; date: string; note: string; tripNumber?: string }) {
    if (!paymentTarget) return;
    setTransactions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        personId: paymentTarget.id,
        type: paymentType,
        amount: payment.amount,
        date: payment.date,
        note: payment.note,
        tripNumber: payment.tripNumber,
      },
    ]);
    setPaymentTarget(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Driver Compensation</h1>
        <p className="mt-1 text-sm text-gray-500">Pay advances and salaries to drivers</p>
      </div>

      <CompensationTable
        people={people}
        showAdvance
        onPayAdvance={handlePayAdvance}
        onPaySalary={handlePaySalary}
        onViewHistory={setHistoryTarget}
        photoLabel="Driver Photo"
        nameLabel="Driver Name"
      />

      <PaymentDialog
        open={paymentTarget !== null}
        onClose={() => setPaymentTarget(null)}
        onSave={handleSavePayment}
        type={paymentType}
        personName={paymentTarget?.name ?? ""}
        tripNumbers={tripNumbers}
      />

      <TransactionHistoryDialog
        open={historyTarget !== null}
        onClose={() => setHistoryTarget(null)}
        personName={historyTarget?.name ?? ""}
        transactions={transactions.filter((transaction) => transaction.personId === historyTarget?.id)}
        showTypeFilters
      />
    </div>
  );
}
