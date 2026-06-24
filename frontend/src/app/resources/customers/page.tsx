"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { CustomerFormDialog } from "@/components/customers/CustomerFormDialog";
import { CustomerPricingTable } from "@/components/customers/CustomerPricingTable";
import { CustomerPricingFormDialog } from "@/components/customers/CustomerPricingFormDialog";
import { CustomerDestinationTable } from "@/components/customers/CustomerDestinationTable";
import { CustomerDestinationFormDialog } from "@/components/customers/CustomerDestinationFormDialog";
import { initialCustomers } from "@/lib/customer-data";
import { initialCustomerPricing } from "@/lib/customer-pricing-data";
import { initialCustomerDestinations } from "@/lib/customer-destination-data";
import { cn } from "@/lib/utils";
import type { Customer } from "@/types/customer";
import type { CustomerPricing } from "@/types/customer-pricing";
import type { CustomerDestination } from "@/types/customer-destination";

const TABS = [
  { id: "list", label: "Customer List" },
  { id: "pricing", label: "Our Customer Pricing" },
  { id: "destinations", label: "Our Customer Destinations" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState<TabId>("list");

  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [pricing, setPricing] = useState<CustomerPricing[]>(initialCustomerPricing);
  const [pricingDialogOpen, setPricingDialogOpen] = useState(false);
  const [editingPricing, setEditingPricing] = useState<CustomerPricing | null>(null);

  const [destinations, setDestinations] = useState<CustomerDestination[]>(initialCustomerDestinations);
  const [destinationDialogOpen, setDestinationDialogOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<CustomerDestination | null>(null);

  function handleAddCustomer() {
    setEditingCustomer(null);
    setCustomerDialogOpen(true);
  }

  function handleEditCustomer(customer: Customer) {
    setEditingCustomer(customer);
    setCustomerDialogOpen(true);
  }

  function handleDeleteCustomer(id: string) {
    if (!confirm("Delete this customer?")) return;
    setCustomers((prev) => prev.filter((customer) => customer.id !== id));
  }

  function handleSaveCustomer(customer: Customer) {
    setCustomers((prev) => {
      const exists = prev.some((existing) => existing.id === customer.id);
      if (exists) {
        return prev.map((existing) => (existing.id === customer.id ? customer : existing));
      }
      return [...prev, customer];
    });
    setCustomerDialogOpen(false);
  }

  function handleAddPricing() {
    setEditingPricing(null);
    setPricingDialogOpen(true);
  }

  function handleEditPricing(entry: CustomerPricing) {
    setEditingPricing(entry);
    setPricingDialogOpen(true);
  }

  function handleDeletePricing(id: string) {
    if (!confirm("Delete this pricing entry?")) return;
    setPricing((prev) => prev.filter((entry) => entry.id !== id));
  }

  function handleSavePricing(entry: CustomerPricing) {
    setPricing((prev) => {
      const exists = prev.some((existing) => existing.id === entry.id);
      if (exists) {
        return prev.map((existing) => (existing.id === entry.id ? entry : existing));
      }
      return [...prev, entry];
    });
    setPricingDialogOpen(false);
  }

  function handleAddDestination() {
    setEditingDestination(null);
    setDestinationDialogOpen(true);
  }

  function handleEditDestination(entry: CustomerDestination) {
    setEditingDestination(entry);
    setDestinationDialogOpen(true);
  }

  function handleDeleteDestination(id: string) {
    if (!confirm("Delete this destination?")) return;
    setDestinations((prev) => prev.filter((entry) => entry.id !== id));
  }

  function handleSaveDestination(entry: CustomerDestination) {
    setDestinations((prev) => {
      const exists = prev.some((existing) => existing.id === entry.id);
      if (exists) {
        return prev.map((existing) => (existing.id === entry.id ? entry : existing));
      }
      return [...prev, entry];
    });
    setDestinationDialogOpen(false);
  }

  return (
    <div className="animate-stagger flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Our Customers</h1>
        <p className="mt-1 text-sm text-gray-500">Manage customer records, pricing, and destinations</p>
      </div>

      <div className="flex items-center gap-2 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "list" && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={handleAddCustomer}
              className="group relative overflow-hidden flex items-center gap-2 rounded-xl bg-white/40 px-4 py-2 text-sm font-semibold text-blue-600 shadow-[0_4px_15px_rgba(37,99,235,0.1)] backdrop-blur-xl border border-white/80 transition-all duration-300 hover:bg-white/60 hover:shadow-[0_8px_25px_rgba(37,99,235,0.2)] hover:-translate-y-0.5 hover:border-white hover:text-blue-700 after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent after:-translate-x-full hover:after:translate-x-full after:transition-transform after:duration-700"
            >
              <Plus className="h-4 w-4" />
              Add Customer
            </button>
          </div>

          <CustomerTable customers={customers} onEdit={handleEditCustomer} onDelete={handleDeleteCustomer} />

          <CustomerFormDialog
            open={customerDialogOpen}
            onClose={() => setCustomerDialogOpen(false)}
            onSave={handleSaveCustomer}
            initialData={editingCustomer}
          />
        </div>
      )}

      {activeTab === "pricing" && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={handleAddPricing}
              className="group relative overflow-hidden flex items-center gap-2 rounded-xl bg-white/40 px-4 py-2 text-sm font-semibold text-blue-600 shadow-[0_4px_15px_rgba(37,99,235,0.1)] backdrop-blur-xl border border-white/80 transition-all duration-300 hover:bg-white/60 hover:shadow-[0_8px_25px_rgba(37,99,235,0.2)] hover:-translate-y-0.5 hover:border-white hover:text-blue-700 after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent after:-translate-x-full hover:after:translate-x-full after:transition-transform after:duration-700"
            >
              <Plus className="h-4 w-4" />
              Add Pricing
            </button>
          </div>

          <CustomerPricingTable
            pricing={pricing}
            customers={customers}
            onEdit={handleEditPricing}
            onDelete={handleDeletePricing}
          />

          <CustomerPricingFormDialog
            open={pricingDialogOpen}
            onClose={() => setPricingDialogOpen(false)}
            onSave={handleSavePricing}
            initialData={editingPricing}
            customers={customers}
            existingPricing={pricing}
          />
        </div>
      )}

      {activeTab === "destinations" && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={handleAddDestination}
              className="group relative overflow-hidden flex items-center gap-2 rounded-xl bg-white/40 px-4 py-2 text-sm font-semibold text-blue-600 shadow-[0_4px_15px_rgba(37,99,235,0.1)] backdrop-blur-xl border border-white/80 transition-all duration-300 hover:bg-white/60 hover:shadow-[0_8px_25px_rgba(37,99,235,0.2)] hover:-translate-y-0.5 hover:border-white hover:text-blue-700 after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent after:-translate-x-full hover:after:translate-x-full after:transition-transform after:duration-700"
            >
              <Plus className="h-4 w-4" />
              Add Destination
            </button>
          </div>

          <CustomerDestinationTable
            destinations={destinations}
            customers={customers}
            onEdit={handleEditDestination}
            onDelete={handleDeleteDestination}
          />

          <CustomerDestinationFormDialog
            open={destinationDialogOpen}
            onClose={() => setDestinationDialogOpen(false)}
            onSave={handleSaveDestination}
            initialData={editingDestination}
            customers={customers}
          />
        </div>
      )}
    </div>
  );
}
