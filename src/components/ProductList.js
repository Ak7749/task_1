import React from "react";

function ProductList({ products }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>All Products</h2>
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

export default ProductList;
