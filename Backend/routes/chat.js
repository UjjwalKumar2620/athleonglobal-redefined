// ═══════════════════════════════════════════
// CHAT ROUTE — OpenRouter AI Proxy
// ═══════════════════════════════════════════
const express = require('express');
const router = express.Router();

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'meta-llama/llama-3.2-3b-instruct:free';

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

router.post('/', async (req, res) => {
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
      'meta-llama/llama-3.2-3b-instruct:free',
      'deepseek/deepseek-r1:free',
      'google/gemma-2-9b-it:free',
      'qwen/qwen-2.5-72b-instruct:free'
    ];

    let reply = 'I could not generate a response. Please try again.';
    let usedModel = modelsToTry[0];
    let usage = null;
    let success = false;
    let lastError = null;

    for (const model of modelsToTry) {
      try {
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
          })
        });

        if (response.ok) {
          const data = await response.json();
          reply = data.choices?.[0]?.message?.content || reply;
          usedModel = data.model || model;
          usage = data.usage;
          success = true;
          break; // successfully got a response
        } else {
          lastError = await response.text();
          console.warn(`Model ${model} failed with: ${lastError}`);
        }
      } catch (err) {
        lastError = err.message;
        console.warn(`Model ${model} threw error: ${lastError}`);
      }
    }

    if (!success) {
      console.error('All OpenRouter models failed. Last error:', lastError);
      return res.status(500).json({ error: 'AI service unreachable', details: lastError });
    }

    return res.json({
      reply,
      model: usedModel,
      usage: usage,
      sessionId
    });

  } catch (err) {
    console.error('Chat route error:', err);
    return res.status(500).json({ error: 'Failed to reach AI service', message: err.message });
  }
});

module.exports = router;
