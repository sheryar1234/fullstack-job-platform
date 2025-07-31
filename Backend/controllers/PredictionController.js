const PredictionModel = require("../models/PredictionModel");

class PredictionController {
  async predictNextWord(req, res) {
    try {
      const { text, field } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Input text is required!" });
      }

      let suggestion;
      try {
        const response = await PredictionModel.generatePrediction(text, field);
        const words = response.trim().split(" ");
        suggestion = words.length >= 2 ? words.slice(0, 2).join(" ") : await PredictionModel.retryPrediction(text, field, 1);
      } catch (error) {
        console.error("❌ Initial prediction failed:", error);
        suggestion = await PredictionModel.retryPrediction(text, field, 1);
      }

      console.log(`✅ Next Words Prediction for '${field}': ${suggestion}`);
      res.json({ suggestion });
    } catch (error) {
      console.error("❌ Unexpected error in prediction:", error);
      res.status(500).json({ suggestion: "please retry" });
    }
  }
}

module.exports = new PredictionController();