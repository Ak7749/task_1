function getEnvValue(...keys) {
  const viteEnv =
    typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : {};
  const processEnv =
    typeof process !== "undefined" && process.env ? process.env : {};

  for (const key of keys) {
    if (viteEnv[key]) {
      return viteEnv[key];
    }

    if (processEnv[key]) {
      return processEnv[key];
    }
  }

  return "";
}

const HF_BASE_URL =
  getEnvValue("VITE_HF_BASE_URL", "VITE_BASE_URL") ||
  "https://router.huggingface.co/v1";
const HF_CHAT_COMPLETIONS_URL = `${HF_BASE_URL.replace(/\/$/, "")}/chat/completions`;
const HF_MODEL =
  getEnvValue("VITE_HF_MODEL", "MODEL_NAME") || "openai/gpt-oss-120b";

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
  const messageContent = data?.choices?.[0]?.message?.content;

  if (typeof messageContent === "string" && messageContent.trim()) {
    return messageContent.trim();
  }

  if (Array.isArray(messageContent)) {
    return messageContent
      .map((item) => {
        if (typeof item?.text === "string") {
          return item.text;
        }

        return "";
      })
      .join("\n")
      .trim();
  }

  return "";
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

    if (Array.isArray(parsed)) {
      return sanitizeProductIds(parsed, products);
    }

    if (Array.isArray(parsed?.productIds)) {
      return sanitizeProductIds(parsed.productIds, products);
    }

    return [];
  } catch (error) {
    return [];
  }
}

export async function getRecommendations(query, products) {
  const apiKey = getEnvValue("VITE_HF_API_KEY", "HF_TOKEN", "OPENAPI_KEY");

  if (!apiKey) {
    throw new Error("Missing VITE_HF_API_KEY in your environment file.");
  }

  // In production, call Hugging Face from your server to avoid exposing secrets in the browser.
  try {
    const response = await fetch(HF_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: HF_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You recommend products from a provided catalog. Follow the user's budget and category constraints carefully.",
          },
          {
            role: "user",
            content: buildPrompt(query, products),
          },
        ],
        temperature: 0.1,
        max_tokens: 80,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Hugging Face request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    return parseRecommendationIds(extractResponseText(data), products);
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch Hugging Face recommendations."
    );
  }
}

export default getRecommendations;
