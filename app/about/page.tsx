export default function AboutPage() {
  return (
    <div className="space-y-14 lg:space-y-16">
      <section className="space-y-6 max-w-3xl">
        <p className="text-xs tracking-[0.26em] uppercase text-stone-500">
          About
        </p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-stone-900">
          A&F Studio is a collaborative architecture and interior practice based
          in Ahmedabad.
        </h1>
        <p className="text-sm sm:text-base leading-relaxed text-stone-700">
          The studio is founded by{" "}
          <span className="font-medium">Ahmed Abbas</span> and{" "}
          <span className="font-medium">Farhaz Ahemad Admani</span>, working
          together across mosque architecture, hospitality, institutes,
          offices, and residences. Each commission is treated as a careful study
          of site, climate, and community, resulting in architecture that feels
          both timeless and specific to its context.
        </p>
      </section>

      <section className="grid gap-10 lg:grid-cols-[1.3fr,1fr] items-start">
        <div className="space-y-6">
          <h2 className="text-sm tracking-[0.24em] uppercase text-stone-500">
            Practice
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-stone-700">
            We believe that meaningful architecture is built through patient
            dialogue and precise observation. Our work often begins with long
            conversations with clients, visits to the site at different times of
            day, and a close reading of local craft traditions. These insights
            inform a design language that is minimal in form yet rich in
            shadow, texture, and proportion.
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-stone-700">
            The studio moves fluidly between architecture and interior design,
            ensuring that structure, light, furniture, and landscape are
            conceived as one continuous experience. Across typologies, we seek
            to create spaces that are quiet, dignified, and generous.
          </p>
        </div>

        <div className="border border-stone-200 rounded-2xl p-5 bg-white/80 space-y-6 text-sm">
          <div>
            <p className="text-xs tracking-[0.24em] uppercase text-stone-500 mb-2">
              Services
            </p>
            <ul className="space-y-1 text-stone-700">
              <li>Architectural design</li>
              <li>Interior design &amp; styling</li>
              <li>Master planning &amp; campus design</li>
              <li>Furniture &amp; custom joinery</li>
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-[0.24em] uppercase text-stone-500 mb-2">
              Sectors
            </p>
            <ul className="space-y-1 text-stone-700">
              <li>Mosque architecture</li>
              <li>Hospitality &amp; banquets</li>
              <li>Educational institutes</li>
              <li>Corporate &amp; boutique offices</li>
              <li>Private residences &amp; housing</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-8 sm:grid-cols-2 text-sm">
        <div className="space-y-3">
          <h2 className="text-xs tracking-[0.24em] uppercase text-stone-500">
            Process
          </h2>
          <p className="text-stone-700">
            Projects move through a clear structure: briefing &amp; research,
            concept design, detailed development, coordination with
            consultants, and on-site review. At each stage, drawings and models
            are used as tools for conversation, not just presentation.
          </p>
        </div>
        <div className="space-y-3">
          <h2 className="text-xs tracking-[0.24em] uppercase text-stone-500">
            Collaboration
          </h2>
          <p className="text-stone-700">
            We collaborate with structural engineers, lighting designers,
            landscape architects, and local craftspeople. This extended team
            allows us to deliver projects that are technically robust while
            remaining sensitive to budget and long-term maintenance.
          </p>
        </div>
      </section>
    </div>
  );
}

