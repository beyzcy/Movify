import React from 'react';
import { List, Film, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import FilmCard from '../components/FilmCard';

/* ── Stat card ──────────────────────────────────────────────────────── */
const StatCard = ({ value, label, valueColor, bg }) => (
  <div className="rounded-2xl p-5" style={{ backgroundColor: bg }}>
    <p className="text-3xl font-extrabold" style={{ color: valueColor }}>{value}</p>
    <p className="text-sm mt-1" style={{ color: '#6b7280' }}>{label}</p>
  </div>
);

/* ── Section header ─────────────────────────────────────────────────── */
const SectionHeader = ({ icon, title, count }) => (
  <div className="flex items-center gap-2 mb-5">
    {icon}
    <h3 className="text-lg font-bold" style={{ color: '#1A1A24' }}>{title}</h3>
    {count != null && (
      <span
        className="text-xs px-2.5 py-1 rounded-full font-medium"
        style={{ backgroundColor: 'rgba(156,129,129,0.15)', color: '#9C8181' }}
      >
        {count}
      </span>
    )}
  </div>
);

/* ── Empty state ────────────────────────────────────────────────────── */
const Empty = ({ icon, title, sub }) => (
  <div
    className="flex flex-col items-center justify-center py-10 text-center rounded-2xl"
    style={{ backgroundColor: 'rgba(255,255,255,0.45)' }}
  >
    <div className="mb-3" style={{ color: '#c4b8b8' }}>{icon}</div>
    <p className="text-sm font-medium" style={{ color: '#9C8181' }}>{title}</p>
    <p className="text-xs mt-1 text-gray-400">{sub}</p>
  </div>
);

/* ── Profile ────────────────────────────────────────────────────────── */
const Profile = ({
  movies, userLists, currentUser,
  onWatched, onRate, onFavorite, onMovieSelect, onOpenListModal,
  activePage, onPageChange, onLogout,
}) => {
  const watchedMovies  = movies.filter(m => m.watched);
  const favoriteMovies = movies.filter(m => m.isFavorite);
  const ratedMovies    = movies.filter(m => m.userRating > 0);
  const avgUserRating  = ratedMovies.length > 0
    ? (ratedMovies.reduce((sum, m) => sum + m.userRating, 0) / ratedMovies.length).toFixed(1)
    : '—';

  const cardProps = { onWatched, onRate, onFavorite, onMovieSelect, onOpenListModal };

  return (
    <div className="page-bg">
      <div className="max-w-6xl mx-auto">
        <Navbar activePage={activePage} onPageChange={onPageChange} currentUser={currentUser} onLogout={onLogout} />

        <div className="px-6 lg:px-10 pb-12 animate-fadeIn">

          {/* ── User hero ──────────────────────────────────────────── */}
          <div className="flex items-center gap-4 mb-7">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
              style={{ backgroundColor: '#1A1A24' }}
            >
              <span className="text-white text-xl font-bold">
                {currentUser?.username?.slice(0, 2).toUpperCase() ?? '?'}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: '#1A1A24' }}>
                {currentUser?.username ?? 'User'}
              </h2>
              <p className="text-sm" style={{ color: '#9C8181' }}>{currentUser?.email ?? ''}</p>
            </div>
          </div>

          {/* ── Stats ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-4 gap-4 mb-10">
            <StatCard value={movies.length}        label="Total Films"  valueColor="#1A1A24" bg="rgba(255,255,255,0.6)" />
            <StatCard value={watchedMovies.length}  label="Watched"      valueColor="#819C81" bg="rgba(129,156,129,0.15)" />
            <StatCard value={favoriteMovies.length} label="Favorites"    valueColor="#c0605a" bg="rgba(192,96,90,0.1)" />
            <StatCard value={avgUserRating}         label="Avg. Rating"  valueColor="#b08850" bg="rgba(245,158,11,0.1)" />
          </div>

          {/* ── Favorites ──────────────────────────────────────────── */}
          <section className="mb-10">
            <SectionHeader
              icon={<Heart className="w-5 h-5 fill-red-400 text-red-400" />}
              title="My Favorites"
              count={favoriteMovies.length > 0 ? `${favoriteMovies.length} films` : null}
            />
            {favoriteMovies.length > 0 ? (
              <div className="flex gap-5 overflow-x-auto [&::-webkit-scrollbar]:hidden pb-2">
                {favoriteMovies.map(movie => (
                  <FilmCard key={movie.movie_id} movie={movie} {...cardProps} />
                ))}
              </div>
            ) : (
              <Empty
                icon={<Heart className="w-10 h-10" />}
                title="No favorites yet"
                sub="Tap the heart icon on any film to add it here"
              />
            )}
          </section>

          {/* ── My Lists ───────────────────────────────────────────── */}
          <section className="mb-10">
            <SectionHeader
              icon={<List className="w-5 h-5" style={{ color: '#819C9C' }} />}
              title="My Lists"
              count={userLists.length > 0 ? userLists.length : null}
            />
            {userLists.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {userLists.map(list => (
                  <div
                    key={list.list_id}
                    className="rounded-2xl p-4 flex items-start gap-3"
                    style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: 'rgba(129,156,156,0.15)' }}
                    >
                      <List className="w-4 h-4" style={{ color: '#819C9C' }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: '#1A1A24' }}>{list.name}</p>
                      <p className="text-xs mt-0.5 text-gray-400">{list.movieIds.size} films</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty
                icon={<List className="w-10 h-10" />}
                title="No lists yet"
                sub='Hover a film card and click "Add to List"'
              />
            )}
          </section>

          {/* ── Watched ────────────────────────────────────────────── */}
          <section>
            <SectionHeader
              icon={<Film className="w-5 h-5" style={{ color: '#819C81' }} />}
              title="Watched Films"
              count={watchedMovies.length > 0 ? watchedMovies.length : null}
            />
            {watchedMovies.length > 0 ? (
              <div className="flex gap-5 flex-wrap">
                {watchedMovies.map(movie => (
                  <FilmCard key={movie.movie_id} movie={movie} {...cardProps} />
                ))}
              </div>
            ) : (
              <Empty
                icon={<Film className="w-14 h-14" />}
                title="No watched films yet"
                sub='Hover a film card and click "Mark Watched"'
              />
            )}
          </section>

        </div>
      </div>
    </div>
  );
};

export default Profile;
