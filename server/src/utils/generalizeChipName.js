import { GoogleGenerativeAI} from '@google/generative-ai'


const genAI = new GoogleGenerativeAI('AIzaSyD5KfSrvYyQO_MFJ2gJYtT7Mso8px7wBvY');

async function runPrompt(product) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Your detailed prompt string, including input JSON and expected output example
    const prompt = `Your response MUST be valid JSON and contain ONLY the JSON array result. Do NOT include any explanatory text, conversational phrases, code blocks (e.g., \`\`\`python, \`\`\`json), or comments.

    you have to run this model for this data: ${product}
  know the context first:
  All "Chicken Heaven" related items (Chicken Heaven Pizza, Chicken Heaven Pizza Special, Thin crust Chicken heaven, Spicy Chicken Heaven) should indeed group under a single "Chicken heaven" entry. My rule for "chicken heaven" containing name should have caught all of them and they should have been consolidated.
  
Similarly, "Beef BUrger" and "Spicy Beef Burger" should also be consolidated into a single "Beef Burger" entry.


  Given the following JSON array of product objects, process them as follows:
  
  1.  **Generalize Product Names:** For each product, if its \`name\` contains the substring \" Special\" (note the leading space), create a 'generalized name' by removing \" Special\" from the original name. Otherwise, the 'generalized name' is the original \`name\`.
  2.  **Group and Collect IDs by Generalized Name:** Iterate through the input list. Group products by their 'generalized name'. For each unique 'generalized name':
      * Retain the \`name\` of the *first* product encountered that maps to this generalized name.
      * Retain the \`category\` of the *first* product encountered that maps to this generalized name.
      * Collect *all* original \`_id\` values from *all* products that map to this generalized name into an array called \`originalIds\`.
  3.  **Output Format:** Provide the final result as a pure JSON array, where each object represents a unique generalized product. Each object should contain:
      * \`name\` (the original name of the first product in that group)
      * \`category\` (the category of the first product in that group)
      * \`originalIds\` (an array of all \`_id\`s that map to this generalized product name)
  
  Input JSON:
  [
    {
      \"_id\": \"686b344eacbeac6ec398589f\",
      \"name\": \"Chicken Heaven Pizza\",
      \"description\": \"A delicious pizza loaded with tender chicken pieces, mozzarella cheese, and our special house sauce.\",
      \"category\": \"6869e1e5ddc164e1d0b24093\",
      \"imageUrl\": \"https://example.com/chicken_heaven_pizza.jpg\",
      \"sellerId\": \"686b3251d49621c2b28e8b88\",
      \"originalPrice\": 450,
      \"discountedPrice\": 400,
      \"discountPercentage\": 11,
      \"expiryDate\": \"2025-07-11T00:00:00.000Z\",
      \"availableQuantity\": 20,
      \"isAvailable\": true,
      \"status\": \"active\",
      \"createdAt\": \"2025-07-07T09:05:00.000Z\",
      \"updatedAt\": \"2025-07-07T09:05:00.000Z\",
      \"__v\": 0
    },\n  {\n    \"_id\": \"686b344eacbeac6ec39858a0\",\n    \"name\": \"Chicken Heaven Pizza Special\",
      \"description\": \"Our signature Chicken Heaven Pizza with extra toppings, including bell peppers, onions, and a hint of smoky BBQ sauce.\",
      \"category\": \"6869e1e5ddc164e1d0b24093\",
      \"imageUrl\": \"https://example.com/chicken_heaven_pizza_special.jpg\",
      \"sellerId\": \"686b3251d49621c2b28e8b88\",
      \"originalPrice\": 550,
      \"discountedPrice\": 500,
      \"discountPercentage\": 9,
      \"expiryDate\": \"2025-07-11T00:00:00.000Z\",
      \"availableQuantity\": 12,
      \"isAvailable\": true,
      \"status\": \"active\",
      \"createdAt\": \"2025-07-07T09:06:00.000Z\",
      \"updatedAt\": \"2025-07-07T09:06:00.000Z\",
      \"__v\": 0
    },\n{\n    \"_id\": \"686b344eacbeac6ec398589d\",\n    \"name\": \"Sel Roti\",
      \"description\": \"Traditional Nepali Ring-shaped Bread\",
      \"category\": \"6869e1e5ddc164e1d0b24092\",
      \"imageUrl\": \"https://www.nepalicooking.com/wp-content/uploads/2019/04/selroti-1.jpg\",
      \"sellerId\": \"686b3251d49621c2b28e8b87\",
      \"originalPrice\": 40,\n    \"discountedPrice\": 40,\n    \"discountPercentage\": 0,\n    \"expiryDate\": \"2025-07-08T00:00:00.000Z\",
      \"availableQuantity\": 25,
      \"isAvailable\": true,
      \"status\": \"active\",
      \"createdAt\": \"2025-07-07T02:46:30.000Z\",
      \"updatedAt\": \"2025-07-07T02:46:30.000Z\",
      \"__v\": 0
    }\n]\n\nExpected Output:\n[\n  {\n    \"name\": \"Chicken Heaven Pizza\",\n    \"category\": \"6869e1e5ddc164e1d0b24093\",\n    \"originalIds\": [\"686b344eacbeac6ec398589f\", \"686b344eacbeac6ec39858a0\"]\n  },\n  {\n    \"name\": \"Sel Roti\",\n    \"category\": \"6869e1e5ddc164e1d0b24092\",\n    \"originalIds\": [\"686b344eacbeac6ec398589d\"]\n  }\n]\n`;

    const result = await model.generateContent(prompt);
    const response = await result.response; 
let cleanedJsonString = response.candidates[0].content.parts[0].text.trim(); // Remove leading/trailing whitespace

if (cleanedJsonString.startsWith('```json\n') && cleanedJsonString.endsWith('\n```')) {
  cleanedJsonString = cleanedJsonString.substring(7, cleanedJsonString.length - 4);
} else if (cleanedJsonString.startsWith('```\n') && cleanedJsonString.endsWith('\n```')) {
  cleanedJsonString = cleanedJsonString.substring(4, cleanedJsonString.length - 4);
}
const plainJavaScriptObject = JSON.parse(cleanedJsonString);

   return plainJavaScriptObject
}


export default runPrompt