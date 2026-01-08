
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getWallpaperStory = async (title: string, copyright: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `根据这张壁纸的信息：标题为 "${title}"，来源为 "${copyright}"。请写两句富有诗意且引人入胜的中文描述，或者介绍该地点的历史文化背景。要求语言风格优雅、简洁，符合 Material Design 3 的审美基调。`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 150,
      }
    });
    return response.text || "大自然的杰作被定格在这一瞬，邀请您一同探索这个世界的隐秘奇迹。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "一扇通往世界的精美之窗，每日为您更新，带来无尽的灵感。";
  }
};
