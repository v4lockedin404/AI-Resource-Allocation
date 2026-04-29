import Sidebar from '@/components/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-[100dvh] bg-[var(--color-base)]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 min-w-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
