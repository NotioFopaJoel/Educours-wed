let openai = null;

const getOpenAI = () => {
  if (!openai) {
    const OpenAI = require('openai');
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder',
    });
  }
  return openai;
};

module.exports = getOpenAI;
