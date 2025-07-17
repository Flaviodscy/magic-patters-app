import React, { useEffect, useState, useRef } from 'react';
import { SendIcon, PaperclipIcon, SmileIcon, StarIcon, ThumbsUpIcon, ThumbsDownIcon, MessageCircleIcon, ShoppingBagIcon, RulerIcon, HelpCircleIcon, ImageIcon, PhoneIcon, ArrowRightIcon, CheckCircleIcon, XCircleIcon, Loader2Icon, BotIcon, UserIcon, MailIcon, SparklesIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIService } from '../services/AIService';
import { useAuth } from '../contexts/AuthContext';
type MessageType = 'general' | 'product' | 'measurement' | 'feedback' | 'order';
type Message = {
  id: number;
  text: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: Date;
  type?: MessageType;
  rating?: number;
  feedback?: {
    helpful: boolean;
    comment?: string;
  };
  status?: 'sending' | 'sent' | 'read' | 'error';
  attachments?: string[];
  quickReplies?: string[];
  isAI?: boolean;
};
export const ChatPage = () => {
  const {
    user
  } = useAuth();
  const [messages, setMessages] = useState<Message[]>([{
    id: 1,
    text: "👋 Welcome to PerfectPillow support! I'm your AI assistant here to help with your questions, provide product recommendations, or assist with your recent purchase.",
    sender: 'agent',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    type: 'general',
    quickReplies: ['Find a pillow', 'Track my order', 'Return policy', 'Share feedback'],
    isAI: true
  }]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedType, setSelectedType] = useState<MessageType>('general');
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [satisfaction, setSatisfaction] = useState<'satisfied' | 'unsatisfied' | null>(null);
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageTypes = [{
    id: 'general',
    label: 'General',
    icon: MessageCircleIcon
  }, {
    id: 'product',
    label: 'Products',
    icon: ShoppingBagIcon
  }, {
    id: 'measurement',
    label: 'Measurement',
    icon: RulerIcon
  }, {
    id: 'order',
    label: 'Orders',
    icon: ShoppingBagIcon
  }, {
    id: 'feedback',
    label: 'Feedback',
    icon: StarIcon
  }];
  // Load chat history when component mounts
  useEffect(() => {
    if (user?.id) {
      loadChatHistory();
    }
  }, [user?.id]);
  const loadChatHistory = async () => {
    if (!user?.id) return;
    try {
      const history = await AIService.loadChatHistory(user.id);
      if (history && history.length > 0) {
        setMessages(history);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };
  // Save chat history when messages change
  useEffect(() => {
    if (user?.id && messages.length > 1) {
      AIService.saveChatHistory(user.id, messages);
    }
  }, [messages, user?.id]);
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  const sendMessage = async (e: React.FormEvent, textOverride?: string) => {
    e.preventDefault();
    const messageText = textOverride || newMessage;
    if (!messageText.trim() && attachments.length === 0) return;
    // Reset any previous errors
    setProcessingError(null);
    // Create new user message
    const newUserMessage: Message = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
      type: selectedType,
      status: 'sending',
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };
    setMessages(prev => [...prev, newUserMessage]);
    // Clear input and attachments
    setNewMessage('');
    setAttachments([]);
    // Update message status to sent
    setTimeout(() => {
      setMessages(prev => prev.map(msg => msg.id === newUserMessage.id ? {
        ...msg,
        status: 'sent'
      } : msg));
      // Show typing indicator
      setIsTyping(true);
      // Process with AI if enabled
      if (isAIEnabled) {
        processWithAI(messageText, newUserMessage.id);
      } else {
        // Fallback to simulated responses
        simulateResponse(messageText, selectedType);
      }
    }, 300);
  };
  const processWithAI = async (messageText: string, messageId: number) => {
    try {
      const aiResponse = await AIService.processMessage(messageText, selectedType, user?.id);
      // Hide typing indicator
      setIsTyping(false);
      // Special handling for feedback type
      if (selectedType === 'feedback' && !showFeedback) {
        setShowFeedback(true);
      }
      // Add AI response
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: aiResponse.text,
        sender: 'agent',
        timestamp: new Date(),
        type: aiResponse.type as MessageType || selectedType,
        quickReplies: aiResponse.quickReplies,
        isAI: true
      }]);
    } catch (error) {
      console.error('Error processing message with AI:', error);
      setProcessingError('Sorry, I had trouble processing your message. Please try again.');
      setIsTyping(false);
      // Add error message
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "I'm having trouble connecting to my AI brain right now. Let me try a simpler response.",
        sender: 'system',
        timestamp: new Date()
      }]);
      // Fall back to simulated response
      simulateResponse(messageText, selectedType);
    }
  };
  const simulateResponse = (messageText: string, messageType: MessageType) => {
    setTimeout(() => {
      setIsTyping(false);
      // Generate appropriate response based on message type
      let response: string;
      let quickReplies: string[] | undefined;
      switch (messageType) {
        case 'product':
          response = "I'd be happy to help you find the perfect pillow! Based on your message, I think you might like our Cloud Comfort Elite or Purple Harmony. Would you like to know more about either of these?";
          quickReplies = ['Cloud Comfort Elite', 'Purple Harmony', 'See all options'];
          break;
        case 'measurement':
          response = 'Getting accurate measurements is crucial for finding your perfect pillow. Would you like to use our LiDAR scanner (available on newer iPhones/iPads) or follow our manual measurement guide?';
          quickReplies = ['Use LiDAR scanner', 'Manual measurement', 'Watch tutorial'];
          break;
        case 'feedback':
          response = 'Thank you for taking the time to share your feedback! Your insights help us improve our products and service. Would you like to rate your experience with us?';
          setShowFeedback(true);
          break;
        case 'order':
          response = "I'd be happy to help with your order. Could you provide your order number? Alternatively, I can look it up using your email address.";
          quickReplies = ['Find by email', 'I have my order number', 'Return policy'];
          break;
        default:
          response = "Thanks for your message! I'm here to help with any questions about our pillows, your order, or measurement assistance. What can I help you with today?";
          quickReplies = ['Product recommendations', 'Order help', 'Measurement guide'];
      }
      // Add agent response
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: response,
        sender: 'agent',
        timestamp: new Date(),
        type: messageType,
        quickReplies
      }]);
    }, 1000);
  };
  const handleQuickReply = (reply: string) => {
    sendMessage(new Event('submit') as any, reply);
  };
  const submitFeedback = () => {
    // Add user feedback to messages
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: `Rating: ${rating}/5 stars\n${feedbackComment}`,
      sender: 'user',
      timestamp: new Date(),
      type: 'feedback',
      rating
    }]);
    // Add feedback confirmation
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: `Thank you for your ${rating}-star feedback! We appreciate you taking the time to share your thoughts with us.`,
        sender: 'system',
        timestamp: new Date(),
        type: 'feedback'
      }]);
    }, 500);
    setShowFeedback(false);
    setRating(0);
    setFeedbackComment('');
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newAttachments = Array.from(e.target.files).map(file => {
        // In a real app, you'd upload these to a server and get back URLs
        // For demo purposes, we'll create object URLs
        return URL.createObjectURL(file);
      });
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  };
  const toggleAI = () => {
    setIsAIEnabled(!isAIEnabled);
    // Add system message about AI status
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: isAIEnabled ? "AI assistance has been turned off. You'll now receive standard responses." : "AI assistance has been turned on. I'll now provide more personalized help.",
      sender: 'system',
      timestamp: new Date()
    }]);
  };
  // Dummy emojis for the emoji picker
  const emojis = ['😊', '👍', '❤️', '😂', '🙏', '😍', '🤔', '😭', '🎉', '👋', '🛌', '💤'];
  return <div className="h-[calc(100vh-200px)] flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium text-gray-900">
            Support & Feedback
          </h1>
          <p className="mt-2 text-gray-500 text-lg font-light">
            We're here to help with anything you need
          </p>
        </div>
        {/* AI Toggle Button */}
        <button onClick={toggleAI} className={`flex items-center px-4 py-2 rounded-xl transition-colors ${isAIEnabled ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
          <SparklesIcon className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">
            AI Assistant {isAIEnabled ? 'On' : 'Off'}
          </span>
        </button>
      </div>

      {/* Chat satisfaction survey - shows at the top */}
      {messages.length > 3 && !satisfaction && <motion.div initial={{
      opacity: 0,
      y: -20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="mb-6 p-4 backdrop-blur-xl bg-white/70 rounded-2xl shadow-lg shadow-gray-200/50 border border-blue-100">
          <p className="text-sm text-gray-700 mb-3">
            How is your chat experience so far?
          </p>
          <div className="flex space-x-4">
            <button onClick={() => setSatisfaction('satisfied')} className="flex items-center px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-colors">
              <ThumbsUpIcon className="h-5 w-5 mr-2" />
              <span>It's helpful</span>
            </button>
            <button onClick={() => setSatisfaction('unsatisfied')} className="flex items-center px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors">
              <ThumbsDownIcon className="h-5 w-5 mr-2" />
              <span>Need improvement</span>
            </button>
          </div>
        </motion.div>}

      {/* Message Type Selector */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {messageTypes.map(({
        id,
        label,
        icon: Icon
      }) => <button key={id} onClick={() => setSelectedType(id as MessageType)} className={`flex items-center px-4 py-2 rounded-xl transition-all ${selectedType === id ? 'bg-blue-500 text-white shadow-md shadow-blue-200/50' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            <Icon className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium whitespace-nowrap">
              {label}
            </span>
          </button>)}
      </div>

      {/* Error message if AI processing fails */}
      {processingError && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
          {processingError}
        </div>}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-6 space-y-4 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {messages.map(message => <motion.div key={message.id} initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          height: 0
        }} transition={{
          duration: 0.2
        }} className={`flex ${message.sender === 'user' ? 'justify-end' : message.sender === 'system' ? 'justify-center' : 'justify-start'}`}>
              {message.sender === 'system' ? <div className="px-4 py-2 bg-gray-100/70 rounded-full text-xs text-gray-500">
                  {message.text}
                </div> : <div className="flex items-start max-w-[80%] group">
                  {message.sender === 'agent' && <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-1">
                      {message.isAI ? <SparklesIcon className="h-4 w-4 text-blue-600" /> : <BotIcon className="h-4 w-4 text-blue-600" />}
                    </div>}
                  <div className={`relative px-4 py-3 rounded-2xl ${message.sender === 'user' ? 'bg-blue-500 text-white rounded-tr-none' : message.isAI ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-900 rounded-tl-none border border-blue-100' : 'bg-gray-100 text-gray-900 rounded-tl-none'}`}>
                    {message.type && <span className={`text-xs mb-1 block ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
                      </span>}
                    <p className="text-sm whitespace-pre-line">
                      {message.text}
                    </p>
                    {/* Attachments */}
                    {message.attachments && message.attachments.length > 0 && <div className="mt-2 grid grid-cols-2 gap-2">
                        {message.attachments.map((url, i) => <div key={i} className="relative rounded-lg overflow-hidden">
                            <img src={url} alt="Attachment" className="w-full h-24 object-cover" />
                          </div>)}
                      </div>}
                    {/* Quick replies */}
                    {message.quickReplies && message.sender === 'agent' && <div className="mt-3 flex flex-wrap gap-2">
                        {message.quickReplies.map((reply, i) => <button key={i} onClick={() => handleQuickReply(reply)} className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${message.isAI ? 'bg-white text-blue-500 border-blue-100 hover:bg-blue-50' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
                            {reply}
                          </button>)}
                      </div>}
                    {/* AI indicator for agent messages */}
                    {message.sender === 'agent' && message.isAI && <div className="absolute top-2 right-2">
                        <span className="flex items-center text-xs text-blue-500 font-medium">
                          <SparklesIcon className="h-3 w-3 mr-1" />
                          AI
                        </span>
                      </div>}
                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                      {/* Message status for user messages */}
                      {message.sender === 'user' && message.status && <span className="ml-1">
                          {message.status === 'sending' && '• Sending...'}
                          {message.status === 'sent' && '• Sent'}
                          {message.status === 'read' && '• Read'}
                          {message.status === 'error' && '• Failed to send'}
                        </span>}
                    </p>
                  </div>
                  {message.sender === 'user' && <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ml-2 mt-1">
                      <UserIcon className="h-4 w-4 text-white" />
                    </div>}
                </div>}
            </motion.div>)}
          {/* Typing indicator */}
          {isTyping && <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} className="flex justify-start">
              <div className="flex items-start max-w-[80%]">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-1">
                  {isAIEnabled ? <SparklesIcon className="h-4 w-4 text-blue-600" /> : <BotIcon className="h-4 w-4 text-blue-600" />}
                </div>
                <div className={`px-4 py-3 rounded-2xl ${isAIEnabled ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100' : 'bg-gray-100'} text-gray-900`}>
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{
                  animationDelay: '0ms'
                }}></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{
                  animationDelay: '200ms'
                }}></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{
                  animationDelay: '400ms'
                }}></div>
                  </div>
                </div>
              </div>
            </motion.div>}
        </AnimatePresence>
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Feedback Form */}
      <AnimatePresence>
        {showFeedback && <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: 20
      }} className="mb-6 backdrop-blur-xl bg-white/70 rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-blue-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <StarIcon className="h-5 w-5 mr-2 text-yellow-400" />
              Share Your Feedback
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  How would you rate your experience?
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map(star => <button key={star} onClick={() => setRating(star)} className="p-2 rounded-lg transition-all">
                      <StarIcon className={`h-8 w-8 ${rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'} transition-colors hover:text-yellow-300`} />
                    </button>)}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Tell us more about your experience
                </label>
                <textarea value={feedbackComment} onChange={e => setFeedbackComment(e.target.value)} placeholder="What did you like or what could we improve?" className="w-full p-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows={3} />
              </div>
              <div className="flex space-x-3">
                <button onClick={submitFeedback} disabled={rating === 0} className={`flex-1 flex items-center justify-center p-3 rounded-xl text-white transition-all ${rating > 0 ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}>
                  <SendIcon className="h-5 w-5 mr-2" />
                  <span className="font-medium">Submit Feedback</span>
                </button>
                <button onClick={() => setShowFeedback(false)} className="p-3 rounded-xl text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                  <XCircleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>}
      </AnimatePresence>

      {/* Attachment preview */}
      {attachments.length > 0 && <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {attachments.map((url, i) => <div key={i} className="relative h-16 w-16 flex-shrink-0">
              <img src={url} alt="Attachment" className="h-full w-full rounded-lg object-cover border border-gray-200" />
              <button onClick={() => setAttachments(prev => prev.filter((_, index) => index !== i))} className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 rounded-full text-white flex items-center justify-center">
                <XCircleIcon className="h-4 w-4" />
              </button>
            </div>)}
        </div>}

      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} multiple accept="image/*" className="hidden" />

      {/* Message Input */}
      <div className="backdrop-blur-xl bg-white/70 rounded-2xl p-4 shadow-lg shadow-gray-200/50 border border-gray-100">
        <form onSubmit={sendMessage} className="flex items-center space-x-4">
          <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <PaperclipIcon className="h-6 w-6" />
          </button>
          <div className="relative flex-1">
            <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder={`Type your ${selectedType} message...`} className="w-full py-2 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none" />
            {/* Emoji picker */}
            <AnimatePresence>
              {showEmojiPicker && <motion.div initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: 10
            }} className="absolute bottom-full mb-2 right-0 bg-white rounded-xl shadow-lg border border-gray-200 p-2 w-64">
                  <div className="grid grid-cols-6 gap-2">
                    {emojis.map((emoji, i) => <button key={i} type="button" onClick={() => {
                  setNewMessage(prev => prev + emoji);
                  setShowEmojiPicker(false);
                }} className="text-xl p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        {emoji}
                      </button>)}
                  </div>
                </motion.div>}
            </AnimatePresence>
          </div>
          <button type="button" onClick={() => setShowEmojiPicker(prev => !prev)} className={`p-2 transition-colors ${showEmojiPicker ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}>
            <SmileIcon className="h-6 w-6" />
          </button>
          <button type="submit" disabled={!newMessage.trim() && attachments.length === 0} className={`p-2 rounded-xl transition-colors ${!newMessage.trim() && attachments.length === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-blue-500 hover:text-blue-600'}`}>
            <SendIcon className="h-6 w-6" />
          </button>
        </form>
      </div>

      {/* Contact alternatives */}
      <div className="mt-4 flex justify-center space-x-4">
        <button className="flex items-center text-sm text-gray-500 hover:text-blue-500 transition-colors">
          <PhoneIcon className="h-4 w-4 mr-1" />
          <span>Call support</span>
        </button>
        <span className="text-gray-300">|</span>
        <button className="flex items-center text-sm text-gray-500 hover:text-blue-500 transition-colors">
          <MailIcon className="h-4 w-4 mr-1" />
          <span>Email us</span>
        </button>
      </div>
    </div>;
};