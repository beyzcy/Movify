import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Profile from './pages/Profile';
import MovieDetail from './pages/MovieDetail';
import Search from './pages/Search';
import ListModal from './components/ListModal';
import { supabase } from './lib/supabase';
import { USER_ID } from './lib/userId';

function App() {
  const [activePage, setActivePage]             = useState('home');
  const [selectedMovieId, setSelectedMovieId]   = useState(null);
  const [movies, setMovies]                     = useState([]);
  const [userLists, setUserLists]               = useState([]);
  const [listModalMovieId, setListModalMovieId] = useState(null);
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState(null);

  const handlePageChange = (page) => {
    setActivePage(page);
    if (page !== 'movieDetail') setSelectedMovieId(null);
  };

  const handleMovieSelect = (id) => {
    setSelectedMovieId(id);
    setActivePage('movieDetail');
  };

  useEffect(() => { fetchAllData(); }, []);

  // ── Veri çekme ────────────────────────────────────────────────────────────

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        { data: moviesData, error: moviesErr },
        { data: favoritesData },
        { data: watchedData },
        { data: ratingsData },
        { data: listsData },
      ] = await Promise.all([
        supabase.from('movies').select('*, movie_genres(genres(name))').order('movie_id', { ascending: false }),
        supabase.from('favorites').select('movie_id').eq('user_id', USER_ID),
        supabase.from('watched_movies').select('movie_id').eq('user_id', USER_ID),
        supabase.from('ratings').select('movie_id, score').eq('user_id', USER_ID),
        supabase.from('user_lists').select('*, user_list_movies(movie_id)').eq('user_id', USER_ID).order('created_at', { ascending: false }),
      ]);

      if (moviesErr) throw moviesErr;

      const favoriteIds = new Set((favoritesData || []).map(f => f.movie_id));
      const watchedIds  = new Set((watchedData  || []).map(w => w.movie_id));
      const ratingsMap  = Object.fromEntries((ratingsData || []).map(r => [r.movie_id, r.score]));

      setMovies(
        (moviesData || []).map(m => {
          const genreList = (m.movie_genres || []).map(mg => mg.genres?.name).filter(Boolean);
          return {
            ...m,
            genre:      genreList[0] || '',
            genres:     genreList,
            isFavorite: favoriteIds.has(m.movie_id),
            watched:    watchedIds.has(m.movie_id),
            userRating: ratingsMap[m.movie_id] ?? 0,
          };
        })
      );

      setUserLists(
        (listsData || []).map(list => ({
          ...list,
          movieIds: new Set((list.user_list_movies || []).map(m => m.movie_id)),
        }))
      );
    } catch (err) {
      console.error('Supabase veri çekme hatası:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Favori / İzlendi / Puan ───────────────────────────────────────────────

  const handleWatched = async (id) => {
    setMovies(prev => prev.map(m => m.movie_id === id ? { ...m, watched: true } : m));
    const { error } = await supabase
      .from('watched_movies')
      .upsert({ user_id: USER_ID, movie_id: id }, { onConflict: 'user_id,movie_id' });
    if (error) console.error('watched_movies hatası:', error.message);
  };

  const handleFavorite = async (id) => {
    const movie = movies.find(m => m.movie_id === id);
    if (!movie) return;

    const newVal = !movie.isFavorite;
    setMovies(prev => prev.map(m => m.movie_id === id ? { ...m, isFavorite: newVal } : m));

    if (movie.isFavorite) {
      const { error } = await supabase.from('favorites').delete().eq('user_id', USER_ID).eq('movie_id', id);
      if (error) {
        console.error('favorites delete hatası:', error.message);
        setMovies(prev => prev.map(m => m.movie_id === id ? { ...m, isFavorite: true } : m));
      }
    } else {
      const { error } = await supabase.from('favorites').insert({ user_id: USER_ID, movie_id: id });
      if (error) {
        console.error('favorites insert hatası:', error.message);
        setMovies(prev => prev.map(m => m.movie_id === id ? { ...m, isFavorite: false } : m));
      }
    }
  };

  const handleRate = async (id, userRating) => {
    setMovies(prev => prev.map(m => m.movie_id === id ? { ...m, userRating } : m));
    const { error } = await supabase
      .from('ratings')
      .upsert({ user_id: USER_ID, movie_id: id, score: userRating }, { onConflict: 'user_id,movie_id' });
    if (error) console.error('ratings hatası:', error.message);
  };

  // ── Kullanıcı Listeleri ───────────────────────────────────────────────────

  const handleCreateList = async (name, movieId) => {
    const { data, error } = await supabase
      .from('user_lists')
      .insert({ user_id: USER_ID, name, is_public: true })
      .select()
      .single();

    if (error) { console.error('user_lists hatası:', error.message); return; }

    const newList = { ...data, movieIds: new Set() };

    if (movieId) {
      const { error: addErr } = await supabase
        .from('user_list_movies')
        .insert({ list_id: data.list_id, movie_id: movieId, position: 1 });
      if (!addErr) newList.movieIds.add(movieId);
    }

    setUserLists(prev => [newList, ...prev]);
  };

  const handleAddToList = async (listId, movieId) => {
    const list = userLists.find(l => l.list_id === listId);
    if (!list) return;

    if (list.movieIds.has(movieId)) {
      // listeden çıkar
      const { error } = await supabase
        .from('user_list_movies')
        .delete()
        .eq('list_id', listId)
        .eq('movie_id', movieId);

      if (!error) {
        setUserLists(prev => prev.map(l => {
          if (l.list_id !== listId) return l;
          const ids = new Set(l.movieIds);
          ids.delete(movieId);
          return { ...l, movieIds: ids };
        }));
      }
    } else {
      // listeye ekle
      const { error } = await supabase
        .from('user_list_movies')
        .insert({ list_id: listId, movie_id: movieId, position: list.movieIds.size + 1 });

      if (!error) {
        setUserLists(prev => prev.map(l => {
          if (l.list_id !== listId) return l;
          const ids = new Set(l.movieIds);
          ids.add(movieId);
          return { ...l, movieIds: ids };
        }));
      }
    }
  };

  // ── Loading / Error ───────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <p className="text-red-500 font-bold text-lg mb-2">Bağlantı Hatası</p>
          <p className="text-gray-500 text-sm mb-6 break-all">{error}</p>
          <button onClick={fetchAllData} className="bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors">
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const sharedProps = {
    movies,
    userLists,
    onWatched:          handleWatched,
    onRate:             handleRate,
    onFavorite:         handleFavorite,
    onOpenListModal:    setListModalMovieId,
    activePage,
    onPageChange:       handlePageChange,
    onMovieSelect:      handleMovieSelect,
  };

  return (
    <>
      {activePage === 'home'        && <Home {...sharedProps} />}
      {activePage === 'search'      && <Search {...sharedProps} />}
      {activePage === 'profile'     && <Profile {...sharedProps} />}
      {activePage === 'movieDetail' && <MovieDetail {...sharedProps} movieId={selectedMovieId} />}

      <ListModal
        isOpen={listModalMovieId !== null}
        onClose={() => setListModalMovieId(null)}
        movieId={listModalMovieId}
        userLists={userLists}
        onAddToList={handleAddToList}
        onCreateList={handleCreateList}
      />
    </>
  );
}

export default App;
