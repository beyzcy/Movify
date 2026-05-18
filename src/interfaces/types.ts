export interface IMovie {
  id: string;
  title: string;
  genre: string;
  year: number;
  rating: number;      // 0-10 genel puan (form'dan girilir)
  description: string;
  poster: string;
  watched: boolean;
  userRating: number;  // 1-5 kullanıcı puanı (karttan verilir), 0 = puanlanmamış
  isFavorite: boolean; // kalp ikonuyla toggle edilir
  createdAt: string;
}

export const GENRES = [
  "Action", "Comedy", "Drama", "Horror", "Romance",
  "Sci-Fi", "Animation", "Thriller", "Documentary", "Adventure"
];
