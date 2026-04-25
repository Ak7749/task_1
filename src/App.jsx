import React, { useState } from "react";
import SearchBar from "./components/SearchBar.jsx";
import ProductList from "./components/ProductList.jsx";
import RecommendationList from "./components/RecommendationList.jsx";
import products from "./data/products";
import { getRecommendations } from "./api/openai";
import { fallbackFilter } from "./utils/fallbackFilter";

function mapIdsToProducts(productIds, products) {
  const idSet = new Set(productIds);
  return products.filter((product) => idSet.has(product.id));
}

function App() {
  const [query, setQuery] = useState("");
  const [recommendedIds, setRecommendedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const hasSearched = Boolean(lastQuery);

  async function handleSearch() {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setError("Please enter a search query before requesting recommendations.");
      setRecommendedIds([]);
      return;
    }

    setIsLoading(true);
    setError("");
    setLastQuery(trimmedQuery);

    try {
      const aiRecommendationIds = await getRecommendations(trimmedQuery, products);

      if (aiRecommendationIds.length > 0) {
        setRecommendedIds(aiRecommendationIds);
        return;
      }

      // If AI returns invalid JSON or no usable IDs, use the local fallback.
      const fallbackIds = fallbackFilter(products, trimmedQuery);
      setRecommendedIds(fallbackIds);

      if (fallbackIds.length === 0) {
        setError("No matching products were found for that query.");
      }
    } catch (requestError) {
      const fallbackIds = fallbackFilter(products, trimmedQuery);
      setRecommendedIds(fallbackIds);

      if (fallbackIds.length === 0) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Something went wrong while fetching recommendations."
        );
      } else {
        setError("AI recommendations were unavailable, so fallback results are shown.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const recommendedProducts = mapIdsToProducts(recommendedIds, products);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.hero}>
          <div>
            <span style={styles.eyebrow}>Smart Shopping Assistant</span>
            <h1 style={styles.title}>AI Product Recommendations</h1>
            <p style={styles.subtitle}>
              Search with natural language, like <strong>"phone under 500"</strong>,
              and get matching products from the catalog.
            </p>
          </div>
        </div>

        <SearchBar
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        <p style={styles.note}>
          Tip: keep the Hugging Face API key in environment variables and use a
          backend proxy in production so the key is not exposed to the browser.
        </p>

        {isLoading ? (
          <div style={styles.loadingBanner}>
            <span style={styles.loadingDot} />
            Fetching AI recommendations and preparing results...
          </div>
        ) : null}

        {error ? <div style={styles.errorBanner}>{error}</div> : null}

        <ProductList products={products} />
        <RecommendationList
          products={recommendedProducts}
          isLoading={isLoading}
          lastQuery={lastQuery}
          hasSearched={hasSearched}
        />
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f5f7fb 0%, #eef4f1 100%)",
    padding: "40px 16px 56px",
    fontFamily: '"Segoe UI", Arial, sans-serif',
  },
  container: {
    maxWidth: "980px",
    margin: "0 auto",
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderRadius: "28px",
    padding: "32px",
    boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.7)",
  },
  hero: {
    marginBottom: "24px",
    paddingBottom: "8px",
    borderBottom: "1px solid #e4e7eb",
  },
  eyebrow: {
    display: "inline-block",
    marginBottom: "12px",
    padding: "6px 10px",
    borderRadius: "999px",
    backgroundColor: "#eef8f4",
    color: "#0b6e4f",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  title: {
    margin: "0 0 10px",
    color: "#102a43",
    fontSize: "56px",
    lineHeight: 1.05,
  },
  subtitle: {
    margin: "0 0 24px",
    color: "#52606d",
    fontSize: "18px",
    maxWidth: "760px",
  },
  note: {
    margin: "0 0 18px",
    color: "#7b8794",
    fontSize: "13px",
    lineHeight: 1.5,
  },
  loadingBanner: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
    padding: "12px 14px",
    borderRadius: "12px",
    backgroundColor: "#e8f1ff",
    color: "#1f4f82",
    fontWeight: 600,
  },
  loadingDot: {
    width: "10px",
    height: "10px",
    borderRadius: "999px",
    backgroundColor: "#1f4f82",
    display: "inline-block",
  },
  errorBanner: {
    marginBottom: "16px",
    padding: "12px 14px",
    borderRadius: "12px",
    backgroundColor: "#ffe3e3",
    color: "#c92a2a",
  },
};

export default App;
