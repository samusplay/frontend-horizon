import { CategoryGallery } from "components/events/category-gallery";
import { EventCard, EventCardData } from "components/events/event-card";
import { FeaturedEvents } from "components/events/featured-events";


const ALL_EVENTS: EventCardData[] = [
  {
    id: "1",
    title: "Torneo Valorant Masters",
    category: "Valorant",
    image: "/images/categories/valorant.jpg",
    status: "live",
    time: "En vivo ahora",
  },
  {
    id: "2",
    title: "Liga LoL Regional",
    category: "League of Legends",
    image: "/images/categories/league-of-legends.jpg",
    status: "scheduled",
    time: "Empieza en 2h",
  },
  {
    id: "3",
    title: "Survival Semanal Minecraft",
    category: "Minecraft",
    image: "/images/categories/minecraft.jpg",
    status: "scheduled",
    time: "Mañana, 3:00 PM",
  },
];

export default function EventsPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-[#0d0221] via-[#0a0118] to-black text-white">
      <div className="text-center mb-4 px-6">
        <h1 className="text-4xl md:text-5xl font-bold">Eventos</h1>
        <p className="mt-3 text-white/60 max-w-xl mx-auto">
          Descubre torneos en vivo y próximos, organizados por categoría
        </p>
      </div>

      <FeaturedEvents />

      <CategoryGallery />

      <section className="px-6 py-12 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Todos los eventos</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_EVENTS.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </main>
  );
}