import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeCV(
  fileBase64: string,
  mimeType: string,
  profile: { field: string; experience: string; skills: string; otherRequirements: string }
) {
  const prompt = `
    You are an expert HR recruiter. Analyze the provided CV against the following job requirements:
    
    Field/Role: ${profile.field}
    Required Experience: ${profile.experience}
    Required Skills: ${profile.skills}
    Other Requirements: ${profile.otherRequirements}
    
    Provide a JSON response with the following structure:
    - name: The candidate's full name (or "Unknown" if not found).
    - score: A score from 0 to 100 indicating how well the candidate matches the requirements.
    - strengths: An array of 3 to 5 key strengths or matching points.
    - summary: A short summary (2-3 sentences) of the candidate's fit for the role.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      score: { type: Type.NUMBER },
      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
      summary: { type: Type.STRING },
    },
    required: ['name', 'score', 'strengths', 'summary'],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            { inlineData: { data: fileBase64, mimeType } },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema as any,
        temperature: 0.2,
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error('No response from AI');
  } catch (error) {
    console.error('Error analyzing CV:', error);
    throw error;
  }
}
