import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyseTask = async (task) => {
    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is not set in environment variables");
        return null;
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Task Analysis Requirements:
            Return a JSON object WITHOUT code blocks or markdown formatting.
            Required fields:
            - summary: Brief 1-2 sentence description
            - priority: exactly "low", "medium", or "high"
            - helpfulnotes: Technical details and resources
            - relatedskills: Array of skills (use empty array [] if none)
             Only return a strict JSON object with no extra text, headers, or markdown.
        Analyze the following support ticket and provide a JSON object with:
        -summary: A short 1-2 sentence summary of the issue.
        -priority: One of "low", "medium", or "high" based on urgency.
        -helpfulnotes:A detailed technical explanation that a moderator can use to solve this issue. Include useful external links or resources if possible.
        -relatedskills: An array of relevant skills required to solve the issue(e.g.,["React,"MongoDB]).
        Respond only in this JSON format and do not include any other text or markdown in the answer:
        {
            "summary": "Short summary of the ticket",
            "priority": "high",
            "helpfulnotes": "Here are useful tips...",
            "relatedskills": ["React","Node.js]
        }

            Task to analyze:
            Title: ${task.title}
            Description: ${task.description}
 IMPORTANT:
        -Respond with *only* valid raw JSON.
        -Do not include markdown, code fences, comments, or any extra formatting.
        -The format must be a raw JSON object.

        Repeat: Do not wrap your output in markdown or code fences.
            IMPORTANT: Return raw JSON only, no code blocks or backticks.`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        let text = response.text().trim();

        // Remove markdown code blocks if present
        if (text.startsWith('```') && text.endsWith('```')) {
            // Extract content between code blocks
            text = text.replace(/^```json?\s*/, '').replace(/\s*```$/, '');
        }

        try {
            const parsedJson = JSON.parse(text);
            // Transform the response to match our schema
            return {
                summary: parsedJson.summary || "",
                priority: parsedJson.priority || "medium",
                helpfulnotes: parsedJson.helpfulnotes || "",
                relatedskills: Array.isArray(parsedJson.relatedskills) ? parsedJson.relatedskills : []
            };
        } catch (error) {
            console.error("Failed to parse JSON from AI response:", error);
            console.error("Raw response:", text);
            // Return a default structure if parsing fails
            return {
                summary: "Task analysis failed",
                priority: "medium",
                helpfulnotes: "Unable to analyze task content",
                relatedskills: []
            };
        }
    } catch (error) {
        console.error("Error in AI processing:", error);
        return null;
    }
}

export default analyseTask;