// AI Message Generator — with OpenAI integration + high-quality fallback

export type MessageStyle = 'casual' | 'professional' | 'placement' | 'fun';

interface GenerateParams {
  style: MessageStyle;
  studentName: string;
  referralLink: string;
  workshopName?: string;
}

// ─── High-Quality Fallback Templates ──────────────────────────────────────────
const FALLBACK_TEMPLATES: Record<MessageStyle, (params: GenerateParams) => string> = {
  casual: ({ studentName, referralLink }) => 
`Hey! 👋

${studentName} here — I just signed up for this free AI workshop where we build an actual AI project in just 60 minutes. No experience needed!

I thought you'd love it too. It's completely beginner-friendly and free 🎉

Join using my link:
${referralLink}

See you there! 🚀`,

  professional: ({ studentName, referralLink }) =>
`Hi,

I wanted to share an opportunity you might find valuable.

I've registered for NxtWave's free online workshop: *"Build Your First AI Project in 60 Minutes"*. It's a structured, beginner-friendly session designed to help engineering students build a tangible AI project — something worth discussing in interviews and internship applications.

If you're looking to strengthen your profile, this could be a great start.

Register here (free):
${referralLink}

Best,
${studentName}`,

  placement: ({ studentName, referralLink }) =>
`Hey! 🎯

If you're prepping for placements and want something concrete to talk about in interviews — this is it.

I'm joining a free 60-minute AI workshop where we actually *build* an AI project from scratch. No fluff. No slides. Just hands-on building.

Recruiters love seeing real projects, and this gives you exactly that in under an hour.

Register free:
${referralLink}

Let's show up to placements with something real to talk about. 💪

— ${studentName}`,

  fun: ({ studentName, referralLink }) =>
`Bro/Sis 🫡

Okay hear me out — what if we spent 60 minutes and walked out with an actual AI project?? No weeks of tutorials. No confusion. Just build it.

It's FREE. It's beginner-friendly. And it's honestly kinda impressive to put on your resume 😅

I literally just registered and now I'm dragging you in too 😂

Link:
${referralLink}

Do it. Do it now. You'll thank me later.

— ${studentName} 🤖✨`,
};

// ─── OpenAI Integration (optional) ────────────────────────────────────────────
async function generateWithOpenAI(params: GenerateParams): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error('No API key');

  const styleDescriptions: Record<MessageStyle, string> = {
    casual: 'casual, friendly, and conversational between college friends',
    professional: 'professional and formal, suitable for LinkedIn or email',
    placement: 'placement-focused, emphasizing the career and interview value of the project',
    fun: 'fun, playful, with emojis, humor, and excitement — like texting a best friend',
  };

  const prompt = `Write a WhatsApp message inviting a friend to join this free AI workshop.
Style: ${styleDescriptions[params.style]}
Workshop: "${params.workshopName || 'Build Your First AI Project in 60 Minutes'}" by NxtWave
Key facts: Free, 60 minutes, beginner-friendly, great for placement preparation
Sender name: ${params.studentName}
Referral link to include: ${params.referralLink}

The message should:
- Feel natural and human, NOT like marketing copy
- Be 80–150 words
- Include the referral link prominently
- End with the sender's name

Write ONLY the message, no extra explanation.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.8,
    }),
  });

  if (!response.ok) throw new Error('OpenAI API error');
  const data = await response.json();
  return data.choices[0]?.message?.content?.trim() || '';
}

// ─── Main Export ───────────────────────────────────────────────────────────────
export async function generateMessage(params: GenerateParams): Promise<{ message: string; source: 'ai' | 'template' }> {
  try {
    const message = await generateWithOpenAI(params);
    if (message) return { message, source: 'ai' };
  } catch {
    // Silently fall through to template
  }

  // Use high-quality fallback template
  const message = FALLBACK_TEMPLATES[params.style](params);
  return { message, source: 'template' };
}

// ─── WhatsApp URL ──────────────────────────────────────────────────────────────
export function createWhatsAppURL(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/?text=${encoded}`;
}

// ─── Quick share message ───────────────────────────────────────────────────────
export function getDefaultShareMessage(_studentName: string, referralLink: string): string {
  return `🚀 I'm joining a free workshop where we'll build an AI project in just 60 minutes!

It's beginner-friendly and perfect if you're preparing for placements.

Join me using my link:
${referralLink}

Let's build together! 💡`;
}
