export default function LoadingButton({ loading, text }) {
  return (
    <button className="submit-btn" disabled={loading}>
      {loading ? "Processing..." : text}
    </button>
  );
}
