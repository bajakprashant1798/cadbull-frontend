// pages/faqs.js
import MainLayout from "@/layouts/MainLayout";
import Head from "next/head";
import { Fragment, useState } from "react";
import logo from "@/assets/images/logo.png";

const faqs = [
  {
    question: "What is Gold File or Account?",
    answer: (
      <span>
        A Gold account or a file is format with the help of which the Architects or Civil Engineers will be able to present their work by creating an official account keeping in mind the Terms of Use and policies of Cadbull.com. It is an account where the gold users will submit their work on Cadbull.com and after analyzing or going through every bit of the detail and trends in the Civil engineering the Cadbull.com will approve the files for Gold users and Cadbull.com hold the full authority to upload, delete and make changes accordingly. Gold users cannot upload their files directly and only after getting approved Cadbull.com team will upload the users' work under his/her name. You will get your payment for your files through PayPal and it is a one-time payment.
      </span>
    )
  },
  {
    question: "Who are premium users?",
    answer: "Premium users are the professional Architects or Civil Engineers who will showcase their personal talent and represent their work on Cadbull.com by creating a professional account for them and they are bound to abide by the rules."
  },
  {
    question: "How many files a premium member can upload?",
    answer: "Premium members can upload unlimited files."
  },
  {
    question: "What is the cost of files/per files and who decides the price of the file?",
    answer: "The cost of the files is decided by the Cadbull.com professionals and as per the nature and features of the file the cost is decided. The nature, trend, and scope of the file play a vital role- but the maximum cost you can earn per file is 1000 USD. (In which 50% share goes to Cadbull.com)"
  },
  {
    question: "How will we get paid and with the help of which format we will get our payment?",
    answer: "You will get paid through PayPal and you will get the 50% of fixed cost and the rest belongs to Cadbull.com. For Ex- The cost of one file is decided to be 1 USD- Then the premium user will get 0.5 USD and the rest 0.5 USD goes to Cadbull.com as per the terms and conditions."
  },
  {
    question: "When will we get paid or our payment?",
    answer: "You need a fixed amount of 10 USD dollars in your account (With Cadbull.com) in order to get paid."
  },
  {
    question: "How much time it takes for files to get approved?",
    answer: "It depends on the total number of files to be approved and the nature of the file. We do try to respond as soon as possible and we try to respond within 30 days."
  },
  {
    question: "How many files can we download in a day?",
    answer: (
      <span>
        <strong>Premium user:</strong> Unlimited files<br />
        <strong>Gold user:</strong> 250 files per day<br />
        <strong>Free users:</strong> 15 files per day
      </span>
    )
  },
  {
    question: "Format supported by the Cadbull.com?",
    answer: "We have different types of file formats such as- DWG, Max files, Pdf format, Photoshop format, jpg format, Mobi format."
  },
  {
    question: "Can we use these files for personal use such as – uploading under our name or reuse them on social media or in an article?",
    answer: "No, you can’t use our files for personal use as per our Terms of Use, and you can’t upload these files under your name or anywhere on your social media."
  },
  {
    question: "Why should I use Cadbull.com?",
    answer: "Cadbull.com is the website with maximum online reach and highest credibility. We provide a platform for talented people who need a platform to showcase their talent."
  },
  {
    question: "Can Users leave feedback and why is it important for me?",
    answer: "Yes, they can leave the comment and we always welcome honest and good feedback which helps us and our partners to learn to grow on a daily basis and we can take corrective measures on the basis of their feedback."
  },
  {
    question: "How to cancel cadbull gold subscription?",
    answer: 'Click on "Manage Billing" option on Cadbull Profile Page. Please reach out on support@cadbull.com if you need more help.'
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
              {faq.question}
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

        <section className="py-5">
        <div className="container">
            <h1 className="mb-4 text-center">Frequently Asked Questions (FAQs)</h1>
            <FAQAccordion faqs={faqs} />
        </div>
        </section>
    </Fragment>
);

export default FAQsPage;
FAQsPage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};