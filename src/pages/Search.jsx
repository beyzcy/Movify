import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useDebounce } from '../hooks/useDebounce';
import Navbar from '../components/Navbar';

const ShimmerRow = () => (
  <div className="flex gap-4 p-4 animate-pulse">
    <div className="w-16 h-24 rounded-xl bg-gray-200 flex-shrink-0" />
    <div className="flex-1 py-2 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="h-3 bg-gray-200 rounded w-1/4" />
    </div>
  </div>
);

const Search = ({ activePage, onPageChange, onMovieSelect }) => {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700 p-6 lg:p-10 flex items-start justify-center">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <Navbar activePage={activePage} onPageChange={onPageChange} />

        <div className="px-8 pb-10">
          {/* Başlık */}
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Film Ara</h2>

          {/* Arama çubuğu */}
          <div className="relative mb-8">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Film adı ile ara..."
              autoFocus
              className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setResults([]); setSearched(false); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-gray-500" />
              </button>
            )}
          </div>

          {/* Yükleniyor */}
          {loading && (
            <div className="divide-y divide-gray-50">
              {Array.from({ length: 6 }).map((_, i) => <ShimmerRow key={i} />)}
            </div>
          )}

          {/* Sonuçlar */}
          {!loading && results.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-4 px-1">{results.length} sonuç bulundu</p>
              <div className="divide-y divide-gray-50">
                {results.map(movie => (
                  <button
                    key={movie.movie_id}
                    onClick={() => onMovieSelect?.(movie.movie_id)}
                    className="w-full flex gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors text-left group"
                  >
                    <div className="flex-shrink-0 w-16 h-24 rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={e => { e.target.src = 'https://placehold.co/64x96?text=?'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <h3 className="text-sm font-bold text-gray-900 mb-1 leading-snug line-clamp-2">
                        {movie.title}
                      </h3>
                      {movie.director && (
                        <p className="text-xs text-gray-400 mb-1">{movie.director}</p>
                      )}
                      <p className="text-xs text-gray-400">{movie.release_year}</p>
                      {movie.average_rating && (
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-semibold text-gray-600">{movie.average_rating}</span>
                          <span className="text-xs text-gray-400">/ 10</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sonuç yok */}
          {!loading && searched && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                <SearchIcon className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-gray-700 font-bold text-lg mb-1">Sonuç bulunamadı</p>
              <p className="text-gray-400 text-sm max-w-xs">
                "<span className="font-medium text-gray-600">{query}</span>" için herhangi bir film bulunamadı.
              </p>
              <p className="text-gray-400 text-xs mt-2">Farklı bir arama terimi deneyin.</p>
            </div>
          )}

          {/* Başlangıç durumu */}
          {!loading && !searched && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                <SearchIcon className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm">Film adı yazarak aramaya başlayın</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
