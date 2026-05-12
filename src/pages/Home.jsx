import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import Navbar from '../components/Navbar';
import FilmForm from '../components/FilmForm';
import FilmList from '../components/FilmList';

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
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Loetoeng Kasarung',
    genre: 'Animation',
    year: 2023,
    rating: 7.8,
    description: 'A classic Indonesian folklore reimagined',
    poster: 'https://images.unsplash.com/photo-1527549993586-dff825b37782?w=300&h=400&fit=crop',
    watched: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Gajah Langka',
    genre: 'Animation',
    year: 2023,
    rating: 6.0,
    description: 'A rare elephant on an adventure',
    poster: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=300&h=400&fit=crop',
    watched: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Si Kang Satay',
    genre: 'Animation',
    year: 2023,
    rating: 7.1,
    description: 'A young cook chasing his culinary dream',
    poster: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=400&fit=crop',
    watched: false,
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
    createdAt: new Date().toISOString()
  }
];

const HeroCard = ({ movie, gradient }) => (
  <div className="relative rounded-2xl overflow-hidden cursor-pointer group" style={{ height: '210px' }}>
    <div
      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
      style={{ backgroundImage: `url(${movie.poster})` }}
    />
    <div className={`absolute inset-0 ${gradient}`} />
    <div className="absolute inset-0 flex flex-col justify-end p-6">
      <h2 className="text-xl font-bold text-white mb-3 leading-tight" style={{ maxWidth: '60%' }}>
        {movie.title}
      </h2>
      <button className="flex items-center gap-2.5 text-white text-sm font-medium w-fit">
        <div className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
          <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
        </div>
        Let Play Movie
      </button>
    </div>
  </div>
);

const Home = () => {
  const [movies, setMovies] = useState(() => {
    try {
      const saved = localStorage.getItem('movies');
      return saved ? JSON.parse(saved) : DEFAULT_MOVIES;
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
        createdAt: new Date().toISOString()
      }]);
    }
    setIsFormOpen(false);
  };

  const handleWatched = (id) => {
    setMovies(prev => prev.map(m => m.id === id ? { ...m, watched: true } : m));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this movie?')) {
      setMovies(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setIsFormOpen(true);
  };

  const featuredMovies = movies.slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700 p-6 lg:p-10 flex items-start justify-center">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <Navbar onOpenForm={() => setIsFormOpen(true)} />

        {/* Hero */}
        <div className="px-8 pb-6">
          <div className="grid grid-cols-2 gap-4">
            {featuredMovies[0] && (
              <HeroCard
                movie={featuredMovies[0]}
                gradient="bg-gradient-to-r from-black/75 via-black/40 to-transparent"
              />
            )}
            {featuredMovies[1] && (
              <HeroCard
                movie={featuredMovies[1]}
                gradient="bg-gradient-to-r from-blue-900/75 via-blue-800/40 to-transparent"
              />
            )}
          </div>
        </div>

        {/* Film list with category tabs */}
        <FilmList
          movies={movies}
          onWatched={handleWatched}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>

      <FilmForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingMovie(null); }}
        onSubmit={handleAddMovie}
        editingMovie={editingMovie}
      />
    </div>
  );
};

export default Home;
