const QUERY_STOP_WORDS = new Set([
  "under",
  "below",
  "less",
  "than",
  "max",
  "upto",
  "up",
  "to",
]);

function normalizeText(value) {
  return String(value || "").toLowerCase().trim();
}

function extractPriceLimit(query) {
  const match = query.match(
    /\b(?:under|below|less than|max|upto|up to)\s+\$?(\d+)\b/i
  );

  return match ? Number(match[1]) : null;
}

function tokenizeQuery(query) {
  return normalizeText(query)
    .split(/[^a-z0-9]+/i)
    .filter((token) => token.length > 1 && !QUERY_STOP_WORDS.has(token));
}

function scoreProductMatch(product, queryTokens, priceLimit) {
  const searchableText = normalizeText(`${product.name} ${product.category}`);
  let score = 0;

  queryTokens.forEach((token) => {
    if (searchableText.includes(token)) {
      score += 2;
    }
  });

  if (priceLimit !== null && product.price <= priceLimit) {
    score += 3;
  }

  if (priceLimit !== null && product.price > priceLimit) {
    score -= 5;
  }

  return score;
}

// Simple local fallback used when AI fails or returns no usable results.
export function fallbackFilter(products, query) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const priceLimit = extractPriceLimit(trimmedQuery);
  const queryTokens = tokenizeQuery(trimmedQuery);

  return products
    .map((product) => ({
      product,
      score: scoreProductMatch(product, queryTokens, priceLimit),
    }))
    .filter(({ product, score }) => {
      if (priceLimit !== null) {
        return product.price <= priceLimit || score > 0;
      }

      return score > 0;
    })
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.product.price - right.product.price;
    })
    .slice(0, 5)
    .map(({ product }) => product.id);
}

export default fallbackFilter;
