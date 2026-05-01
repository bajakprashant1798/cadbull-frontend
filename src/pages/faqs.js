// pages/faqs.js
import MainLayout from "@/layouts/MainLayout";
import Head from "next/head";
import { Fragment, useState } from "react";
import logo from "@/assets/images/logo.png";

const faqs = [
  {
    question: "What is Cadbull, and how does it work?",
    answer: (
      <span>
        <a href="https://cadbull.com" target="_blank">Cadbull</a> is an online platform where users can download and upload AutoCAD DWG files, including architectural, structural, and interior design drawings. Users can browse categories, download files, or contribute their own designs.
      </span>
    )
  },
  {
    question: "Where can I download free AutoCAD DWG files?",
    answer: "You can download free AutoCAD DWG files from Cadbull, which offers a wide collection of CAD blocks, house plans, and design drawings for students, architects, and engineers."
  },
  {
    question: "How many files a premium member can upload?",
    answer: "Premium members can upload unlimited files."
  },
  {
    question: "Are Cadbull files free or paid?",
    answer: (
      <span>
        Cadbull offers both free and premium CAD files. Some drawings are available for free, while premium content requires a <a href="https://cadbull.com/pricing">subscription</a> or purchase. If you want to learn more about costs and plans, you can check our pricing plans for detailed information.
      </span>
    )
  },
  {
    question: "Is Cadbull safe to download CAD files?",
    answer: (
      <span>
        Cadbull provides CAD drawings uploaded by users and reviewed by the platform. Users should always check file details and suitability before using them in professional projects. For more information, you can review our <a href="https://cadbull.com/terms-conditions">terms and conditions</a> and <strong>file usage guidelines.</strong>
      </span>
    )
  },
  {
    question: "How can I upload my AutoCAD files to Cadbull?",
    answer: (
      <span>
        To upload files, <a href="https://cadbull.com/auth/register">create an account</a>, go to the upload section, add your DWG file with a proper title and description, and submit it for approval.
      </span>
    )
  },
  {
    question: "How long does it take for files to get approved on Cadbull?",
    answer: "Approval time depends on file quality and the review process. Well-organized and properly described files are usually approved faster."
  },
  {
    question: "Can I earn money by uploading CAD drawings on Cadbull?",
    // answer: (
    //   <span>
    //     <strong>Premium user:</strong> Unlimited files<br />
    //     <strong>Gold user:</strong> 250 files per day<br />
    //     <strong>Free users:</strong> 15 files per day
    //   </span>
    // )
    answer: "Yes, users can monetize their CAD drawings. Premium members can upload files and earn revenue when other users download their content."
  },
  {
    question: "What file formats are supported on Cadbull?",
    answer: "Cadbull mainly supports AutoCAD DWG files and related formats used in architecture and engineering design."
  },
  {
    question: "How to use downloaded CAD files in AutoCAD?",
    answer: (
      <span>
        After downloading a DWG file, open it in AutoCAD, adjust layers, scale, and settings as needed, and integrate it into your project. If you are new, you can follow our <a href="https://cadbull.com/blog/how-to-download-cad-drawings-from-cadbull-step-by-step-guide">step-by-step guide to download a CAD file</a> for detailed instructions.
      </span>
    )
  },
  {
    question: "Can I use Cadbull files for personal or commercial projects?",
    answer: "Usage depends on the file license. Some files may be used for personal and commercial purposes, but users should always verify licensing terms before use."
  },
  {
    question: "What is Cadbull Premium or gold membership?",
    answer: "Cadbull premium (gold) membership provides benefits like higher download limits, access to premium files, and earning opportunities through uploads."
  },
  {
    question: "How many files can I download or upload on Cadbull?",
    answer: 'Download and upload limits depend on your membership plan. Free users have limited access, while premium users get higher or extended limits.'
  },

  {
    question: "How do payments and pricing work on Cadbull?",
    answer: "File pricing is usually set based on the platform or uploader. Payments to contributors are processed through supported payment methods after meeting platform requirements."
  },
  {
    question: "How can I cancel my Cadbull premium subscription?",
    answer: "You can cancel your premium subscription by going to your account settings or contacting Cadbull support for assistance with subscription management."
  },
];

function FAQAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="accordion" id="faqAccordion">
      {faqs.map((faq, idx) => (
        <div className="accordion-item mb-2" key={idx}>
          <h2 className="accordion-header" id={`heading${idx}`}>
            <button
              className={`accordion-button ${openIndex === idx ? "" : "collapsed"}`}
              type="button"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              aria-expanded={openIndex === idx}
              aria-controls={`collapse${idx}`}
            >
              <span className="fw-bold">Q. &nbsp;</span> {faq.question}
            </button>
          </h2>
          <div
            id={`collapse${idx}`}
            className={`accordion-collapse collapse ${openIndex === idx ? "show" : ""}`}
            aria-labelledby={`heading${idx}`}
            data-bs-parent="#faqAccordion"
          >
            <div className="accordion-body">{faq.answer}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Reusable FAQ section — no Head tag, safe to embed on any page
export function FAQSection() {
  return (
    <section className="py-5">
      <div className="container">
        <h1 className="mb-4 text-center">Frequently Asked Questions (FAQs)</h1>
        <FAQAccordion faqs={faqs} />
      </div>
    </section>
  );
}

const FAQsPage = () => (
  <Fragment>
    <Head>
      <title>Cadbull Help Center | Common Questions About Architectural Plans</title>
      <meta name="description" content="Find quick answers to common questions about CADBull downloads, DWG file access, usage rights, account setup, and file compatibility." />
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_FRONT_URL}/faqs`} />

      <meta property="og:title" content="Cadbull Help Center | Common Questions About Architectural Plans" />
      <meta property="og:description" content="Find quick answers to common questions about CADBull downloads, DWG file access, usage rights, account setup, and file compatibility." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${process.env.NEXT_PUBLIC_FRONT_URL}/faqs`} />
      <meta property="og:image" content={logo} />
      <meta name="twitter:title" content="Cadbull Help Center | Common Questions About Architectural Plans" />
      <meta name="twitter:description" content="Find quick answers to common questions about CADBull downloads, DWG file access, usage rights, account setup, and file compatibility." />
      <meta name="twitter:image" content={logo} />
      <meta name="keywords" content="autocad,autocad file,dwg file,dwg.,autocad files dwg,architecture plan,home plan, modern building,plan,hotel plan,architecture blocks,interior design blocks, autocad blocks,dwg blocks, modern architecture plan in dwg , modern architecture plan dwg, dwg files, architecture projects in autocad, dwg file download, download free dwg, 3ds, autocad, dwg, block, cad, 2d cad library, cad library dwg, cad model library, cad detail library, online cad library, cad symbol library, cad symbol library, cad parts library, cad furniture" />
    </Head>

    <FAQSection />
  </Fragment>
);

export default FAQsPage;
FAQsPage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};