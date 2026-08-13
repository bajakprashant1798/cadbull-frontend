import MainLayout from "@/layouts/MainLayout";
import Head from "next/head";
import Link from "next/link";
import { Fragment } from "react";
import {
  Users,
  Award,
  Building2,
  HardHat,
  Layers,
  Box,
  Zap,
  Trees,
  Cog,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  FileCheck2,
  BadgeCheck
} from "lucide-react";

// Scoped Custom Styles for Our Staff page
const customStyles = `
.our-staff-root {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #1e293b;
  background-color: #f8fafc;
  overflow-x: hidden;
}

.hero-staff-bg {
  background: radial-gradient(100% 100% at 50% 0%, rgba(30, 58, 138, 0.05) 0%, rgba(248, 250, 252, 1) 100%);
  position: relative;
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

.staff-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1.25rem;
  padding: 2rem 1.75rem;
  height: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
  position: relative;
  overflow: hidden;
}

.staff-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 25px -4px rgba(0, 0, 0, 0.08), 0 6px 10px -3px rgba(0, 0, 0, 0.04);
  border-color: #cbd5e1;
}

.staff-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #1e3a8a 0%, #ed4d4c 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.staff-card:hover::before {
  opacity: 1;
}

.avatar-monogram {
  width: 3.75rem;
  height: 3.75rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.25rem;
  color: #1e3a8a;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #bfdbfe;
  flex-shrink: 0;
}

.role-badge {
  font-size: 0.725rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tag-mini {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: 0.375rem;
  background: #f1f5f9;
  color: #475569;
}

.qa-banner {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
  border-radius: 1.5rem;
  padding: 3rem 2rem;
  color: #ffffff;
}
`;

// Staff Data Array
const staffMembers = [
  {
    id: 1,
    name: "Krunal Jani",
    title: "Architect & Interior Designer",
    initials: "KJ",
    badgeColor: "bg-primary text-white",
    disciplineIcon: Building2,
    discipline: "Architecture & Interior",
    bio: "Krunal has a strong eye for design and a deep understanding of space planning. He creates detailed architectural and interior design drawings for the Cadbull library. He also reviews and approves community-uploaded architectural files to make sure they meet the platform's quality and accuracy standards.",
    tags: ["Space Planning", "Architectural Drawings", "Upload Verification", "Interior Design"]
  },
  {
    id: 2,
    name: "Pinkal Jani",
    title: "Civil Engineer",
    initials: "PJ",
    badgeColor: "bg-danger text-white",
    disciplineIcon: HardHat,
    discipline: "Civil & Construction",
    bio: "Pinkal has solid experience in civil engineering, from site planning to structural documentation. He creates reliable civil engineering drawings for the platform and also reviews uploads from the Cadbull community. His attention to technical detail ensures every published file is accurate and project-ready.",
    tags: ["Site Planning", "Civil Documentation", "Technical Review", "Quality Assurance"]
  },
  {
    id: 3,
    name: "Mefuja Panara",
    title: "AutoCAD Designer",
    initials: "MP",
    badgeColor: "bg-success text-white",
    disciplineIcon: Layers,
    discipline: "2D CAD Drafting",
    bio: "Mefuja is an expert in creating clean, well-organised 2D CAD drawings, from floor plans to detailed sections. She also reviews community-submitted files to check for proper layering, dimensions, and drafting standards. Her work ensures that every file on Cadbull is precise and professionally usable.",
    tags: ["2D Floor Plans", "Layering Standards", "Dimension Verification", "Drafting Review"]
  },
  {
    id: 4,
    name: "Dhaval Vaghela",
    title: "3D Designer",
    initials: "DV",
    badgeColor: "bg-purple text-white",
    disciplineIcon: Box,
    discipline: "3D Modeling & Visualization",
    bio: "Dhaval turns flat drawings into realistic 3D models and visualisations for the Cadbull library. He also reviews and approves 3D files uploaded by the community, checking for quality, accuracy, and visual detail. His work helps designers and engineers see how their projects will look before construction begins.",
    tags: ["3D Modeling", "Visual Rendering", "Model Verification", "3D Blocks"]
  },
  {
    id: 5,
    name: "Nagendra Prajapati",
    title: "Electrical Designer & Draftsman",
    initials: "NP",
    badgeColor: "bg-warning text-dark",
    disciplineIcon: Zap,
    discipline: "Electrical & MEP",
    bio: "Nagendra creates electrical layouts, wiring diagrams, and service coordination drawings for Cadbull. He also reviews community-uploaded electrical files to ensure they follow safety standards and technical accuracy. His hands-on knowledge of electrical systems keeps the platform's content reliable and ready for professional use.",
    tags: ["Wiring Schematics", "Service Coordination", "Safety Standards", "MEP Review"]
  },
  {
    id: 6,
    name: "Prachi Mewada",
    title: "Landscape Architect",
    initials: "PM",
    badgeColor: "bg-info text-dark",
    disciplineIcon: Trees,
    discipline: "Landscape Architecture",
    bio: "Prachi designs outdoor spaces that are both beautiful and sustainable, contributing landscape drawings to the Cadbull library. She also reviews and approves landscape files uploaded by the community, ensuring design quality and completeness. From garden plans to public green areas, her work brings a thoughtful approach to every project.",
    tags: ["Sustainable Design", "Outdoor Layouts", "Garden Planning", "Landscape Review"]
  },
  {
    id: 7,
    name: "Paresh Patel",
    title: "Mechanical Engineer",
    initials: "PP",
    badgeColor: "bg-secondary text-white",
    disciplineIcon: Cog,
    discipline: "Mechanical Engineering",
    bio: "Paresh creates mechanical system designs, equipment layouts, and machine part details for the Cadbull platform. He also reviews community-uploaded mechanical drawings to ensure they meet technical and industrial standards. His engineering expertise keeps the platform's mechanical content accurate and up to date.",
    tags: ["Equipment Layouts", "Machine Parts", "Industrial Standards", "Mechanical Review"]
  },
  {
    id: 8,
    name: "Ronak Mistry",
    title: "Structural Engineer",
    initials: "RM",
    badgeColor: "bg-dark text-white",
    disciplineIcon: ShieldCheck,
    discipline: "Structural Engineering",
    bio: "Ronak creates structural design drawings, RCC details, and load-bearing system plans for Cadbull. He also reviews and approves structural files uploaded by the community, making sure they are safe and meet current engineering standards. His expertise adds trust and technical depth to the platform's structural library.",
    tags: ["RCC Details", "Load Analysis", "Engineering Compliance", "Structural Review"]
  }
];

const OurStaffPage = () => {
  const pageUrl = `${process.env.NEXT_PUBLIC_FRONT_URL || "https://cadbull.com"}/our-staff`;

  const staffSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Cadbull",
    "url": pageUrl,
    "logo": "https://cadbull.com/logo.webp",
    "description": "Meet the engineering, architectural, and drafting experts behind Cadbull who curate, design, and review 270,000+ CAD files for technical accuracy.",
    "member": staffMembers.map(m => ({
      "@type": "Person",
      "name": m.name,
      "jobTitle": m.title,
      "worksFor": {
        "@type": "Organization",
        "name": "Cadbull"
      },
      "description": m.bio
    }))
  };

  return (
    <Fragment>
      <Head>
        <title>Our Technical Staff & Experts | Cadbull — CAD & Design Review Team</title>
        <link rel="canonical" href={pageUrl} />
        <meta
          name="description"
          content="Meet Cadbull's core technical team of architects, civil engineers, AutoCAD drafters, 3D visualizers, electrical designers, landscape architects, and structural engineers."
        />
        <meta property="og:title" content="Our Technical Staff & Experts | Cadbull — CAD & Design Review Team" />
        <meta
          property="og:description"
          content="Meet Cadbull's core technical team of architects, civil engineers, AutoCAD drafters, 3D visualizers, electrical designers, landscape architects, and structural engineers."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content="https://cadbull.com/logo.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Technical Staff & Experts | Cadbull" />
        <meta
          name="twitter:description"
          content="Meet the core engineering and design team behind Cadbull."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(staffSchema) }}
        />
      </Head>

      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      <div className="our-staff-root pb-5">
        {/* HERO SECTION */}
        <section className="hero-staff-bg pt-5 pb-5">
          <div className="container pt-4 pb-4">
            <div className="row justify-content-center text-center">
              <div className="col-lg-10 col-xl-8">
                <div className="badge-pill-soft mb-3">
                  <Users size={15} className="text-primary" />
                  <span>CADBULL TECHNICAL TEAM &amp; REVIEWERS</span>
                </div>
                <h1 className="display-5 fw-extrabold text-dark mb-4 lh-sm">
                  Our Technical Staff
                </h1>
                <p className="lead text-secondary mb-4 mx-auto" style={{ maxWidth: '780px', fontSize: '1.1rem', lineHeight: '1.75' }}>
                  Behind Cadbull’s library of over 270,000 architectural drawings, 3D models, and engineering schematics is a team of specialized architects, engineers, and CAD professionals. Our staff designs original library assets and reviews every community upload to guarantee technical precision, layer organization, and project readiness.
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <div className="d-flex align-items-center gap-2 small fw-semibold text-dark bg-white px-3 py-2 rounded-pill border shadow-sm">
                    <BadgeCheck size={18} className="text-primary" /> Technical Review Process
                  </div>
                  <div className="d-flex align-items-center gap-2 small fw-semibold text-dark bg-white px-3 py-2 rounded-pill border shadow-sm">
                    <FileCheck2 size={18} className="text-success" /> Layering &amp; Precision Checks
                  </div>
                  <div className="d-flex align-items-center gap-2 small fw-semibold text-dark bg-white px-3 py-2 rounded-pill border shadow-sm">
                    <Award size={18} className="text-danger" /> Multi-Discipline Expertise
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TEAM GRID SECTION */}
        <section className="py-5 bg-white border-top border-bottom">
          <div className="container py-3">
            <div className="text-center mb-5 mx-auto" style={{ maxWidth: '650px' }}>
              <span className="text-uppercase fw-bold text-primary tracking-wider" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                Technical Leadership
              </span>
              <h2 className="h1 fw-bold text-dark mt-2 mb-3">
                Meet Our Experts
              </h2>
              <p className="text-secondary">
                From architectural space planning to structural load calculations, explore the experts keeping Cadbull's content verified and reliable.
              </p>
            </div>

            <div className="row g-4">
              {staffMembers.map((member) => {
                const DisciplineIcon = member.disciplineIcon;
                return (
                  <div key={member.id} className="col-md-6 col-lg-6 col-xl-3">
                    <div className="staff-card">
                      {/* Top Header Row */}
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="avatar-monogram">
                          {member.initials}
                        </div>
                        <span className={`role-badge ${member.badgeColor}`}>
                          {member.discipline}
                        </span>
                      </div>

                      {/* Name & Title */}
                      <h3 className="h5 fw-bold text-dark mb-1">{member.name}</h3>
                      <div className="d-flex align-items-center gap-1 text-primary fw-semibold small mb-3">
                        <DisciplineIcon size={16} />
                        <span>{member.title}</span>
                      </div>

                      {/* Bio */}
                      <p className="small text-secondary mb-4 flex-grow-1" style={{ lineHeight: '1.65', fontSize: '0.875rem' }}>
                        {member.bio}
                      </p>

                      {/* Tags */}
                      <div className="border-top pt-3 mt-auto">
                        <div className="d-flex flex-wrap gap-1">
                          {member.tags.map((tag, idx) => (
                            <span key={idx} className="tag-mini">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* QUALITY & REVIEW BANNER */}
        <section className="py-5">
          <div className="container py-3">
            <div className="qa-banner">
              <div className="row align-items-center g-4">
                <div className="col-lg-8">
                  <div className="d-flex align-items-center gap-2 text-warning mb-2">
                    <Sparkles size={20} />
                    <span className="fw-bold text-uppercase small tracking-wider">Engineering Quality Control</span>
                  </div>
                  <h3 className="h2 fw-extrabold text-white mb-3">
                    How Our Team Guarantees CAD Quality
                  </h3>
                  <p className="text-light opacity-90 mb-0" style={{ fontSize: '1rem', lineHeight: '1.7' }}>
                    Every single file submitted by our global community of 2.5M+ designers passes through our staff review pipeline. Our engineers and drafters verify layering structure, dimension accuracy, scale ratios, and file compatibility before releasing files for download.
                  </p>
                </div>

                <div className="col-lg-4 text-lg-end">
                  <div className="p-4 bg-white text-dark rounded-4 shadow-sm text-start">
                    <h4 className="h6 fw-bold mb-3 d-flex align-items-center gap-2">
                      <CheckCircle2 size={20} className="text-success" /> Quality Checks Include:
                    </h4>
                    <ul className="list-unstyled mb-0 small text-secondary d-flex flex-column gap-2">
                      <li className="d-flex align-items-center gap-2">
                        <span className="badge bg-light text-dark border">1</span> Layer &amp; Color Standards
                      </li>
                      <li className="d-flex align-items-center gap-2">
                        <span className="badge bg-light text-dark border">2</span> Scale &amp; Dimension Precision
                      </li>
                      <li className="d-flex align-items-center gap-2">
                        <span className="badge bg-light text-dark border">3</span> 2D/3D File Integrity
                      </li>
                      <li className="d-flex align-items-center gap-2">
                        <span className="badge bg-light text-dark border">4</span> Copyright &amp; IP Compliance
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="pt-2 pb-5">
          <div className="container">
            <div className="p-4 p-md-5 rounded-4 bg-white border text-center shadow-sm">
              <div className="mx-auto" style={{ maxWidth: '650px' }}>
                <h3 className="h2 fw-bold text-dark mb-3">
                  Explore Designs Curated by Our Staff
                </h3>
                <p className="text-secondary mb-4">
                  Browse over 270,000 verified 2D floor plans, 3D CAD blocks, and engineering drawings created and reviewed by our experts.
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <Link href="/categories" className="btn btn-primary btn-lg fw-bold px-4 py-3 rounded-pill shadow-sm">
                    Browse CAD Library <ArrowRight size={18} className="ms-1" />
                  </Link>
                  <Link href="/work/upload" className="btn btn-outline-secondary btn-lg fw-semibold px-4 py-3 rounded-pill">
                    Submit Your Drawings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
};

OurStaffPage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 86400,
  };
}

export default OurStaffPage;
