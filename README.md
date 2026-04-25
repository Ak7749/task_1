# AI Product Recommendations

A small React + Vite app that recommends products from a local catalog based on a natural-language query like `phone under 500`.

The app tries the OpenAI API first and falls back to a local scoring filter if the AI request fails or returns no usable product IDs.

## Features

- Search products with natural-language queries
- Display the full product catalog
- Show AI-based recommendations
- Fall back to local filtering when AI is unavailable
- Handle loading and error states in the UI

## Tech Stack

- React
- Vite
- OpenAI Responses API

## Project Structure

```text
src/
  components/
    ProductList.jsx
    RecommendationList.jsx
    SearchBar.jsx
  api/
    openai.js
  utils/
    fallbackFilter.js
  data/
    products.js
  App.jsx
  main.jsx
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview the production build

```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the project root if you want to enable the OpenAI request path:

```env
REACT_APP_OPENAI_API_KEY=your_api_key_here
REACT_APP_OPENAI_MODEL=gpt-5.4-mini
```

## How It Works

1. The user enters a query in the search bar.
2. The app sends the query and product catalog to the OpenAI API.
3. The AI is prompted to return only a JSON array of product IDs, for example `[1, 3]`.
4. The app maps those IDs back to products in the local catalog.
5. If the API call fails or the AI response cannot be used, the app falls back to `fallbackFilter`.

## Notes

- The current implementation uses environment variables in frontend code because that matches the current app logic.
- For real production use, move the OpenAI call to a backend proxy so the API key is not exposed in the browser.
- JSX files use the `.jsx` extension in this Vite setup.

## Example Query

- `phone under 500`
- `audio under 200`
- `tablet below 400`

## Available Scripts

- `npm run dev`: start the Vite dev server
- `npm run build`: create a production build
- `npm run preview`: preview the production build locally
