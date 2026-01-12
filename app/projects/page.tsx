import Image from "next/image";

const projectGroups = [
  {
    heading: "Mosque Architecture",
    description:
      "Places of worship that balance community, quietude and light.",
    projects: ["Sevalni Mosque", "Jumma Masjid Kesimpa"],
    accent: "from-[#020617] via-[#111827] to-[#e5e7eb]",
  },
  {
    heading: "Hospitality",
    description:
      "Hotels, banquets and dining spaces designed for gatherings and celebration.",
    projects: ["La Pristina", "Aura The Banquet", "Artilla Inn", "Orange"],
    accent: "from-[#7c2d12] via-[#b45309] to-[#fef3c7]",
  },
  {
    heading: "Institutes",
    description:
      "Campuses and learning environments that support focus and exchange.",
    projects: ["Jafari Knowledge City"],
    accent: "from-[#022c22] via-[#065f46] to-[#d1fae5]",
  },
  {
    heading: "Offices",
    description:
      "Workplaces that align spatial clarity with day-to-day pragmatism.",
    projects: ["Carrefour", "Corporate & boutique workspaces"],
    accent: "from-[#0f172a] via-[#1e293b] to-[#e2e8f0]",
  },
  {
    heading: "Residences",
    description:
      "Private homes and housing that bring together comfort, privacy and openness.",
    projects: ["Eminence", "Custom residences & apartments"],
    accent: "from-[#312e81] via-[#4f46e5] to-[#e0e7ff]",
  },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-14 lg:space-y-16">
      <section className="space-y-6 max-w-3xl">
        <p className="text-xs tracking-[0.26em] uppercase text-stone-500">
          Projects
        </p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-stone-900">
          A selection of built and ongoing work across typologies.
        </h1>
        <p className="text-sm sm:text-base leading-relaxed text-stone-700">
          The portfolio moves from mosque architecture to hospitality,
          institutes, offices and residences. Each project is shaped by its
          context and community, while maintaining a consistent attitude towards
          light, proportion and material tactility.
        </p>
      </section>

      <section className="space-y-10">
        {projectGroups.map((group) => (
          <div
            key={group.heading}
            className="overflow-hidden border border-stone-200 rounded-3xl bg-white/90 hover:border-stone-500 hover:shadow-[0_22px_45px_rgba(15,23,42,0.18)] transition-all duration-500"
          >
            {/* Large banner with overlay */}
            <div className="relative h-56 sm:h-64 lg:h-72 group cursor-pointer">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${group.accent}`}
              />
              <Image
                src="/globe.svg"
                alt={group.heading}
                fill
                className="object-contain opacity-40 mix-blend-screen group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent group-hover:from-black/75 group-hover:via-black/35 transition-colors" />
              <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-7">
                <div className="flex items-center justify-between gap-4 text-xs text-stone-200">
                  <p className="tracking-[0.24em] uppercase">
                    {group.heading}
                  </p>
                  <span className="rounded-full border border-white/40 px-3 py-1 text-[10px] tracking-[0.24em] uppercase">
                    View series
                  </span>
                </div>
                <div className="space-y-2 max-w-lg">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-stone-300">
                    Selected works
                  </p>
                  <p className="text-sm sm:text-base text-stone-50">
                    {group.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Thumbnails list with hover overlay */}
            <div className="border-t border-stone-200/70 bg-stone-50/60 px-4 py-4 sm:px-6 sm:py-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm text-stone-800">
              {group.projects.map((project) => (
                <div
                  key={project}
                  className="group/item relative overflow-hidden rounded-2xl border border-stone-200 bg-white/90 cursor-pointer hover:border-stone-400 transition-colors"
                >
                  <div className="h-20 bg-gradient-to-tr from-stone-200 via-stone-100 to-white group-hover/item:from-stone-300 group-hover/item:via-stone-100 transition-colors" />
                  <div className="absolute inset-0 opacity-0 group-hover/item:opacity-100 bg-black/20 transition-opacity" />
                  <div className="absolute inset-0 flex flex-col justify-between p-3 text-xs text-stone-900">
                    <span className="font-medium">{project}</span>
                    <span className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-stone-700">
                      View details
                      <span className="translate-x-0 group-hover/item:translate-x-1 transition-transform">
                        →
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

