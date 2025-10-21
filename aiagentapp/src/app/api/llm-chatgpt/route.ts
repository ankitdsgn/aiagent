import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const {
    prompt,
    max_tokens = 800,
    input_toggle,
    temperature,
    top_p,
  } = await req.json();

  const cleanedPrompt = prompt
    .replace(/\s*\n\s*/g, " ") // Replace line breaks with single space
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .trim();

  const apiKey = process.env.CHAT_GPT_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing CHAT_GPT_API_KEY" },
      { status: 500 }
    );
  }

  let metaPrompt = null;
  let metaPromptBody = {};

  if (input_toggle === false) {
    metaPrompt = `
You are a text generator that must return structured JSON only.

TASK:
Create exactly 9 creative variations of the user's prompt.

RULES:
1. Return ONLY a valid JSON object with the following structure:
   {
     "variations": [
       { "variation": "string", "temp": number, "top_p": number }
     ]
   }
2. Include exactly 9 items in the "variations" array.
3. Each "variation" must be a rephrased version of the user's prompt, not identical.
4. Each "temp" must be a random float between 0.2–1.0.
5. Each "top_p" must be a random float between 0.5–1.0.
6. Escape all quotes properly inside strings.
7. Do NOT include markdown or any text outside JSON.
8. Make each variation length random.

User prompt:
${cleanedPrompt}
`;

    metaPromptBody = {
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: metaPrompt }],
      max_tokens,
      temperature: Math.random() * 0.8 + 0.2,
      top_p: Math.random() * 0.5 + 0.5,
      response_format: { type: "json_object" },
    };
  } else if (input_toggle === true) {
    metaPrompt = `
You are a text generator that must return structured JSON only.
TASK:
Create exactly 9 creative variations of the user's prompt.
RULES:
1. Return ONLY a valid JSON object with the following structure:
    {
      "variations": [
        { "variation": "string" }
      ]
    }
2. Include exactly 9 items in the "variations" array.
3. Each "variation" must be a rephrased version of the user's prompt, not identical.
4. Escape all quotes properly inside strings.
5. Do NOT include markdown or any text outside JSON.
6. Make each variation length random.

User prompt:
${cleanedPrompt}
`;

    metaPromptBody = {
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: metaPrompt }],
      max_tokens,
      temperature,
      top_p,
      response_format: { type: "json_object" },
    };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(metaPromptBody),
    });

    const data = await response.json();

    const message = data.choices?.[0]?.message?.content;

    //parse the message content as JSON
    const parsedMessage = JSON.parse(message);

    return NextResponse.json({
      prompt,
      variations: parsedMessage,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "OpenAI request failed" },
      { status: 500 }
    );
  }
}
