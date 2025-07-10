import { GoogleGenerativeAI } from '@google/generative-ai'; // Note: lowercase 'ai'

const genAI = new GoogleGenerativeAI('AIzaSyD5KfSrvYyQO_MFJ2gJYtT7Mso8px7wBvY'); // Use your actual API key

async function runPrompt(productData) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const productJsonString = JSON.stringify(productData);

  const prompt = `Your response MUST be valid JSON and contain ONLY the JSON array result. Do NOT include any explanatory text, conversational phrases, code blocks (e.g., \`\`\`python, \`\`\`json), or comments.

You have to process the following product data: ${productJsonString}

**Context and Generalization Rules (Think like a human categorizer):**
The goal is to create a set of simplified, commonly understood product categories from varied names, while maintaining important distinctions like meat type.

1.  **Initial Cleaning:** Remove " Special" (with leading space), and any leading/trailing spaces from all product names.
2.  **Determine Core Product Type & Specific Variant:** For each product name, first identify its main item (e.g., "Momo", "Cheesecake", "Burger"). Then, identify any specific variant (e.g., "Veg", "Chicken", "Buff", "Beef").
3.  **Construct the Final 'Generalized Name':**
    * **Cheesecakes:** Any product containing "cheesecake" (case-insensitive) should be generalized to "Cheesecake".
    * **Cupcakes:** Any product containing "cupcake" (case-insensitive) should be generalized to "Cupcake".
    * **Momo Variants:**
        * If the cleaned name contains "veg" (case-insensitive), generalize to "Momo (Veg)".
        * If the cleaned name contains "chicken" (case-insensitive) AND "momo" (case-insensitive), generalize to "Chicken Momo". This covers "Steam chicken Momo", "Spicy Fried Chicken Momo", "Chicken Momo", etc.
        * If the cleaned name contains "buff" (case-insensitive) AND "momo" (case-insensitive), generalize to "Buff Momo". This ensures Buff Momo is separate from Chicken Momo.
        * If the cleaned name contains "pork" (case-insensitive) AND "momo" (case-insensitive), generalize to "Pork Momo".
        * If the cleaned name contains "momo" (case-insensitive) but no specific dietary/meat type is clearly identified (e.g., "Plain Momo"), generalize to "Momo".
    * **Pizza Variants:**
        * "Chicken Heaven Pizza" and its variations (like "Chicken Heaven Pizza Special", "Thin crust Chicken heaven", "Spicy Chicken Heaven") should all generalize to "Chicken Heaven Pizza".
    * **Burger Variants:**
        * "Beef Burger" and "Spicy Beef Burger" should generalize to "Beef Burger".
4.  **Default Generalization:** If a product name doesn't fit any specific rule above, its 'generalized name' is simply its cleaned original name.

**Given the following JSON array of product objects, process them as follows:**

1.  **Generate 'Generalized Name':** For each product, apply the rules above to create its unique and appropriate 'generalized name'.
2.  **Group and Collect IDs:** Iterate through the input list. Group products by their *final* 'generalized name'. For each unique 'generalized name':
    * **Set the \`name\` field:** This \`name\` field in the output object MUST be the *generalized name* you just determined (e.g., "Chicken Momo", "Momo (Veg)", "Cheesecake").
    * Retain the \`category\` of the *first* product encountered that maps to this generalized name.
    * Collect *all* original \`_id\` values from *all* products that map to this generalized name into an array called \`originalIds\`.
3.  **Output Format:** Provide the final result as a pure JSON array, where each object represents a unique generalized product. Each object should contain:
    * \`name\` (the determined generalized name)
    * \`category\` (the category of the first product in that group)
    * \`originalIds\` (an array of all \`_id\`s that map to this generalized product name)

Input JSON (example includes various momos and cheesecakes to test new rules):
${productJsonString}

Expected Output based on your desired logic (this is a guiding example for the model):
[
  {
    "name": "Cheesecake",
    "category": "686a329ee7a04be1ab6a9858",
    "originalIds": ["686e108be000b43358ecfd5d", "686e0ffce000b43358ecfd59", "686a3bc548c679475e3d813e"]
  },
  {
    "name": "Momo (Veg)",
    "category": "686a32b7e7a04be1ab6a985d",
    "originalIds": ["686a3c2d48c679475e3d8142"]
  },
  {
    "name": "Chicken Momo",
    "category": "686a32b7e7a04be1ab6a985d",
    "originalIds": ["686e114be000b43358ecfd61", "686e11f8e000b43358ecfd65"]
  },
  {
    "name": "Buff Momo",
    "category": "686a32b7e7a04be1ab6a985d",
    "originalIds": ["686e27dd4f4e9955039eb854"] // Assuming this is the ID for Buff Momo
  }
]
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let cleanedJsonString = response.candidates[0].content.parts[0].text.trim();

  if (cleanedJsonString.startsWith('```json\n') && cleanedJsonString.endsWith('\n```')) {
    cleanedJsonString = cleanedJsonString.substring(7, cleanedJsonString.length - 4);
  } else if (cleanedJsonString.startsWith('```\n') && cleanedJsonString.endsWith('\n```')) {
    cleanedJsonString = cleanedJsonString.substring(4, cleanedJsonString.length - 4);
  }
  const plainJavaScriptObject = JSON.parse(cleanedJsonString);

  return plainJavaScriptObject;
}

export default runPrompt;