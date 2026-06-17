"use client";

import { Truck, Gauge, IndianRupee, Weight } from "lucide-react";
import { initialTrucks } from "@/lib/truck-data";

type MockInsight = {
  mileage: number;
  costPerKm: number;
  tonKmEfficiency: number;
};

const MOCK_INSIGHTS: MockInsight[] = [
  { mileage: 4.2, costPerKm: 38.5, tonKmEfficiency: 18.6 },
  { mileage: 3.8, costPerKm: 42.1, tonKmEfficiency: 16.2 },
  { mileage: 4.6, costPerKm: 35.9, tonKmEfficiency: 19.4 },
];

function getMockInsight(index: number): MockInsight {
  return MOCK_INSIGHTS[index % MOCK_INSIGHTS.length];
}

export default function MileageInsightsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mileage Insights</h1>
        <p className="mt-1 text-sm text-gray-500">
          Mileage, cost, and load efficiency insights for every vehicle
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {initialTrucks.map((truck, index) => {
          const insight = getMockInsight(index);

          return (
            <div
              key={truck.id}
              className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Truck className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{truck.registrationNumber}</p>
                  <p className="text-xs text-gray-500">
                    {truck.truckType} · {truck.truckId} · {Number(truck.odometer).toLocaleString("en-IN")} km
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:flex sm:items-center sm:gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5">
                  <Gauge className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-bold text-blue-700">{insight.mileage.toFixed(1)} km/L</p>
                    <p className="text-[11px] text-blue-500">Mileage</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-2.5">
                  <IndianRupee className="h-4 w-4 text-amber-500" />
                  <div>
                    <p className="text-sm font-bold text-amber-700">₹{insight.costPerKm.toFixed(1)}/km</p>
                    <p className="text-[11px] text-amber-500">Cost per Km</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5">
                  <Weight className="h-4 w-4 text-emerald-500" />
                  <div>
                    <p className="text-sm font-bold text-emerald-700">{insight.tonKmEfficiency.toFixed(1)} t-km/L</p>
                    <p className="text-[11px] text-emerald-500">Ton-Km Efficiency</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
