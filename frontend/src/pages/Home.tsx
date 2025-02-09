import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Glasses, 
  ArrowRight, 
  User, 
  Mic, 
  MicOff, 
  PlusCircle, 
  Search,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Trash2
} from 'lucide-react';
import TypingAnimation from '../components/TypingAnimation';

interface Chat {
  id: string;
  title: string;
  messages: Array<{ role: 'user' | 'ai'; content: string }>;
  timestamp: Date;
}

// Add type definitions for SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: () => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface Window {
  SpeechRecognition: new () => SpeechRecognition;
  webkitSpeechRecognition: new () => SpeechRecognition;
}

const Home = () => {
  const [message, setMessage] = React.useState('');
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = React.useState<string | null>(null);
  const [isListening, setIsListening] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);
  const [animatedMessages, setAnimatedMessages] = React.useState<Set<string>>(new Set());

  const currentChat = chats.find(chat => chat.id === currentChatId);
  const chatHistory = currentChat?.messages || [];

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  React.useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setMessage(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const createNewChat = (initialMessage?: string) => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: initialMessage ? initialMessage.slice(0, 30) + '...' : 'New Conversation',
      messages: [],
      timestamp: new Date()
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    return newChat;
  };

  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    console.log('Submitting message:', message);
    
    let chatId = currentChatId;
    
    // If no chat is selected, create a new one
    if (!chatId) {
      console.log('No chat selected, creating new chat');
      const newChat = createNewChat(message);
      chatId = newChat.id;
    }

    // Send message using the current or newly created chat ID
    sendMessage(message, chatId);
    setMessage('');
  };

  const sendMessage = async (text: string, chatId: string) => {
    console.log('Sending message:', { text, chatId });
    
    // Update the chat with the user's message
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: [...chat.messages, { role: 'user' as const, content: text }],
          title: chat.messages.length === 0 ? text.slice(0, 30) + '...' : chat.title
        };
      }
      return chat;
    }));

    setIsLoading(true);

    try {
      console.log('Making API request with message:', text);
      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      console.log('Received response:', data);
      
      setChats(prev => prev.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, { role: 'ai' as const, content: data.response }]
          };
        }
        return chat;
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      setChats(prev => prev.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, { 
              role: 'ai' as const, 
              content: "I regret to inform you that I've encountered an error processing your request, sir. Perhaps we should attempt an alternative approach."
            }]
          };
        }
        return chat;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const examplePrompts = [
    "Alfred, what's Bitcoin's current price?",
    "How's the weather looking today?",
    "Draft a tweet about Web3 trends",
    "Show me my portfolio performance"
  ];

  const MessageContent = ({ content, isLatest, messageId }: { content: string, isLatest: boolean, messageId: string }) => {
    if (!isLatest || animatedMessages.has(messageId)) {
      return <div className="whitespace-pre-wrap">{content}</div>;
    }

    const words = content.split(' ');
    return (
      <motion.div 
        initial="hidden" 
        animate="visible"
        onAnimationComplete={() => {
          setAnimatedMessages(prev => new Set([...prev, messageId]));
        }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.02,
            },
          },
        }}
        className="whitespace-pre-wrap"
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block mr-1"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  const handleExamplePrompt = (text: string) => {
    let chatId = currentChatId;
    
    // If no chat is selected, create a new one
    if (!chatId) {
      console.log('No chat selected, creating new chat for example prompt');
      const newChat = createNewChat(text);
      chatId = newChat.id;
    }

    // Send message using the current or newly created chat ID
    sendMessage(text, chatId);
  };

  return (
    <div className="flex h-screen pt-16">
      {/* Sidebar */}
      <motion.div
        initial={{ x: isSidebarOpen ? 0 : -320 }}
        animate={{ x: isSidebarOpen ? 0 : -320 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-80 border-r border-border bg-secondary/30 backdrop-blur-sm flex flex-col h-full"
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <button
            onClick={() => setCurrentChatId(null)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors w-full"
          >
            <PlusCircle className="h-5 w-5" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/50" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChats.map(chat => (
            <motion.button
              key={chat.id}
              onClick={() => setCurrentChatId(chat.id)}
              whileHover={{ scale: 1.01 }}
              className={`w-full p-4 text-left border-b border-border hover:bg-secondary/50 flex items-center justify-between group ${
                currentChatId === chat.id ? 'bg-secondary' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium truncate">{chat.title}</p>
                  <p className="text-sm text-foreground/50">
                    {new Date(chat.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
                className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed left-80 top-1/2 transform -translate-y-1/2 z-10 bg-secondary/80 p-2 rounded-r-lg hover:bg-secondary transition-colors"
        style={{ left: isSidebarOpen ? '320px' : '0' }}
      >
        {isSidebarOpen ? (
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </button>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto"
        >
          <AnimatePresence>
            {(!currentChatId || chatHistory.length === 0) ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col items-center justify-center px-4 text-center"
              >
                <Glasses className="h-16 w-16 text-primary mb-6" />
                <h1 className="text-4xl font-serif font-bold mb-4">
                  Good evening, sir. How may I be of assistance?
                </h1>
                <p className="text-lg text-foreground/70 max-w-2xl font-serif">
                  I'm at your service for everything from market analysis and portfolio management to weather updates and social media engagement. What can I do for you today?
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-2xl w-full">
                  {examplePrompts.map((prompt, index) => (
                    <ExamplePrompt key={index} onClick={() => handleExamplePrompt(prompt)}>
                      "{prompt}" →
                    </ExamplePrompt>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="max-w-3xl mx-auto py-8 px-4">
                {chatHistory.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start mb-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                        <Glasses className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 font-serif ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground ml-4'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      <MessageContent 
                        content={msg.content} 
                        isLatest={index === chatHistory.length - 1}
                        messageId={`${msg.role}-${index}`}
                      />
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-4">
                        <User className="h-5 w-5 text-primary-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start mb-6 justify-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Glasses className="h-5 w-5 text-primary" />
                    </div>
                    <div className="bg-secondary rounded-2xl">
                      <TypingAnimation />
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="border-t border-border bg-background/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4">
            <div className="relative flex items-center">
              <button
                type="button"
                onClick={toggleListening}
                className={`absolute left-2 p-2 rounded-xl transition-colors ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-secondary text-foreground hover:bg-secondary/70'
                }`}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How may I be of assistance today, sir?"
                className="w-full rounded-2xl bg-secondary pl-12 pr-12 p-4 text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary font-serif"
              />
              <button
                type="submit"
                className="absolute right-2 p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ExamplePrompt = ({ 
  children, 
  onClick 
}: { 
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="p-4 text-left rounded-xl bg-secondary hover:bg-secondary/70 transition-colors text-sm text-foreground/80 font-serif"
  >
    {children}
  </motion.button>
);

export default Home;