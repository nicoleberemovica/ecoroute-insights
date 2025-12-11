import { ReactNode } from "react";
import { Leaf } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-md px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-display font-semibold">GHG Tracker</h1>
            <p className="text-xs text-muted-foreground">Logistics Emissions</p>
          </div>
        </div>
        <div className="ml-auto text-sm text-muted-foreground">
          Base emission factor: 110.7 g CO₂/tonne-km
        </div>
      </header>

      {/* Page content */}
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}