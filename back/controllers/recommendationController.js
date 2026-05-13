import getRecommendations from "../services/recommendation/getRecommendations.js";
import logger from "../config/logger.js";

const getPersonalRecommendations = async (req, res) => {

  try {

    const recommendations = await getRecommendations(req.user.id);

    res.json({
      success: true,
      recommendations,
    });

  } catch (error) {
    logger.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export {
  getPersonalRecommendations,
};