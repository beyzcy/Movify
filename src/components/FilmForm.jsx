import React, { useState, useEffect } from 'react';

const GENRES = ["Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi", "Animation", "Thriller", "Documentary", "Adventure"];

const FilmForm = ({ isOpen, onClose, onSubmit, editingMovie }) => {
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    genre: 'Action',
    year: new Date().getFullYear(),
    rating: 7.5,
    description: '',
    poster: ''
  });

  useEffect(() => {
    if (editingMovie) {
      setFormData({
        title:       editingMovie.title,
        director:    editingMovie.director || '',
        genre:       editingMovie.genre,
        year:        editingMovie.year,
        rating:      editingMovie.rating,
        description: editingMovie.description,
        poster:      editingMovie.poster
      });
    } else {
      setFormData({
        title: '',
        director: '',
        genre: 'Action',
        year: new Date().getFullYear(),
        rating: 7.5,
        description: '',
        poster: ''
      });
    }
  }, [editingMovie, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'rating' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      watched: editingMovie?.watched || false
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 max-w-2xl w-full mx-4 border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">
            {editingMovie ? 'Edit Movie' : 'Add New Movie'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">Movie Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="Enter movie title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">Director</label>
            <input
              type="text"
              name="director"
              value={formData.director}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="Enter director name"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">Genre *</label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                {GENRES.map(g => <option key={g} value={g} className="bg-slate-900">{g}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">Year *</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear()}
                required
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Rating (0-10): <span className="text-yellow-400 font-bold">{formData.rating.toFixed(1)}</span>
            </label>
            <input
              type="range"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="0"
              max="10"
              step="0.1"
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Enter movie description"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">Poster Image URL *</label>
            <input
              type="url"
              name="poster"
              value={formData.poster}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="https://example.com/poster.jpg"
            />
            {formData.poster && (
              <div className="mt-3 rounded-lg overflow-hidden border border-white/20">
                <img
                  src={formData.poster}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => { e.target.src = 'https://placehold.co/300x400?text=Invalid+URL'; }}
                />
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors border border-white/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all"
            >
              {editingMovie ? 'Update Movie' : 'Add Movie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilmForm;
