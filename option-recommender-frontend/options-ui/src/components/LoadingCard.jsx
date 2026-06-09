function LoadingCard({ title, message = "Loading..." }) {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        {title && <h5 className="card-title">{title}</h5>}
        <div className="d-flex flex-column justify-content-center align-items-center text-center" style={{ minHeight: "280px" }}>
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted small mb-0">{message}</p>
        </div>
      </div>
    </div>
  );
}

export default LoadingCard;
