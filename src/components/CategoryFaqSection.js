import React, { useState } from 'react';

const CategoryFaqSection = ({ faqs, categoryName }) => {
  let faqList = faqs;
  if (typeof faqList === 'string' && faqList.trim() !== '') {
    try {
      faqList = JSON.parse(faqList);
    } catch (e) {
      faqList = [];
    }
  }

  // Do not render section if no FAQs exist
  if (!faqList || !Array.isArray(faqList) || faqList.length === 0) {
    return null;
  }

  const [openIndex, setOpenIndex] = useState(0); // Default open first FAQ

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="my-4">
      <h3 className="fw-bold text-dark mb-3 fs-20">Frequently Asked Questions</h3>
      <div className="accordion-custom d-flex flex-column gap-2.5">
        {faqList.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx} 
              className={`bg-white rounded-3 border transition-all ${
                isOpen ? 'border-danger-subtle shadow-sm' : 'border-light-subtle'
              }`}
              style={{ transition: 'all 0.2s ease-in-out' }}
            >
              <button
                type="button"
                className="w-100 border-0 bg-transparent text-start px-3.5 px-md-4 py-3 d-flex justify-content-between align-items-center"
                onClick={() => toggleFaq(idx)}
                aria-expanded={isOpen}
                style={{ cursor: 'pointer', outline: 'none' }}
              >
                <span className="fw-bold text-dark fs-15 pe-3">
                  {faq.question}
                </span>
                <span 
                  className={`flex-shrink-0 d-inline-flex align-items-center justify-content-center rounded-circle fs-14 fw-bold ${
                    isOpen ? 'bg-danger text-white' : 'bg-light text-secondary border'
                  }`}
                  style={{ width: '26px', height: '26px', minWidth: '26px', transition: 'all 0.2s ease' }}
                >
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              {isOpen && (
                <div className="px-3.5 px-md-4 pb-3.5 pt-2 text-secondary fs-14 lh-base border-top border-light-subtle">
                  <p className="mb-0 text-muted">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFaqSection;
