
import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Headphones,
  Package,
  Truck,
  CreditCard,
  RefreshCw,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Send,
  ShoppingBag,
  Mail,
  Clock,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

export default function Support() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openFAQ, setOpenFAQ] = useState(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Order Related",
    message: "",
  });

  const categories = [
    { name: "All", icon: HelpCircle },
    { name: "Orders", icon: Package },
    { name: "Shipping", icon: Truck },
    { name: "Payments", icon: CreditCard },
    { name: "Returns", icon: RefreshCw },
    { name: "Products", icon: ShoppingBag },
  ];

  const faqs = [
    {
      category: "Orders",
      question: "How can I track my order?",
      answer:
        "You can track your order by opening the Track My Orders page from the three-dot menu in the navbar. You will be able to view your order details and its current status.",
    },
    {
      category: "Orders",
      question: "How can I cancel my order?",
      answer:
        "If you need to cancel an order, contact our support team with your order details as soon as possible. Cancellation availability may depend on the order status.",
    },
    {
      category: "Orders",
      question: "How do I know if my order is confirmed?",
      answer:
        "After successfully placing your order, you should see an order confirmation message. You can also visit Track My Orders to check the current status.",
    },
    {
      category: "Shipping",
      question: "How long does delivery take?",
      answer:
        "Delivery time depends on your location and order processing. Check your order details for updates. The estimated delivery period should be confirmed when your shipping service is configured.",
    },
    {
      category: "Shipping",
      question: "Can I change my delivery address?",
      answer:
        "Please contact support as soon as possible if you need to change your delivery address. Address changes may not be possible after dispatch.",
    },
    {
      category: "Payments",
      question: "What payment methods are available?",
      answer:
        "Available payment methods are displayed during checkout. Please check the checkout page for the payment options currently enabled.",
    },
    {
      category: "Payments",
      question: "What should I do if my payment fails?",
      answer:
        "Check your payment details and try again. If money was deducted but your order was not confirmed, contact support with your payment reference.",
    },
    {
      category: "Returns",
      question: "Can I return a product?",
      answer:
        "For return or replacement requests, contact support with your order details and explain the issue. Eligibility depends on the product condition and applicable return policy.",
    },
    {
      category: "Products",
      question: "What if a product is out of stock?",
      answer:
        "Products that are out of stock may not be available to add to your cart. Please check the Shop page again for availability.",
    },
    {
      category: "Products",
      question: "How should I store my chocolates?",
      answer:
        "Store chocolates in a cool, dry place away from direct sunlight and heat. Follow any specific storage instructions provided with the product.",
    },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "All" ||
      faq.category === activeCategory;

    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Front-end demonstration only.
    // Connect this handler to your backend to receive support requests.

    toast.success("Your support message has been submitted!");

    setFormData({
      name: "",
      email: "",
      subject: "Order Related",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#080808] px-4 pb-20 pt-36 text-white sm:px-8">

      {/* HERO SECTION */}
      <section className="relative mx-auto mb-20 max-w-7xl overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#24180e] via-[#17100b] to-[#090909] px-6 py-16 text-center shadow-2xl sm:px-12 sm:py-24">

        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-amber-500/10 blur-[100px]" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-orange-500/10 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-3xl">

          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-500/10 text-amber-400 shadow-lg shadow-amber-500/10">
            <Headphones size={32} />
          </div>

          <p className="mb-4 text-xs font-bold uppercase tracking-[5px] text-amber-400">
            Lindt Customer Care
          </p>

          <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-6xl">
            How Can We{" "}
            <span className="text-amber-400">Help You?</span>
          </h1>

          <p className="mx-auto mb-9 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
            Have a question about your favourite chocolates?
            We're here to help you with orders, payments,
            delivery and everything in between.
          </p>

          <div className="mx-auto flex max-w-xl items-center gap-3 rounded-full border border-white/15 bg-white/[0.07] px-5 py-4 backdrop-blur-xl">
            <Search className="shrink-0 text-amber-400" size={20} />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setActiveCategory("All");
              }}
              placeholder="Search for answers..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
            />
          </div>

        </div>
      </section>

      {/* SUPPORT CATEGORIES */}
      <section className="mx-auto mb-20 max-w-7xl">

        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[4px] text-amber-400">
            Browse Help Topics
          </p>

          <h2 className="text-3xl font-bold sm:text-4xl">
            What Do You Need Help With?
          </h2>

          <p className="mt-3 text-sm text-white/50">
            Choose a category to find the answers you need.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => {
            const Icon = category.icon;
            const active = activeCategory === category.name;

            return (
              <button
                key={category.name}
                onClick={() => {
                  setActiveCategory(category.name);
                  setOpenFAQ(null);
                }}
                className={`group flex flex-col items-center justify-center gap-4 rounded-2xl border p-6 transition duration-300 ${
                  active
                    ? "border-amber-400/60 bg-amber-500/10 text-amber-400"
                    : "border-white/10 bg-white/[0.03] text-white/60 hover:border-amber-400/40 hover:bg-white/[0.07] hover:text-amber-400"
                }`}
              >
                <Icon
                  size={28}
                  className="transition duration-300 group-hover:scale-110"
                />

                <span className="text-sm font-semibold">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="mx-auto mb-24 max-w-4xl">

        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[4px] text-amber-400">
            Frequently Asked Questions
          </p>

          <h2 className="text-3xl font-bold sm:text-4xl">
            Find Your Answers
          </h2>
        </div>

        <div className="space-y-3">

          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => {
              const isOpen = openFAQ === index;

              return (
                <div
                  key={faq.question}
                  className={`overflow-hidden rounded-2xl border transition duration-300 ${
                    isOpen
                      ? "border-amber-400/40 bg-amber-500/[0.05]"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <button
                    onClick={() =>
                      setOpenFAQ(isOpen ? null : index)
                    }
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                  >
                    <div>
                      <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-amber-400">
                        {faq.category}
                      </span>

                      <span className="text-sm font-semibold sm:text-base">
                        {faq.question}
                      </span>
                    </div>

                    {isOpen ? (
                      <ChevronUp
                        className="shrink-0 text-amber-400"
                        size={20}
                      />
                    ) : (
                      <ChevronDown
                        className="shrink-0 text-white/50"
                        size={20}
                      />
                    )}
                  </button>

                  {isOpen && (
                    <div className="border-t border-white/10 px-5 py-5 sm:px-6">
                      <p className="text-sm leading-7 text-white/60">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
              <Search
                size={35}
                className="mx-auto mb-4 text-white/30"
              />

              <h3 className="mb-2 text-lg font-semibold">
                No answers found
              </h3>

              <p className="text-sm text-white/50">
                Try another search or select a different category.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
                className="mt-5 text-sm font-semibold text-amber-400 hover:text-amber-300"
              >
                Clear filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* TRACK ORDER BANNER */}
      <section className="mx-auto mb-24 max-w-7xl">

        <div className="relative overflow-hidden rounded-[28px] border border-amber-500/20 bg-gradient-to-r from-[#25170c] to-[#120d08] p-8 sm:p-12">

          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-amber-500/10 blur-[80px]" />

          <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">

            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
                <Package size={32} />
              </div>

              <div>
                <h2 className="text-2xl font-bold sm:text-3xl">
                  Waiting for Your Chocolates?
                </h2>

                <p className="mt-2 text-sm text-white/50">
                  Check your order status and stay updated on your delivery.
                </p>
              </div>
            </div>

            <Link
              to="/orders"
              className="flex shrink-0 items-center gap-3 rounded-full bg-amber-500 px-7 py-4 text-sm font-bold text-black transition hover:bg-amber-400"
            >
              Track My Orders
              <ArrowRight size={18} />
            </Link>

          </div>
        </div>
      </section>

      {/* CONTACT SUPPORT */}
      <section className="mx-auto mb-24 max-w-7xl">

        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[4px] text-amber-400">
            Get In Touch
          </p>

          <h2 className="text-3xl font-bold sm:text-4xl">
            Still Need Help?
          </h2>

          <p className="mt-3 text-sm text-white/50">
            Send us your question and tell us how we can help.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">

          {/* CONTACT INFORMATION */}
          <div className="flex flex-col justify-between rounded-[28px] border border-white/10 bg-gradient-to-br from-[#21160d] to-[#101010] p-8 sm:p-10">

            <div>
              <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
                <MessageCircle size={27} />
              </div>

              <h3 className="mb-4 text-2xl font-bold">
                We're Here For You
              </h3>

              <p className="mb-9 text-sm leading-7 text-white/50">
                Whether you have questions about an order,
                need product information or want to report an issue,
                send us a message using the contact form.
              </p>

              <div className="space-y-6">

                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-amber-400">
                    <Mail size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-white/40">
                      Email Support
                    </p>
                    <p className="text-sm font-semibold">
                      Contact through the support form
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-amber-400">
                    <Clock size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-white/40">
                      Support Availability
                    </p>
                    <p className="text-sm font-semibold">
                      Submit a request anytime
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-amber-400">
                    <ShieldCheck size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-white/40">
                      Customer Care
                    </p>
                    <p className="text-sm font-semibold">
                      We're happy to help
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <p className="mt-12 border-t border-white/10 pt-6 text-xs text-white/30">
              Thank you for choosing Lindt. Every chocolate experience matters to us.
            </p>

          </div>

          {/* CONTACT FORM */}
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 sm:p-10">

            <h3 className="mb-2 text-2xl font-bold">
              Send Us a Message
            </h3>

            <p className="mb-8 text-sm text-white/40">
              Fill in the details below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Your Name
                </label>

                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-amber-400/60"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Email Address
                </label>

                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-amber-400/60"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Support Category
                </label>

                <select
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subject: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#171717] px-4 py-4 text-sm text-white outline-none focus:border-amber-400/60"
                >
                  <option>Order Related</option>
                  <option>Shipping & Delivery</option>
                  <option>Payment Issue</option>
                  <option>Return & Replacement</option>
                  <option>Product Information</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Your Message
                </label>

                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      message: e.target.value,
                    })
                  }
                  placeholder="Tell us how we can help..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-amber-400/60"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-amber-500 py-4 text-sm font-bold text-black transition hover:bg-amber-400"
              >
                Submit Message
                <Send size={17} />
              </button>

            </form>

          </div>
        </div>
      </section>

      {/* BOTTOM SECTION */}
      <section className="mx-auto max-w-3xl text-center">

        <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
          Sweet Moments Start With Lindt
        </h2>

        <p className="mb-8 text-sm leading-7 text-white/50">
          Thank you for being part of our chocolate-loving community.
          We're always here to make your experience sweeter.
        </p>

        <Link
          to="/shop"
          className="inline-flex items-center gap-3 rounded-full border border-amber-400/40 px-8 py-4 text-sm font-semibold text-amber-400 transition hover:bg-amber-500 hover:text-black"
        >
          Explore Our Chocolates
          <ArrowRight size={18} />
        </Link>

      </section>

    </div>
  );
}
