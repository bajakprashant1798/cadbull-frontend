import React from 'react';

const categoryFaqStyles = `
.cat-faq-section {
  width: 100%;
  margin: 36px 0 24px 0;
}
.cat-faq-title {
  font-family: inherit;
  font-size: 1.35rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.02em;
  margin-bottom: 20px;
}
.cat-faq-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}
.cat-faq-list details {
  background: #ffffff;
  border: 1px solid #E2E8F0;
  border-radius: 14px;
  padding: 0 20px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  width: 100%;
}
.cat-faq-list details:hover {
  border-color: #CBD5E1;
}
.cat-faq-list details[open] {
  border-color: #CBD5E1;
  box-shadow: 0 1px 3px rgba(16, 24, 40, 0.04);
}
.cat-faq-list summary {
  list-style: none;
  cursor: pointer;
  min-height: 56px;
  display: flex;
  align-items: center;
  padding: 14px 34px 14px 0;
  font-weight: 600;
  font-size: 1rem;
  color: #111827;
  position: relative;
  user-select: none;
  line-height: 1.45;
  outline: none;
}
.cat-faq-list summary::-webkit-details-marker,
.cat-faq-list summary::marker {
  display: none;
}
.cat-faq-list summary::after {
  content: "+";
  position: absolute;
  right: 2px;
  top: 50%;
  transform: translateY(-52%);
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1;
  color: #94A3B8;
  transition: color 0.15s ease;
}
.cat-faq-list details[open] summary::after {
  content: "\\2212";
  color: #475569;
}
.cat-faq-desc {
  margin: 0 0 16px 0;
  color: #334155;
  font-size: 0.92rem;
  line-height: 1.6;
}
`;

const CategoryFaqSection = ({ faqs, categoryName }) => {
  let faqList = faqs;
  if (typeof faqList === 'string' && faqList.trim() !== '') {
    try {
      faqList = JSON.parse(faqList);
    } catch (e) {
      faqList = [];
    }
  }

  const catName = categoryName || "CAD Drawings";

  const defaultFaqs = [
    {
      question: `What types of CAD files are available for ${catName}?`,
      answer: `In the ${catName} category, you can find various high-quality CAD drawings, including 2D & 3D designs, DWG files, and AutoCAD blocks for your architecture, engineering, and construction projects.`
    },
    {
      question: `Are the ${catName} drawings on Cadbull free to download?`,
      answer: `Yes, Cadbull offers both free and premium CAD drawings in the ${catName} category. Registered users can download free DWG files, while Gold and Diamond subscribers get access to premium design resources.`
    },
    {
      question: `Which file formats are supported for ${catName} drawings on Cadbull?`,
      answer: `The drawings in the ${catName} category are primarily in DWG format, compatible with AutoCAD. Some designs also support SketchUp (SKP), 3ds Max (MAX), Revit (RVT), and other design software.`
    }
  ];

  const items = (faqList && Array.isArray(faqList) && faqList.length > 0) ? faqList : defaultFaqs;

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="cat-faq-section my-4 my-md-5">
      <style dangerouslySetInnerHTML={{ __html: categoryFaqStyles }} />
      <h3 className="cat-faq-title">Frequently Asked Questions</h3>
      <div className="cat-faq-list">
        {items.map((faq, idx) => {
          const questionText = faq.question || faq.q;
          const answerText = faq.answer || faq.a;
          return (
            <details key={idx}>
              <summary>{questionText}</summary>
              <div className="cat-faq-desc">
                {typeof answerText === 'string' ? <p className="mb-0">{answerText}</p> : answerText}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFaqSection;
