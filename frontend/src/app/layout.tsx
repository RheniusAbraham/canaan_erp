import type { Metadata } from "next";
import { Manrope, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { TyreInventoryProvider } from "@/context/TyreInventoryContext";
import { TripWorkflowProvider } from "@/context/TripWorkflowContext";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TransportERP - Fleet Management",
  description: "Fleet management ERP for shipping operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full bg-mesh-light font-sans text-gray-900">
        <TripWorkflowProvider>
          <TyreInventoryProvider>
            <div className="flex h-full">
              <Sidebar />
              <div className="flex min-w-0 flex-1 flex-col">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
              </div>
            </div>
          </TyreInventoryProvider>
        </TripWorkflowProvider>
      </body>
    </html>
  );
}
