import React from 'react';

const ICON_OPTIONS = [
  { value: 'check', label: '✓ Verified / Checkmark' },
  { value: 'trophy', label: '🏆 Trophy / Experience' },
  { value: 'lock', label: '🔒 Lock / Safe Download' },
  { value: 'users', label: '👥 Users / Community' },
  { value: 'clock', label: '⏱ Clock / Frequency' },
  { value: 'clipboard', label: '📋 Clipboard / License' },
  { value: 'star', label: '⭐ Star / Premium' },
  { value: 'shield', label: '🛡 Shield / Trust' }
];

const DEFAULT_QUALITY_ITEMS = [
  {
    icon: "check",
    title: "Expert Reviewed",
    description: "Checked by experienced architectural drafters for scale and layout accuracy."
  },
  {
    icon: "trophy",
    title: "10+ Years Experience",
    description: "Cadbull has supported architecture professionals with CAD resources for over a decade."
  },
  {
    icon: "lock",
    title: "Safe Downloads",
    description: "Every DWG file is tested to open correctly in AutoCAD before publishing."
  },
  {
    icon: "users",
    title: "1M+ Professionals",
    description: "Trusted by architects, civil engineers, contractors and students worldwide."
  },
  {
    icon: "clock",
    title: "Regularly Updated",
    description: "New architectural drawings are added to this category daily."
  },
  {
    icon: "clipboard",
    title: "Clear Licensing",
    description: "Every file page states usage terms clearly for personal, academic or commercial use."
  }
];

const DEFAULT_FAQS = [
  {
    question: "What types of CAD drawings can I find in this category?",
    answer: "You can find high-quality 2D & 3D CAD files, AutoCAD DWG blocks, elevations, floor plans, and architectural detail drawings ready for download."
  },
  {
    question: "Are the CAD drawings in this category free to download?",
    answer: "Yes, Cadbull offers both free DWG downloads for registered users and premium CAD drawing downloads for Gold subscribers."
  },
  {
    question: "Which software is compatible with these DWG files?",
    answer: "Our DWG files are compatible with AutoCAD (all versions), BricsCAD, ZWCAD, and any CAD software that supports standard DWG and DXF formats."
  },
  {
    question: "Can I use these CAD blocks for commercial projects?",
    answer: "Yes, drawings can be used for commercial architectural and construction projects according to Cadbull's standard license terms."
  }
];

const CategoryContentEditor = ({
  qualityTitle,
  setQualityTitle,
  qualityDescription,
  setQualityDescription,
  qualityItems = [],
  setQualityItems,
  faqs = [],
  setFaqs
}) => {
  // Quality Items Management
  const handleAddQualityItem = () => {
    setQualityItems([
      ...qualityItems,
      { icon: 'check', title: '', description: '' }
    ]);
  };

  const handleQualityChange = (index, field, value) => {
    const updated = [...qualityItems];
    updated[index][field] = value;
    setQualityItems(updated);
  };

  const handleRemoveQualityItem = (index) => {
    setQualityItems(qualityItems.filter((_, i) => i !== index));
  };

  const handleLoadDefaultQuality = () => {
    setQualityTitle("Quality Verification & Trust");
    setQualityDescription("Every architectural CAD file in this category is checked for drafting accuracy and dimensional correctness before publishing, so you can download with confidence.");
    setQualityItems(DEFAULT_QUALITY_ITEMS);
  };

  // FAQs Management
  const handleAddFaq = () => {
    setFaqs([
      ...faqs,
      { question: '', answer: '' }
    ]);
  };

  const handleFaqChange = (index, field, value) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const handleRemoveFaq = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleLoadDefaultFaqs = () => {
    setFaqs(DEFAULT_FAQS);
  };

  return (
    <div className="my-4">
      {/* 1. QUALITY VERIFICATION & TRUST SECTION */}
      <div className="card mb-4 shadow-sm border-0 bg-light">
        <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h4 className="mb-0 fw-bold text-primary">Quality Verification & Trust Section</h4>
            <small className="text-muted">Content displays directly below pagination on this category page. Leave empty to hide.</small>
          </div>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={handleLoadDefaultQuality}
          >
            ⚡ Load Default Trust Cards
          </button>
        </div>

        <div className="card-body">
          <div className="mb-3">
            <label className="form-label fw-semibold">Section Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Quality Verification & Trust"
              value={qualityTitle}
              onChange={(e) => setQualityTitle(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Section Description</label>
            <textarea
              className="form-control"
              rows="2"
              placeholder="Sub-description text beneath the heading..."
              value={qualityDescription}
              onChange={(e) => setQualityDescription(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0 fw-bold fs-6">Trust Feature Cards ({qualityItems.length})</h5>
            <button
              type="button"
              className="btn btn-sm btn-success"
              onClick={handleAddQualityItem}
            >
              + Add Feature Card
            </button>
          </div>

          {qualityItems.length === 0 ? (
            <div className="p-3 text-center bg-white rounded border text-muted">
              No Trust Cards added. Click <strong>"+ Add Feature Card"</strong> or <strong>"⚡ Load Default Trust Cards"</strong> above.
            </div>
          ) : (
            <div className="row g-3">
              {qualityItems.map((item, idx) => (
                <div key={idx} className="col-md-6">
                  <div className="card border p-3 bg-white h-100 position-relative shadow-sm">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-secondary">Card #{idx + 1}</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger py-0 px-2"
                        onClick={() => handleRemoveQualityItem(idx)}
                      >
                        ✕ Remove
                      </button>
                    </div>

                    <div className="mb-2">
                      <label className="form-label small fw-bold mb-1">Icon</label>
                      <select
                        className="form-select form-select-sm"
                        value={item.icon}
                        onChange={(e) => handleQualityChange(idx, 'icon', e.target.value)}
                      >
                        {ICON_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-2">
                      <label className="form-label small fw-bold mb-1">Title</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. Expert Reviewed"
                        value={item.title}
                        onChange={(e) => handleQualityChange(idx, 'title', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="form-label small fw-bold mb-1">Description</label>
                      <textarea
                        className="form-control form-control-sm"
                        rows="2"
                        placeholder="Card explanation..."
                        value={item.description}
                        onChange={(e) => handleQualityChange(idx, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. CATEGORY FAQS SECTION */}
      <div className="card mb-4 shadow-sm border-0 bg-light">
        <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h4 className="mb-0 fw-bold text-primary">Category Frequently Asked Questions (FAQs)</h4>
            <small className="text-muted">Displays below Trust Cards & feeds JSON-LD Schema for Google & AI Search Overviews. Leave empty to hide.</small>
          </div>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={handleLoadDefaultFaqs}
          >
            ⚡ Load Default FAQs
          </button>
        </div>

        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0 fw-bold fs-6">Category FAQs ({faqs.length})</h5>
            <button
              type="button"
              className="btn btn-sm btn-success"
              onClick={handleAddFaq}
            >
              + Add FAQ
            </button>
          </div>

          {faqs.length === 0 ? (
            <div className="p-3 text-center bg-white rounded border text-muted">
              No custom FAQs added for this category. Click <strong>"+ Add FAQ"</strong> or <strong>"⚡ Load Default FAQs"</strong> above.
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="card border p-3 bg-white shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-primary">FAQ #{idx + 1}</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger py-0 px-2"
                      onClick={() => handleRemoveFaq(idx)}
                    >
                      ✕ Remove FAQ
                    </button>
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-bold mb-1">Question</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g. What types of CAD drawings are in this category?"
                      value={faq.question}
                      onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="form-label small fw-bold mb-1">Answer</label>
                    <textarea
                      className="form-control form-control-sm"
                      rows="2"
                      placeholder="Answer text..."
                      value={faq.answer}
                      onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryContentEditor;
