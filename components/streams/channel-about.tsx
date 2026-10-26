import type { Channel } from "@/src/streams/types";
import {
  categoryName,
  formatDate,
  formatFollowers,
  formatNumber,
} from "@/src/streams/utils";
import { CalendarDays, ExternalLink, Eye, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";

export function ChannelAbout({ channel }: { channel: Channel }) {
  const socials = channel.socials ?? [];
  const panels = channel.panels ?? [];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="rounded-xl bg-[#120a24] p-5 ring-1 ring-white/10">
          <h2 className="text-lg font-bold text-white">Sobre {channel.name}</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/70">{channel.bio}</p>

          {socials.length > 0 && (
            <div className="mt-5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">
                Redes
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {socials.map((social) => (
                  <a
                    key={`${social.label}-${social.url}`}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/75 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                  >
                    {social.label}
                    <ExternalLink className="size-3" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <section className="rounded-xl bg-[#120a24] p-5 ring-1 ring-white/10">
            <h2 className="text-sm font-bold text-white">Estadísticas</h2>
            <dl className="mt-3 grid grid-cols-2 gap-3">
              <Stat
                icon={Users}
                label="Seguidores"
                value={formatFollowers(channel.followers)}
              />
              <Stat
                icon={Eye}
                label="Visualizaciones"
                value={channel.totalViews ? formatNumber(channel.totalViews) : "—"}
              />
              <Stat
                icon={CalendarDays}
                label="En Horizon desde"
                value={formatDate(channel.joinedAt)}
              />
            </dl>
          </section>

          <section className="rounded-xl bg-[#120a24] p-5 ring-1 ring-white/10">
            <h2 className="text-sm font-bold text-white">Categorías</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {channel.categories.map((slug) => (
                <Link
                  key={slug}
                  href={`/category/${slug}`}
                  className="rounded-full bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/75 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                >
                  {categoryName(slug)}
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>

      {panels.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {panels.map((panel) => (
            <section
              key={panel.title}
              className="rounded-xl bg-[#120a24] p-5 ring-1 ring-white/10"
            >
              <h3 className="text-sm font-bold text-white">{panel.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{panel.body}</p>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-white/5 p-3">
      <Icon className="size-4 text-fuchsia-300" />
      <dd className="mt-2 text-sm font-bold text-white">{value}</dd>
      <dt className="text-[11px] text-white/45">{label}</dt>
    </div>
  );
}
