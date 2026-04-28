'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, ShieldCheck } from 'lucide-react';
import VolunteerCard from '@/components/VolunteerCard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchVolunteers() {
      setLoading(true);
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/volunteers${filterAvailable ? '?available=true' : ''}`;
        const res = await axios.get(url);
        setVolunteers(res.data.volunteers);
      } catch (err) {
        console.error('Failed to load volunteers', err);
      } finally {
        setLoading(false);
      }
    }
    fetchVolunteers();
  }, [filterAvailable]);

  const filteredVolunteers = volunteers.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) || 
    v.city?.toLowerCase().includes(search.toLowerCase()) ||
    v.skills.some((s: string) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fade-up" style={{ padding: '2rem 2.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>
            Volunteer Fleet
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
            Manage and monitor your specialized on-ground workforce.
          </p>
        </div>
        
        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              className="input" 
              placeholder="Search name, city, or skill..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.25rem', height: '36px', fontSize: '0.8rem' }}
            />
          </div>

          <button 
            onClick={() => setFilterAvailable(!filterAvailable)}
            className={`btn ${filterAvailable ? 'btn-primary' : 'btn-secondary'}`}
            style={{ height: '36px', fontSize: '0.8rem' }}
          >
            <Filter size={14} /> {filterAvailable ? 'Available Only' : 'All Volunteers'}
          </button>
          
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}><LoadingSpinner /></div>
      ) : filteredVolunteers.length === 0 ? (
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', borderStyle: 'dashed' }}>
          <ShieldCheck size={32} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>No volunteers found</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filteredVolunteers.map((volunteer, idx) => (
            <VolunteerCard key={volunteer.id} volunteer={volunteer} index={idx} />
          ))}
        </div>
      )}
      
    </div>
  );
}
