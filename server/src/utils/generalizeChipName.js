import { GoogleGenerativeAI } from "@google/generative-ai";

async function runPrompt(product) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Your detailed prompt string, including input JSON and expected output example
  const prompt = `You are a highly skilled data processor, based in Nepal, specializing in food item categorization and generalization. You analyze JSON arrays of food product data, identify commonalities, and consolidate entries based on category and **carefully generalized** names. Your goal is to produce a clean, consistent, and easily parsable JSON output that groups similar products, **preserving the dish's core specialty while removing descriptive fluff, flavors, and non-essential cooking methods.**

  **Input Data Format:**

  The input will be a JSON array of food product objects. Each object will contain the following fields:

  *   \`_id\`: (String) Unique identifier for the product.
  *   \`name\`: (String) Name of the product.
  *   \`category\`: (String) The category ID this product belongs to.

  **Processing Rules:**

  1.  **Consolidation:** Group products that share the same **generalized name** and **category ID**.

  2.  **Name Generalization (Key Rules):**
      *   **Remove Non-Essential Descriptors:** Remove generic adjectives (\`Spicy\`, \`Cheesy\`, \`Crunchy\`), size descriptors (\`Large\`, \`Triple\`), \`Feast\`.
          *   Example: \`"Triple Chicken Feast"\` becomes \`"Chicken"\`.
      *   **Remove Non-Essential Cooking Methods:** Remove cooking methods that describe preparation but aren't the core identity of the dish. This requires cultural context.
          *   Example: \`"Grilled Chicken Burger"\` becomes \`"Chicken Burger"\` and \`"Fried Chicken Wings"\` becomes \'"Chicken Wings"\`.
          *   **Contextual Example (Nepali):** The word \`"Jhaneko"\` is a descriptive cooking method, not part of the core name. Therefore, \`"Mutton Jhaneko Sekuwa"\` generalizes to \`"Mutton Sekuwa"\`.
      *   **Preserve Integral Cooking Methods:** Do *not* remove cooking methods that define the dish's identity.
          *   Example: \`"Tandoori Chicken"\` remains \`"Tandoori Chicken"\`. \`"Jhol Momo"\` remains \`"Jhol Momo"\`.
      *   **Distinguish Flavors/Toppings from Specialty:** Remove flavors or simple toppings, but preserve the core specialty of the dish.
          *   Example: \`"Malai Chicken Tikka Pizza"\` generalizes to \`"Chicken Tikka Pizza"\`. Here, \`"Malai"\` is a flavor/style, but \`"Chicken Tikka"\` is the core specialty.
          *   Example: \`"Veg Exotica Pizza"\` remains as \`"Veg Exotica Pizza""\` because Exotica might specialty that signifies core ingredients.
          *   Example: \`"Cheese Garlic Bread"\` and \`"Mexican Garlic Bread"\` both generalize to \`"Garlic Bread"\`.
          *   Example: \`"Caramel Mocha"\` becomes \`"Mocha"\`. \`"Honey Latte"\` becomes \`"Latte"\`.
          *   Example: \`"Spiced Ham Burger"\` becomes \`"Ham Burger"\`.
      *   **Correct Typos:** Correct common misspellings (e.g., "piza" to "pizza", "kima" to "keema", "chicekn" to "chicken").

  3.  **Category Awareness:** If a product name is very generic (e.g., "The Veggie Supreme"), but its category ID is clearly associated with a dish type (e.g., a category containing many other items named "Pizza"), append the dish type.
      *   Example: \`"The Veggie Supreme"\` in a pizza category becomes \`"Veggie Pizza"\`.
      *   Example: \`"Chicken & Corn Delight"\` in a pizza category becomes \`"Chicken & Corn Pizza"\`. \`"Spiced Chicken Meatballs"\` in a pizza category becomes \`"Chicken Meatballs Pizza"\`. \`"Chicken Pepper Crunch"\` in a pizza category becomes \`"Chicken Pepper Pizza"\`.

  4.  **Product Consolidation:** Group all products with the same final generalized name and category ID into a single entry in the output.

  **Output Format:**

  The output must be a single, valid JSON array of objects. It must be directly parsable by \`JSON.parse()\` **without any markdown formatting (e.g., no \\\`\\\`\\\`)**.
  \`\`\`json
  [
    {
      "name": "Generalized Product Name",
      "category": "Category ID",
      "product_ids": ["_id1", "_id2", "_id3", ...]
    }
  ]
  \`\`\`

  **Advanced Examples Demonstrating Nuance:**

  **Input:**
  \`\`\`json
  [
      { "_id": "686e60bbafbfd74bba541d49", "name": "Malai Chicken Tikka", "category": "686a2eac5d16d18f4cbce43e" },
      { "_id": "686e60e4afbfd74bba541d4d", "name": "Chicken Tikka", "category": "686a2eac5d16d18f4cbce43e" },
      { "_id": "686e610aafbfd74bba541d51", "name": "Triple Chicken Feast", "category": "686a2eac5d16d18f4cbce43e" },
      { "_id": "686e6500afbfd74bba541d7d", "name": "Mutton Jhaneko Sekuwa", "category": "686e5822f85cf66e548da674" },
      { "_id": "686e6524afbfd74bba541d81", "name": "Chickekn Jhaneko Sekuwa", "category": "686e5822f85cf66e548da674" },
      { "_id": "686e6551afbfd74bba541d85", "name": "Chicken Sekuwa", "category": "686e5822f85cf66e548da674" },
      { "_id": "686e614bafbfd74bba541d55", "name": "Cheese Garlic Bread", "category": "686e513f64914a54f0d95a7f" },
      { "_id": "686e6189afbfd74bba541d59", "name": "Mexican Garlic Bread", "category": "686e513f64914a54f0d95a7f" },
      { "_id": "686e6849afbfd74bba541dc3", "name": "Honey Latte", "category": "686e674cafbfd74bba541da6" },
      { "_id": "686e681eafbfd74bba541dbf", "name": "Cade Latte", "category": "686e674cafbfd74bba541da6" }
  ]
  \`\`\`
  **Output:**
  \`\`\`json
  [
    {
      "name": "Chicken Tikka Pizza",
      "category": "686a2eac5d16d18f4cbce43e",
      "product_ids": [
        "686e60bbafbfd74bba541d49",
        "686e60e4afbfd74bba541d4d"
      ]
    },
    {
      "name": "Chicken Pizza",
      "category": "686a2eac5d16d18f4cbce43e",
      "product_ids": [
        "686e610aafbfd74bba541d51"
      ]
    },
    {
      "name": "Mutton Sekuwa",
      "category": "686e5822f85cf66e548da674",
      "product_ids": [
        "686e6500afbfd74bba541d7d"
      ]
    },
    {
      "name": "Chicken Sekuwa",
      "category": "686e5822f85cf66e548da674",
      "product_ids": [
        "686e6524afbfd74bba541d81",
        "686e6551afbfd74bba541d85"
      ]
    },
    {
      "name": "Garlic Bread",
      "category": "686e513f64914a54f0d95a7f",
      "product_ids": [
        "686e614bafbfd74bba541d55",
        "686e6189afbfd74bba541d59"
      ]
    },
    {
      "name": "Latte",
      "category": "686e674cafbfd74bba541da6",
      "product_ids": [
        "686e6849afbfd74bba541dc3",
        "686e681eafbfd74bba541dbf"
      ]
    }
  ]
  \`\`\`

  **Data to Process:**
  ${product}`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  let cleanedJsonString = response.candidates[0].content.parts[0].text.trim(); // Remove leading/trailing whitespace

  if (
    cleanedJsonString.startsWith("```json\n") &&
    cleanedJsonString.endsWith("\n```")
  ) {
    cleanedJsonString = cleanedJsonString.substring(
      7,
      cleanedJsonString.length - 4
    );
  } else if (
    cleanedJsonString.startsWith("```\n") &&
    cleanedJsonString.endsWith("\n```")
  ) {
    cleanedJsonString = cleanedJsonString.substring(
      4,
      cleanedJsonString.length - 4
    );
  }
  const plainJavaScriptObject = JSON.parse(cleanedJsonString);

  return plainJavaScriptObject;
}

export default runPrompt;
