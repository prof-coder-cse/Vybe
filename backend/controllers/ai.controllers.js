import { generateComments } from "../services/ai.service.js";

export const getAIComments = async (req, res) => {

    try {

        const { caption } = req.body;

        if (!caption) {
            return res.status(400).json({
                message: "Caption is required"
            });
        }

        const comments = await generateComments(caption);

        return res.status(200).json({
            comments
        });

    } catch (error) {

        return res.status(500).json({
            message: `AI Comment Error ${error.message}`
        });

    }

}