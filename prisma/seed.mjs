import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const films = [
  {
    title: "L'Or de Bandiagara",
    slug: "lor-de-bandiagara",
    synopsis:
      "Sur les falaises mystiques du pays Dogon, une jeune archéologue malienne découvre un héritage ancestral qui pourrait bouleverser l'histoire de l'Afrique de l'Ouest.",
    origin: "Mali",
    genre: "Aventure",
    year: 2025,
    duration: 124,
    isPremium: false,
    isFeatured: true,
    videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    thumbnailUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&q=80",
    rating: 8.7,
    cast: "Aïssa Maïga, Omar Sy, Fatoumata Diawara",
    director: "Souleymane Cissé",
  },
  {
    title: "Lagos Noir",
    slug: "lagos-noir",
    synopsis: "Dans le chaos électrique de Lagos, un détective traque un cartel international entre Victoria Island et Makoko.",
    origin: "Nigeria",
    genre: "Thriller",
    year: 2024,
    duration: 118,
    isPremium: true,
    videoUrl: "https://test-streams.mux.dev/pts_shift/master.m3u8",
    thumbnailUrl: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=600&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1518972559570-7cc1309f3229?w=1920&q=80",
    rating: 8.2,
    cast: "Genevieve Nnaji, Ramsey Nouah",
    director: "Kemi Adetiba",
  },
  {
    title: "Le Royaume de Kongo",
    slug: "le-royaume-de-kongo",
    synopsis: "Fresque historique sur la grandeur et la chute du royaume Kongo au XVIIe siècle.",
    origin: "RDC",
    genre: "Drame Historique",
    year: 2024,
    duration: 142,
    isPremium: true,
    videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1920&q=80",
    rating: 9.1,
    cast: "Maïmouna N'Diaye, Eriq Ebouaney",
    director: "Mahamat-Saleh Haroun",
  },
  {
    title: "Dakar by Night",
    slug: "dakar-by-night",
    synopsis: "Une nuit, trois destins, une ville qui ne dort jamais. La jeunesse sénégalaise au cœur d'une comédie musicale moderne.",
    origin: "Sénégal",
    genre: "Musical",
    year: 2025,
    duration: 96,
    isPremium: false,
    videoUrl: "https://test-streams.mux.dev/test_001/stream.m3u8",
    thumbnailUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1493238792000-8113da705763?w=1920&q=80",
    rating: 7.8,
    cast: "Issa Doumbia, Aïssa Maïga",
    director: "Alain Gomis",
  },
  {
    title: "Mama Africa",
    slug: "mama-africa",
    synopsis: "Documentaire intime sur Miriam Makeba, voix de l'Afrique libre.",
    origin: "Afrique du Sud",
    genre: "Documentaire",
    year: 2023,
    duration: 88,
    isPremium: false,
    videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    thumbnailUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1516496636080-14fb876e029d?w=1920&q=80",
    rating: 8.5,
    cast: "Archives Miriam Makeba",
    director: "Mika Kaurismäki",
  },
  {
    title: "Cairo Sunrise",
    slug: "cairo-sunrise",
    synopsis: "Une histoire d'amour interdite dans le Caire post-révolutionnaire.",
    origin: "Égypte",
    genre: "Romance",
    year: 2024,
    duration: 110,
    isPremium: true,
    videoUrl: "https://test-streams.mux.dev/pts_shift/master.m3u8",
    thumbnailUrl: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=600&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73c0e?w=1920&q=80",
    rating: 7.9,
    cast: "Menna Shalaby, Khaled Abol Naga",
    director: "Mohamed Diab",
  },
  {
    title: "Sahara Code",
    slug: "sahara-code",
    synopsis: "Un hacker tunisien démantèle un réseau de cybercriminalité depuis le désert.",
    origin: "Tunisie",
    genre: "Action",
    year: 2025,
    duration: 105,
    isPremium: true,
    videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    thumbnailUrl: "https://images.unsplash.com/photo-1547234935-80c7145ec969?w=600&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=1920&q=80",
    rating: 8.0,
    cast: "Dhafer L'Abidine, Hend Sabri",
    director: "Leyla Bouzid",
  },
  {
    title: "Conakry Sound",
    slug: "conakry-sound",
    synopsis: "L'ascension d'une jeune chanteuse guinéenne, des marchés de Madina aux scènes de Paris.",
    origin: "Guinée",
    genre: "Musical",
    year: 2025,
    duration: 99,
    isPremium: false,
    videoUrl: "https://test-streams.mux.dev/test_001/stream.m3u8",
    thumbnailUrl: "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=600&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=1920&q=80",
    rating: 8.4,
    cast: "Sayon Bamba, Mory Kanté Jr.",
    director: "Mama Keïta",
  },
  {
    title: "Addis Lights",
    slug: "addis-lights",
    synopsis: "Drame social autour d'une famille éthiopienne tiraillée entre tradition et modernité.",
    origin: "Éthiopie",
    genre: "Drame",
    year: 2024,
    duration: 117,
    isPremium: false,
    videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    thumbnailUrl: "https://images.unsplash.com/photo-1517147177326-b37599372b73?w=600&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=1920&q=80",
    rating: 7.6,
    cast: "Ruta Mengiste, Solomon Bogale",
    director: "Yared Zeleke",
  },
  {
    title: "Kigali Code",
    slug: "kigali-code",
    synopsis: "Au cœur de la Silicon Valley africaine, une startup vise les étoiles.",
    origin: "Rwanda",
    genre: "Drame",
    year: 2025,
    duration: 102,
    isPremium: false,
    videoUrl: "https://test-streams.mux.dev/test_001/stream.m3u8",
    thumbnailUrl: "https://images.unsplash.com/photo-1531062628625-2c98e6f33aa8?w=600&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=1920&q=80",
    rating: 8.1,
    cast: "Cleo Ice Queen, Patrick Mugisha",
    director: "Joel Karekezi",
  },
  {
    title: "Casablanca Rouge",
    slug: "casablanca-rouge",
    synopsis: "Polar haletant dans la médina de Casablanca.",
    origin: "Maroc",
    genre: "Thriller",
    year: 2024,
    duration: 113,
    isPremium: true,
    videoUrl: "https://test-streams.mux.dev/pts_shift/master.m3u8",
    thumbnailUrl: "https://images.unsplash.com/photo-1539020140153-e479b8c64e1e?w=600&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1539020140153-e479b8c64e1e?w=1920&q=80",
    rating: 8.3,
    cast: "Lubna Azabal, Saïd Taghmaoui",
    director: "Nabil Ayouch",
  },
  {
    title: "Abidjan Fever",
    slug: "abidjan-fever",
    synopsis: "Comédie romantique sur fond de Coupé-Décalé.",
    origin: "Côte d'Ivoire",
    genre: "Comédie",
    year: 2025,
    duration: 95,
    isPremium: false,
    videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    thumbnailUrl: "https://images.unsplash.com/photo-1518972734183-c5b57e7f3a6c?w=600&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1604608672516-f1b9b1d1c1f9?w=1920&q=80",
    rating: 7.4,
    cast: "Naky Sy Savane, Michel Gohou",
    director: "Philippe Lacôte",
  },
];

async function main() {
  console.log("🌱 Seeding AfriStream...");

  // Admin
  const adminPass = await bcrypt.hash("admin1234", 10);
  await prisma.user.upsert({
    where: { email: "admin@afristream.tv" },
    update: {},
    create: {
      email: "admin@afristream.tv",
      name: "AfriStream Admin",
      passwordHash: adminPass,
      role: "ADMIN",
      isPremium: true,
    },
  });

  // Test user
  const userPass = await bcrypt.hash("test1234", 10);
  await prisma.user.upsert({
    where: { email: "user@afristream.tv" },
    update: {},
    create: {
      email: "user@afristream.tv",
      name: "Test User",
      passwordHash: userPass,
      role: "USER",
    },
  });

  // Films
  for (const f of films) {
    await prisma.film.upsert({
      where: { slug: f.slug },
      update: {},
      create: f,
    });
  }

  console.log(`✅ Seeded ${films.length} films + 2 users.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
