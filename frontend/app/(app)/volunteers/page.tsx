'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ShieldCheck, Sparkles } from 'lucide-react';
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
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Volunteer Fleet
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-2">
            <Sparkles size={14} className="text-zinc-400" />
            <span>Manage on-ground field personnel.</span>
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text" 
              className="w-full h-10 pl-10 pr-4 text-sm rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700" 
              placeholder="Search personnel..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter button */}
          <button 
            onClick={() => setFilterAvailable(!filterAvailable)}
            className={`h-10 px-4 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border ${
              filterAvailable 
                ? 'bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 border-zinc-900 dark:border-zinc-50' 
                : 'bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }`}
          >
            <Filter size={14} /> 
            <span>{filterAvailable ? 'Available' : 'All Personnel'}</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <LoadingSpinner />
        </div>
      ) : filteredVolunteers.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-md">
          <ShieldCheck size={32} className="text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">No personnel found</h3>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredVolunteers.map((volunteer: any) => (
              <VolunteerCard key={volunteer.id} volunteer={volunteer} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      
    </div>
  );
}
