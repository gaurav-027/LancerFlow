import { SlCalender, SlGraph } from "react-icons/sl";
import { RiFileList3Fill } from "react-icons/ri";
import { SiTicktick } from "react-icons/si";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { WindIcon } from "../../../components/ui/wind";

gsap.registerPlugin(ScrollTrigger);

const scrollFrom = (targets, vars, triggerEl) =>
  gsap.from(targets, {
    ...vars,
    scrollTrigger: {
      trigger: triggerEl || (Array.isArray(targets) ? targets[0] : targets),
      start: "top 80%",
      toggleActions: "play none none none",
    },
  });

const LandingPage = () => {
  const navbarItems = useRef([]);
  const genBadge = useRef();

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    // Navbar entrance
    tl.from("#navbar", { x: -80, opacity: 0, duration: 0.4, delay: 0.15 }).from(
      navbarItems.current.filter(Boolean),
      { y: 30, opacity: 0, stagger: 0.07, duration: 0.35 },
      "-=0.1",
    );

    // Hero section — sequential with overlaps
    tl.from(genBadge.current, { opacity: 0, y: -10, duration: 0.3 }, "+=0.05")
      .from("#s1_h1", { x: -60, opacity: 0, duration: 0.45 }, "hero")
      .from("#s1_h2", { x: 60, opacity: 0, duration: 0.45 }, "hero")
      .from("#s1_p", { y: 30, opacity: 0, duration: 0.4 })
      .from("#s1_btn1", { x: -40, opacity: 0, duration: 0.35 }, "btns")
      .from("#s1_btn2", { x: 40, opacity: 0, duration: 0.35 }, "btns")
      .from(
        "#s1_img",
        { scale: 0.85, opacity: 0, duration: 1, ease: "back.out(1.5)" },
        "-=0.6",
      );

    // Section 2
    scrollFrom("#s2_h1", { y: 35, opacity: 0, duration: 0.5 });
    scrollFrom("#s2_p", { y: 35, opacity: 0, duration: 0.5 });
    scrollFrom(
      ["#s2_card1", "#s2_card2", "#s2_card3"],
      { y: 50, opacity: 0, duration: 0.6, stagger: 0.15 },
      "#s2_card1",
    );

    // Section 3
    scrollFrom("#s3_h", { y: 40, opacity: 0, duration: 0.5 });
    scrollFrom("#s3_p", { y: 40, opacity: 0, duration: 0.5 });
    scrollFrom(
      ["#s3_card1", "#s3_card2", "#s3_card3"],
      { y: 50, opacity: 0, duration: 0.6, stagger: 0.15 },
      "#s3_card1",
    );

    // Section 4 CTA
    scrollFrom("#s4", { y: 40, scale: 0.97, opacity: 0, duration: 0.6 });
  }, []);

  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="fixed w-[500px] h-[500px] bg-blue-500 blur-[200px] opacity-20 bottom-[0px] right-[0px] overflow-x-hidden" />
      <div className="fixed w-[400px] h-[400px] bg-blue-500 blur-[200px] opacity-20 top-[100px] left-[0px] overflow-x-hidden" />

      <div className="w-full h-20 flex justify-between items-center border-b-2 border-white/10 px-15 sticky top-0 z-50 backdrop-blur-md">
        <div className="flex w-full justify-between gap-5">
          <div className="text-4xl flex justify-center items-center">
            LancerFlow
            <WindIcon size={40} />
          </div>
          <div className="flex justify-center items-center gap-10">
            {[
              { name: "About", id: "section1" },
              { name: "Services", id: "section2" },
              { name: "Pricing", id: "section3" },
            ].map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  document.getElementById(item.id)?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="relative overflow-hidden h-6 cursor-pointer group"
              >
                <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                  {item.name}
                </span>

                <span className="block absolute top-full left-0 transition-transform duration-300 group-hover:-translate-y-full">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 1 — Hero */}
      <section
        className="flex justify-center items-center sm:pt-20 sm:pb-16 px-15"
        id="section1"
      >
        <div className="w-full flex flex-col sm:flex-row gap-10 sm:gap-12 items-center">
          {/* Left copy */}
          <div className="sm:w-1/2 flex flex-col gap-6">
            <span
              ref={genBadge}
              className="bg-blue-600/25 w-fit px-4 py-3 text-xs rounded-full tracking-widest text-blue-300 uppercase"
            >
              Next Gen Freelancing
            </span>

            <div className="flex flex-col gap-2">
              <h1
                id="s1_h1"
                className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight"
              >
                Manage Your Freelance
              </h1>
              <h1
                id="s1_h2"
                className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight bg-[image:var(--primary-gradient)] bg-clip-text text-transparent"
              >
                Business with AI
              </h1>
            </div>

            <p
              id="s1_p"
              className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-md"
            >
              Stop juggling spreadsheets and chasing invoices. LancerFlow uses
              AI to automate scheduling, proposals, and client management — so
              you can focus on the work that matters.
            </p>

            <div
              onClick={() => {
                navigate("/dashboard");
              }}
              id="s1_btns"
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              <button
                id="s1_btn1"
                className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors font-medium text-sm"
              >
                Start Free Trial
              </button>
              <button
                id="s1_btn2"
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 transition-colors font-medium text-sm border border-white/10"
              >
                View Demo
              </button>
            </div>
          </div>

          {/* Right image */}
          <div
            id="s1_img"
            className="sm:w-1/2 hidden sm:block rounded-3xl overflow-hidden aspect-[4/3]"
          >
            <img
              className="w-full h-full object-cover"
              src="landing.png"
              alt="LancerFlow dashboard preview"
            />
          </div>
        </div>
      </section>

      {/* Section 2 — Features */}
      <section
        id="section2"
        className="w-full flex flex-col gap-12 py-16 px-15 sm:py-20"
      >
        <div className="max-w-xl">
          <h2
            id="s2_h1"
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 leading-tight"
          >
            AI-Powered Efficiency
          </h2>
          <p
            id="s2_p"
            className="text-base sm:text-lg text-zinc-400 leading-relaxed"
          >
            Every feature is built around saving you time — from smart
            scheduling to automated invoicing and real-time analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div
            id="s2_card1"
            className="bg-white/5 border border-white/8 flex flex-col p-7 gap-4 rounded-3xl hover:bg-white/8 transition-colors"
          >
            <span className="h-11 w-11 rounded-full bg-[#102343] flex justify-center items-center shrink-0">
              <SlCalender fontSize={20} color="#0d65f2" />
            </span>
            <h3 className="text-base font-semibold">Smart Scheduling</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              AI analyzes your workload and client timelines to suggest the
              optimal schedule — no more double-bookings or missed deadlines.
            </p>
          </div>

          <div
            id="s2_card2"
            className="bg-white/5 border border-white/8 flex flex-col p-7 gap-4 rounded-3xl hover:bg-white/8 transition-colors"
          >
            <span className="h-11 w-11 rounded-full bg-[#302145] flex justify-center items-center shrink-0">
              <RiFileList3Fill fontSize={20} color="#c084fc" />
            </span>
            <h3 className="text-base font-semibold">Instant Proposals</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Generate polished, client-ready proposals in seconds. Customize
              tone, scope, and pricing with a single prompt.
            </p>
          </div>

          <div
            id="s2_card3"
            className="bg-white/5 border border-white/8 flex flex-col p-7 gap-4 rounded-3xl hover:bg-white/8 transition-colors"
          >
            <span className="h-11 w-11 rounded-full bg-[#10342d] flex justify-center items-center shrink-0">
              <SlGraph fontSize={20} color="#34d399" />
            </span>
            <h3 className="text-base font-semibold">Revenue Analytics</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Track earnings, project profitability, and growth trends in one
              clean dashboard. Know exactly where your time pays off.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3 — Pricing */}
      <section
        className="w-full flex flex-col gap-12 py-16 sm:py-20"
        id="section3"
      >
        <div className="text-center">
          <h2
            id="s3_h"
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 leading-tight"
          >
            Choose Your Flight Path
          </h2>
          <p id="s3_p" className="text-base text-zinc-400">
            Scalable plans for every stage of your freelance journey
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-6">
          {/* Free */}
          <div
            id="s3_card1"
            className="w-full md:w-72 lg:w-80 bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col gap-8"
          >
            <div>
              <p className="text-sm text-zinc-400 uppercase tracking-wider mb-2">
                Free Pilot
              </p>
              <p className="flex items-end gap-1">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-zinc-400 mb-1">/mo</span>
              </p>
            </div>
            <button className="w-full py-3 rounded-full border border-white/15 text-sm font-medium bg-white/5 hover:bg-white/10 transition-colors active:scale-95">
              Start free
            </button>
            <ul className="flex flex-col gap-3 text-sm text-zinc-400">
              <li className="flex gap-3 items-center">
                <SiTicktick className="text-blue-500 shrink-0" />
                Basic AI Tools
              </li>
              <li className="flex gap-3 items-center">
                <SiTicktick className="text-blue-500 shrink-0" />3 Active
                Projects
              </li>
              <li className="flex gap-3 items-center">
                <SiTicktick className="text-blue-500 shrink-0" />
                Community Support
              </li>
            </ul>
          </div>

          {/* Pro — highlighted */}
          <div
            id="s3_card2"
            className="w-full md:w-72 lg:w-80 bg-blue-600/10 border-2 border-blue-600 p-8 rounded-3xl flex flex-col gap-8 relative md:-mt-4 md:-mb-4"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-blue-600 text-xs font-semibold whitespace-nowrap">
              Most Popular
            </div>
            <div>
              <p className="text-sm text-blue-400 uppercase tracking-wider mb-2">
                Pro Captain
              </p>
              <p className="flex items-end gap-1">
                <span className="text-5xl font-bold">$29</span>
                <span className="text-zinc-400 mb-1">/mo</span>
              </p>
            </div>
            <button className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors text-sm font-medium active:scale-95">
              Go Pro
            </button>
            <ul className="flex flex-col gap-3 text-sm text-zinc-400">
              <li className="flex gap-3 items-center">
                <SiTicktick className="text-blue-500 shrink-0" />
                Advanced AI Tools
              </li>
              <li className="flex gap-3 items-center">
                <SiTicktick className="text-blue-500 shrink-0" />
                Unlimited Projects
              </li>
              <li className="flex gap-3 items-center">
                <SiTicktick className="text-blue-500 shrink-0" />
                Priority Support
              </li>
              <li className="flex gap-3 items-center">
                <SiTicktick className="text-blue-500 shrink-0" />
                Custom Branding
              </li>
            </ul>
          </div>

          {/* Agency */}
          <div
            id="s3_card3"
            className="w-full md:w-72 lg:w-80 bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col gap-8"
          >
            <div>
              <p className="text-sm text-zinc-400 uppercase tracking-wider mb-2">
                Agency Fleet
              </p>
              <p className="flex items-end gap-1">
                <span className="text-5xl font-bold">$99</span>
                <span className="text-zinc-400 mb-1">/mo</span>
              </p>
            </div>
            <button className="w-full py-3 rounded-full border border-white/15 text-sm font-medium bg-white/5 hover:bg-white/10 transition-colors active:scale-95">
              Contact Sales
            </button>
            <ul className="flex flex-col gap-3 text-sm text-zinc-400">
              <li className="flex gap-3 items-center">
                <SiTicktick className="text-blue-500 shrink-0" />
                Full AI Suite
              </li>
              <li className="flex gap-3 items-center">
                <SiTicktick className="text-blue-500 shrink-0" />
                Team Collaboration
              </li>
              <li className="flex gap-3 items-center">
                <SiTicktick className="text-blue-500 shrink-0" />
                Dedicated Manager
              </li>
              <li className="flex gap-3 items-center">
                <SiTicktick className="text-blue-500 shrink-0" />
                API Access
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 4 — CTA */}
      <section className="w-full flex justify-center py-16 sm:py-20">
        <div
          id="s4"
          className="w-full md:w-[85vw] lg:w-[72vw] bg-(image:--secondary-gradient) border border-white/8 rounded-3xl text-center px-8 md:px-20 py-14 md:py-20 flex flex-col items-center gap-8"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-lg">
            Ready to Pilot Your Future?
          </h2>
          <p className="text-base text-zinc-400 max-w-md leading-relaxed">
            Join 15,000+ freelancers who have reclaimed 20+ hours a week using
            WorkPilot's AI intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 font-semibold text-sm bg-blue-600 hover:bg-blue-500 transition-colors rounded-full active:scale-95 cursor-pointer">
              Launch LancerFlow Now
            </button>
            <button className="w-full sm:w-auto px-8 py-4 font-semibold text-sm bg-white/8 border border-white/15 hover:bg-white/12 transition-colors rounded-full active:scale-95 cursor-pointer">
              Talk to an Expert
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
