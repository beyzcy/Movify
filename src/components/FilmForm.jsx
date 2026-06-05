import React, { useState, useEffect } from 'react';

const FilmForm = ({ isOpen, onClose, onSubmit, editingMovie, genres = [] }) => {
  const [formData, setFormData] = useState({
    title:        '',
    director:     '',
    genre_id:     '',
    release_year: new Date().getFullYear(),
    description:  '',
    poster_url:   '',
  });

  useEffect(() => {
    if (editingMovie) {
      // Mevcut filmin genre_id'sini bul
      const firstGenre = (editingMovie.movie_genres || [])[0];
      const currentGenreId = firstGenre
        ? genres.find(g => g.name === firstGenre.genres?.name)?.genre_id ?? ''
        : '';

      setFormData({
        title:        editingMovie.title        || '',
        director:     editingMovie.director     || '',
        genre_id:     currentGenreId,
        release_year: editingMovie.release_year || new Date().getFullYear(),
        description:  editingMovie.description  || '',
        poster_url:   editingMovie.poster_url   || '',
      });
    } else {
      setFormData({
        title:        '',
        director:     '',
        genre_id:     genres[0]?.genre_id ?? '',
        release_year: new Date().getFullYear(),
        description:  '',
        poster_url:   '',
      });
    }
  }, [editingMovie, isOpen, genres]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'release_year' ? parseInt(value) : name === 'genre_id' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 max-w-2xl w-full mx-4 border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">
            {editingMovie ? 'Filmi Düzenle' : 'Yeni Film Ekle'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">Film Adı *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="Film adını girin"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">Yönetmen</label>
            <input
              type="text"
              name="director"
              value={formData.director}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="Yönetmen adını girin"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">Tür</label>
              <select
                name="genre_id"
                value={formData.genre_id}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="" className="bg-slate-900">— Seç —</option>
                {genres.map(g => (
                  <option key={g.genre_id} value={g.genre_id} className="bg-slate-900">{g.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">Yapım Yılı *</label>
              <input
                type="number"
                name="release_year"
                value={formData.release_year}
                onChange={handleChange}
                min="1888"
                max={new Date().getFullYear()}
                required
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">Açıklama</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Film hakkında kısa açıklama"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">Poster URL *</label>
            <input
              type="url"
              name="poster_url"
              value={formData.poster_url}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="https://example.com/poster.jpg"
            />
            {formData.poster_url && (
              <div className="mt-3 rounded-lg overflow-hidden border border-white/20">
                <img
                  src={formData.poster_url}
                  alt="Önizleme"
                  className="w-full h-48 object-cover"
                  onError={(e) => { e.target.src = 'https://placehold.co/300x400?text=Geçersiz+URL'; }}
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
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all"
            >
              {editingMovie ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilmForm;
