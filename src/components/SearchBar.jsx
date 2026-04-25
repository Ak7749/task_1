import React from "react";

function SearchBar({ query, onQueryChange, onSearch, isLoading }) {
  return (
    <div style={styles.wrapper}>
      <input
        type="text"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !isLoading) {
            onSearch();
          }
        }}
        placeholder="Try: phone under 500"
        disabled={isLoading}
        style={styles.input}
      />
      <button
        type="button"
        onClick={onSearch}
        disabled={isLoading}
        style={{
          ...styles.button,
          ...(isLoading ? styles.buttonDisabled : null),
        }}
      >
        {isLoading ? "Loading..." : "Get Recommendations"}
      </button>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  input: {
    flex: "1 1 320px",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #cbd2d9",
    fontSize: "16px",
  },
  button: {
    border: "none",
    borderRadius: "10px",
    padding: "12px 18px",
    backgroundColor: "#0b6e4f",
    color: "#ffffff",
    fontSize: "16px",
    cursor: "pointer",
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
};

export default SearchBar;
