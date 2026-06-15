import { BottomNav } from "@/components/layouts/BottomNav";
import { SideNav } from "@/components/layouts/SideNav";
import { PcGlobalHeader } from "@/components/layouts/PcGlobalHeader";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full">
      {/* Desktop: Left Side Navigation */}
      <SideNav />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop: Global Header */}
        <PcGlobalHeader />

        {/* Page content — padded bottom for mobile bottom nav */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile: Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
