import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import ProductList from "./components/ProductList";
import RecommendationList from "./components/RecommendationList";
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
        <h1 style={styles.title}>AI Product Recommendations</h1>
        <p style={styles.subtitle}>
          Search with natural language, like <strong>"phone under 500"</strong>,
          and get matching products from the catalog.
        </p>

        <SearchBar
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        <div style={styles.note}>
          Best practice: keep the OpenAI API key in environment variables and use a
          backend proxy in production so the key is not exposed to the browser.
        </div>

        {isLoading ? (
          <div style={styles.loadingBanner}>
            Fetching AI recommendations and preparing results...
          </div>
        ) : null}

        {error ? <div style={styles.errorBanner}>{error}</div> : null}

        <ProductList products={products} />
        <RecommendationList
          products={recommendedProducts}
          isLoading={isLoading}
          lastQuery={lastQuery}
        />
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f6f7fb",
    padding: "32px 16px",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    maxWidth: "920px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
  },
  title: {
    margin: "0 0 8px",
    color: "#102a43",
  },
  subtitle: {
    margin: "0 0 24px",
    color: "#52606d",
  },
  note: {
    marginBottom: "16px",
    padding: "12px 14px",
    borderRadius: "10px",
    backgroundColor: "#eef8f4",
    color: "#0b6e4f",
    fontSize: "14px",
  },
  loadingBanner: {
    marginBottom: "16px",
    padding: "12px 14px",
    borderRadius: "10px",
    backgroundColor: "#e8f1ff",
    color: "#1f4f82",
  },
  errorBanner: {
    marginBottom: "16px",
    padding: "12px 14px",
    borderRadius: "10px",
    backgroundColor: "#ffe3e3",
    color: "#c92a2a",
  },
};

export default App;
