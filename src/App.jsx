import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Profile from './pages/Profile';
import MovieDetail from './pages/MovieDetail';
import FilmForm from './components/FilmForm';
import { supabase } from './lib/supabase';
import { USER_ID } from './lib/userId';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const handlePageChange = (page) => {
    setActivePage(page);
    if (page !== 'movieDetail') setSelectedMovieId(null);
  };

  const handleMovieSelect = (id) => {
    setSelectedMovieId(id);
    setActivePage('movieDetail');
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        { data: moviesData, error: moviesErr },
        { data: favoritesData },
        { data: watchedData },
        { data: ratingsData },
      ] = await Promise.all([
        supabase.from('movies').select('*').order('created_at', { ascending: false }),
        supabase.from('favorites').select('movie_id').eq('user_id', USER_ID),
        supabase.from('watched_movies').select('movie_id').eq('user_id', USER_ID),
        supabase.from('ratings').select('movie_id, rating').eq('user_id', USER_ID),
      ]);

      if (moviesErr) throw moviesErr;

      const favoriteIds = new Set((favoritesData || []).map(f => f.movie_id));
      const watchedIds  = new Set((watchedData  || []).map(w => w.movie_id));
      const ratingsMap  = Object.fromEntries((ratingsData || []).map(r => [r.movie_id, r.rating]));

      setMovies(
        (moviesData || []).map(m => ({
          ...m,
          isFavorite: favoriteIds.has(m.id),
          watched:    watchedIds.has(m.id),
          userRating: ratingsMap[m.id] ?? 0,
        }))
      );
    } catch (err) {
      console.error('Supabase veri çekme hatası:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── CRUD ─────────────────────────────────────────────────────────────────

  const handleAddMovie = async (movieData) => {
    if (editingMovie) {
      const { data, error } = await supabase
        .from('movies')
        .update({
          title:       movieData.title,
          genre:       movieData.genre,
          year:        movieData.year,
          rating:      movieData.rating,
          description: movieData.description,
          poster:      movieData.poster,
          director:    movieData.director,
        })
        .eq('id', editingMovie.id)
        .select()
        .single();

      if (!error && data) {
        setMovies(prev => prev.map(m =>
          m.id === editingMovie.id
            ? { ...data, isFavorite: m.isFavorite, watched: m.watched, userRating: m.userRating }
            : m
        ));
      }
      setEditingMovie(null);
    } else {
      const { data, error } = await supabase
        .from('movies')
        .insert({
          title:       movieData.title,
          genre:       movieData.genre,
          year:        movieData.year,
          rating:      movieData.rating,
          description: movieData.description,
          poster:      movieData.poster,
          director:    movieData.director,
        })
        .select()
        .single();

      if (!error && data) {
        setMovies(prev => [{ ...data, isFavorite: false, watched: false, userRating: 0 }, ...prev]);
      }
    }
    setIsFormOpen(false);
  };

  const handleWatched = async (id) => {
    const { error } = await supabase
      .from('watched_movies')
      .upsert({ user_id: USER_ID, movie_id: id }, { onConflict: 'user_id,movie_id' });

    if (!error) {
      setMovies(prev => prev.map(m => m.id === id ? { ...m, watched: true } : m));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu filmi silmek istediğinden emin misin?')) return;

    const { error } = await supabase.from('movies').delete().eq('id', id);

    if (!error) {
      setMovies(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setIsFormOpen(true);
  };

  const handleFavorite = async (id) => {
    const movie = movies.find(m => m.id === id);
    if (!movie) return;

    if (movie.isFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', USER_ID)
        .eq('movie_id', id);

      if (!error) {
        setMovies(prev => prev.map(m => m.id === id ? { ...m, isFavorite: false } : m));
      }
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: USER_ID, movie_id: id });

      if (!error) {
        setMovies(prev => prev.map(m => m.id === id ? { ...m, isFavorite: true } : m));
      }
    }
  };

  const handleRate = async (id, userRating) => {
    const { error } = await supabase
      .from('ratings')
      .upsert(
        { user_id: USER_ID, movie_id: id, rating: userRating },
        { onConflict: 'user_id,movie_id' }
      );

    if (!error) {
      setMovies(prev => prev.map(m => m.id === id ? { ...m, userRating } : m));
    }
  };

  // ── Loading / Error ekranları ─────────────────────────────────────────────

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
          <button
            onClick={fetchAllData}
            className="bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const sharedProps = {
    movies,
    onWatched:     handleWatched,
    onDelete:      handleDelete,
    onEdit:        handleEdit,
    onRate:        handleRate,
    onFavorite:    handleFavorite,
    activePage,
    onPageChange:  handlePageChange,
    onOpenForm:    () => setIsFormOpen(true),
    onMovieSelect: handleMovieSelect,
  };

  return (
    <>
      {activePage === 'home' && <Home {...sharedProps} />}
      {activePage === 'profile' && <Profile {...sharedProps} />}
      {activePage === 'movieDetail' && (
        <MovieDetail {...sharedProps} movieId={selectedMovieId} />
      )}
      <FilmForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingMovie(null); }}
        onSubmit={handleAddMovie}
        editingMovie={editingMovie}
      />
    </>
  );
}

export default App;
