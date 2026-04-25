import React from "react";

function RecommendationList({ products, isLoading, lastQuery, hasSearched }) {
  const hasProducts = products.length > 0;

  return (
    <section style={styles.section}>
      <div style={styles.panel}>
        <div style={styles.headerRow}>
          <div>
            <h2 style={styles.heading}>Recommended Products</h2>
            {lastQuery && !isLoading ? (
              <p style={styles.summary}>
                Results for <strong>{lastQuery}</strong>
              </p>
            ) : null}
          </div>
          {hasProducts ? <span style={styles.badge}>{products.length} match{products.length > 1 ? "es" : ""}</span> : null}
        </div>

        {isLoading ? (
          <p style={styles.info}>Analyzing your query and choosing the best matches...</p>
        ) : null}

        {!hasSearched && !isLoading ? (
          <p style={styles.info}>
            Recommendations will appear here after you search.
          </p>
        ) : null}

        {hasSearched && !hasProducts && !isLoading ? (
          <div style={styles.emptyState}>
            <strong style={styles.emptyTitle}>No recommendations found</strong>
            <span style={styles.emptyText}>
              Try a broader query, a higher budget, or a different category.
            </span>
          </div>
        ) : null}

        <ul style={styles.list}>
          {products.map((product) => (
            <li key={product.id} style={styles.card}>
              <div style={styles.productInfo}>
                <div style={styles.titleRow}>
                  <strong style={styles.name}>{product.name}</strong>
                  <span style={styles.recommendedTag}>Recommended</span>
                </div>
                <span style={styles.meta}>{product.category}</span>
              </div>
              <span style={styles.price}>${product.price}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const styles = {
  section: {
    marginTop: "40px",
  },
  panel: {
    padding: "22px",
    borderRadius: "20px",
    background:
      "linear-gradient(180deg, rgba(234, 245, 241, 0.85) 0%, rgba(255, 255, 255, 1) 100%)",
    border: "1px solid #d7ebe4",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "14px",
    flexWrap: "wrap",
  },
  heading: {
    margin: 0,
    color: "#102a43",
    fontSize: "30px",
  },
  summary: {
    margin: "8px 0 0",
    color: "#486581",
    fontSize: "14px",
  },
  info: {
    marginTop: 0,
    marginBottom: "12px",
    color: "#52606d",
    fontSize: "15px",
  },
  badge: {
    padding: "7px 12px",
    borderRadius: "999px",
    backgroundColor: "#dff4ea",
    color: "#0b6e4f",
    fontSize: "13px",
    fontWeight: 700,
  },
  emptyState: {
    display: "grid",
    gap: "6px",
    marginBottom: "12px",
    padding: "16px 18px",
    borderRadius: "16px",
    backgroundColor: "#ffffff",
    border: "1px dashed #cbd2d9",
  },
  emptyTitle: {
    color: "#102a43",
  },
  emptyText: {
    color: "#7b8794",
    fontSize: "14px",
  },
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "grid",
    gap: "14px",
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    padding: "18px 20px",
    border: "1px solid #b8e0d0",
    borderLeft: "6px solid #0b6e4f",
    borderRadius: "18px",
    backgroundColor: "#ffffff",
    flexWrap: "wrap",
    boxShadow: "0 8px 20px rgba(11, 110, 79, 0.08)",
  },
  productInfo: {
    display: "grid",
    gap: "6px",
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  name: {
    color: "#102a43",
    fontSize: "18px",
  },
  meta: {
    color: "#486581",
    fontSize: "15px",
  },
  recommendedTag: {
    padding: "5px 10px",
    borderRadius: "999px",
    backgroundColor: "#eef8f4",
    color: "#0b6e4f",
    fontSize: "12px",
    fontWeight: 700,
  },
  price: {
    color: "#0b6e4f",
    fontWeight: 700,
    fontSize: "16px",
  },
};

export default RecommendationList;
