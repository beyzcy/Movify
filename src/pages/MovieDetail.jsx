import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Eye, Heart, Send, ListPlus, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';

/* ── Star rating ────────────────────────────────────────────────────── */
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
            className="w-6 h-6 transition-colors"
            style={(hovered > 0 ? hovered : userRating) >= star
              ? { fill: '#f59e0b', color: '#f59e0b' }
              : { color: '#d4c9c9' }}
          />
        </button>
      ))}
    </div>
  );
};

/* ── MovieDetail ────────────────────────────────────────────────────── */
const MovieDetail = ({ movieId, userId, movies, onWatched, onFavorite, onRate, onOpenListModal, activePage, onPageChange, currentUser, onLogout }) => {
  const [detail, setDetail]         = useState(null);
  const [genres, setGenres]         = useState([]);
  const [reviews, setReviews]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [newReview, setNewReview]   = useState('');
  const [submitting, setSubmitting] = useState(false);

  const enriched = movies.find(m => m.movie_id === movieId) || {};

  useEffect(() => { if (movieId) fetchDetail(); }, [movieId]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const [{ data: movieData }, { data: reviewsData }] = await Promise.all([
        supabase.from('movies').select('*, movie_genres(genres(name))').eq('movie_id', movieId).single(),
        supabase.from('reviews').select('*').eq('movie_id', movieId).order('created_at', { ascending: false }),
      ]);
      if (movieData) {
        setDetail(movieData);
        setGenres((movieData.movie_genres || []).map(mg => mg.genres?.name).filter(Boolean));
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
      .insert({ user_id: userId, movie_id: movieId, content: newReview.trim() })
      .select().single();
    if (!error && data) { setReviews(prev => [data, ...prev]); setNewReview(''); }
    if (error) console.error('reviews error:', error.message);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="page-bg flex items-center justify-center">
        <div
          className="w-8 h-8 border-4 rounded-full animate-spin"
          style={{ borderColor: 'rgba(156,129,129,0.3)', borderTopColor: '#9C8181' }}
        />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="page-bg flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4" style={{ color: '#9C8181' }}>Film not found.</p>
          <button
            onClick={() => onPageChange('home')}
            className="text-sm underline"
            style={{ color: '#1A1A24' }}
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-bg">
      <div className="max-w-6xl mx-auto">
        <Navbar activePage={activePage} onPageChange={onPageChange} currentUser={currentUser} onLogout={onLogout} />

        <div className="px-6 lg:px-10 pb-12 animate-fadeIn">

          {/* ── Back ───────────────────────────────────────────────── */}
          <button
            onClick={() => onPageChange('home')}
            className="flex items-center gap-2 text-sm mb-6 transition-colors"
            style={{ color: '#9C8181' }}
            onMouseEnter={e => e.currentTarget.style.color = '#1A1A24'}
            onMouseLeave={e => e.currentTarget.style.color = '#9C8181'}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          {/* ── Hero ───────────────────────────────────────────────── */}
          <div
            className="flex flex-col md:flex-row gap-8 p-8 rounded-3xl mb-6"
            style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
          >
            {/* Poster */}
            <div className="flex-shrink-0">
              <img
                src={detail.poster_url}
                alt={detail.title}
                className="w-48 object-cover rounded-2xl shadow-lg"
                style={{ height: '288px' }}
                onError={e => { e.target.src = 'https://placehold.co/192x288?text=?'; }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-black mb-1 leading-tight" style={{ color: '#1A1A24' }}>
                {detail.title}
              </h1>

              {detail.director && (
                <p className="text-sm mb-4" style={{ color: '#9C8181' }}>
                  Directed by <span className="font-semibold" style={{ color: '#1A1A24' }}>{detail.director}</span>
                </p>
              )}

              <div className="flex items-center gap-3 mb-4">
                {detail.average_rating && (
                  <div
                    className="flex items-center gap-1.5 rounded-xl px-3 py-1.5"
                    style={{ backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
                  >
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-amber-600">{detail.average_rating}</span>
                    <span className="text-xs text-amber-400">/ 10</span>
                  </div>
                )}
                {detail.release_year && (
                  <span
                    className="text-sm px-3 py-1.5 rounded-xl"
                    style={{ backgroundColor: 'rgba(156,129,129,0.1)', color: '#9C8181' }}
                  >
                    {detail.release_year}
                  </span>
                )}
              </div>

              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {genres.map(g => (
                    <span
                      key={g}
                      className="text-xs font-medium px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: 'rgba(129,156,156,0.15)', color: '#819C9C' }}
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}

              {detail.description && (
                <p className="text-sm leading-relaxed mb-6 text-gray-500">{detail.description}</p>
              )}

              {/* ── Action buttons ─────────────────────────────────── */}
              <div className="flex flex-wrap items-center gap-3">
                {enriched.watched ? (
                  <span
                    className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-full"
                    style={{ backgroundColor: '#819C81' }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Watched
                  </span>
                ) : (
                  <button
                    onClick={() => onWatched(movieId)}
                    className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200"
                    style={{ backgroundColor: '#819C81' }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
                  >
                    <Eye className="w-4 h-4" />
                    Mark as Watched
                  </button>
                )}

                <button
                  onClick={() => onFavorite(movieId)}
                  className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 border"
                  style={enriched.isFavorite
                    ? { backgroundColor: '#fef2f2', color: '#ef4444', borderColor: '#fecaca' }
                    : { backgroundColor: 'rgba(255,255,255,0.7)', color: '#1A1A24', borderColor: 'rgba(156,129,129,0.3)' }}
                >
                  <Heart className={`w-4 h-4 ${enriched.isFavorite ? 'fill-red-400 text-red-400' : ''}`} />
                  {enriched.isFavorite ? 'Favorited' : 'Add to Favorites'}
                </button>

                {onOpenListModal && (
                  <button
                    onClick={() => onOpenListModal(movieId)}
                    className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200"
                    style={{ backgroundColor: '#819C9C' }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
                  >
                    <ListPlus className="w-4 h-4" />
                    Add to List
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: '#9C8181' }}>Your rating:</span>
                  <StarRating movieId={movieId} userRating={enriched.userRating || 0} onRate={onRate} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Reviews ────────────────────────────────────────────── */}
          <div
            className="rounded-3xl p-8"
            style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
          >
            <h2 className="text-lg font-bold mb-6" style={{ color: '#1A1A24' }}>
              Reviews
              {reviews.length > 0 && (
                <span className="ml-2 text-sm font-normal" style={{ color: '#9C8181' }}>
                  ({reviews.length})
                </span>
              )}
            </h2>

            {/* Write review */}
            <div className="flex gap-3 mb-8">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#1A1A24' }}
              >
                <span className="text-white text-xs font-bold">BC</span>
              </div>
              <div className="flex-1">
                <textarea
                  value={newReview}
                  onChange={e => setNewReview(e.target.value)}
                  placeholder="What did you think of this film?"
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl text-sm placeholder-gray-400 focus:outline-none resize-none transition-all"
                  style={{
                    backgroundColor: '#EDE8E8',
                    border: '1.5px solid rgba(156,129,129,0.2)',
                    color: '#1A1A24',
                  }}
                  onFocus={e => e.target.style.borderColor = '#9C8181'}
                  onBlur={e => e.target.style.borderColor = 'rgba(156,129,129,0.2)'}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAddReview}
                    disabled={submitting || !newReview.trim()}
                    className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 disabled:opacity-40"
                    style={{ backgroundColor: '#9C8181' }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
                  >
                    <Send className="w-3.5 h-3.5" />
                    Post
                  </button>
                </div>
              </div>
            </div>

            {/* Review list */}
            {reviews.length > 0 ? (
              <div className="space-y-5">
                {reviews.map(review => (
                  <div key={review.review_id} className="flex gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(156,129,129,0.15)' }}
                    >
                      <span className="text-xs font-bold" style={{ color: '#9C8181' }}>U</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold" style={{ color: '#1A1A24' }}>User</span>
                        <span className="text-xs text-gray-400">
                          {new Date(review.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-500">{review.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-center py-8" style={{ color: '#9C8181' }}>
                No reviews yet. Be the first!
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
