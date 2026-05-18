import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Profile from './pages/Profile';
import FilmForm from './components/FilmForm';

const DEFAULT_MOVIES = [
  {
    id: '1',
    title: 'The Adventure of Blue Sword',
    genre: 'Adventure',
    year: 2023,
    rating: 8.5,
    description: 'An epic journey through magical landscapes',
    poster: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=400&fit=crop',
    watched: false,
    userRating: 0,
    isFavorite: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Recalling the Journey of Dol',
    genre: 'Animation',
    year: 2023,
    rating: 7.8,
    description: 'A heartwarming tale of friendship',
    poster: 'https://images.unsplash.com/photo-1533066481125-ec8e6e1ab2f0?w=300&h=400&fit=crop',
    watched: false,
    userRating: 0,
    isFavorite: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Loetoeng Kasarung',
    genre: 'Animation',
    year: 2023,
    rating: 7.8,
    description: 'A classic folklore reimagined',
    poster: 'https://images.unsplash.com/photo-1527549993586-dff825b37782?w=300&h=400&fit=crop',
    watched: false,
    userRating: 0,
    isFavorite: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Gajah Langka',
    genre: 'Adventure',
    year: 2023,
    rating: 6.0,
    description: 'A rare elephant on an adventure',
    poster: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=300&h=400&fit=crop',
    watched: false,
    userRating: 0,
    isFavorite: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Si Kang Satay',
    genre: 'Drama',
    year: 2023,
    rating: 7.1,
    description: 'A young cook chasing his culinary dream',
    poster: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=400&fit=crop',
    watched: false,
    userRating: 0,
    isFavorite: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    title: 'Mommy Cat',
    genre: 'Animation',
    year: 2023,
    rating: 7.8,
    description: 'A mother cat and her kittens face the world',
    poster: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=400&fit=crop',
    watched: false,
    userRating: 0,
    isFavorite: false,
    createdAt: new Date().toISOString()
  }
];

function App() {
  const [activePage, setActivePage] = useState('home');
  const [movies, setMovies] = useState(() => {
    try {
      const saved = localStorage.getItem('movies');
      if (saved) {
        const parsed = JSON.parse(saved);
        // migrate: add missing fields for older saved data
        return parsed.map(m => ({ userRating: 0, isFavorite: false, ...m }));
      }
      return DEFAULT_MOVIES;
    } catch {
      return DEFAULT_MOVIES;
    }
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  useEffect(() => {
    localStorage.setItem('movies', JSON.stringify(movies));
  }, [movies]);

  const handleAddMovie = (movieData) => {
    if (editingMovie) {
      setMovies(prev => prev.map(m =>
        m.id === editingMovie.id ? { ...editingMovie, ...movieData } : m
      ));
      setEditingMovie(null);
    } else {
      setMovies(prev => [...prev, {
        id: Date.now().toString(),
        ...movieData,
        userRating: 0,
        isFavorite: false,
        createdAt: new Date().toISOString()
      }]);
    }
    setIsFormOpen(false);
  };

  const handleWatched = (id) => {
    setMovies(prev => prev.map(m => m.id === id ? { ...m, watched: true } : m));
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu filmi silmek istediğinden emin misin?')) {
      setMovies(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setIsFormOpen(true);
  };

  const handleRate = (id, userRating) => {
    setMovies(prev => prev.map(m => m.id === id ? { ...m, userRating } : m));
  };

  const handleFavorite = (id) => {
    setMovies(prev => prev.map(m => m.id === id ? { ...m, isFavorite: !m.isFavorite } : m));
  };

  const sharedProps = {
    movies,
    onWatched: handleWatched,
    onDelete: handleDelete,
    onEdit: handleEdit,
    onRate: handleRate,
    onFavorite: handleFavorite,
    activePage,
    onPageChange: setActivePage,
    onOpenForm: () => setIsFormOpen(true),
  };

  return (
    <>
      {activePage === 'home'
        ? <Home {...sharedProps} />
        : <Profile {...sharedProps} />
      }
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
