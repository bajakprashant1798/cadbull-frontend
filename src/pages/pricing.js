"use client"
import MainLayout from "@/layouts/MainLayout";
import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import { handleSubscription, getUserDetails } from "@/service/api";
import { toast } from "react-toastify";
import useSessionStorageData from "@/utils/useSessionStorageData";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Check, Sparkles, Zap, Crown, Gem, Star, ArrowRight, ShieldCheck, RefreshCw, Headphones, FileCheck, Users, Download, ChevronDown, X } from "lucide-react";

// Local Custom CSS for Pricing to avoid Tailwind/Bootstrap conflicts
const pricingStyles = `
.pricing-root {
  font-family: 'Inter', system-ui, sans-serif;
  background-color: #f8f9fa;
  color: #1e293b;
}

.hero-title {
  font-size: clamp(2rem, 6vw, 3.75rem);
  line-height: 1.1;
  letter-spacing: -1.5px;
  color: #0f172a;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: clamp(0.95rem, 2vw, 1.15rem);
  line-height: 1.7;
  max-width: 560px;
  margin: 0 auto;
  color: #64748b;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 1rem;
  border-radius: 99px;
  background: #fff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  margin-bottom: 1.25rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.text-gradient-navy {
  background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.bg-gradient-popular {
  background: linear-gradient(160deg, #2a374a 0%, #172033 100%);
}

.bg-gradient-gold {
  background: linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%);
}

.shadow-card {
  box-shadow: 0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02);
}

.shadow-popular {
  box-shadow: 0 20px 40px -10px rgba(15,23,42,0.4);
}

.pricing-card {
  transition: all 0.3s ease;
  border-radius: 1.25rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.bg-white.shadow-card {
  border: 1px solid rgba(0,0,0,0.03); /* Extremely subtle border */
}

.pricing-card.popular-card {
  border: 1px solid #0f172a;
}

.pricing-card:hover {
  transform: translateY(-0.25rem);
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.08), 0 10px 10px -5px rgba(0,0,0,0.03);
}

@media (min-width: 992px) {
  .popular-card-wrapper {
    margin-top: -1.25rem !important;
    z-index: 10;
  }
}

.feature-list {
  font-size: 0.85rem;
  flex-grow: 1; /* Pushes button to the bottom */
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.ai-pill {
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 0.5rem;
  padding: 0.4rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-pricing {
  font-weight: 700;
  letter-spacing: 0.5px;
  border-radius: 0.6rem;
  padding: 0.7rem 1rem;
  transition: all 0.3s ease;
  margin-top: auto; /* Aligns to bottom */
  font-size: 0.8rem;
}

.bg-grid-pattern {
  background-image: linear-gradient(rgba(148, 163, 184, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.2) 1px, transparent 1px);
  background-size: 40px 40px;
}

@media (min-width: 1200px) {
  .row-cols-xl-5 > * {
    flex: 0 0 auto;
    width: 20%;
  }
}

.badge-overlap {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-weight: 800;
  font-size: 0.55rem;
  letter-spacing: 1.5px;
  white-space: nowrap;
  z-index: 20;
}
`;

const aiTools = [
  { label: "Architecture → 3D", full: "AI Architecture Elevation to 3D" },
  { label: "Interior → 3D", full: "AI Interior Elevation to 3D" },
  { label: "Sketch → 3D", full: "Sketch to 3D conversion" },
  { label: "2D → 3D", full: "2D drawing to 3D model" },
  { label: "3D → 2D", full: "3D model to 2D drawing" },
  { label: "Image → DWG", full: "Image to DWG conversion" },
  { label: "AI Floor Plan", full: "AI-generated Floor Plans" },
  { label: "PlanForge 2D", full: "PlanForge 2D design tool" },
  { label: "Vastu Analysis", full: "AI Vastu Analysis" },
  { label: "Projects Thesis", full: "AI Projects Thesis generator" },
  { label: "Unit Converter", full: "Unit Converter tool" },
];

const baseFeatures = (premium) => [
  { label: "65K+ Free Files", full: "All 65000+ Free Files", bold: true },
  premium
    ? { label: "225K+ Premium Files", full: "All 225000+ Premium Files", bold: true }
    : { label: "0 Premium Files", full: "No Premium Files included", muted: true },
  { label: "Create Library", full: "Create your own Library" },
  { label: "Upload Files", full: "Upload your own Files" },
  { label: "Projects Library", full: "Create Projects Library" },
];

const plans = [
  {
    id: "free",
    name: "Free Plan",
    tagline: "Start free, no card needed",
    price: "$0",
    period: "forever",
    icon: "sparkles",
    stripeId: null,
    features: [
      ...baseFeatures(false),
      { label: "0 Gold / day", full: "Upto 0 Gold files/day", muted: true },
      { label: "10 Free / day", full: "Upto 10 Free files/day" },
      { label: "Unit Converter", full: "Unit Converter tool", isNew: true },
    ],
    aiCredits: "0 AI Credits",
    ctaLabel: "CURRENT PLAN",
  },
  {
    id: "silver",
    name: "Silver Plan",
    tagline: "Try the full library",
    price: "$9.99",
    period: "/ 15 Days",
    icon: "zap",
    stripeId: "price_1TSAT3Fy6VKViPpJP4SIMcZX",
    features: [
      ...baseFeatures(true),
      { label: "10 Gold / day", full: "Upto 10 Gold files/day" },
      { label: "10 Free / day", full: "Upto 10 Free files/day" },
      ...aiTools.map((t) => ({ ...t, isNew: true })),
    ],
    aiCredits: "50 AI Credits",
  },
  {
    id: "gold",
    name: "Gold Plan",
    tagline: "Best for active designers",
    price: "$14.99",
    period: "/ Month",
    icon: "crown",
    popular: true,
    badge: "MOST POPULAR",
    stripeId: "price_1TSAo6Fy6VKViPpJRV0M9OY4",
    features: [
      ...baseFeatures(true),
      { label: "20 Gold / day", full: "Upto 20 Gold files/day" },
      { label: "15 Free / day", full: "Upto 15 Free files/day" },
      ...aiTools.map((t) => ({ ...t, isNew: true })),
    ],
    aiCredits: "100 AI Credits",
  },
  {
    id: "platinum",
    name: "Platinum Plan",
    tagline: "Power for studios",
    price: "$39.99",
    period: "/ 3 Months",
    icon: "star",
    stripeId: "price_1TSB3UFy6VKViPpJdcvQYrh2",
    features: [
      ...baseFeatures(true),
      { label: "30 Gold / day", full: "Upto 30 Gold files/day" },
      { label: "25 Free / day", full: "Upto 25 Free files/day" },
      ...aiTools.map((t) => ({ ...t, isNew: true })),
    ],
    aiCredits: "400 AI Credits",
  },
  {
    id: "diamond",
    name: "Diamond Plan",
    tagline: "Maximum savings",
    price: "$99",
    period: "/ Year",
    icon: "gem",
    badge: "BEST VALUE",
    stripeId: "price_1Q8PNDFy6VKViPpJSYVg4mvU",
    features: [
      ...baseFeatures(true),
      { label: "40 Gold / day", full: "Upto 40 Gold files/day" },
      { label: "50 Free / day", full: "Upto 50 Free files/day" },
      ...aiTools.map((t) => ({ ...t, isNew: true })),
    ],
    aiCredits: "1500 AI Credits",
  },
];

const faqs = [
  { q: "Can I switch plans later?", a: "Yes, you can upgrade or downgrade your plan anytime from your dashboard. Prorated billing applies." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards, debit cards, PayPal, and UPI for Indian customers." },
  { q: "What are AI Credits?", a: "AI Credits power our new AI tools — like Sketch to 3D, Image to DWG and AI Floor Plan. Each generation uses one credit." },
  { q: "Is there a free trial?", a: "Our Free Plan gives you permanent access to 65,000+ free files with no time limit — no credit card required." },
  { q: "Do unused daily downloads roll over?", a: "Daily download limits reset every 24 hours and don't roll over. AI Credits are valid for the entire plan duration." },
];

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-3" style={{ borderRadius: '1rem', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', transition: 'all 0.3s ease' }}>
      <button
        onClick={() => setOpen(!open)}
        className="btn d-flex align-items-center justify-content-between w-100 p-4 text-start shadow-none rounded-0 border-0"
        style={{ fontWeight: '600', color: '#1e293b', backgroundColor: open ? '#f8fafc' : '#fff', transition: 'background-color 0.3s' }}
      >
        <span style={{ fontSize: '0.95rem' }}>{q}</span>
        <ChevronDown className="ms-3" size={18} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s', color: '#64748b' }} />
      </button>
      <div className={`collapse ${open ? 'show' : ''}`}>
        <div className="px-4 pb-4 pt-1 text-secondary" style={{ backgroundColor: '#f8fafc', fontSize: '0.9rem', lineHeight: '1.6' }}>
          <p className="mb-0">{a}</p>
        </div>
      </div>
    </div>
  );
};

const iconMap = { sparkles: Sparkles, zap: Zap, crown: Crown, gem: Gem, star: Star };

const PricingCard = ({ plan, onSubscribe }) => {
  const isPopular = plan.popular;
  const Icon = iconMap[plan.icon];

  return (
    <div className={`col d-flex position-relative mt-4 mt-lg-0 ${isPopular ? 'popular-card-wrapper' : 'pt-3'}`}>
      {/* Container ensures card stretches full height. overflow: visible ensures absolute badges are not clipped */}
      <div className={`card w-100 pricing-card ${isPopular ? 'bg-gradient-popular text-white popular-card shadow-popular' : 'bg-white shadow-card'}`} style={{ overflow: 'visible' }}>

        {/* Absolute Badge properly overlapping the top border */}
        {plan.badge && (
          <div
            className="badge-overlap"
            style={{
              backgroundColor: isPopular ? '#f59e0b' : '#1e293b',
              color: isPopular ? '#0f172a' : '#fff',
              boxShadow: isPopular ? '0 0 15px rgba(245, 158, 11, 0.3)' : 'none'
            }}
          >
            {plan.badge}
          </div>
        )}

        <div className="card-body d-flex flex-column p-4" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <div className="d-flex align-items-center mb-2 gap-2 mt-2">
            <div
              className="d-flex align-items-center justify-content-center rounded"
              style={{
                width: '32px', height: '32px', flexShrink: 0,
                backgroundColor: isPopular ? '#f59e0b' : '#f1f5f9',
                color: isPopular ? '#0f172a' : '#1e293b'
              }}
            >
              <Icon size={18} strokeWidth={2.5} />
            </div>
            <h5 className="mb-0 fw-bold text-truncate" style={{ fontSize: '1rem' }}>{plan.name}</h5>
          </div>
          <p className="text-uppercase fw-semibold mb-3 text-truncate" title={plan.tagline} style={{ fontSize: '0.6rem', letterSpacing: '1px', color: isPopular ? '#94a3b8' : '#64748b' }}>
            {plan.tagline}
          </p>

          {/* Price */}
          <div className="mb-3 d-flex align-items-baseline gap-1">
            <div className="d-flex align-items-baseline" style={{ color: isPopular ? '#fff' : '#0f172a' }}>
              <span className="fw-bold" style={{ fontSize: '1.25rem', marginRight: '3px' }}>{plan.price[0]}</span>
              <span className="fw-bolder" style={{ fontSize: '2.8rem', lineHeight: '1', letterSpacing: '-1.5px' }}>{plan.price.substring(1)}</span>
            </div>
            <span className="fw-semibold ms-1" style={{ fontSize: '0.75rem', color: isPopular ? '#94a3b8' : '#64748b' }}>{plan.period}</span>
          </div>

          {/* AI Credits */}
          <div
            className="ai-pill mb-3"
            style={{
              backgroundColor: isPopular ? 'rgba(255,255,255,0.08)' : '#fef08a',
              color: isPopular ? '#fff' : '#854d0e',
              border: 'none',
              boxShadow: isPopular ? 'none' : 'inset 0 0 0 1px rgba(0,0,0,0.05)'
            }}
          >
            <Sparkles size={14} />
            <span className="text-truncate">{plan.aiCredits}</span>
          </div>

          <hr className="mb-3 mt-1" style={{ borderColor: isPopular ? 'rgba(255,255,255,0.15)' : '#e2e8f0' }} />

          {/* Features */}
          <ul className="list-unstyled feature-list mb-4">
            {plan.features.map((feature, i) => (
              <li key={i} className={`feature-item ${feature.muted ? 'opacity-50' : ''}`}>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: '14px', height: '14px',
                    backgroundColor: isPopular ? '#f59e0b' : '#f1f5f9',
                    color: isPopular ? '#0f172a' : '#64748b'
                  }}
                >
                  <Check size={9} strokeWidth={4} />
                </div>
                <span title={feature.full} className={`flex-grow-1 text-truncate ${feature.bold ? 'fw-bold' : ''}`} style={{ fontSize: '0.72rem', color: isPopular ? '#f8fafc' : '#334155' }}>
                  {feature.label}
                </span>
                {feature.isNew && (
                  <span className="badge ms-1" style={{ fontSize: '0.45rem', padding: '0.2rem 0.3rem', backgroundColor: isPopular ? '#f59e0b' : '#eff6ff', color: isPopular ? '#0f172a' : '#1e3a8a', border: isPopular ? 'none' : '1px solid #bfdbfe' }}>
                    NEW
                  </span>
                )}
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <button
            onClick={() => onSubscribe(plan)}
            className="btn btn-pricing w-100 d-flex justify-content-center align-items-center gap-2 shadow-none"
            style={{
              backgroundColor: isPopular ? '#f59e0b' : '#0f172a',
              color: isPopular ? '#0f172a' : '#fff',
              border: 'none',
              marginTop: 'auto' /* Crucial for bottom alignment */
            }}
          >
            <span className="text-truncate">{plan.ctaLabel || "BUY NOW"}</span>
            <ArrowRight size={14} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Pricing = () => {
  const router = useRouter();
  const userData = useSessionStorageData("userData");
  const isAuthenticated = useSelector((store) => store.logininfo.isAuthenticated);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [activeSubscription, setActiveSubscription] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const [billing, setBilling] = useState("all");

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!isAuthenticated) return;
      try {
        const response = await getUserDetails();
        if (!response) return;
        setUser(response.data);
        const expDate = new Date(response.data.acc_exp_date);
        const today = new Date();
        if (response.data.acc_exp_date && expDate > today) {
          setActiveSubscription(true);
          const planName = response.data.subscription_plan ? response.data.subscription_plan.charAt(0).toUpperCase() + response.data.subscription_plan.slice(1) : "Premium";
          setMessage(`✅ Your ${planName} account expires on ${expDate.toDateString()}`);
        } else {
          setActiveSubscription(false);
          setMessage("✖ Oops! Looks like you're not on an active subscription yet. But no worries – you're just one click away from accessing our entire CAD library! Subscribe today and explore without limits!");
        }
      } catch (error) {
        console.error("❌ Error fetching user details:", error);
      }
    };
    if (isAuthenticated) fetchUserDetails();
  }, [isAuthenticated]);

  const handleSubscribe = async (plan) => {
    if (!userData) {
      router.push(`/auth/login?redirect=${router.asPath}`);
      return;
    }
    if (!plan.stripeId) {
      toast.info("You already have the Free Plan by default!");
      return;
    }
    try {
      const res = await handleSubscription(plan.stripeId, user.id);
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Subscription error:", err);
    }
  };

  const baseFiltered = billing === "all" ? plans : billing === "monthly" ? plans.filter((p) => ["free", "silver", "gold"].includes(p.id)) : plans.filter((p) => ["free", "platinum", "diamond"].includes(p.id));

  return (
    <Fragment>
      <Head>
        <title>Cadbull Pricing Plans | Affordable AutoCAD Files for Architecture</title>
      </Head>
      <style dangerouslySetInnerHTML={{ __html: pricingStyles }} />
      <div className="pricing-root pb-5 position-relative">
        <div className="position-absolute w-100 h-100 bg-grid-pattern" style={{ zIndex: 0, opacity: 0.3 }}></div>

        {/* Hero */}
        <section className="pt-5 pb-3 pb-xl-5 position-relative z-1">
          <div className="container pt-4">
            {message && showMessage && (
              <div className="mx-auto mb-4 p-3 position-relative rounded d-flex justify-content-center align-items-center" style={{
                maxWidth: '900px',
                backgroundColor: activeSubscription ? '#dcfce7' : '#ff6b6b',
                color: activeSubscription ? '#166534' : '#ffffff',
                border: activeSubscription ? '1px solid #bbf7d0' : 'none',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
              }}>
                <span className="fw-semibold text-center" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{message}</span>
                <button
                  onClick={() => setShowMessage(false)}
                  className="position-absolute d-flex align-items-center justify-content-center rounded-circle border-0 bg-white"
                  style={{
                    width: '24px',
                    height: '24px',
                    top: '-10px',
                    right: '-10px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                    color: '#0f172a'
                  }}
                >
                  <X size={14} strokeWidth={4} />
                </button>
              </div>
            )}

            <div className="text-center mb-5 mt-4">
              <div className="hero-badge">
                <span style={{ color: '#f59e0b', fontSize: '0.7rem' }}>✦</span>
                NEW · AI design tools now included
              </div>
              <h1 className="fw-bolder hero-title">
                New Files Daily,{' '}
                <span className="d-block text-gradient-navy">No Exceptions!</span>
              </h1>
              <p className="hero-subtitle mt-3">
                Choose the plan that fits your workflow. Daily updates, instant
                downloads, and our growing AI toolkit.
              </p>

              {/* Billing Toggle */}
              <div className="mt-5 d-flex justify-content-center">
                <div className="bg-white p-1 rounded-pill d-inline-flex" style={{ border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  {[{ id: "all", label: "All Plans" }, { id: "monthly", label: "Short-term" }, { id: "yearly", label: "Long-term" }].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setBilling(opt.id)}
                      className={`btn rounded-pill border-0 px-4 py-2 shadow-none ${billing === opt.id ? 'text-white fw-bold' : 'text-secondary fw-semibold'}`}
                      style={{
                        backgroundColor: billing === opt.id ? '#0f172a' : 'transparent',
                        color: billing === opt.id ? '#fff' : '#64748b',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Grid */}
        <section className="position-relative z-1 pb-5">
          <div className="container-fluid px-3 px-xl-5 mx-auto" style={{ maxWidth: '1600px' }}>
            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-5 g-3 justify-content-center align-items-stretch">
              {baseFiltered.map((plan) => (
                <PricingCard key={plan.id} plan={plan} onSubscribe={handleSubscribe} />
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="position-relative z-1 py-5 mt-5">
          <div className="container">
            <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
              <h2 className="fw-bolder mb-3" style={{ color: '#0f172a' }}>Frequently Asked Questions</h2>
              <p className="text-secondary">Everything you need to know about our plans and billing.</p>
            </div>
            <div className="mx-auto" style={{ maxWidth: '800px' }}>
              {faqs.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
};

Pricing.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default Pricing;
