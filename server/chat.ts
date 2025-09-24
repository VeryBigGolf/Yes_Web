import { ChatResponse } from './types';

// Mock chat handler - TODO: Replace with GROQ integration
export const handleChatMessage = async (message: string): Promise<ChatResponse> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

  const lowerMessage = message.toLowerCase();

  // Simple rule-based responses for demo
  if (lowerMessage.includes('pressure') || lowerMessage.includes('steam')) {
    return {
      reply: "I can see the main steam pressure is currently within normal range. Would you like me to analyze the pressure trends over the last hour?"
    };
  }

  if (lowerMessage.includes('temperature') || lowerMessage.includes('temp')) {
    return {
      reply: "The boiler temperatures are being monitored. The main steam temperature is stable. Is there a specific temperature parameter you'd like me to focus on?"
    };
  }

  if (lowerMessage.includes('air flow') || lowerMessage.includes('oxygen')) {
    return {
      reply: "The air flow and oxygen levels are within acceptable ranges. I can provide suggestions for optimization if needed."
    };
  }

  if (lowerMessage.includes('efficiency') || lowerMessage.includes('optimize')) {
    return {
      reply: "Based on current readings, I can suggest several optimization opportunities. The economizer performance could be improved, and stack temperature optimization is available."
    };
  }

  if (lowerMessage.includes('alarm') || lowerMessage.includes('warning') || lowerMessage.includes('alert')) {
    return {
      reply: "No active alarms detected. All systems are operating within normal parameters. I can help you set up monitoring for specific thresholds."
    };
  }

  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return {
      reply: "I can help you monitor boiler operations, analyze trends, provide optimization suggestions, and answer questions about system performance. Try asking about pressure, temperature, air flow, or efficiency."
    };
  }

  // Default response
  const responses = [
    "I understand you're asking about the boiler operations. Could you be more specific about which parameter you'd like me to analyze?",
    "That's an interesting question about the boiler system. I can help analyze specific parameters like pressure, temperature, or air flow.",
    "I'm here to help with boiler operations. What specific aspect of the system would you like me to focus on?",
    "Let me know which parameter or system you'd like me to analyze, and I'll provide detailed insights."
  ];

  return {
    reply: responses[Math.floor(Math.random() * responses.length)]
  };
};

// TODO: GROQ Integration
// Replace the above function with this when ready:
/*
import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const handleChatMessage = async (message: string): Promise<ChatResponse> => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert boiler operations assistant. Help operators understand and optimize boiler performance. Be concise and technical."
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 500,
    });

    return {
      reply: completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response."
    };
  } catch (error) {
    console.error('GROQ API error:', error);
    return {
      reply: "I'm experiencing technical difficulties. Please try again later."
    };
  }
};
*/
