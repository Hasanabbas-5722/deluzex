import Link from "next/link";
import Image from "next/image";

const featuredProjects = [
  {
    title: "Sevalni Mosque",
    location: "Sevalni, Gujarat",
    category: "Mosque Architecture",
    accent: "from-[#111827] via-[#1f2937] to-[#e5e7eb]",
  },
  {
    title: "La Pristina",
    location: "Ahmedabad",
    category: "Hospitality",
    accent: "from-[#7c2d12] via-[#b45309] to-[#fef3c7]",
  },
  {
    title: "Jafari Knowledge City",
    location: "Shekhpur",
    category: "Institute",
    accent: "from-[#022c22] via-[#065f46] to-[#d1fae5]",
  },
  {
    title: "Eminence Residences",
    location: "Ahmedabad",
    category: "Residences",
    accent: "from-[#312e81] via-[#4f46e5] to-[#e0e7ff]",
  },
];

export default function Home() {
  return (
    <div className="space-y-16 lg:space-y-20">
      {/* Hero with image + overlay */}
      <section className="grid gap-10 lg:grid-cols-[1.35fr,1.1fr] items-stretch">
        <div className="flex flex-col justify-center space-y-6">
          <p className="text-xs tracking-[0.26em] uppercase text-stone-500">
            Architecture · Interior · Urban Fragments
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-stone-900">
            Crafted spaces that hold{" "}
            <span className="inline-block border-b border-stone-400 pb-1">
              light, silence
            </span>{" "}
            and ritual.
          </h1>
          <p className="max-w-xl text-sm sm:text-base leading-relaxed text-stone-600">
            A&amp;F Studio is a design practice based in Ahmedabad, working
            across mosques, hospitality, institutes, offices and residences. We
            choreograph structure, texture and daylight into calm, enduring
            architecture.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-stone-900 text-stone-50 text-xs sm:text-sm tracking-[0.22em] uppercase hover:bg-stone-700 transition-colors"
            >
              View projects
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center px-5 py-2.5 rounded-full border border-stone-300 text-[11px] sm:text-xs tracking-[0.24em] uppercase text-stone-700 hover:bg-stone-100 transition-colors"
            >
              Studio profile
            </Link>
          </div>
        </div>

        {/* Hero image block with overlay and hover */}
        <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-stone-900/90 group">
          <Image
            src="/window.svg"
            alt="Architecture composition"
            fill
            priority
            className="object-cover opacity-60 mix-blend-screen group-hover:scale-105 group-hover:opacity-70 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 group-hover:via-black/30 transition-colors" />
          <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-8">
            <div className="flex items-center justify-between text-xs text-stone-200">
              <span className="tracking-[0.26em] uppercase">
                Ahmedabad · India
              </span>
              <span className="rounded-full border border-stone-400/60 px-3 py-1 text-[10px] tracking-[0.24em] uppercase">
                Since 2012
              </span>
            </div>
            <div className="space-y-3">
              <p className="text-[11px] tracking-[0.3em] uppercase text-stone-300">
                Mosque Architecture · Hospitality · Institutes
              </p>
              <p className="max-w-xs text-sm text-stone-100">
                From intimate prayer halls to large-scale campuses, each project
                is tuned to light, orientation and ritual.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects with image overlays */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.26em] uppercase text-stone-500">
              Featured Projects
            </p>
            <p className="text-sm text-stone-600">
              A cross-section of ongoing and completed work.
            </p>
          </div>
          <Link
            href="/projects"
            className="hidden sm:inline-flex text-[11px] tracking-[0.26em] uppercase text-stone-700 hover:text-stone-900"
          >
            View all
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProjects.map((project) => (
            <article
              key={project.title}
              className="group overflow-hidden rounded-2xl border border-stone-200 bg-white/80 hover:border-stone-500 hover:shadow-[0_18px_35px_rgba(15,23,42,0.18)] transition-all duration-500 cursor-pointer"
            >
              <div
                className={`relative h-40 sm:h-44 bg-gradient-to-br ${project.accent}`}
              >
                <div className="absolute inset-3 rounded-2xl border border-white/40 border-dashed" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.6),_transparent_55%)]" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:bg-black/35 transition-opacity duration-500" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                  <span className="tracking-[0.24em] uppercase">
                    {project.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10px]">
                    View
                    <span className="translate-x-0 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-1">
                <h3 className="text-sm font-medium text-stone-900">
                  {project.title}
                </h3>
                <p className="text-xs text-stone-500">{project.location}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Studio Snapshot */}
      <section className="grid gap-8 lg:grid-cols-[1.2fr,1fr] items-start">
        <div className="space-y-4">
          <p className="text-xs tracking-[0.26em] uppercase text-stone-500">
            Studio
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-stone-700">
            Led by architects Ahmed Abbas and Farhaz Ahemad Admani, the studio
            works closely with clients, artisans and engineers. Each project is
            approached as a careful dialogue between context, program and
            material, resulting in spaces that feel both rooted and quietly
            contemporary.
          </p>
          <Link
            href="/about"
            className="inline-flex text-[11px] tracking-[0.26em] uppercase text-stone-700 hover:text-stone-900"
          >
            Read about the practice →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 text-xs border border-stone-200 rounded-2xl p-4 bg-white/70">
          <div className="space-y-1">
            <p className="tracking-[0.24em] uppercase text-stone-500">
              Focus
            </p>
            <p className="text-stone-800">
              Mosques, hospitality, institutes, offices and bespoke residences.
            </p>
          </div>
          <div className="space-y-1">
            <p className="tracking-[0.24em] uppercase text-stone-500">
              Approach
            </p>
            <p className="text-stone-800">
              Minimal, tactile architecture balanced with rich spatial
              sequences.
            </p>
          </div>
          <div className="space-y-1">
            <p className="tracking-[0.24em] uppercase text-stone-500">
              Location
            </p>
            <p className="text-stone-800">Ahmedabad, working across India.</p>
          </div>
          <div className="space-y-1">
            <p className="tracking-[0.24em] uppercase text-stone-500">
              Status
            </p>
            <p className="text-stone-800">
              Accepting commissions for 2025–26.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="border border-stone-200 rounded-3xl px-6 py-8 sm:px-8 sm:py-10 bg-white/80">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs tracking-[0.26em] uppercase text-stone-500">
              New Commissions
            </p>
            <p className="text-sm sm:text-base text-stone-700 max-w-xl">
              Share your brief, site and timeline. We will review and respond
              with an initial perspective on how we might work together.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex justify-center items-center px-5 py-2.5 rounded-full bg-stone-900 text-stone-50 text-xs sm:text-sm tracking-[0.22em] uppercase hover:bg-stone-700 transition-colors"
          >
            Send inquiry
          </Link>
        </div>
      </section>
    </div>
  );
}
