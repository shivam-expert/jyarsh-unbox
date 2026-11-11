import JyarshUnfold from "@/components/jyarsh/JyarshUnfold";

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <JyarshUnfold />
      <section className="grid min-h-[70vh] place-items-center px-6 py-20">
        <div className="max-w-[36ch] text-center">
          <h2 className="mb-3 font-display text-4xl leading-tight md:text-5xl">Unboxing, the way it should feel.</h2>
          <p className="leading-relaxed text-muted">
            Every Jyarsh piece ships in this kraft drawer box with a gold foil mark, a velvet-lined tray and a thank-you note.
          </p>
        </div>
      </section>
    </main>
  );
}
