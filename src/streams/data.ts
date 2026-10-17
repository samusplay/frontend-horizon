import type { Category, ChatMessage, FollowedChannel, Notification, Stream, Vod } from "./types";

// ---------------------------------------------------------------------------
// Datos mock de la vertical `streams`.
// TODO backend: reemplazar por llamadas a `${process.env.API_URL}` a través de
// las server actions (`actions/get-streams-action.ts`, `get-vods-action.ts`,
// `get-notifications-action.ts`, `search-action.ts`...).
// Las imágenes reutilizan las que ya existen en `public/images`.
// ---------------------------------------------------------------------------

export const CATEGORIES: Category[] = [
  { slug: "valorant", name: "Valorant", image: "/images/categories/valorant.jpg" },
  {
    slug: "league-of-legends",
    name: "League of Legends",
    image: "/images/categories/league-of-legends.jpg",
  },
  { slug: "minecraft", name: "Minecraft", image: "/images/categories/minecraft.jpg" },
  { slug: "cs2", name: "Counter-Strike 2", image: "/images/categories/valorant.jpg" },
  { slug: "free-fire", name: "Free Fire", image: "/images/categories/minecraft.jpg" },
  { slug: "dota-2", name: "Dota 2", image: "/images/categories/league-of-legends.jpg" },
];

export const STREAMS: Stream[] = [
  {
    id: "s1",
    slug: "valorant-masters-final",
    title: "GRAN FINAL · Valorant Masters — BO5 con analistas",
    streamer: { name: "Horizon Esports", accent: "#f43f5e", verified: true, followers: 204983 },
    categorySlug: "valorant",
    viewers: 12483,
    status: "live",
    thumbnail: "/images/categories/valorant.jpg",
    tags: ["Español", "Torneo", "FPS"],
    language: "Español",
    startedAt: "2026-10-17T14:00:00.000Z",
    description:
      "Gran final del Valorant Masters. Análisis previo, cobertura completa del BO5 decisivo y entrevistas al campeón. ¡Pasa a saludar en el chat!",
  },
  {
    id: "s2",
    slug: "lol-liga-regional",
    title: "Liga LoL Regional · Jornada 4 en directo",
    streamer: { name: "Liga Nova", accent: "#38bdf8", verified: true, followers: 152340 },
    categorySlug: "league-of-legends",
    viewers: 8210,
    status: "live",
    thumbnail: "/images/categories/league-of-legends.jpg",
    tags: ["Español", "Liga", "MOBA"],
    language: "Español",
    startedAt: "2026-10-17T16:30:00.000Z",
    description:
      "Cuarta jornada de la Liga Regional de League of Legends. Tres partidos seguidos con narración y análisis en español.",
  },
  {
    id: "s3",
    slug: "minecraft-survival-semanal",
    title: "Survival Semanal · Construimos la ciudad flotante",
    streamer: { name: "CrafteandoAndo", accent: "#22c55e", verified: false, followers: 42110 },
    categorySlug: "minecraft",
    viewers: 3421,
    status: "live",
    thumbnail: "/images/categories/minecraft.jpg",
    tags: ["Español", "Survival", "Chill"],
    language: "Español",
    startedAt: "2026-10-17T17:45:00.000Z",
    description:
      "Continuamos el survival comunitario: hoy terminamos la ciudad flotante. Trae tus ideas y únete a las votaciones del chat.",
  },
  {
    id: "s4",
    slug: "cs2-copa-apertura",
    title: "Copa CS2 Apertura · Semifinales",
    streamer: { name: "Tier1 Gaming", accent: "#a855f7", verified: true, followers: 88900 },
    categorySlug: "cs2",
    viewers: 5102,
    status: "live",
    thumbnail: "/images/categories/valorant.jpg",
    tags: ["Español", "Torneo", "Shooter"],
    language: "Español",
    startedAt: "2026-10-17T15:15:00.000Z",
    description:
      "Semifinales de la Copa CS2 Apertura. Dos series al mejor de tres con estadísticas en vivo y análisis de cada ronda.",
  },
  {
    id: "s5",
    slug: "free-fire-world-series",
    title: "Free Fire World Series · Fase de grupos",
    streamer: { name: "Fuego Latino", accent: "#f97316", verified: false, followers: 23100 },
    categorySlug: "free-fire",
    viewers: 2987,
    status: "live",
    thumbnail: "/images/categories/minecraft.jpg",
    tags: ["Español", "Battle Royale", "Móvil"],
    language: "Español",
    startedAt: "2026-10-17T13:00:00.000Z",
    description:
      "Fase de grupos del Free Fire World Series. Seguimos a los equipos latinos clasificados y su camino a la gran final.",
  },
  {
    id: "s6",
    slug: "dota2-inalambricos",
    title: "Dota 2 · Inalámbricos rumbo al Major",
    streamer: { name: "AncientGG", accent: "#ef4444", verified: true, followers: 98700 },
    categorySlug: "dota-2",
    viewers: 1876,
    status: "live",
    thumbnail: "/images/categories/league-of-legends.jpg",
    tags: ["Español", "Clasificatorio", "MOBA"],
    language: "Español",
    startedAt: "2026-10-17T12:20:00.000Z",
    description:
      "Clasificatorio abierto de Dota 2. Analizamos los drafts y comentamos cada partida camino al Major.",
  },
  {
    id: "s7",
    slug: "valorant-clasificatorio",
    title: "Valorant · Clasificatorio Amateur Random",
    streamer: { name: "PuntoDeMira", accent: "#14b8a6", verified: false, followers: 12040 },
    categorySlug: "valorant",
    viewers: 964,
    status: "live",
    thumbnail: "/images/categories/valorant.jpg",
    tags: ["Español", "Amateur", "FPS"],
    language: "Español",
    startedAt: "2026-10-17T18:10:00.000Z",
    description:
      "Clasificatorio amateur con equipos emergentes. Comentamos las jugadas y entrevistamos a los capitanes.",
  },
  {
    id: "s8",
    slug: "lol-community-night",
    title: "League of Legends · Noche de la comunidad",
    streamer: { name: "La Grieta", accent: "#6366f1", verified: false, followers: 8300 },
    categorySlug: "league-of-legends",
    viewers: 0,
    status: "scheduled",
    thumbnail: "/images/categories/league-of-legends.jpg",
    tags: ["Español", "Comunidad", "Flex"],
    language: "Español",
    startedAt: "2026-10-17T22:00:00.000Z",
    description:
      "Noche de partidas flex con la comunidad. Empieza a las 22:00, ¡apúntate y juega con nosotros!",
  },
];

// Barra lateral: canales que sigue el usuario (incluye los que están offline).
export const FOLLOWED_CHANNELS: FollowedChannel[] = [
  {
    slug: "valorant-masters-final",
    name: "Horizon Esports",
    accent: "#f43f5e",
    categorySlug: "valorant",
    status: "live",
    viewers: 12483,
  },
  {
    slug: "lol-liga-regional",
    name: "Liga Nova",
    accent: "#38bdf8",
    categorySlug: "league-of-legends",
    status: "live",
    viewers: 8210,
  },
  {
    slug: "minecraft-survival-semanal",
    name: "CrafteandoAndo",
    accent: "#22c55e",
    categorySlug: "minecraft",
    status: "live",
    viewers: 3421,
  },
  {
    slug: "cs2-copa-apertura",
    name: "Tier1 Gaming",
    accent: "#a855f7",
    categorySlug: "cs2",
    status: "live",
    viewers: 5102,
  },
  {
    slug: "dota2-inalambricos",
    name: "AncientGG",
    accent: "#ef4444",
    categorySlug: "dota-2",
    status: "offline",
    viewers: 0,
  },
  {
    slug: "free-fire-world-series",
    name: "Fuego Latino",
    accent: "#f97316",
    categorySlug: "free-fire",
    status: "offline",
    viewers: 0,
  },
  {
    slug: "valorant-clasificatorio",
    name: "PuntoDeMira",
    accent: "#14b8a6",
    categorySlug: "valorant",
    status: "offline",
    viewers: 0,
  },
  {
    slug: "lol-community-night",
    name: "La Grieta",
    accent: "#6366f1",
    categorySlug: "league-of-legends",
    status: "offline",
    viewers: 0,
  },
];

// Emisiones pasadas (VODs).
export const VODS: Vod[] = [
  {
    id: "v1",
    streamerName: "Horizon Esports",
    title: "FINAL Valorant Masters — BO5 completo con análisis",
    thumbnail: "/images/categories/valorant.jpg",
    durationSeconds: 29264,
    views: 120575,
    publishedAt: "2026-10-16T20:00:00.000Z",
    url: "#",
  },
  {
    id: "v2",
    streamerName: "Horizon Esports",
    title: "Valorant Masters — Semifinales y reacciones",
    thumbnail: "/images/categories/valorant.jpg",
    durationSeconds: 23129,
    views: 69183,
    publishedAt: "2026-10-14T19:30:00.000Z",
    url: "#",
  },
  {
    id: "v3",
    streamerName: "Liga Nova",
    title: "Liga LoL Regional · Jornada 3 completa",
    thumbnail: "/images/categories/league-of-legends.jpg",
    durationSeconds: 21895,
    views: 92659,
    publishedAt: "2026-10-13T18:00:00.000Z",
    url: "#",
  },
  {
    id: "v4",
    streamerName: "Tier1 Gaming",
    title: "Copa CS2 Apertura · Cuartos de final",
    thumbnail: "/images/categories/valorant.jpg",
    durationSeconds: 6323,
    views: 33950,
    publishedAt: "2026-10-13T16:00:00.000Z",
    url: "#",
  },
  {
    id: "v5",
    streamerName: "AncientGG",
    title: "Dota 2 · Clasificatorio: los mejores drafts",
    thumbnail: "/images/categories/league-of-legends.jpg",
    durationSeconds: 34243,
    views: 147441,
    publishedAt: "2026-10-11T15:00:00.000Z",
    url: "#",
  },
  {
    id: "v6",
    streamerName: "CrafteandoAndo",
    title: "Minecraft Survival · Construyendo el castillo",
    thumbnail: "/images/categories/minecraft.jpg",
    durationSeconds: 19875,
    views: 51204,
    publishedAt: "2026-10-10T17:00:00.000Z",
    url: "#",
  },
];

// Notificaciones del usuario (campana de la barra superior).
export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    streamerName: "Horizon Esports",
    accent: "#f43f5e",
    title: "Horizon Esports está en directo: GRAN FINAL Valorant Masters",
    createdAt: "2026-10-17T14:02:00.000Z",
    read: false,
    href: "/channel/valorant-masters-final",
  },
  {
    id: "n2",
    streamerName: "Liga Nova",
    accent: "#38bdf8",
    title: "Liga Nova comenzó su emisión",
    createdAt: "2026-10-17T16:31:00.000Z",
    read: false,
    href: "/channel/lol-liga-regional",
  },
  {
    id: "n3",
    streamerName: "Tier1 Gaming",
    accent: "#a855f7",
    title: "Tier1 Gaming publicó una nueva emisión pasada",
    createdAt: "2026-10-17T10:15:00.000Z",
    read: true,
    href: "/channel/cs2-copa-apertura",
  },
];

export const CHAT_SEED: ChatMessage[] = [
  { id: "c1", author: "nova_fan", color: "#f472b6", message: "¡Qué jugadón! 🔥" },
  { id: "c2", author: "clutchking", color: "#38bdf8", message: "Ese clutch fue increíble" },
  { id: "c3", author: "MartaGG", color: "#34d399", message: "hype hype hype" },
  { id: "c4", author: "elprofe", color: "#fbbf24", message: "el análisis de la ronda estuvo buenísimo" },
  { id: "c5", author: "luna_dev", color: "#c084fc", message: "¿alguien sabe el marcador global?" },
  { id: "c6", author: "TomasX", color: "#60a5fa", message: "3-2 para Horizon Esports 👀" },
  { id: "c7", author: "kito", color: "#fb7185", message: "saludos desde Colombia 🇨🇴" },
  { id: "c8", author: "mod_horizon", color: "#a3e635", message: "Recuerden mantener el chat respetuoso 💜" },
];

// Emotes rápidos del chat (mock). TODO backend: emotes de la API.
export const CHAT_EMOTES = ["😀", "🔥", "😂", "💜", "👀", "🎮", "GG", "PogChamp"];

export const CREATOR_STATS = [
  { label: "Espectadores ahora", value: 3421, delta: "+12%", trend: "up" as const },
  { label: "Seguidores nuevos", value: 128, delta: "+8%", trend: "up" as const },
  { label: "Minutos vistos", value: 48600, delta: "+21%", trend: "up" as const },
  { label: "Suscripciones", value: 74, delta: "-2%", trend: "down" as const },
];
