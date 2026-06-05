import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Eye, Heart, Send, ListPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { USER_ID } from '../lib/userId';
import Navbar from '../components/Navbar';

const StarRating = ({ movieId, userRating = 0, onRate }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => onRate(movieId, star === userRating ? 0 : star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none"
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              (hovered > 0 ? hovered : userRating) >= star
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const MovieDetail = ({ movieId, movies, onWatched, onFavorite, onRate, onOpenListModal, activePage, onPageChange }) => {
  const [detail, setDetail]           = useState(null);
  const [genres, setGenres]           = useState([]);
  const [reviews, setReviews]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [newReview, setNewReview]     = useState('');
  const [submitting, setSubmitting]   = useState(false);

  const enriched = movies.find(m => m.movie_id === movieId) || {};

  useEffect(() => {
    if (movieId) fetchDetail();
  }, [movieId]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const [
        { data: movieData },
        { data: reviewsData },
      ] = await Promise.all([
        supabase
          .from('movies')
          .select('*, movie_genres(genres(name))')
          .eq('movie_id', movieId)
          .single(),
        supabase
          .from('reviews')
          .select('*')
          .eq('movie_id', movieId)
          .order('created_at', { ascending: false }),
      ]);

      if (movieData) {
        setDetail(movieData);
        const joined = (movieData.movie_genres || [])
          .map(mg => mg.genres?.name)
          .filter(Boolean);
        setGenres(joined);
      }

      setReviews(reviewsData || []);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async () => {
    if (!newReview.trim()) return;
    setSubmitting(true);
    const { data, error } = await supabase
      .from('reviews')
      .insert({ user_id: USER_ID, movie_id: movieId, content: newReview.trim() })
      .select()
      .single();

    if (!error && data) {
      setReviews(prev => [data, ...prev]);
      setNewReview('');
    }
    if (error) console.error('reviews hatası:', error.message);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center">
          <p className="text-gray-500">Film bulunamadı.</p>
          <button onClick={() => onPageChange('home')} className="mt-4 text-sm text-blue-500 hover:underline">
            Ana sayfaya dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700 p-6 lg:p-10 flex items-start justify-center">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <Navbar activePage={activePage} onPageChange={onPageChange} />

        <div className="px-8 pt-2 pb-0">
          <button
            onClick={() => onPageChange('home')}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Ana sayfaya dön
          </button>
        </div>

        {/* Hero */}
        <div className="flex flex-col md:flex-row gap-8 px-8 py-8">
          <div className="flex-shrink-0">
            <img
              src={detail.poster_url}
              alt={detail.title}
              className="w-52 h-72 object-cover rounded-2xl shadow-xl"
              onError={e => { e.target.src = 'https://placehold.co/208x288?text=?'; }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-1 leading-tight">{detail.title}</h1>

            {detail.director && (
              <p className="text-gray-500 text-sm mb-3">
                Yönetmen: <span className="font-semibold text-gray-700">{detail.director}</span>
              </p>
            )}

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-amber-600">
                  {detail.average_rating ?? '—'}
                </span>
                <span className="text-xs text-amber-500">/ 10</span>
              </div>
              {detail.release_year && (
                <span className="text-sm text-gray-400">{detail.release_year}</span>
              )}
            </div>

            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {genres.map(g => (
                  <span key={g} className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full">
                    {g}
                  </span>
                ))}
              </div>
            )}

            {detail.description && (
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{detail.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              {enriched.watched ? (
                <span className="flex items-center gap-2 bg-green-100 text-green-600 text-sm font-medium px-5 py-2.5 rounded-full">
                  <Eye className="w-4 h-4" />
                  İzlendi ✓
                </span>
              ) : (
                <button
                  onClick={() => onWatched(movieId)}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  İzlendi
                </button>
              )}

              <button
                onClick={() => onFavorite(movieId)}
                className={`flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full transition-colors ${
                  enriched.isFavorite
                    ? 'bg-red-100 text-red-500'
                    : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${enriched.isFavorite ? 'fill-red-500' : ''}`} />
                {enriched.isFavorite ? 'Favorilerde' : 'Favorile'}
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Puanın:</span>
                <StarRating movieId={movieId} userRating={enriched.userRating || 0} onRate={onRate} />
              </div>

              {onOpenListModal && (
                <button
                  onClick={() => onOpenListModal(movieId)}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
                >
                  <ListPlus className="w-4 h-4" />
                  Listeye Ekle
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Yorumlar */}
        <div className="border-t border-gray-100 px-8 py-6">
          <h2 className="text-lg font-bold text-gray-800 mb-5">
            Yorumlar
            {reviews.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-400">({reviews.length})</span>
            )}
          </h2>

          <div className="flex gap-3 mb-8">
            <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">BC</span>
            </div>
            <div className="flex-1">
              <textarea
                value={newReview}
                onChange={e => setNewReview(e.target.value)}
                placeholder="Bu film hakkında ne düşünüyorsun?"
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400 resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleAddReview}
                  disabled={submitting || !newReview.trim()}
                  className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 disabled:opacity-40 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Gönder
                </button>
              </div>
            </div>
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-5">
              {reviews.map(review => (
                <div key={review.review_id} className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 text-xs font-bold">K</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-700">Kullanıcı</span>
                      <span className="text-xs text-gray-400">
                        {new Date(review.created_at).toLocaleDateString('tr-TR', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-6">
              Henüz yorum yok. İlk yorumu sen yaz!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
