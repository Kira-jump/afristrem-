export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // diacritics
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const GENRES = [
  "Action",
  "Aventure",
  "Comédie",
  "Documentaire",
  "Drame",
  "Drame Historique",
  "Musical",
  "Polar",
  "Romance",
  "Science-Fiction",
  "Thriller",
] as const;

export const ORIGINS = [
  "Algérie",
  "Bénin",
  "Burkina Faso",
  "Cameroun",
  "Côte d'Ivoire",
  "Égypte",
  "Éthiopie",
  "Gabon",
  "Ghana",
  "Guinée",
  "Kenya",
  "Mali",
  "Maroc",
  "Niger",
  "Nigeria",
  "RDC",
  "Rwanda",
  "Sénégal",
  "Afrique du Sud",
  "Tanzanie",
  "Togo",
  "Tunisie",
] as const;
