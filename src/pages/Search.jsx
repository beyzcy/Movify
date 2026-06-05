import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useDebounce } from '../hooks/useDebounce';
import Navbar from '../components/Navbar';

/* ── Shimmer ────────────────────────────────────────────────────────── */
const ShimmerRow = () => (
  <div className="flex gap-4 p-4 animate-pulse">
    <div className="w-16 h-24 rounded-xl flex-shrink-0" style={{ backgroundColor: 'rgba(156,129,129,0.12)' }} />
    <div className="flex-1 py-2 space-y-2">
      <div className="h-4 rounded w-3/4" style={{ backgroundColor: 'rgba(156,129,129,0.12)' }} />
      <div className="h-3 rounded w-1/3" style={{ backgroundColor: 'rgba(156,129,129,0.12)' }} />
      <div className="h-3 rounded w-1/4" style={{ backgroundColor: 'rgba(156,129,129,0.12)' }} />
    </div>
  </div>
);

/* ── Search ─────────────────────────────────────────────────────────── */
const Search = ({ activePage, onPageChange, onMovieSelect, currentUser, onLogout }) => {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults([]); setSearched(false); return; }
    doSearch(debouncedQuery.trim());
  }, [debouncedQuery]);

  const doSearch = async (q) => {
    setLoading(true);
    setSearched(true);
    const { data, error } = await supabase
      .from('movies')
      .select('movie_id, title, release_year, average_rating, poster_url, director')
      .ilike('title', `%${q}%`)
      .order('average_rating', { ascending: false, nullsFirst: false })
      .limit(30);
    if (!error) setResults(data || []);
    setLoading(false);
  };

  return (
    <div className="page-bg">
      <div className="max-w-6xl mx-auto">
        <Navbar activePage={activePage} onPageChange={onPageChange} currentUser={currentUser} onLogout={onLogout} />

        <div className="px-6 lg:px-10 pb-12 animate-fadeIn">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#1A1A24' }}>Search Films</h2>

          {/* ── Search bar ─────────────────────────────────────────── */}
          <div className="relative mb-8">
            <SearchIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
              style={{ color: '#9C8181' }}
            />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by title..."
              autoFocus
              className="w-full pl-12 pr-12 py-4 rounded-2xl text-sm placeholder-gray-400 focus:outline-none transition-all"
              style={{
                backgroundColor: 'rgba(255,255,255,0.7)',
                border: '1.5px solid rgba(156,129,129,0.25)',
                color: '#1A1A24',
              }}
              onFocus={e => { e.target.style.backgroundColor = '#fff'; e.target.style.borderColor = '#9C8181'; }}
              onBlur={e => { e.target.style.backgroundColor = 'rgba(255,255,255,0.7)'; e.target.style.borderColor = 'rgba(156,129,129,0.25)'; }}
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setResults([]); setSearched(false); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'rgba(156,129,129,0.2)' }}
              >
                <X className="w-3.5 h-3.5" style={{ color: '#9C8181' }} />
              </button>
            )}
          </div>

          {/* ── Shimmer ────────────────────────────────────────────── */}
          {loading && (
            <div
              className="rounded-2xl overflow-hidden divide-y"
              style={{ backgroundColor: 'rgba(255,255,255,0.55)', divideColor: 'rgba(156,129,129,0.1)' }}
            >
              {Array.from({ length: 6 }).map((_, i) => <ShimmerRow key={i} />)}
            </div>
          )}

          {/* ── Results ────────────────────────────────────────────── */}
          {!loading && results.length > 0 && (
            <div>
              <p className="text-xs mb-3 px-1" style={{ color: '#9C8181' }}>{results.length} results found</p>
              <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.55)' }}>
                {results.map((movie, i) => (
                  <button
                    key={movie.movie_id}
                    onClick={() => onMovieSelect?.(movie.movie_id)}
                    className="w-full flex gap-4 p-4 text-left group transition-colors"
                    style={i < results.length - 1 ? { borderBottom: '1px solid rgba(156,129,129,0.1)' } : {}}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.8)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div className="flex-shrink-0 w-16 h-24 rounded-xl overflow-hidden" style={{ backgroundColor: 'rgba(156,129,129,0.12)' }}>
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={e => { e.target.src = 'https://placehold.co/64x96?text=?'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <h3 className="text-sm font-bold mb-1 leading-snug" style={{ color: '#1A1A24' }}>{movie.title}</h3>
                      {movie.director && <p className="text-xs text-gray-400 mb-1">{movie.director}</p>}
                      <p className="text-xs text-gray-400">{movie.release_year}</p>
                      {movie.average_rating && (
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-semibold" style={{ color: '#1A1A24' }}>{movie.average_rating}</span>
                          <span className="text-xs text-gray-400">/ 10</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── No results ─────────────────────────────────────────── */}
          {!loading && searched && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
              >
                <SearchIcon className="w-9 h-9" style={{ color: '#9C8181' }} />
              </div>
              <p className="font-bold text-lg mb-1" style={{ color: '#1A1A24' }}>No results found</p>
              <p className="text-sm text-gray-400">
                No films match "<span className="font-medium" style={{ color: '#9C8181' }}>{query}</span>"
              </p>
            </div>
          )}

          {/* ── Initial state ──────────────────────────────────────── */}
          {!loading && !searched && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
              >
                <SearchIcon className="w-9 h-9" style={{ color: '#9C8181' }} />
              </div>
              <p className="text-sm" style={{ color: '#9C8181' }}>Start typing to search films</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
