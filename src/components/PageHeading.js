const PageHeading = ({ title, description }) => {
  return (
    <div className="text-center mb-3 mb-md-4">
      <h2 className="mb-2 text-primary fw-semibold lh-sm">{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export default PageHeading;