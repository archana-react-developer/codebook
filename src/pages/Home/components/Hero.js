import { Link } from "react-router-dom";
import { useExperiment } from "../../../hooks/useExperiment";

// You can swap these URLs for local assets if you prefer:
// import heroA from "../../../assets/images/hero.avif";
// import heroB from "../../../assets/images/hero-b.avif"; // add this file if you want a local B image

const DEFAULT_CONTENT = {
  title: "The Ultimate eBook Store",
  subtitle:
    "CodeBook is the world's most popular and authoritative source for computer science ebooks. Find ratings and access to the newest books digitally.",

  // Variant-specific images (B is optional; falls back to A)
  imageA: {
    // src: heroA,
    src: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=1470&q=60",
    alt: "Workspace with laptop, notebook and coffee",
  },
  imageB: {
    // src: heroB,
    src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1470&q=60",
    alt: "Alternative workspace with laptop and mug",
  },

  // CTA variants for A/B
  ctaA: { label: "Explore eBooks", to: "/products" },
  ctaB: { label: "Read a Free Sample", to: "/sample" },
};

export const Hero = ({ content = DEFAULT_CONTENT }) => {
  const { bucket, override } = useExperiment("hero");
  const { title, subtitle, imageA, imageB, ctaA, ctaB } = content;

  // Choose image & CTA by bucket (B falls back to A when missing)
  const img = bucket === "B" && imageB ? imageB : imageA;
  const cta = bucket === "A" ? ctaA : ctaB;

  return (
    <section className="my-20 flex flex-col items-center dark:text-slate-100">
      <div className="text my-5">
        <h1 className="text-5xl font-bold">{title}</h1>

        {subtitle && (
          <p className="text-2xl my-7 px-1 dark:text-slate-300">{subtitle}</p>
        )}

        {cta && (
          <Link
            to={cta.to}
            aria-label={cta.label}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={() => {
              const events = JSON.parse(localStorage.getItem("events") || "[]");
              events.unshift({ ts: Date.now(), type: "cta_click", label: cta.label, bucket });
              localStorage.setItem("events", JSON.stringify(events.slice(0, 100)));
            }}
          >
            {cta.label}
          </Link>
        )}

        {/* Test Controls */}
        <div className="mt-3 text-xs text-slate-500">
          Variant: <b>{bucket}</b>{" "}
          <button
            type="button"
            className="ml-2 mr-1 rounded border px-2 py-0.5 hover:bg-slate-50"
            onClick={() => override("A")}
          >
            A
          </button>
          <button
            type="button"
            className="rounded border px-2 py-0.5 hover:bg-slate-50"
            onClick={() => override("B")}
          >
            B
          </button>
          <span className="ml-2">or use <code>?exp=A</code> / <code>?exp=B</code> in the URL</span>
        </div>
      </div>

      <div className="visual my-5 lg:max-w-xl">
        <img
          className="rounded-lg max-h-full"
          src={img?.src}
          alt={img?.alt || "Hero image"}
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
};
