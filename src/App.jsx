import { useState, useEffect, useCallback } from 'react';
import Home        from './pages/Home';
import Profile     from './pages/Profile';
import MovieDetail from './pages/MovieDetail';
import Search      from './pages/Search';
import Login       from './pages/Login';
import SignUp      from './pages/SignUp';
import ListModal   from './components/ListModal';
import { supabase }               from './lib/supabase';
import { getStoredUser, clearUser } from './lib/auth';

function App() {
  // ── Auth state ────────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [authScreen, setAuthScreen]   = useState('login'); // 'login' | 'signup'

  // ── App state ─────────────────────────────────────────────────────────────
  const [activePage, setActivePage]             = useState('home');
  const [selectedMovieId, setSelectedMovieId]   = useState(null);
  const [movies, setMovies]                     = useState([]);
  const [userLists, setUserLists]               = useState([]);
  const [listModalMovieId, setListModalMovieId] = useState(null);
  const [loading, setLoading]                   = useState(false);
  const [error, setError]                       = useState(null);

  // ── Navigation ────────────────────────────────────────────────────────────
  const handlePageChange = (page) => {
    setActivePage(page);
    if (page !== 'movieDetail') setSelectedMovieId(null);
  };
  const handleMovieSelect = (id) => {
    setSelectedMovieId(id);
    setActivePage('movieDetail');
  };

  // ── Fetch all data for the logged-in user ─────────────────────────────────
  const fetchAllData = useCallback(async (uid) => {
    try {
      setLoading(true);
      setError(null);

      const [
        { data: moviesData,    error: moviesErr },
        { data: favoritesData },
        { data: watchedData },
        { data: ratingsData },
        { data: listsData },
      ] = await Promise.all([
        supabase.from('movies').select('*, movie_genres(genres(name))').order('movie_id', { ascending: false }),
        supabase.from('favorites').select('movie_id').eq('user_id', uid),
        supabase.from('watched_movies').select('movie_id').eq('user_id', uid),
        supabase.from('ratings').select('movie_id, score').eq('user_id', uid),
        supabase.from('user_lists').select('*, user_list_movies(movie_id)').eq('user_id', uid).order('created_at', { ascending: false }),
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
      console.error('Data fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch whenever the logged-in user changes
  useEffect(() => {
    if (currentUser) {
      fetchAllData(currentUser.user_id);
    }
  }, [currentUser, fetchAllData]);

  // ── Auth handlers ─────────────────────────────────────────────────────────
  const handleLogin = (user) => {
    setCurrentUser(user);
    setActivePage('home');
    setSelectedMovieId(null);
  };

  const handleLogout = () => {
    clearUser();
    setCurrentUser(null);
    setMovies([]);
    setUserLists([]);
    setActivePage('home');
    setSelectedMovieId(null);
    setListModalMovieId(null);
  };

  // ── Watched / Favorite / Rate ─────────────────────────────────────────────
  const uid = currentUser?.user_id;

  const handleWatched = async (id) => {
    setMovies(prev => prev.map(m => m.movie_id === id ? { ...m, watched: true } : m));
    const { error } = await supabase
      .from('watched_movies')
      .upsert({ user_id: uid, movie_id: id }, { onConflict: 'user_id,movie_id' });
    if (error) console.error('watched_movies error:', error.message);
  };

  const handleFavorite = async (id) => {
    const movie = movies.find(m => m.movie_id === id);
    if (!movie) return;
    const newVal = !movie.isFavorite;
    setMovies(prev => prev.map(m => m.movie_id === id ? { ...m, isFavorite: newVal } : m));

    if (movie.isFavorite) {
      const { error } = await supabase.from('favorites').delete().eq('user_id', uid).eq('movie_id', id);
      if (error) {
        console.error('favorites delete error:', error.message);
        setMovies(prev => prev.map(m => m.movie_id === id ? { ...m, isFavorite: true } : m));
      }
    } else {
      const { error } = await supabase.from('favorites').insert({ user_id: uid, movie_id: id });
      if (error) {
        console.error('favorites insert error:', error.message);
        setMovies(prev => prev.map(m => m.movie_id === id ? { ...m, isFavorite: false } : m));
      }
    }
  };

  const handleRate = async (id, userRating) => {
    setMovies(prev => prev.map(m => m.movie_id === id ? { ...m, userRating } : m));
    const { error } = await supabase
      .from('ratings')
      .upsert({ user_id: uid, movie_id: id, score: userRating }, { onConflict: 'user_id,movie_id' });
    if (error) console.error('ratings error:', error.message);
  };

  // ── User Lists ────────────────────────────────────────────────────────────
  const handleCreateList = async (name, movieId) => {
    const { data, error } = await supabase
      .from('user_lists')
      .insert({ user_id: uid, name, is_public: true })
      .select()
      .single();

    if (error) { console.error('user_lists error:', error.message); return; }

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
      const { error } = await supabase
        .from('user_list_movies')
        .delete().eq('list_id', listId).eq('movie_id', movieId);
      if (!error) {
        setUserLists(prev => prev.map(l => {
          if (l.list_id !== listId) return l;
          const ids = new Set(l.movieIds); ids.delete(movieId);
          return { ...l, movieIds: ids };
        }));
      }
    } else {
      const { error } = await supabase
        .from('user_list_movies')
        .insert({ list_id: listId, movie_id: movieId, position: list.movieIds.size + 1 });
      if (!error) {
        setUserLists(prev => prev.map(l => {
          if (l.list_id !== listId) return l;
          const ids = new Set(l.movieIds); ids.add(movieId);
          return { ...l, movieIds: ids };
        }));
      }
    }
  };

  // ── Auth gates ────────────────────────────────────────────────────────────
  if (!currentUser) {
    return authScreen === 'login'
      ? <Login  onLogin={handleLogin} onGoSignUp={() => setAuthScreen('signup')} />
      : <SignUp onLogin={handleLogin} onGoLogin={() => setAuthScreen('login')}  />;
  }

  // ── Loading / Error ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="page-bg flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: 'rgba(156,129,129,0.3)', borderTopColor: '#9C8181' }}
          />
          <p className="text-sm font-medium" style={{ color: '#9C8181' }}>Loading your films…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-bg flex items-center justify-center">
        <div className="rounded-2xl p-8 max-w-md w-full mx-4 text-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}>
          <p className="font-bold text-lg mb-2" style={{ color: '#c0605a' }}>Connection Error</p>
          <p className="text-sm mb-6 break-all text-gray-500">{error}</p>
          <button
            onClick={() => fetchAllData(uid)}
            className="text-white px-6 py-2 rounded-full text-sm font-medium transition-all"
            style={{ backgroundColor: '#9C8181' }}
            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  const navbarProps  = { activePage, onPageChange: handlePageChange, currentUser, onLogout: handleLogout };
  const sharedProps  = {
    movies, userLists,
    onWatched:       handleWatched,
    onRate:          handleRate,
    onFavorite:      handleFavorite,
    onOpenListModal: setListModalMovieId,
    onMovieSelect:   handleMovieSelect,
    ...navbarProps,
  };

  return (
    <>
      {activePage === 'home'        && <Home        {...sharedProps} />}
      {activePage === 'search'      && <Search      {...sharedProps} />}
      {activePage === 'profile'     && <Profile     {...sharedProps} currentUser={currentUser} />}
      {activePage === 'movieDetail' && <MovieDetail {...sharedProps} movieId={selectedMovieId} userId={uid} />}

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
