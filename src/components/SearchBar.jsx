import React from "react";

function SearchBar({ query, onQueryChange, onSearch, isLoading }) {
  const isDisabled = isLoading || !query.trim();

  return (
    <div style={styles.wrapper}>
      <label htmlFor="product-query" style={styles.label}>
        Describe what you want
      </label>
      <div style={styles.controls}>
      <input
        id="product-query"
        type="text"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !isLoading) {
            onSearch();
          }
        }}
        placeholder='Example: "phone under 500"'
        disabled={isLoading}
        className="search-input"
        style={styles.input}
      />
      <button
        type="button"
        onClick={onSearch}
        disabled={isDisabled}
        style={{
          ...styles.button,
          ...(isDisabled ? styles.buttonDisabled : null),
        }}
      >
        {isLoading ? "Finding matches..." : "Get Recommendations"}
      </button>
      </div>
      <p style={styles.helperText}>
        Try a product type and budget, like phone under 500 or audio below 200.
      </p>
    </div>
  );
}

const styles = {
  wrapper: {
    marginBottom: "12px",
  },
  label: {
    display: "block",
    marginBottom: "10px",
    color: "#102a43",
    fontSize: "14px",
    fontWeight: 600,
  },
  controls: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  input: {
    flex: "1 1 320px",
    minHeight: "56px",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #d9e2ec",
    fontSize: "16px",
    color: "#102a43",
    backgroundColor: "#ffffff",
    outline: "none",
  },
  button: {
    border: "none",
    borderRadius: "14px",
    minHeight: "56px",
    padding: "14px 20px",
    backgroundColor: "#0b6e4f",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    minWidth: "220px",
  },
  buttonDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
  helperText: {
    margin: "10px 2px 0",
    color: "#7b8794",
    fontSize: "13px",
  },
};

export default SearchBar;
