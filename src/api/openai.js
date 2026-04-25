const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const OPENAI_MODEL = process.env.REACT_APP_OPENAI_MODEL || "gpt-5.4-mini";

function buildCatalogSummary(products) {
  return products
    .map(
      (product) =>
        `- id: ${product.id} | name: ${product.name} | category: ${product.category} | price: $${product.price}`
    )
    .join("\n");
}

function buildPrompt(query, products) {
  return [
    "You are a product recommendation assistant.",
    "Choose only from the provided product catalog.",
    "Return ONLY a JSON array of product IDs.",
    "Example output: [1, 3]",
    "Do not return product names.",
    "Do not return markdown.",
    "Return at most 5 IDs.",
    "If nothing matches, return [].",
    "",
    `User query: ${query}`,
    "",
    "Catalog:",
    buildCatalogSummary(products),
  ].join("\n");
}

function extractResponseText(data) {
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const textParts = [];

  for (const item of data?.output || []) {
    for (const content of item?.content || []) {
      if (content?.type === "output_text" && typeof content.text === "string") {
        textParts.push(content.text);
      }
    }
  }

  return textParts.join("\n").trim();
}

function sanitizeProductIds(ids, products) {
  const validIds = new Set(products.map((product) => product.id));

  return [...new Set(ids)]
    .map((id) => Number(id))
    .filter((id) => Number.isInteger(id) && validIds.has(id));
}

function parseRecommendationIds(responseText, products) {
  if (!responseText) {
    return [];
  }

  try {
    const parsed = JSON.parse(responseText);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return sanitizeProductIds(parsed, products);
  } catch (error) {
    return [];
  }
}

export async function getRecommendations(query, products) {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing REACT_APP_OPENAI_API_KEY.");
  }

  // In production, call OpenAI from your server to avoid exposing secrets in the browser.
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: buildPrompt(query, products),
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `OpenAI request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    return parseRecommendationIds(extractResponseText(data), products);
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch AI recommendations."
    );
  }
}

export default getRecommendations;
