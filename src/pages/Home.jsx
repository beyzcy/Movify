import React from 'react';
import Navbar from '../components/Navbar';
import FavoriteMovies from '../components/FavoriteMovies';
import FilmList from '../components/FilmList';

const Home = ({ movies, onWatched, onDelete, onEdit, onRate, onFavorite, activePage, onPageChange, onOpenForm, onMovieSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700 p-6 lg:p-10 flex items-start justify-center">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <Navbar onOpenForm={onOpenForm} activePage={activePage} onPageChange={onPageChange} />

        <FavoriteMovies movies={movies} />

        <FilmList
          movies={movies}
          onWatched={onWatched}
          onDelete={onDelete}
          onEdit={onEdit}
          onRate={onRate}
          onFavorite={onFavorite}
          onMovieSelect={onMovieSelect}
        />
      </div>
    </div>
  );
};

export default Home;
