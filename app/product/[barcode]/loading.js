export default function ProductLoading() {
  return (
    <div className="loader-container d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading product…</span>
      </div>
    </div>
  );
}
