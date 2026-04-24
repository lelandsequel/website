export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--stone)",
        color: "#F0E7D5",
        padding: "3rem 0",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div
          style={{
            width: 48,
            height: 2,
            backgroundColor: "var(--accent)",
            marginBottom: "1.75rem",
          }}
          aria-hidden="true"
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.375rem",
            fontSize: "0.875rem",
            letterSpacing: "0.02em",
          }}
        >
          <div style={{ fontWeight: 500 }}>JourdanLabs &middot; Houston, TX</div>
          <a
            href="mailto:leland@jourdanlabs.com"
            style={{ color: "#F0E7D5", opacity: 0.85 }}
          >
            leland@jourdanlabs.com
          </a>
        </div>
      </div>
    </footer>
  );
}
