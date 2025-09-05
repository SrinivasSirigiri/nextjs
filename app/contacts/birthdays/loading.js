"use client";
export default function Loading() {
    return (
      <section style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div style={{
          width: "50px",
          height: "50px",
          border: "5px solid #ccc",
          borderTop: "5px solid #0070f3",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </section>
    );
  }
  