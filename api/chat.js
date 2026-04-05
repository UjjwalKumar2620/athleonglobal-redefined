// ═══════════════════════════════════════════
// ATHLEON AI — SERVERLESS CHAT HANDLER
// ═══════════════════════════════════════════

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const SYSTEM_PROMPT = `You are AthleonAI, an elite sports performance analyst and coaching assistant built into the Athleon Global platform. You specialize in:

- Sports performance analysis and improvement strategies
- Training plans and workout optimization for specific sports
- Match analysis and tactical breakdowns
- Injury prevention, recovery, and sports nutrition
- Mental performance and competitive psychology
- Player statistics interpretation and MVP/performance metrics
- Career development advice for athletes
- Team dynamics and leadership in sports

You have deep expertise across Football, Cricket, Basketball, Rugby, Tennis, Athletics, Swimming, and all major sports. 

Keep responses concise, practical, and actionable. Use bullet points for clarity. When analyzing stats or suggesting plans, be specific with numbers and timelines. Always encourage athletes while being honest about areas of improvement.

Format your responses cleanly. Use emojis sparingly but effectively to make content more engaging.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, sessionId } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    // Build full conversation with system prompt
    const fullMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];

    const modelsToTry = [
      'qwen/qwen3.6-plus:free',
      'nvidia/nemotron-3-super:free',
      'stepfun/step-3.5-flash:free',
      'nvidia/nemotron-3-nano-30b-a3b:free',
      'arcee-ai/trinity-large-preview:free'
    ];

    let reply = 'I could not generate a response. Please try again.';
    let usedModel = modelsToTry[0];
    let usage = null;
    let success = false;
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        console.log(`📡 AthleonAI (Serverless): Trying model ${model}...`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

        const response = await fetch(OPENROUTER_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://athleon.global',
            'X-Title': 'AthleonAI Sports Coach'
          },
          body: JSON.stringify({
            model: model,
            messages: fullMessages,
            temperature: 0.7,
            max_tokens: 1024,
            stream: false
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          reply = data.choices?.[0]?.message?.content || reply;
          usedModel = data.model || model;
          usage = data.usage;
          success = true;
          console.log(`✅ AthleonAI (Serverless): Success with ${model}`);
          break; // successfully got a response
        } else {
          lastError = await response.text();
          console.warn(`❌ AthleonAI: Model ${model} failed (HTTP ${response.status}): ${lastError}`);
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          lastError = 'Request timed out after 20 seconds';
        } else {
          lastError = err.message;
        }
        console.warn(`⚠️ AthleonAI: Model ${model} error: ${lastError}`);
      }
    }

    if (!success) {
      console.error('All OpenRouter models failed. Last error:', lastError);
      return res.status(500).json({ error: 'AI service unreachable', details: lastError });
    }

    return res.status(200).json({
      reply,
      model: usedModel,
      usage: usage,
      sessionId
    });

  } catch (err) {
    console.error('Serverless chat error:', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
}
