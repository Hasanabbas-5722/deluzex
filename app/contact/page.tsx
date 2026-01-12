export default function ContactPage() {
  return (
    <div className="space-y-14 lg:space-y-16">
      <section className="space-y-6 max-w-2xl">
        <p className="text-xs tracking-[0.26em] uppercase text-stone-500">
          Contact
        </p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-stone-900">
          Share your site, program and timeline to begin a conversation.
        </h1>
        <p className="text-sm sm:text-base leading-relaxed text-stone-700">
          For new commissions and collaborations, please outline your brief and
          we will respond with a suitable time for a call or meeting at the
          studio.
        </p>
      </section>

      <section className="grid gap-10 lg:grid-cols-[1.1fr,1fr] items-start">
        <form className="space-y-5 border border-stone-200 rounded-3xl p-5 sm:p-6 lg:p-7 bg-white/90">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-xs tracking-[0.22em] uppercase text-stone-600"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your full name"
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm bg-stone-50 focus:outline-none focus:ring-1 focus:ring-stone-500 focus:border-stone-500"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs tracking-[0.22em] uppercase text-stone-600"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm bg-stone-50 focus:outline-none focus:ring-1 focus:ring-stone-500 focus:border-stone-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="subject"
              className="text-xs tracking-[0.22em] uppercase text-stone-600"
            >
              Project type
            </label>
            <input
              id="subject"
              type="text"
              placeholder="Mosque, residence, hospitality, institute, office…"
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm bg-stone-50 focus:outline-none focus:ring-1 focus:ring-stone-500 focus:border-stone-500"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="message"
              className="text-xs tracking-[0.22em] uppercase text-stone-600"
            >
              Brief
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="Location, site size, program, expected timelines and any other details you would like to share."
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm bg-stone-50 focus:outline-none focus:ring-1 focus:ring-stone-500 focus:border-stone-500 resize-none"
            />
          </div>

          <button
            type="button"
            className="inline-flex justify-center items-center px-5 py-2.5 rounded-full bg-stone-900 text-stone-50 text-xs sm:text-sm tracking-[0.22em] uppercase hover:bg-stone-700 transition-colors w-full sm:w-auto"
          >
            Send inquiry
          </button>

          <p className="text-xs text-stone-500">
            This form is a visual prototype only. Connect directly at{" "}
            <span className="font-medium">info@aandfdesign.com</span> to share
            your project details.
          </p>
        </form>

        <div className="space-y-6 text-sm">
          <div>
            <p className="text-xs tracking-[0.24em] uppercase text-stone-500 mb-2">
              Studio address
            </p>
            <p className="text-stone-700">
              a/1, Jamman Nagar Society,
              <br />
              b/h. El Dorado Hotel,
              <br />
              Opp. Crossword, Mithakali,
              <br />
              Ahmedabad, India
            </p>
          </div>
          <div>
            <p className="text-xs tracking-[0.24em] uppercase text-stone-500 mb-2">
              Email
            </p>
            <p className="text-stone-700">info@aandfdesign.com</p>
          </div>
          <div>
            <p className="text-xs tracking-[0.24em] uppercase text-stone-500 mb-2">
              Phone
            </p>
            <p className="text-stone-700">+91-98765-43210</p>
          </div>
        </div>
      </section>
    </div>
  );
}

