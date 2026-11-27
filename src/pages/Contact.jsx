
// import { useState } from "react";
// import {
//   Mail,
//   Phone,
//   MapPin,
//   Clock,
//   Send,
// } from "lucide-react";

// export default function Contact() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   });

//   const [submitted, setSubmitted] = useState(false);

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//     setSubmitted(false);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // This is a frontend preview.
//     // Connect an email service or backend to actually send messages.
//     setSubmitted(true);
//   };

//   return (
//     <main className="min-h-screen bg-black text-white">

//       {/* HERO SECTION */}
//       <section className="relative flex h-[550px] items-center justify-center overflow-hidden">

//         <img
//           src="https://images.pexels.com/photos/4198415/pexels-photo-4198415.jpeg?cs=srgb&dl=pexels-karola-g-4198415.jpg&fm=jpg"
//           alt="Premium dark chocolate on a black background"
//           className="absolute inset-0 h-full w-full object-cover"
//         />

//         <div className="absolute inset-0 bg-black/65" />

//         <div className="relative z-10 px-6 text-center">
//           <p className="mb-4 text-sm uppercase tracking-[0.4em] text-amber-400">
//             We'd Love To Hear From You
//           </p>

//           <h1 className="text-4xl font-bold md:text-6xl">
//             Contact Us
//           </h1>

//           <p className="mx-auto mt-5 max-w-xl text-gray-200">
//             Have a question or need assistance?
//             We're here to make your chocolate experience sweeter.
//           </p>
//         </div>
//       </section>

//       {/* CONTACT SECTION */}
//       <section className="px-6 py-20">

//         <div className="mx-auto max-w-7xl">

//           {/* SECTION HEADING */}
//           <div className="mb-14 text-center">
//             <p className="mb-3 text-sm uppercase tracking-[0.3em] text-amber-500">
//               Get In Touch
//             </p>

//             <h2 className="text-3xl font-bold md:text-4xl">
//               Let's Start a Conversation
//             </h2>

//             <p className="mt-4 text-gray-400">
//               Send us a message and we'll be happy to help.
//             </p>
//           </div>

//           <div className="grid gap-12 lg:grid-cols-2">

//             {/* LEFT SIDE - CONTACT INFORMATION */}
//             <div className="space-y-8">

//               <div>
//                 <h3 className="text-2xl font-semibold">
//                   We'd Love to Hear From You
//                 </h3>

//                 <p className="mt-4 leading-7 text-gray-400">
//                   Whether you have questions about our chocolates,
//                   orders, or special gifts, feel free to reach out.
//                   We're always happy to help.
//                 </p>
//               </div>

//               {/* EMAIL */}
//               <div className="flex items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
//                 <div className="rounded-xl bg-orange-600/15 p-4 text-orange-400">
//                   <Mail size={25} />
//                 </div>

//                 <div>
//                   <h4 className="font-semibold">Email Us</h4>
//                   <p className="mt-2 text-sm text-gray-400">
//                     Add your business email here
//                   </p>
//                 </div>
//               </div>

//               {/* PHONE */}
//               <div className="flex items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
//                 <div className="rounded-xl bg-orange-600/15 p-4 text-orange-400">
//                   <Phone size={25} />
//                 </div>

//                 <div>
//                   <h4 className="font-semibold">Call Us</h4>
//                   <p className="mt-2 text-sm text-gray-400">
//                     Add your business phone number here
//                   </p>
//                 </div>
//               </div>

//               {/* LOCATION */}
//               <div className="flex items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
//                 <div className="rounded-xl bg-orange-600/15 p-4 text-orange-400">
//                   <MapPin size={25} />
//                 </div>

//                 <div>
//                   <h4 className="font-semibold">Our Location</h4>
//                   <p className="mt-2 text-sm text-gray-400">
//                     Add your business address here
//                   </p>
//                 </div>
//               </div>

//               {/* BUSINESS HOURS */}
//               <div className="flex items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
//                 <div className="rounded-xl bg-orange-600/15 p-4 text-orange-400">
//                   <Clock size={25} />
//                 </div>

//                 <div>
//                   <h4 className="font-semibold">Working Hours</h4>
//                   <p className="mt-2 text-sm text-gray-400">
//                     Add your business hours here
//                   </p>
//                 </div>
//               </div>

//             </div>

//             {/* RIGHT SIDE - CONTACT FORM */}
//             <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 md:p-10">

//               <h3 className="mb-2 text-2xl font-bold">
//                 Send Us a Message
//               </h3>

//               <p className="mb-8 text-sm text-gray-400">
//                 Fill in the details below.
//               </p>

//               <form onSubmit={handleSubmit} className="space-y-6">

//                 {/* NAME */}
//                 <div>
//                   <label className="mb-2 block text-sm font-medium">
//                     Your Name
//                   </label>

//                   <input
//                     type="text"
//                     name="name"
//                     value={form.name}
//                     onChange={handleChange}
//                     placeholder="Enter your name"
//                     required
//                     className="w-full rounded-xl border border-white/10 bg-black px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500"
//                   />
//                 </div>

//                 {/* EMAIL */}
//                 <div>
//                   <label className="mb-2 block text-sm font-medium">
//                     Email Address
//                   </label>

//                   <input
//                     type="email"
//                     name="email"
//                     value={form.email}
//                     onChange={handleChange}
//                     placeholder="Enter your email"
//                     required
//                     className="w-full rounded-xl border border-white/10 bg-black px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500"
//                   />
//                 </div>

//                 {/* SUBJECT */}
//                 <div>
//                   <label className="mb-2 block text-sm font-medium">
//                     Subject
//                   </label>

//                   <input
//                     type="text"
//                     name="subject"
//                     value={form.subject}
//                     onChange={handleChange}
//                     placeholder="What is this about?"
//                     required
//                     className="w-full rounded-xl border border-white/10 bg-black px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500"
//                   />
//                 </div>

//                 {/* MESSAGE */}
//                 <div>
//                   <label className="mb-2 block text-sm font-medium">
//                     Your Message
//                   </label>

//                   <textarea
//                     name="message"
//                     value={form.message}
//                     onChange={handleChange}
//                     placeholder="Write your message here..."
//                     rows="5"
//                     required
//                     className="w-full resize-none rounded-xl border border-white/10 bg-black px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500"
//                   />
//                 </div>

//                 {/* SUBMIT BUTTON */}
//                 <button
//                   type="submit"
//                   className="flex w-full items-center justify-center gap-3 rounded-xl bg-orange-600 py-4 font-semibold text-white transition hover:bg-orange-500"
//                 >
//                   Send Message
//                   <Send size={18} />
//                 </button>

//                 {submitted && (
//                   <p className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-6 text-amber-300">
//                     Your form has been completed successfully. This is a
//                     frontend preview; connect an email service or backend
//                     to actually deliver your message.
//                   </p>
//                 )}

//               </form>
//             </div>

//           </div>
//         </div>
//       </section>

//       {/* BOTTOM BANNER */}
//       <section className="px-6 pb-20">
//         <div className="mx-auto max-w-7xl rounded-3xl bg-[#17110d] px-6 py-14 text-center">

//           <p className="mb-3 text-sm uppercase tracking-[0.3em] text-amber-400">
//             Sweet Moments Start Here
//           </p>

//           <h2 className="text-3xl font-bold md:text-4xl">
//             Thank You for Choosing Us!
//           </h2>

//           <p className="mx-auto mt-4 max-w-xl text-gray-400">
//             Every chocolate tells a story. We're happy to be
//             part of yours.
//           </p>

//         </div>
//       </section>

//     </main>
//   );
// }

import { useState } from "react";
import toast from "react-hot-toast";

import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
} from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Frontend preview only.
    // Connect an email service or backend to actually send messages.
    toast.success("Your message has been submitted successfully!");

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO SECTION */}
      <section className="relative flex h-[550px] items-center justify-center overflow-hidden">

        <img
          src="https://images.pexels.com/photos/4198415/pexels-photo-4198415.jpeg?cs=srgb&dl=pexels-karola-g-4198415.jpg&fm=jpg"
          alt="Premium dark chocolate on a black background"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/65" />

        <div className="relative z-10 px-6 text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-amber-400">
            We'd Love To Hear From You
          </p>

          <h1 className="text-4xl font-bold md:text-6xl">
            Contact Us
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-gray-200">
            Have a question or need assistance?
            We're here to make your chocolate experience sweeter.
          </p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="px-6 py-20">

        <div className="mx-auto max-w-7xl">

          {/* SECTION HEADING */}
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-amber-500">
              Get In Touch
            </p>

            <h2 className="text-3xl font-bold md:text-4xl">
              Let's Start a Conversation
            </h2>

            <p className="mt-4 text-gray-400">
              Send us a message and we'll be happy to help.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">

            {/* LEFT SIDE - CONTACT INFORMATION */}
            <div className="space-y-8">

              <div>
                <h3 className="text-2xl font-semibold">
                  We'd Love to Hear From You
                </h3>

                <p className="mt-4 leading-7 text-gray-400">
                  Whether you have questions about our chocolates,
                  orders, or special gifts, feel free to reach out.
                  We're always happy to help.
                </p>
              </div>

              {/* EMAIL */}
              <div className="flex items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <div className="rounded-xl bg-orange-600/15 p-4 text-orange-400">
                  <Mail size={25} />
                </div>

                <div>
                  <h4 className="font-semibold">Email Us</h4>
                  <p className="mt-2 text-sm text-gray-400">
                    Add your business email here
                  </p>
                </div>
              </div>

              {/* PHONE */}
              <div className="flex items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <div className="rounded-xl bg-orange-600/15 p-4 text-orange-400">
                  <Phone size={25} />
                </div>

                <div>
                  <h4 className="font-semibold">Call Us</h4>
                  <p className="mt-2 text-sm text-gray-400">
                    Add your business phone number here
                  </p>
                </div>
              </div>

              {/* LOCATION */}
              <div className="flex items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <div className="rounded-xl bg-orange-600/15 p-4 text-orange-400">
                  <MapPin size={25} />
                </div>

                <div>
                  <h4 className="font-semibold">Our Location</h4>
                  <p className="mt-2 text-sm text-gray-400">
                    Add your business address here
                  </p>
                </div>
              </div>

              {/* BUSINESS HOURS */}
              <div className="flex items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <div className="rounded-xl bg-orange-600/15 p-4 text-orange-400">
                  <Clock size={25} />
                </div>

                <div>
                  <h4 className="font-semibold">Working Hours</h4>
                  <p className="mt-2 text-sm text-gray-400">
                    Add your business hours here
                  </p>
                </div>
              </div>

            </div>

            {/* RIGHT SIDE - CONTACT FORM */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 md:p-10">

              <h3 className="mb-2 text-2xl font-bold">
                Send Us a Message
              </h3>

              <p className="mb-8 text-sm text-gray-400">
                Fill in the details below.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* NAME */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Your Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="w-full rounded-xl border border-white/10 bg-black px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="w-full rounded-xl border border-white/10 bg-black px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500"
                  />
                </div>

                {/* SUBJECT */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Subject
                  </label>

                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="What is this about?"
                    required
                    className="w-full rounded-xl border border-white/10 bg-black px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500"
                  />
                </div>

                {/* MESSAGE */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Your Message
                  </label>

                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    rows="5"
                    required
                    className="w-full resize-none rounded-xl border border-white/10 bg-black px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500"
                  />
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-orange-600 py-4 font-semibold text-white transition hover:bg-orange-500"
                >
                  Send Message
                  <Send size={18} />
                </button>

              </form>
            </div>

          </div>
        </div>
      </section>

      {/* BOTTOM BANNER */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl rounded-3xl bg-[#17110d] px-6 py-14 text-center">

          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-amber-400">
            Sweet Moments Start Here
          </p>

          <h2 className="text-3xl font-bold md:text-4xl">
            Thank You for Choosing Us!
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            Every chocolate tells a story. We're happy to be
            part of yours.
          </p>

        </div>
      </section>

    </main>
  );
}
