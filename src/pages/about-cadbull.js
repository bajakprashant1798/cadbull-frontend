import MainLayout from "@/layouts/MainLayout";
import Head from "next/head";
import Link from "next/link";
import { Fragment, useState } from "react";
import {
  Users,
  Download,
  Eye,
  Globe,
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Cpu,
  ChevronDown,
  ArrowRight,
  MapPin,
  Briefcase,
  Clock,
  Rocket,
  Star,
  UserCheck,
  GraduationCap,
  Home,
  Building2,
  Compass,
  FileCheck2,
  ExternalLink,
  Laptop,
  Tv,
  HardHat,
  TrendingUp,
  Landmark,
  Bot,
  Sun,
  Flag,
  Gamepad2,
  Pill,
  Palette,
  Film,
  FolderArchive
} from "lucide-react";

// Scoped Custom Styles for About Cadbull page
const customStyles = `
.about-cadbull-root {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #1e293b;
  background-color: #f8fafc;
  overflow-x: hidden;
}

.hero-gradient-bg {
  background: radial-gradient(100% 100% at 50% 0%, rgba(30, 58, 138, 0.05) 0%, rgba(248, 250, 252, 1) 100%);
  position: relative;
}

.text-gradient-primary {
  background: linear-gradient(135deg, #1e3a8a 0%, #ed4d4c 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.badge-pill-soft {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  background-color: #eff6ff;
  border: 1px solid #dbeafe;
  color: #1d4ed8;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.stat-card-modern {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1.75rem 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
}

.stat-card-modern:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
  border-color: #cbd5e1;
}

.vertical-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1.5rem;
  height: 100%;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.vertical-card:hover {
  border-color: #ed4d4c;
  transform: translateY(-3px);
  box-shadow: 0 10px 25px -5px rgba(237, 77, 76, 0.1);
}

.vertical-badge-active {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.vertical-badge-upcoming {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.timeline-container {
  position: relative;
  padding-left: 2rem;
}

@media (min-width: 768px) {
  .timeline-container {
    padding-left: 0;
  }
  .timeline-container::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #e2e8f0;
    transform: translateX(-50%);
  }
}

.timeline-item {
  position: relative;
  margin-bottom: 2.5rem;
}

.timeline-dot {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #1e3a8a;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  box-shadow: 0 0 0 4px #eff6ff;
  position: absolute;
  left: -2.5rem;
  top: 0;
  z-index: 2;
}

@media (min-width: 768px) {
  .timeline-dot {
    left: 50%;
    transform: translateX(-50%);
  }
}

.audience-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.25s ease;
  height: 100%;
}

.audience-card:hover {
  background: #ffffff;
  border-color: #3b82f6;
  box-shadow: 0 8px 16px -4px rgba(59, 130, 246, 0.1);
}

.faq-card {
  border: 1px solid #e2e8f0;
  border-radius: 0.875rem;
  background: #ffffff;
  overflow: hidden;
  transition: all 0.2s ease;
}

.faq-card:hover {
  border-color: #cbd5e1;
}

.cta-banner {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
  border-radius: 1.5rem;
  padding: 3.5rem 2rem;
  color: #ffffff;
  position: relative;
  overflow: hidden;
}
`;

// Verticals Data
const activeVerticals = [
  {
    id: 1,
    name: "Shuttech",
    icon: Laptop,
    badge: "Tech & News Hub",
    description: "Shuttech is your comprehensive guide to the ever-evolving world of technology. We deliver cutting-edge news, in-depth tutorials, unbiased software reviews, and expert insights on artificial intelligence, web development, mobile applications, and emerging digital trends. Our mission is to keep tech enthusiasts, developers, and professionals informed and ahead of the curve in the rapidly changing digital landscape."
  },
  {
    id: 2,
    name: "CastingScreen",
    icon: Tv,
    badge: "Entertainment & Media",
    description: "CastingScreen revolutionizes how talent meets opportunity in the entertainment and creative industries. Our professional ecosystem connects actors, models, dancers, musicians, and creative professionals with casting directors, production houses, and agencies. With comprehensive profile management, real-time casting calls, and powerful networking tools, CastingScreen is the go-to platform for anyone looking to advance their career in entertainment."
  },
  {
    id: 3,
    name: "CivilEngi",
    icon: HardHat,
    badge: "Engineering Knowledge",
    description: "CivilEngi is the premier online resource for civil engineering professionals and construction industry experts. Our platform provides a comprehensive knowledge base covering structural engineering, geotechnical studies, transportation, water resources, and construction management. With technical articles, case studies, innovative methods, and industry news, CivilEngi empowers engineers to excel in their projects and stay current with industry developments."
  },
  {
    id: 4,
    name: "DiBull",
    icon: TrendingUp,
    badge: "Digital Services & Growth",
    description: "DiBull is the flagship digital services platform of Digital Bull Technology, offering comprehensive solutions for businesses seeking growth in the digital age. From cutting-edge digital marketing strategies to custom website and application development, and transformative business coaching, DiBull provides end-to-end services that drive measurable results. Our expert team combines technical excellence with strategic insight to help businesses thrive online."
  },
  {
    id: 5,
    name: "Gift City Property",
    icon: Landmark,
    badge: "Real Estate & Finance Hub",
    description: "Gift City Property is India's premier real estate portal dedicated exclusively to Gujarat International Finance Tec-City (GIFT City). As India's first operational smart city and International Financial Services Centre, GIFT City represents unprecedented investment opportunities. Our platform provides comprehensive property listings, project information, investment insights, and expert guidance for commercial and residential real estate in this rapidly developing financial hub."
  }
];

const upcomingVerticals = [
  {
    id: 1,
    name: "HireForJob",
    icon: Bot,
    description: "HireForJob is designed to revolutionize the recruitment landscape by creating a seamless bridge between talented professionals and forward-thinking employers worldwide. Our AI-powered platform will feature advanced matching algorithms, video interviewing capabilities, skills assessments, and a comprehensive talent management system that makes hiring faster, smarter, and more effective."
  },
  {
    id: 2,
    name: "KundliChart",
    icon: Sun,
    description: "KundliChart brings the ancient wisdom of Vedic astrology into the digital age. Our platform combines traditional astrological calculations with modern technology to provide accurate birth charts, detailed predictions, compatibility analyses, and personalized life guidance. Whether you're seeking insights about career, relationships, or life decisions, KundliChart offers comprehensive astrological solutions."
  },
  {
    id: 3,
    name: "MakeOnIndia",
    icon: Flag,
    description: "MakeOnIndia is a patriotic e-commerce platform dedicated to promoting Indian products, artisans, and manufacturers. We provide a marketplace where authentic Indian brands can reach domestic and global customers, supporting the 'Make in India' initiative while empowering local entrepreneurs and preserving traditional crafts alongside modern innovations."
  },
  {
    id: 4,
    name: "GameToxic",
    icon: Gamepad2,
    description: "GameToxic is building the ultimate gaming ecosystem that brings together gamers, developers, streamers, and esports enthusiasts. From game discovery and community building to developer tools and esports tournament management, GameToxic aims to be the central hub for everything gaming in the Indian subcontinent and beyond."
  },
  {
    id: 5,
    name: "DrugsEffect",
    icon: Pill,
    description: "DrugsEffect is your trusted source for medicine information, drug interactions, side effects, and healthcare guidance. Our platform provides comprehensive, verified medical information to help patients, caregivers, and healthcare professionals make informed decisions. We combine medical expertise with accessible technology to democratize health information."
  },
  {
    id: 6,
    name: "YourDesignStory",
    icon: Palette,
    description: "YourDesignStory is the ultimate platform for creative professionals to showcase their work, connect with clients, and grow their careers. From graphic designers and illustrators to photographers and UI/UX designers, our platform provides portfolio hosting, project marketplace, creative resources, and a thriving community of fellow artists."
  },
  {
    id: 7,
    name: "HindiFilmCinema",
    icon: Film,
    description: "HindiFilmCinema is the definitive destination for everything Bollywood and Hindi cinema. From breaking industry news and exclusive interviews to in-depth reviews and behind-the-scenes content, we bring fans closer to the movies and stars they love. Our platform also serves as a resource for aspiring filmmakers and industry professionals."
  },
  {
    id: 8,
    name: "FilesBundle",
    icon: FolderArchive,
    description: "FilesBundle is the premier marketplace for digital assets and creative resources. From design templates and code snippets to 3D models and audio files, creators can sell their digital products while buyers access high-quality resources for their projects. Our platform ensures secure transactions, fair creator compensation, and quality-verified assets."
  }
];

// Milestones Data
const journeyMilestones = [
  {
    year: "2014",
    title: "The Launch",
    description: "Krunal Jani officially launches Cadbull in Ahmedabad, Gujarat. The initial goal was simple: create a shared digital space where local architects and drafters could exchange standard 2D drawings and save hours of repetitive work."
  },
  {
    year: "Growth",
    title: "Building the Global Library",
    description: "The site shifts from a regional portal to a global crowdsourced forum. By allowing global designers to upload their projects in exchange for premium site access, the library rapidly climbs past 270,000 architectural, structural, and interior design files."
  },
  {
    year: "Scale",
    title: "Hitting User Milestones",
    description: "The platform establishes a massive community footprint, scaling to support over 2.5 million registered accounts and eventually surpassing 3 million users globally."
  },
  {
    year: "Expansion",
    title: "Expanding Beyond 2D",
    description: "To keep pace with modern engineering demands, Cadbull expands its standard 2D blueprint inventory to host intricate 3D CAD modeling blocks, landscaping matrices, and specialized electrical/mechanical design sets."
  },
  {
    year: "Innovation",
    title: "The AI Evolution",
    description: "Transitioning into an AI-enabled ecosystem, Cadbull introduces AI Cadbull Studio. This update equips modern architects with automation tools like text-to-render systems, 'Sketch to 3D', and instant AI floor plan layout generators."
  }
];

// User Groups Data
const userGroups = [
  {
    title: "Professional Architects",
    icon: Building2,
    description: "Used to quickly download base floor plans, house layouts, and structural frameworks to speed up project delivery."
  },
  {
    title: "Interior Designers",
    icon: Palette,
    description: "Used to source pre-made 2D/3D blocks for furniture, lighting, kitchen modules, and decor items to populate client presentations."
  },
  {
    title: "Civil & Structural Engineers",
    icon: HardHat,
    description: "Used to access highly technical construction details, beam/column layouts, plumbing schematics, and electrical diagrams."
  },
  {
    title: "CAD Drafters & Freelancers",
    icon: UserCheck,
    description: "Used to save hours of repetitive drafting work by using ready-made blocks like trees, vehicles, doors, and windows."
  },
  {
    title: "Architecture & Engineering Students",
    icon: GraduationCap,
    description: "Used as a massive learning library to study professional blueprints, construction standards, and layout variations."
  },
  {
    title: "Real Estate Developers & Builders",
    icon: Home,
    description: "Used to browse thousands of conceptual elevation designs and house plans for initial project brainstorming."
  }
];

// FAQs Data
const faqsList = [
  {
    q: "What is Cadbull?",
    a: "Cadbull is a leading CAD file sharing platform where architects, civil engineers, interior designers, and drafters can download and upload 2D/3D design resources, AutoCAD DWG blocks, and architectural layouts."
  },
  {
    q: "Is Cadbull free to use?",
    a: "Yes, free access is available for thousands of standard CAD drawings. For advanced downloads, gold assets, and unlimited daily downloads, flexible premium subscription plans are available."
  },
  {
    q: "What file formats does Cadbull support?",
    a: "Cadbull primarily supports DWG, DXF, 3DS, MAX, and RVT formats, covering 2D floor plans, 3D models, vector details, and architectural CAD blocks."
  },
  {
    q: "How do I upload my designs on Cadbull?",
    a: "Simply sign up for a free account, click on 'Upload File' in the main navigation, enter your project details and CAD category, and submit your drawings for reviewer verification."
  },
  {
    q: "Is Cadbull safe to use?",
    a: "Yes. All uploaded files undergo review and automated security scans to maintain quality, technical reliability, and strict copyright compliance."
  }
];

const FaqAccordionItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="faq-card mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-100 p-4 text-start bg-white border-0 d-flex align-items-center justify-content-between cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="fw-semibold text-dark pe-3" style={{ fontSize: '1rem' }}>
          {faq.q}
        </span>
        <ChevronDown
          size={18}
          className="text-secondary flex-shrink-0"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease' }}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-1 text-secondary border-top" style={{ fontSize: '0.925rem', lineHeight: '1.65', backgroundColor: '#f8fafc' }}>
          {faq.a}
        </div>
      )}
    </div>
  );
};

const AboutCadbullPage = () => {
  const pageUrl = `${process.env.NEXT_PUBLIC_FRONT_URL || "https://cadbull.com"}/about-cadbull`;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Cadbull",
    "url": pageUrl,
    "logo": "https://cadbull.com/logo.webp",
    "founder": {
      "@type": "Person",
      "name": "Krunal Jani",
      "jobTitle": "Founder & Architect"
    },
    "foundingDate": "2014",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ahmedabad",
      "addressRegion": "Gujarat",
      "addressCountry": "India"
    },
    "description": "Cadbull is a leading online platform and digital library for AutoCAD users worldwide, providing 2D/3D DWG drawings, architectural CAD blocks, and AI design tools."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqsList.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  return (
    <Fragment>
      <Head>
        <title>About Cadbull — India's CAD & Design Resource Community</title>
        <link rel="canonical" href={pageUrl} />
        <meta
          name="description"
          content="Discover Cadbull, India's leading CAD & architectural design resource platform founded by Krunal Jani. Access 270K+ DWG files, 3D models, and AI Studio tools."
        />
        <meta property="og:title" content="About Cadbull — India's CAD & Design Resource Community" />
        <meta
          property="og:description"
          content="Discover Cadbull, India's leading CAD & architectural design resource platform founded by Krunal Jani. Access 270K+ DWG files, 3D models, and AI Studio tools."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content="https://cadbull.com/logo.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Cadbull — India's CAD & Design Resource Community" />
        <meta
          name="twitter:description"
          content="Discover Cadbull, India's leading CAD & architectural design resource platform founded by Krunal Jani."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>

      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      <div className="about-cadbull-root pb-5">
        {/* HERO SECTION */}
        <section className="hero-gradient-bg pt-5 pb-5">
          <div className="container pt-4 pb-4">
            <div className="row justify-content-center text-center">
              <div className="col-lg-10 col-xl-9">
                <div className="badge-pill-soft mb-3">
                  <Sparkles size={15} className="text-primary" />
                  <span>India's Leading CAD & Design Ecosystem</span>
                </div>
                <h1 className="display-5 fw-extrabold text-dark mb-4 lh-sm">
                  About Cadbull — India's CAD &amp; Design Resource Community
                </h1>
                <p className="lead text-secondary mb-5 mx-auto" style={{ maxWidth: '850px', fontSize: '1.1rem', lineHeight: '1.75' }}>
                  Cadbull is a leading online platform and digital library for AutoCAD users worldwide, also providing 3D Models, Architecture, Construction Details, DWG CAD Blocks, Electrical, Furniture, Interior Design, Landscape, Mechanical and Machinery, Projects, Structure, and Urban Design CAD files. Headquartered in Ahmedabad, India, the platform serves a global community of over 2.5 million registered users, including architects, engineers, students, and interior designers. The website functions as an extensive repository containing over 270,000 downloadable 2D and 3D drawings, primarily in the AutoCAD DWG format.
                </p>

                {/* STATS HIGHLIGHT CARDS */}
                <div className="row g-3 justify-content-center">
                  <div className="col-6 col-md-3">
                    <div className="stat-card-modern text-center">
                      <div className="d-inline-flex p-2 rounded-circle bg-light text-primary mb-2">
                        <Download size={22} />
                      </div>
                      <h3 className="fw-bolder text-dark mb-1" style={{ fontSize: '1.75rem' }}>300K+</h3>
                      <p className="small text-secondary mb-0 fw-medium">Downloadable Files</p>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="stat-card-modern text-center">
                      <div className="d-inline-flex p-2 rounded-circle bg-light text-primary mb-2">
                        <Users size={22} />
                      </div>
                      <h3 className="fw-bolder text-dark mb-1" style={{ fontSize: '1.75rem' }}>2.5M+</h3>
                      <p className="small text-secondary mb-0 fw-medium">Registered Users</p>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="stat-card-modern text-center">
                      <div className="d-inline-flex p-2 rounded-circle bg-light text-primary mb-2">
                        <Eye size={22} />
                      </div>
                      <h3 className="fw-bolder text-dark mb-1" style={{ fontSize: '1.75rem' }}>700K+</h3>
                      <p className="small text-secondary mb-0 fw-medium">Visits Each Month</p>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="stat-card-modern text-center">
                      <div className="d-inline-flex p-2 rounded-circle bg-light text-primary mb-2">
                        <Globe size={22} />
                      </div>
                      <h3 className="fw-bolder text-dark mb-1" style={{ fontSize: '1.75rem' }}>100M+</h3>
                      <p className="small text-secondary mb-0 fw-medium">Total Visits Since Launch</p>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <span className="badge bg-light text-muted border px-3 py-2 fw-normal" style={{ fontSize: '0.75rem' }}>
                    As of August 2026
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOUNDER & COMPANY INFO */}
        <section className="py-5 bg-white border-top border-bottom">
          <div className="container py-3">
            <div className="row align-items-center g-4">
              <div className="col-lg-6">
                <div className="pe-lg-4">
                  <span className="text-uppercase fw-bold text-primary tracking-wider" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                    Leadership &amp; Vision
                  </span>
                  <h2 className="h1 fw-bold text-dark mt-2 mb-3">
                    Who's Behind Cadbull
                  </h2>
                  <p className="lead text-dark fw-semibold mb-3">
                    Cadbull was founded and is owned by Krunal Jani, an Indian architect and entrepreneur.
                  </p>
                  <p className="text-secondary mb-4" style={{ lineHeight: '1.7' }}>
                    Driven by a passion for architectural innovation and digital automation, Krunal Jani envisioned a world where designers, drafters, and engineers wouldn't have to rebuild recurring 2D CAD blocks from scratch. Under his leadership, Cadbull expanded from a local repository into an international ecosystem powering over 3 million AEC professionals worldwide.
                  </p>
                  
                  <div className="p-3 bg-light rounded-3 border-start border-4 border-primary">
                    <p className="fst-italic text-dark mb-0" style={{ fontSize: '0.95rem' }}>
                      "Our goal is to eliminate repetitive drafting tasks for architects and engineers globally while bridging traditional blueprint design with next-generation AI generation."
                    </p>
                    <span className="d-block mt-2 fw-bold text-primary small">— Krunal Jani, Founder &amp; Architect</span>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="row g-3">
                  <div className="col-sm-6">
                    <div className="p-4 bg-light rounded-4 border h-100">
                      <div className="d-inline-flex p-2 bg-white rounded-3 text-primary shadow-sm mb-3">
                        <Award size={22} />
                      </div>
                      <h4 className="h6 fw-bold text-dark mb-2">Founder &amp; Visionary</h4>
                      <p className="small text-secondary mb-0" style={{ lineHeight: '1.6' }}>
                        Krunal Jani established Cadbull in 2014. He launched the platform to build a centralized global marketplace and repository where architects and drafters could easily exchange AutoCAD assets.
                      </p>
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="p-4 bg-light rounded-4 border h-100">
                      <div className="d-inline-flex p-2 bg-white rounded-3 text-primary shadow-sm mb-3">
                        <Briefcase size={22} />
                      </div>
                      <h4 className="h6 fw-bold text-dark mb-2">Corporate Structure</h4>
                      <p className="small text-secondary mb-0" style={{ lineHeight: '1.6' }}>
                        The company operates as a self-owned private entity categorized under the Architecture and Planning tech industry.
                      </p>
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="p-4 bg-light rounded-4 border h-100">
                      <div className="d-inline-flex p-2 bg-white rounded-3 text-primary shadow-sm mb-3">
                        <Users size={22} />
                      </div>
                      <h4 className="h6 fw-bold text-dark mb-2">Team and Scale</h4>
                      <p className="small text-secondary mb-0" style={{ lineHeight: '1.6' }}>
                        Cadbull runs with a core team of approximately 11 to 50 employees, managing customer support, community contributions, and technical upgrades for their AI Cadbull Studio.
                      </p>
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="p-4 bg-light rounded-4 border h-100">
                      <div className="d-inline-flex p-2 bg-white rounded-3 text-primary shadow-sm mb-3">
                        <MapPin size={22} />
                      </div>
                      <h4 className="h6 fw-bold text-dark mb-2">Headquarters</h4>
                      <p className="small text-secondary mb-0" style={{ lineHeight: '1.6' }}>
                        The operations team is based in Ahmedabad, Gujarat, India, with their primary corporate workspace located near Science City Road.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VERTICALS / WHAT WE OFFER */}
        <section className="py-5">
          <div className="container py-3">
            <div className="text-center mb-5 mx-auto" style={{ maxWidth: '700px' }}>
              <span className="text-uppercase fw-bold text-primary tracking-wider" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                Diverse Digital Portfolio
              </span>
              <h2 className="h1 fw-bold text-dark mt-2 mb-3">
                What You'll Find on Cadbull
              </h2>
              <p className="text-secondary">
                Explore our active platforms and upcoming tech verticals designed to empower creators, developers, engineers, and digital entrepreneurs across multiple industries.
              </p>
            </div>

            {/* Active Verticals */}
            <div className="mb-5">
              <h3 className="h5 fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <span className="badge bg-danger rounded-circle p-1"></span>
                Active Platforms &amp; Ecosystem
              </h3>
              <div className="row g-3">
                {activeVerticals.map((v) => {
                  const Icon = v.icon;
                  return (
                    <div key={v.id} className="col-md-6 col-lg-4">
                      <div className="vertical-card">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <div className="d-flex align-items-center gap-2">
                            <div className="p-2 rounded bg-light text-primary">
                              <Icon size={20} />
                            </div>
                            <h4 className="h6 fw-bold text-dark mb-0">{v.name}</h4>
                          </div>
                          <span className="badge vertical-badge-active rounded-pill px-2 py-1" style={{ fontSize: '0.65rem' }}>
                            {v.badge}
                          </span>
                        </div>
                        <p className="small text-secondary mb-0" style={{ lineHeight: '1.6' }}>
                          {v.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Verticals */}
            <div>
              <h3 className="h5 fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <span className="badge bg-success rounded-circle p-1"></span>
                Upcoming Innovations
              </h3>
              <div className="row g-3">
                {upcomingVerticals.map((v) => {
                  const Icon = v.icon;
                  return (
                    <div key={v.id} className="col-md-6 col-lg-3">
                      <div className="vertical-card">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <div className="d-flex align-items-center gap-2">
                            <div className="p-2 rounded bg-light text-success">
                              <Icon size={18} />
                            </div>
                            <h4 className="h6 fw-bold text-dark mb-0">{v.name}</h4>
                          </div>
                          <span className="badge vertical-badge-upcoming rounded-pill px-2 py-1" style={{ fontSize: '0.65rem' }}>
                            Upcoming
                          </span>
                        </div>
                        <p className="small text-secondary mb-0" style={{ lineHeight: '1.55', fontSize: '0.825rem' }}>
                          {v.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* OUR STORY / MILESTONES */}
        <section className="py-5 bg-white border-top border-bottom">
          <div className="container py-3">
            <div className="row justify-content-center text-center mb-5">
              <div className="col-lg-8">
                <span className="text-uppercase fw-bold text-primary tracking-wider" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                  History &amp; Milestones
                </span>
                <h2 className="h1 fw-bold text-dark mt-2 mb-3">
                  Our Journey
                </h2>
                <p className="text-secondary" style={{ lineHeight: '1.7' }}>
                  Cadbull has evolved from a simple file-sharing idea into the World’s largest CAD community platform. Founded by architect and digital entrepreneur Krunal Jani, the platform was created to solve a persistent issue in the architecture industry: the lack of a centralized, high-quality, and affordable hub for reusable AutoCAD files.
                </p>
              </div>
            </div>

            <div className="timeline-container mx-auto" style={{ maxWidth: '850px' }}>
              {journeyMilestones.map((m, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="row g-0 align-items-start">
                    <div className="col-md-6 pe-md-4 text-md-end d-none d-md-block">
                      {idx % 2 === 0 && (
                        <div className="p-4 bg-light rounded-4 border">
                          <span className="badge bg-primary rounded-pill mb-2 px-3 py-1">{m.year}</span>
                          <h4 className="h6 fw-bold text-dark mb-2">{m.title}</h4>
                          <p className="small text-secondary mb-0">{m.description}</p>
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 ps-md-4 text-md-start">
                      <div className="timeline-dot">{idx + 1}</div>
                      {(idx % 2 !== 0 || true) && (
                        <div className={`p-4 bg-light rounded-4 border ${idx % 2 === 0 ? 'd-md-none' : ''}`}>
                          <span className="badge bg-primary rounded-pill mb-2 px-3 py-1">{m.year}</span>
                          <h4 className="h6 fw-bold text-dark mb-2">{m.title}</h4>
                          <p className="small text-secondary mb-0">{m.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHO IT'S FOR */}
        <section className="py-5">
          <div className="container py-3">
            <div className="text-center mb-5 mx-auto" style={{ maxWidth: '700px' }}>
              <span className="text-uppercase fw-bold text-primary tracking-wider" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                Target Audience &amp; Community
              </span>
              <h2 className="h1 fw-bold text-dark mt-2 mb-3">
                Built For
              </h2>
              <p className="text-secondary">
                Cadbull serves a broad, global audience within the architecture, engineering, and construction (AEC) industries. It is designed for anyone who needs to create, edit, or study technical building plans and layouts.
              </p>
            </div>

            <div className="row g-3">
              {userGroups.map((group, idx) => {
                const Icon = group.icon;
                return (
                  <div key={idx} className="col-md-6 col-lg-4">
                    <div className="audience-card">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="p-3 bg-light rounded-3 text-primary">
                          <Icon size={24} />
                        </div>
                        <h4 className="h6 fw-bold text-dark mb-0">{group.title}</h4>
                      </div>
                      <p className="small text-secondary mb-0" style={{ lineHeight: '1.6' }}>
                        {group.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* TRUST & DATA PRIVACY */}
        <section className="py-5 bg-white border-top border-bottom">
          <div className="container py-3">
            <div className="p-4 p-md-5 rounded-4 bg-light border position-relative overflow-hidden">
              <div className="row align-items-center g-4">
                <div className="col-lg-8">
                  <div className="d-flex align-items-center gap-2 text-primary mb-2">
                    <ShieldCheck size={22} />
                    <span className="fw-bold text-uppercase small tracking-wider">Security &amp; Compliance</span>
                  </div>
                  <h3 className="h3 fw-bold text-dark mb-3">Trust &amp; Safety</h3>
                  <p className="text-secondary mb-0" style={{ fontSize: '1rem', lineHeight: '1.7' }}>
                    Cadbull user data ki privacy ko seriously leta hai (see our{" "}
                    <Link href="/privacy-policy" className="text-primary text-decoration-underline fw-semibold">
                      Privacy Policy
                    </Link>{" "}
                    &amp;{" "}
                    <Link href="/gdpr-compliant-policy" className="text-primary text-decoration-underline fw-semibold">
                      GDPR Compliance
                    </Link>
                    ). Uploaded files ko quality check aur copyright review process ke through pass kiya jaata hai taaki technical standard aur IP compliance strictly maintain rahe.
                  </p>
                </div>
                <div className="col-lg-4 text-lg-end">
                  <div className="d-inline-flex flex-column gap-2 text-start bg-white p-3 rounded-3 border shadow-sm">
                    <div className="d-flex align-items-center gap-2 small text-dark fw-medium">
                      <CheckCircle2 size={16} className="text-success" /> Verified Quality Files
                    </div>
                    <div className="d-flex align-items-center gap-2 small text-dark fw-medium">
                      <CheckCircle2 size={16} className="text-success" /> 100% GDPR Compliant
                    </div>
                    <div className="d-flex align-items-center gap-2 small text-dark fw-medium">
                      <CheckCircle2 size={16} className="text-success" /> Encrypted User Data
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="py-5">
          <div className="container py-3">
            <div className="text-center mb-5 mx-auto" style={{ maxWidth: '650px' }}>
              <span className="text-uppercase fw-bold text-primary tracking-wider" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                Instant Answers
              </span>
              <h2 className="h1 fw-bold text-dark mt-2 mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-secondary">
                Got questions about Cadbull's platform, CAD file downloads, or AI Studio? Find answers to the most common queries below.
              </p>
            </div>

            <div className="mx-auto" style={{ maxWidth: '800px' }}>
              {faqsList.map((faq, idx) => (
                <FaqAccordionItem key={idx} faq={faq} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="pt-4 pb-5">
          <div className="container">
            <div className="cta-banner text-center">
              <div className="mx-auto" style={{ maxWidth: '750px' }}>
                <span className="badge bg-danger rounded-pill px-3 py-2 mb-3 text-uppercase fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
                  Get Started Today
                </span>
                <h2 className="h1 fw-extrabold mb-3 text-white">
                  Ready to Explore Cadbull?
                </h2>
                <p className="text-light opacity-90 mb-4 lead" style={{ fontSize: '1.05rem' }}>
                  Join over 2.5 million architects, engineers, and designers. Download thousands of free CAD blocks or try our AI Cadbull Studio.
                </p>

                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <Link href="/auth/register" className="btn btn-danger btn-lg fw-bold px-4 py-3 rounded-pill shadow">
                    Create Free Account
                  </Link>
                  <Link href="/categories" className="btn btn-outline-light btn-lg fw-semibold px-4 py-3 rounded-pill">
                    Browse Categories
                  </Link>
                  <a href="https://ai.cadbull.com" target="_blank" rel="noopener noreferrer" className="btn btn-light text-primary btn-lg fw-bold px-4 py-3 rounded-pill">
                    Try AI Studio <Sparkles size={16} className="ms-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
};

AboutCadbullPage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 86400,
  };
}

export default AboutCadbullPage;
