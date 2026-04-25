import React from "react";

function ProductList({ products }) {
  return (
    <section style={styles.section}>
      <div style={styles.headerRow}>
        <h2 style={styles.heading}>All Products</h2>
        <span style={styles.count}>{products.length} items</span>
      </div>
      <ul style={styles.list}>
        {products.map((product) => (
          <li key={product.id} style={styles.card}>
            <div style={styles.productInfo}>
              <strong style={styles.name}>{product.name}</strong>
              <span style={styles.meta}>{product.category}</span>
            </div>
            <span style={styles.price}>${product.price}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const styles = {
  section: {
    marginTop: "36px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "14px",
    flexWrap: "wrap",
  },
  heading: {
    margin: 0,
    color: "#102a43",
    fontSize: "32px",
  },
  count: {
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
    gap: "12px",
    alignItems: "center",
    padding: "18px 20px",
    border: "1px solid #e4e7eb",
    borderRadius: "16px",
    backgroundColor: "#ffffff",
    flexWrap: "wrap",
    boxShadow: "0 2px 10px rgba(15, 23, 42, 0.03)",
  },
  productInfo: {
    display: "grid",
    gap: "6px",
  },
  name: {
    color: "#102a43",
    fontSize: "18px",
  },
  meta: {
    color: "#486581",
    fontSize: "15px",
  },
  price: {
    color: "#0b6e4f",
    fontWeight: 700,
    fontSize: "16px",
  },
};

export default ProductList;
