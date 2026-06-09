function CacheNotice({ message }) {
  if (!message) return null;

  return (
    <div className="alert alert-warning py-2 px-3 mb-0 text-center small" role="status">
      {message}
    </div>
  );
}

export default CacheNotice;
