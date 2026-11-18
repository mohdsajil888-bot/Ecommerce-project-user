
import { Link } from "react-router-dom";
import {
  Heart,
  Sparkles,
  Award,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

export default function About() {
  const values = [
    {
      icon: <Heart size={27} />,
      number: "01",
      title: "Made With Passion",
      description:
        "Every creation is made with care and a passion for unforgettable chocolate experiences.",
    },
    {
      icon: <Sparkles size={27} />,
      number: "02",
      title: "Unique Flavours",
      description:
        "We bring together exciting combinations, rich textures and delightful flavours.",
    },
    {
      icon: <Award size={27} />,
      number: "03",
      title: "Quality First",
      description:
        "We focus on thoughtful preparation, delicious ingredients and beautiful presentation.",
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#090807] text-white">

      {/* EDITORIAL INTRO */}
      <section className="px-6 pb-20 pt-40 md:px-16 lg:px-24">
        <div className="mx-auto max-w-7xl">

          <p className="mb-7 text-xs uppercase tracking-[0.5em] text-amber-500">
            The Story Behind Every Bite
          </p>

          <div className="grid gap-10 md:grid-cols-12 md:items-end">

            <div className="md:col-span-8">
              <h1 className="text-5xl font-light leading-[1.1] md:text-7xl lg:text-8xl">
                More Than
                <br />
                Just <span className="font-serif italic text-amber-400">Chocolate.</span>
              </h1>
            </div>

            <div className="md:col-span-4">
              <p className="max-w-sm text-sm leading-8 text-gray-400">
                We believe the sweetest moments are the ones
                we share. Our passion is creating chocolate
                experiences that make those moments memorable.
              </p>
            </div>

          </div>

          <div className="mt-14 overflow-hidden rounded-3xl">
            <img
              src="https://i.pinimg.com/1200x/02/8a/46/028a46661f6e29d57819ea0433c2ab6c.jpg"
              alt="Premium chocolate pieces and chocolate creations"
              className="h-[300px] w-full object-cover md:h-[480px]"
            />
          </div>

        </div>
      </section>

      {/* OUR STORY */}
      <section className="px-6 py-24 md:px-16 lg:px-24">
        <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">

          {/* IMAGE SIDE */}
          <div className="relative mx-auto w-full max-w-lg">

            <div className="absolute -left-5 -top-5 h-full w-full rounded-3xl border border-amber-500/20" />

            <div className="relative h-[450px] overflow-hidden rounded-3xl">
              <img
                src="https://www.kunafatales.com/assets/hero-kunafa-bar-DlcAGYKJ.jpg"
                alt="Pistachio and chocolate creation"
                className="h-full w-full object-cover transition duration-700 hover:scale-105"
              />
            </div>

            <div className="absolute -bottom-7 -right-3 rounded-2xl border border-amber-500/20 bg-[#21160e] px-7 py-5 shadow-2xl md:-right-7">
              <p className="font-serif text-2xl italic text-amber-400">
                Made with love
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-gray-400">
                Every single bite
              </p>
            </div>

          </div>

          {/* STORY TEXT */}
          <div className="pt-8 md:pt-0">

            <p className="mb-5 text-xs uppercase tracking-[0.4em] text-amber-500">
              Who We Are
            </p>

            <h2 className="text-4xl font-light leading-tight md:text-5xl">
              A Passion for Chocolate,
              <br />
              <span className="font-serif italic text-amber-400">
                A Taste of Happiness.
              </span>
            </h2>

            <p className="mt-8 leading-8 text-gray-400">
              We believe chocolate is more than just a sweet
              treat. It is a way to celebrate special moments,
              share happiness and create unforgettable memories.
            </p>

            <p className="mt-5 leading-8 text-gray-400">
              From rich chocolate creations to delightful
              pistachio kunafa combinations and crunchy treats,
              our collection is designed to make every moment
              a little sweeter.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <CheckCircle2 size={18} className="text-amber-400" />
                Thoughtfully created chocolate experiences
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-300">
                <CheckCircle2 size={18} className="text-amber-400" />
                Exciting flavours and textures
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-300">
                <CheckCircle2 size={18} className="text-amber-400" />
                Made for sharing and celebrating
              </div>
            </div>

            <Link
              to="/shop"
              className="mt-10 inline-flex items-center gap-3 border-b border-amber-500 pb-3 text-sm font-semibold uppercase tracking-widest text-amber-400 transition hover:gap-6"
            >
              Explore Our Chocolates
              <ArrowUpRight size={18} />
            </Link>

          </div>

        </div>
      </section>

      {/* BRAND VALUES */}
      <section className="bg-[#15100c] px-6 py-24 md:px-16 lg:px-24">
        <div className="mx-auto max-w-7xl">

          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.4em] text-amber-500">
                What Makes Us Different
              </p>

              <h2 className="text-4xl font-light md:text-5xl">
                Our Philosophy.
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-gray-400">
              The little details make a big difference.
              These are the values behind everything we create.
            </p>

          </div>

          <div className="grid gap-5 md:grid-cols-3">

            {values.map((value) => (
              <div
                key={value.number}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition duration-500 hover:-translate-y-2 hover:border-amber-500/40 hover:bg-white/[0.06]"
              >

                <div className="mb-10 flex items-center justify-between">
                  <div className="text-amber-400">
                    {value.icon}
                  </div>

                  <span className="text-sm text-gray-600">
                    {value.number}
                  </span>
                </div>

                <h3 className="text-xl font-semibold transition group-hover:text-amber-400">
                  {value.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-400">
                  {value.description}
                </p>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* FINAL STORY SECTION */}
      <section className="px-6 py-28 md:px-16 lg:px-24">
        <div className="mx-auto max-w-7xl">

          <div className="grid items-center gap-12 md:grid-cols-2">

            <div>
              <p className="mb-5 text-xs uppercase tracking-[0.4em] text-amber-500">
                A Little More Happiness
              </p>

              <h2 className="text-4xl font-light leading-tight md:text-6xl">
                Every Moment
                <br />
                Deserves a
                <span className="font-serif italic text-amber-400">
                  {" "}Sweet Touch.
                </span>
              </h2>

              <p className="mt-6 max-w-lg leading-8 text-gray-400">
                Whether you are treating yourself or surprising
                someone special, discover chocolates made to
                bring a little happiness into every day.
              </p>

              <Link
                to="/shop"
                className="mt-9 inline-flex items-center gap-3 rounded-full bg-orange-600 px-8 py-4 text-sm font-semibold transition hover:bg-orange-500"
              >
                Discover Our Collection
                <ArrowUpRight size={19} />
              </Link>
            </div>

            <div className="h-[380px] overflow-hidden rounded-3xl md:h-[470px]">
              <img
                src="https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1200&q=90"
                alt="Assorted premium chocolate treats"
                className="h-full w-full object-cover transition duration-700 hover:scale-105"
              />
            </div>

          </div>

        </div>
      </section>

    </main>
  );
}
