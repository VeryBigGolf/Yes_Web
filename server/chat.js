const fetch = require("node-fetch");

async function groqChat(message, apiKey) {
  if (!apiKey) return { reply: "GROQ key missing. Using mock reply." };

  try {
    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are an operations assistant for a boiler plant. Be concise and practical." },
          { role: "user", content: message },
        ],
        temperature: 0.2,
        max_tokens: 300,
      }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      return { reply: `GROQ error: ${resp.status} ${resp.statusText} — ${txt.slice(0,200)}` };
    }
    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content ?? "No reply.";
    return { reply };
  } catch (error) {
    return { reply: `GROQ error: ${error.message}` };
  }
}

module.exports = { groqChat };
