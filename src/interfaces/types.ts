export interface IMovie {
  id: string;
  title: string;
  genre: string;
  year: number;
  rating: number;
  description: string;
  poster: string;
  watched: boolean;
  createdAt: string;
}

export const GENRES = [
  "Action", "Comedy", "Drama", "Horror", "Romance",
  "Sci-Fi", "Animation", "Thriller", "Documentary", "Adventure"
];

export const INITIAL_MOVIES: IMovie[] = [
  {
    id: "1",
    title: "The Adventure of Blue Sword",
    genre: "Adventure",
    year: 2023,
    rating: 8.5,
    description: "An epic journey through magical landscapes",
    poster: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=400&fit=crop",
    watched: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Recalling the Journey of Dol",
    genre: "Animation",
    year: 2023,
    rating: 7.8,
    description: "A heartwarming tale of friendship",
    poster: "https://images.unsplash.com/photo-1533066481125-ec8e6e1ab2f0?w=300&h=400&fit=crop",
    watched: false,
    createdAt: new Date().toISOString()
  }
];
