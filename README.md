# Movify — Film Watchlist App

Kişisel film takip uygulaması. React + Tailwind CSS ile geliştirilmiş, tüm veriler localStorage'da saklanır.

## Özellikler

- **Film Ekle / Düzenle / Sil** — Form modalı ile tam CRUD
- **İzlendi İşaretleme** — Film kartına hover yapıp "İzlendi" ile güncelle
- **Favori Filmler** — Kalp ikonu ile favorile, Letterboxd tarzı fan animasyonu ile göster
- **Yıldız Puanlama** — Her film kartında 1–5 arası kişisel puan ver
- **Kategori Filtreleme** — Türe göre dinamik sekmeler (listedeki filmlere göre otomatik oluşur)
- **İzlendi / İzlenmedi Filtresi** — Üst bar butonlarıyla hızlı filtrele
- **Profil Sayfası** — İstatistikler, favori filmler ve izlenen filmler listesi
- **localStorage** — Tüm veriler tarayıcıda kalıcı olarak saklanır

## Ekran Görüntüleri

### Ana Sayfa
- Favori filmler bölümü (hover ile yelpaze animasyonu)
- Tür sekmeleri ve film grid'i

### Profil Sayfası
- Toplam / izlenen / ortalama puan istatistikleri
- Favori filmler bölümü
- İzlenen filmler listesi

## Teknolojiler

| Teknoloji | Versiyon | Kullanım |
|-----------|----------|----------|
| React | 19 | UI bileşenleri, state yönetimi |
| Vite | 6 | Geliştirme sunucusu, build |
| Tailwind CSS | 4 | Stil |
| lucide-react | 1.14 | İkonlar |

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcıda `http://localhost:5173` adresini aç.

```bash
# Production build
npm run build

# Build önizleme
npm run preview
```

## Proje Yapısı

```
src/
├── components/
│   ├── FavoriteMovies.jsx   # Letterboxd tarzı favori filmler (fan animasyonu)
│   ├── FilmCard.jsx         # Film kartı (kalp, yıldız, hover aksiyonlar)
│   ├── FilmForm.jsx         # Film ekle / düzenle modal formu
│   ├── FilmList.jsx         # Kategori sekmeleri + film grid'i
│   └── Navbar.jsx           # Üst navigasyon (Ana Sayfa / Profilim)
├── interfaces/
│   └── types.ts             # IMovie TypeScript arayüzü
├── pages/
│   ├── Home.jsx             # Ana sayfa layout
│   └── Profile.jsx          # Profil sayfası
├── App.jsx                  # Merkezi state yönetimi + routing
├── main.jsx                 # Uygulama giriş noktası
└── index.css                # Tailwind direktifleri
```

## Veri Modeli

```ts
interface IMovie {
  id: string;
  title: string;
  genre: string;           // Kategori sekmeleri buna göre oluşur
  year: number;
  rating: number;          // 0–10 genel puan (formdan girilir)
  description: string;
  poster: string;          // Görsel URL
  watched: boolean;        // İzlendi durumu
  userRating: number;      // 1–5 kişisel puan (0 = puanlanmamış)
  isFavorite: boolean;     // Favori durumu
  createdAt: string;
}
```

## Kullanım

| İşlem | Nasıl yapılır |
|-------|--------------|
| Film ekle | Navbar'daki **Film Ekle** butonuna tıkla |
| Favorile | Film kartının sol üstündeki **kalp** ikonuna tıkla |
| Puan ver | Film kartının altındaki **yıldızlara** tıkla (1–5) |
| İzlendi işaretle | Karta hover yap → **İzlendi** butonuna tıkla |
| Düzenle | Karta hover yap → **Düzenle** butonuna tıkla |
| Sil | Karta hover yap → **Sil** butonuna tıkla |
| Kategori filtrele | Alt sekmelere tıkla (Trending = tümü) |
| İzlendi/İzlenmedi | "Tüm Filmler" sağındaki filtre butonları |
