'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, FileText, Users, Upload, BarChart3,
  Zap, LogOut, Activity
} from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard'  },
  { href: '/ingest',     icon: Upload,           label: 'Ingest Reports' },
  { href: '/reports',    icon: FileText,          label: 'Reports'    },
  { href: '/volunteers', icon: Users,             label: 'Volunteers' },
  { href: '/analytics',  icon: BarChart3,         label: 'Analytics'  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    router.push('/login');
  }

  return (
    <aside
      style={{
        width: '240px',
        minWidth: '240px',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        padding: '1.25rem 1rem',
        gap: '0.25rem',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '0.5rem 0.75rem 1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>AI Resource</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>Allocation</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.75rem', marginBottom: '0.5rem' }}>
          Navigation
        </div>
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`sidebar-link${isActive ? ' active' : ''}`}
            >
              <Icon size={16} />
              {label}
              {isActive && (
                <span style={{
                  marginLeft: 'auto', width: '6px', height: '6px',
                  borderRadius: '50%', background: 'var(--accent-blue)',
                  boxShadow: '0 0 6px rgba(59,130,246,0.6)',
                }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Live indicator + logout */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>
          <Activity size={12} className="pulse-glow" />
          <span>System Live</span>
        </div>
        <button onClick={handleLogout} className="sidebar-link btn-danger" style={{ border: 'none', background: 'transparent', width: '100%', textAlign: 'left' }}>
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
