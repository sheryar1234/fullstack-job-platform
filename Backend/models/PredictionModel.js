const { GoogleGenerativeAI } = require("@google/generative-ai");

class PredictionModel {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  // Field-specific prediction logic
  predictFieldSpecific(text, field) {
    const promptTemplates = {
      fullName: `Given the partial name '${text}' (e.g., 'john' → 'smith', 'ali' → 'khan'), predict the next two words of a full name. Return exactly two words, ensuring they fit a name format.`,
      email: `Given the partial email address '${text}' (e.g., 'gamil' → '. com', 'user' → '@ gmail', 'john.doe' → '@ outlook'), predict the next two parts of an email pattern. Return exactly two words or segments, ensuring they fit an email address format (username@domain.tld).`,
      phoneNumber: `Given the partial phone number '${text}' (e.g., '034125' → '00 34', '123' → '45 67', '555' → '12 34'), predict the next two digits or segments to continue the pattern. Return exactly two words or digits, ensuring they fit a phone number format (10-15 digits total).`,
      linkedin: `Given the partial URL '${text}' (e.g., 'https' → ': //', 'link' → 'ed in', 'www' → '. linkedin'), predict the next two parts of a LinkedIn URL. Return exactly two words, ensuring they fit a URL structure.`,
      "education.degree": `Given the partial degree '${text}' (e.g., 'B' → 'S CS', 'M' → 'A IT', 'Ph' → 'D Eng'), predict the next two parts of a degree abbreviation. Return exactly two words, ensuring they fit an academic degree format.`,
      "education.institution": `Given the partial institution name '${text}' (e.g., 'nt' → 'u fsd', 'har' → 'vard uni', 'stan' → 'ford univ'), predict the next two words of a university name. Return exactly two words, ensuring they fit an institution name.`,
      "education.graduationYear": `Given the partial graduation year '${text}' (e.g., '20' → '25', '19' → '98', '2' → '02'), predict the next two digits or parts of a year. Return exactly two words or digits, ensuring they fit a year format (e.g., 20XX).`,
      skills: `Given the partial skill '${text}' (e.g., 'soft' → 'ware engineering', 'web' → 'dev skills', 'data' → 'analysis tools'), predict the next two words of a technical skill. Return exactly two words, ensuring they fit a skill description.`,
      "experience.companyName": `Given the partial company name '${text}' (e.g., 'nets' → 'ole tech', 'goog' → 'le inc', 'micro' → 'soft corp'), predict the next two words of a company name. Return exactly two words, ensuring they fit a company name format.`,
      "experience.jobTitle": `Given the partial job title '${text}' (e.g., 'soft' → 'ware engineering', 'proj' → 'ect manager', 'data' → 'scientist role'), predict the next two words of a job title. Return exactly two words, ensuring they fit a job title.`,
      "experience.duration": `Given the partial duration '${text}' (e.g., 'jan' → '20 22', 'may' → '19 21', 'jun' → '23 24'), predict the next two parts of a duration. Return exactly two words, ensuring they fit a date range format.`,
      certifications: `Given the partial certification '${text}' (e.g., 'aws' → 'certified developer', 'cis' → 'co ccna', 'goog' → 'le analytics'), predict the next two words of a certification. Return exactly two words, ensuring they fit a certification format.`,
      hobbies: `Given the partial hobby '${text}' (e.g., 'read' → 'ing books', 'swim' → 'ming laps', 'hik' → 'ing trails'), predict the next two words of a hobby. Return exactly two words, ensuring they fit a hobby description.`,
      default: `Given the input '${text}' in a resume's '${field}' field, predict the next two words that are contextually relevant and grammatically correct. Return exactly two words (e.g., 'proj' → 'ect completed').`,
    };

    return promptTemplates[field] || promptTemplates.default;
  }

  // Generate prediction using Gemini API
  async generatePrediction(text, field) {
    const prompt = this.predictFieldSpecific(text, field);
    const response = await this.model.generateContent(prompt);
    return response.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }

  // Retry logic with multiple attempts
  async retryPrediction(text, field, attempt) {
    const retryPrompt = `Retry (Attempt ${attempt}): Given the input '${text}' in a resume's '${field}' field, predict the next two words that are contextually relevant and grammatically correct. Return exactly two words, ensuring they fit the field's purpose.`;
    try {
      const retryResponse = await this.model.generateContent(retryPrompt);
      const retryText = retryResponse.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const retryWords = retryText.trim().split(" ");
      if (retryWords.length >= 2) {
        return retryWords.slice(0, 2).join(" ");
      } else if (attempt < 2) {
        console.log(`⚠️ Retry ${attempt} failed to return 2 words, attempting again...`);
        return await this.retryPrediction(text, field, attempt + 1);
      } else {
        return "keep typing"; // Final fallback
      }
    } catch (retryError) {
      console.error(`❌ Retry ${attempt} failed:`, retryError);
      if (attempt < 2) {
        return await this.retryPrediction(text, field, attempt + 1);
      }
      return "keep typing"; // Final fallback
    }
  }
}

module.exports = new PredictionModel();