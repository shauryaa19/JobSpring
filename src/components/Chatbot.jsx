import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { CHATBOT_CONSTANTS } from '../data/ui';
import apiService from '../services/api';
import useLocalStorage from '../hooks/useLocalStorage';
import { useProfile } from '../hooks/useApi';
import { UserAvatar } from './ui';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { profile } = useProfile();

  const getInitialMessages = () => [
    {
      id: '1',
      text: CHATBOT_CONSTANTS.welcomeMessage,
      sender: 'bot',
      timestamp: new Date().toISOString()
    }
  ];

  // Use localStorage for messages persistence with proper initialization
  const [messages, setMessages] = useLocalStorage('chatbot-messages', getInitialMessages());

  useEffect(() => {
    if (!Array.isArray(messages) || messages.length === 0) {
      const initialMessages = getInitialMessages();
      setMessages(initialMessages);
    }
  }, [messages, setMessages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (newMessage) => {
    setMessages(currentMessages => {
      // Ensure currentMessages is an array
      const validMessages = Array.isArray(currentMessages) ? currentMessages : getInitialMessages();
      const updatedMessages = [...validMessages, newMessage];
      
      return updatedMessages;
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    addMessage(userMessage);
    setInputValue('');
    setIsTyping(true);
    setIsLoading(true);

    try {
      const response = await apiService.sendChatMessage(inputValue);
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: response.data.message,
        sender: 'bot',
        timestamp: response.data.timestamp
      };
      
      // Add bot message after a small delay to ensure user message is saved first
      setTimeout(() => {
        addMessage(botMessage);
      }, 100);
    } catch {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I\'m having trouble responding right now. Please try again later.',
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      
      setTimeout(() => {
        addMessage(errorMessage);
      }, 100);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action) => {
    const userMessage = {
      id: Date.now().toString(),
      text: action,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    addMessage(userMessage);
    setIsTyping(true);
    setIsLoading(true);
    
    try {
      const response = await apiService.sendChatMessage(action);
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: response.data.message,
        sender: 'bot',
        timestamp: response.data.timestamp
      };
      
      // Add bot message after a small delay to ensure user message is saved first
      setTimeout(() => {
        addMessage(botMessage);
      }, 100);
    } catch {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I\'m having trouble responding right now. Please try again later.',
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      
      setTimeout(() => {
        addMessage(errorMessage);
      }, 100);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const clearChatHistory = () => {
    const initialMessages = getInitialMessages();
    setMessages(initialMessages);
  };

  // Ensure we always have a valid messages array for rendering
  const validMessages = Array.isArray(messages) && messages.length > 0 ? messages : getInitialMessages();

  return (
    <>
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat assistant"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <Bot size={20} />
              <span>Buddy Bot</span>
            </div>
            <div className="chatbot-header-actions">
              <button 
                className="chatbot-clear-btn"
                onClick={clearChatHistory}
                title="Clear chat history"
                aria-label="Clear chat history"
              >
                Clear
              </button>
              <button 
                className="chatbot-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="chatbot-messages">
            {validMessages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-avatar">
                  {message.sender === 'bot' ? (
                    <Bot size={16} />
                  ) : (
                    <UserAvatar profile={profile} size="small" showInitials={true} />
                  )}
                </div>
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-avatar">
                  <Bot size={16} />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {validMessages.length === 1 && (
            <div className="quick-actions">
              {CHATBOT_CONSTANTS.quickActions.map((action, index) => (
                <button
                  key={index}
                  className="quick-action-btn"
                  onClick={() => handleQuickAction(action)}
                  disabled={isLoading}
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          <form className="chatbot-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about jobs..."
              className="chat-input"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="send-btn" 
              disabled={!inputValue.trim() || isLoading}
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;