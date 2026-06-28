import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { chatbotApi } from '../../api/chatbot.api';

const ChatbotPage = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatbotApi.createSession().then((res) => setSessionId(res.data.data.sessionId)).catch(() => {});
  }, []);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await chatbotApi.sendMessage({ message: userMsg, sessionId });
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.data.message }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Helmet><title>AI Tutor - EDUCOURS</title></Helmet>
      <h1 className="text-2xl font-bold mb-6">{t('student.chatWithTutor')}</h1>

      <div className="card h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              <p className="text-4xl mb-4">🤖</p>
              <p>{t('student.askQuestion')}</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white rounded-br-none'
                  : 'bg-gray-100 dark:bg-gray-800 rounded-bl-none'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEnd} />
        </div>

        <div className="flex gap-2">
          <input
            className="input-field flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={t('student.typeMessage')}
            disabled={loading}
          />
          <button onClick={sendMessage} className="btn-primary" disabled={loading || !input.trim()}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
