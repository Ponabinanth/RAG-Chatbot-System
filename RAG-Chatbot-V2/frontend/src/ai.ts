const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export const isRealAiAvailable = !!GEMINI_API_KEY;

export async function generateAiResponse(systemInstruction: string, userMessage: string): Promise<string> {
  if (!isRealAiAvailable) {
    throw new Error('No API key configured');
  }

  const prompt = `${systemInstruction}\n\nUser: ${userMessage}`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Gemini API Error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to fetch AI response');
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
  } catch (err: any) {
    console.error(err);
    throw new Error(err.message || 'Error communicating with AI service');
  }
}
