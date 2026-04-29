'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, Users, Upload, BarChart3,
  Zap, LogOut, Menu, X, Sun, Moon
} from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';

const navItems = [
  { href: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard'     },
  { href: '/ingest',     icon: Upload,           label: 'Ingest'        },
  { href: '/reports',    icon: FileText,          label: 'Reports'       },
  { href: '/volunteers', icon: Users,             label: 'Volunteers'    },
  { href: '/analytics',  icon: BarChart3,         label: 'Analytics'     },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  async function handleLogout() {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    router.push('/login');
    setIsOpen(false);
  }

  const toggleMenu = () => setIsOpen(!isOpen);

  const drawerVariants = {
    closed: { x: '-100%', transition: { type: 'tween', duration: 0.2 } },
    open: { x: 0, transition: { type: 'tween', duration: 0.2 } }
  };

  const ThemeToggleControl = () => (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );

  return (
    <>
      {/* ── Mobile/Tablet Top Navbar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <Zap size={18} className="text-blue-500 fill-blue-500" />
          <span className="font-bold text-sm tracking-tight text-[var(--color-text-primary)]">
            ResQ Core
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggleControl />
          <button
            onClick={toggleMenu}
            className="w-10 h-10 flex items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-text-primary)] cursor-pointer"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* ── Mobile/Tablet Drawer Navigation ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />

            <motion.aside
              initial="closed"
              animate="open"
              exit="closed"
              variants={drawerVariants}
              className="fixed top-0 bottom-0 left-0 w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] p-6 flex flex-col z-50 md:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Zap size={18} className="text-blue-500 fill-blue-500" />
                  <span className="font-bold text-sm text-[var(--color-text-primary)]">
                    ResQ Core
                  </span>
                </div>
                <button onClick={toggleMenu} className="text-[var(--color-text-muted)] cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 flex flex-col gap-1">
                {navItems.map(({ href, icon: Icon, label }) => {
                  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
                  return (
                    <Link 
                      key={href} 
                      href={href} 
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 h-11 rounded-md text-sm transition-colors cursor-pointer ${
                        isActive 
                          ? 'bg-zinc-100 dark:bg-zinc-800/80 font-semibold text-[var(--color-text-primary)]' 
                          : 'text-[var(--color-text-secondary)] hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto pt-6 border-t border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface)]">
                <ThemeToggleControl />
                <button
                  onClick={handleLogout}
                  className="w-10 h-10 flex items-center justify-center rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Desktop Permanent Sidebar ── */}
      <aside className="hidden md:flex flex-col w-60 bg-[var(--color-surface)] border-r border-[var(--color-border)] p-6 h-screen sticky top-0">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <Zap size={20} className="text-blue-500 fill-blue-500" />
            <div className="text-base font-bold tracking-tight text-[var(--color-text-primary)]">
              ResQ Core
            </div>
          </div>
          <ThemeToggleControl />
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
            return (
              <Link 
                key={href} 
                href={href} 
                className={`flex items-center gap-3 px-3 h-11 rounded-md text-sm transition-colors cursor-pointer ${
                  isActive 
                    ? 'bg-zinc-100 dark:bg-zinc-800/80 font-semibold text-[var(--color-text-primary)]' 
                    : 'text-[var(--color-text-secondary)] hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-[var(--color-text-primary)]'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-[var(--color-border)] flex items-center justify-end bg-[var(--color-surface)]">
          <button
            onClick={handleLogout}
            className="w-10 h-10 flex items-center justify-center rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}
