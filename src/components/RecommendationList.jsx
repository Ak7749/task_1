import React from "react";

function RecommendationList({ products, isLoading, lastQuery }) {
  const hasProducts = products.length > 0;

  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>Recommended Products</h2>

      {lastQuery && !isLoading ? (
        <p style={styles.summary}>
          Showing results for: <strong>{lastQuery}</strong>
        </p>
      ) : null}

      {isLoading ? (
        <p style={styles.info}>Analyzing your query and product catalog...</p>
      ) : null}

      {!hasProducts && !isLoading ? (
        <p style={styles.info}>Recommendations will appear here after you search.</p>
      ) : null}

      <ul style={styles.list}>
        {products.map((product) => (
          <li key={product.id} style={styles.card}>
            <strong>{product.name}</strong>
            <span style={styles.meta}>{product.category}</span>
            <span style={styles.price}>${product.price}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const styles = {
  section: {
    marginTop: "28px",
  },
  heading: {
    marginBottom: "12px",
    color: "#102a43",
  },
  summary: {
    marginTop: 0,
    marginBottom: "12px",
    color: "#486581",
  },
  info: {
    marginTop: 0,
    marginBottom: "12px",
    color: "#486581",
  },
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "grid",
    gap: "12px",
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "14px 16px",
    border: "1px solid #e4e7eb",
    borderRadius: "12px",
    backgroundColor: "#fbfcfe",
    flexWrap: "wrap",
  },
  meta: {
    color: "#486581",
  },
  price: {
    color: "#0b6e4f",
    fontWeight: 700,
  },
};

export default RecommendationList;
