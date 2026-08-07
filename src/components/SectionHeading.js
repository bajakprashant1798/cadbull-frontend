const SectionHeading = ({ subHeading, mainHeading, mainHeadingBold, headingLevel = "h2" }) => {
  const HeadingTag = headingLevel;
  return (
    <div className={`position-relative d-inline-flex main-heading-wrapper `}>
      <div>
        {subHeading && <span className="d-inline-block mb-3 h6 fw-normal" style={{ minHeight: 20 }}>{subHeading}</span>}
        <HeadingTag className="h3 mb-0">{mainHeading} <span className="fw-bold">{mainHeadingBold}</span></HeadingTag>
      </div>
    </div>
  );
}

export default SectionHeading;