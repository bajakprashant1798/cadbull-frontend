import HeadingImage from "@/assets/images/heading-image.png"
const SectionHeading = ({ subHeading, mainHeading, mainHeadingBold }) => {

  return (
    <div className={`position-relative d-inline-flex main-heading-wrapper `}>
      <div>
        <h6 className="d-inline-block mb-3" style={{ minHeight: 20 }}>{subHeading}</h6>
        <h3>{mainHeading} <span className="fw-bold">{mainHeadingBold}</span></h3>
      </div>
    </div>
  );
}

export default SectionHeading;