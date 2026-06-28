const getOpenAI = require('../config/openai');

const SYSTEM_PROMPT_TEMPLATE = `You are a patient and encouraging pedagogical tutor for a secondary school student.
Never give the final answer directly. Break down every problem into small steps.
After each step, ask a verification question to check the student's understanding, and wait for their answer before proceeding.
Encourage the student to try on their own.
Adapt your language to the student's academic level ({level}) and respond in the language chosen by the user ({language}).
If the student makes an error, explain the mistake kindly and give a hint without revealing the answer.
Only provide the complete answer as a last resort, after multiple failed attempts, with a full pedagogical explanation.`;

const generateChatResponse = async (messages, level, language) => {
  const systemPrompt = SYSTEM_PROMPT_TEMPLATE
    .replace('{level}', level)
    .replace('{language}', language === 'fr' ? 'French' : 'English');

  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  ];

  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: apiMessages,
    max_tokens: 1000,
    temperature: 0.7,
  });

  return response.choices[0].message.content;
};

const generateQuizQuestions = async (courseTitle, educationSystem, level, chaptersContent, language) => {
  const prompt = `Generate exactly 15 multiple-choice questions for a monthly assessment.
Course: ${courseTitle}
Education System: ${educationSystem}
Level: ${level}
Language: ${language === 'fr' ? 'French' : 'English'}

Chapter content to base questions on:
${chaptersContent}

For each question, provide:
- The question text
- 4 options (A, B, C, D)
- The correct answer index (0-3)
- Which chapter it references
- A brief explanation

Respond in strict JSON format as an array of objects with keys: questionText, options (array), correctAnswerIndex (number), chapterReference (string), explanation (string)`;

  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a quiz generator for secondary school students. Always respond with valid JSON only.' },
      { role: 'user', content: prompt },
    ],
    max_tokens: 4000,
    temperature: 0.8,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content);
};

const generateRevisionNotes = async (courseTitle, weakChapters, level, language) => {
  const prompt = `Generate concise revision notes for a secondary school student.
Course: ${courseTitle}
Level: ${level}
Language: ${language === 'fr' ? 'French' : 'English'}
Weak areas to focus on: ${weakChapters.join(', ')}

Create easy-to-understand summary notes covering the key concepts from these topics.
Use bullet points, simple language, and include memory tips where helpful.`;

  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a helpful tutor creating revision materials for students.' },
      { role: 'user', content: prompt },
    ],
    max_tokens: 2000,
    temperature: 0.5,
  });

  return response.choices[0].message.content;
};

module.exports = { generateChatResponse, generateQuizQuestions, generateRevisionNotes };
