import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Send,
  Info,
  Phone,
  MoreHorizontal,
  Plus,
  Users,
  Calendar,
  Package,
  FileText,
  RefreshCw,
  Link2,
  Bold,
  Italic,
  Underline,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  HelpCircle,
  Target,
  Clock,
  AlertCircle,
  Activity,
  X,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  CheckCircle,
  Edit2,
  Filter,
  TrendingUp
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'patient' | 'system';
  initial: string;
  name: string;
  content: string;
  timestamp: string;
  isAutomated?: boolean;
}

interface Conversation {
  id: string;
  name: string;
  initial: string;
  lastMessage: string;
  time: string;
}

interface MessageTemplate {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  category: string;
}

const ChatPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>("mary");
  const [messageInput, setMessageInput] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [conversationTypeFilter, setConversationTypeFilter] = useState("all");
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const conversations: Conversation[] = [
    { id: "mary", name: "Mary SMITHTESTNEW", initial: "MS", lastMessage: "", time: "Sep 27" },
    { id: "abit", name: "Abit GurungTEST", initial: "AG", lastMessage: "", time: "Aug 29" },
    { id: "joe", name: "Schmo Joe", initial: "SJ", lastMessage: "", time: "Aug 28" },
    { id: "marisa1", name: "Marisa TESTS", initial: "MT", lastMessage: "", time: "Aug 25" },
    { id: "marisa2", name: "Marisa TEST", initial: "MT", lastMessage: "", time: "Aug 25" },
    { id: "monica", name: "Monica TESTjones", initial: "MT", lastMessage: "", time: "Aug 16" },
    { id: "ashleigh", name: "Ashleigh TEST", initial: "AT", lastMessage: "", time: "Aug 09" },
    { id: "marytest", name: "MaryTEST SmiTEST", initial: "MS", lastMessage: "Another test", time: "Jul 28" },
    { id: "marisaoge", name: "MarisaTEST Oge", initial: "MO", lastMessage: "", time: "May 22" },
    { id: "margo", name: "Margo Smithtest2", initial: "MS", lastMessage: "", time: "May 18" },
    { id: "bonnie", name: "Bonnie Test", initial: "BT", lastMessage: "", time: "May 15" },
  ];

  const messages: Record<string, Message[]> = {
    mary: [
      { id: "1", sender: "RC", initial: "RC", content: "hi there", date: "Aug 03" },
      { id: "2", sender: "RC", initial: "RC", content: "https://docs.google.com/...", date: "Aug 03", isLink: true },
    ]
  };

  const messageTemplates: MessageTemplate[] = [
    {
      id: "1",
      title: "Blood Pressure:",
      subtitle: "2 of 19 BPs recorded this month",
      content: "Hi there we noticed you haven't been checking your blood pressure recently. Is there anything getting in the way? We're here to help if something's making it hard.",
      category: "Health"
    },
    {
      id: "2",
      title: "Weight tracking:",
      subtitle: "8 of 8 recorded weights this month",
      content: "Hey, amazing job tracking your weight consistently this month! Your commitment is making a real difference – keep it up!",
      category: "Progress"
    },
    {
      id: "3",
      title: "Week 11 Lesson:",
      subtitle: "Sleep, barriers to quality sleep",
      content: "Getting 7-8 hours of sleep can be tough sometimes—about 1 in 3 US adults don't get enough sleep regularly, so you're not alone. Is there anything that gets in the way of your sleep? Let's talk about it at our next session!",
      category: "Education"
    }
  ];

  const handleTemplateClick = (template: MessageTemplate) => {
    setMessageInput(template.content);
  };

  const selectedPatient = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left panel - Conversation list */}
      <div className="w-72 border-r border-gray-200 bg-white flex flex-col h-full">
        {/* User dropdown */}
        <div className="border-b border-gray-200">
          <div ref={dropdownRef} className="relative">
            <button 
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="w-full p-3 flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                  alt="Profile"
                  className="h-10 w-10 rounded-full mr-3"
                />
                <span className="font-medium">You</span>
              </div>
              <ChevronDown className={`h-5 w-5 text-blue-600 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {userDropdownOpen && (
              <div className="absolute left-0 right-0 bg-white border border-gray-200 shadow-lg z-20">
                <button className="w-full p-3 flex items-center text-blue-600 hover:bg-gray-50">
                  <Plus className="h-5 w-5 mr-3" />
                  <span>New</span>
                </button>
                
                <button className="w-full p-3 flex items-center justify-between bg-gray-100 hover:bg-gray-200">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 mr-3 text-gray-600" />
                    <span>Active</span>
                  </div>
                  <span className="bg-gray-200 px-2 py-0.5 rounded-full text-sm">99+</span>
                </button>
                
                <button className="w-full p-3 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-gray-600" />
                    <span>Scheduled</span>
                  </div>
                  <span className="bg-gray-200 px-2 py-0.5 rounded-full text-sm">0</span>
                </button>
                
                <button className="w-full p-3 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 mr-3 text-gray-600" />
                    <span>Archived</span>
                  </div>
                  <span className="bg-gray-200 px-2 py-0.5 rounded-full text-sm">0</span>
                </button>
                
                <button className="w-full p-3 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <X className="h-5 w-5 mr-3 text-gray-600" />
                    <span>Closed</span>
                  </div>
                  <span className="bg-gray-200 px-2 py-0.5 rounded-full text-sm">10</span>
                </button>
                
                <div className="border-t border-gray-200 p-3">
                  <button 
                    className="w-full flex items-center justify-between"
                    onClick={() => setFiltersExpanded(!filtersExpanded)}
                  >
                    <span className="font-medium">Filters</span>
                    <Filter className={`h-5 w-5 text-blue-600 transition-transform ${filtersExpanded ? '' : 'rotate-180'}`} />
                  </button>
                  
                  {filtersExpanded && (
                    <div className="mt-3">
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-2">Status</p>
                        <div className="flex border border-gray-300 rounded-md overflow-hidden">
                          <button 
                            className={`flex-1 py-2 text-center text-sm ${statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                            onClick={() => setStatusFilter('all')}
                          >
                            All
                          </button>
                          <button 
                            className={`flex-1 py-2 text-center text-sm ${statusFilter === 'unread' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                            onClick={() => setStatusFilter('unread')}
                          >
                            Unread
                          </button>
                          <button 
                            className={`flex-1 py-2 text-center text-sm ${statusFilter === 'read' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                            onClick={() => setStatusFilter('read')}
                          >
                            Read
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-2">Conversation Type</p>
                        <div className="flex border border-gray-300 rounded-md overflow-hidden">
                          <button 
                            className={`flex-1 py-2 text-center text-sm ${conversationTypeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                            onClick={() => setConversationTypeFilter('all')}
                          >
                            All
                          </button>
                          <button 
                            className={`flex-1 py-2 text-center text-sm ${conversationTypeFilter === 'individual' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                            onClick={() => setConversationTypeFilter('individual')}
                          >
                            Individual
                          </button>
                          <button 
                            className={`flex-1 py-2 text-center text-sm ${conversationTypeFilter === 'community' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                            onClick={() => setConversationTypeFilter('community')}
                          >
                            Community
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Search bar */}
        <div className="p-4 border-b border-gray-200 flex items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search Conversations..."
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {conversations.map(conversation => (
            <button
              key={conversation.id}
              className={`w-full p-3 flex items-center border-b border-gray-100 hover:bg-gray-50 ${selectedConversation === conversation.id ? 'bg-blue-50' : ''}`}
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-3">
                {conversation.initial}
              </div>
              <div className="flex-1 text-left">
                <div className="flex justify-between">
                  <span className="font-medium text-sm">{conversation.name}</span>
                  <span className="text-xs text-gray-500">{conversation.time}</span>
                </div>
                {conversation.lastMessage && (
                  <p className="text-xs text-gray-500 truncate">{conversation.lastMessage}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Middle panel - Chat */}
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
        {/* Chat header */}
        <div className="bg-white p-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <div className="font-medium">{selectedPatient?.name}</div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-1 hover:bg-gray-100 rounded-full">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            <span className="font-medium">Marisa</span>
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
              alt="Profile"
              className="h-8 w-8 rounded-full"
            />
            <button className="p-1 hover:bg-gray-100 rounded-full">
              <MoreHorizontal className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Chat messages container */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {selectedConversation && messages[selectedConversation]?.map(message => (
            <div key={message.id} className="mb-4 flex">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-2 flex-shrink-0">
                {message.initial}
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <span className="text-sm font-medium mr-2">{message.sender}</span>
                  <span className="text-xs text-gray-500">{message.date}</span>
                </div>
                <div className={`p-3 rounded-lg ${message.isLink ? 'bg-white border border-gray-200' : 'bg-white border border-gray-200'}`}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          
          {(!selectedConversation || !messages[selectedConversation] || messages[selectedConversation].length === 0) && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <p>You haven't sent or received a message yet.</p>
              <p>Enter a message below and press "Send."</p>
            </div>
          )}
        </div>
        
        {/* Message input - Fixed at bottom */}
        <div className="bg-white border-t border-gray-200 p-3">
          <div className="flex items-center mb-2 space-x-2">
            <button className="p-1 text-gray-500 hover:text-gray-700">
              <Bold className="h-5 w-5" />
            </button>
            <button className="p-1 text-gray-500 hover:text-gray-700">
              <Italic className="h-5 w-5" />
            </button>
            <button className="p-1 text-gray-500 hover:text-gray-700">
              <Underline className="h-5 w-5" />
            </button>
            <button className="p-1 text-gray-500 hover:text-gray-700">
              <List className="h-5 w-5" />
            </button>
            <button className="p-1 text-gray-500 hover:text-gray-700">
              <Link2 className="h-5 w-5" />
            </button>
            <button className="p-1 text-gray-500 hover:text-gray-700">
              <FileText className="h-5 w-5" />
            </button>
            <button className="p-1 text-gray-500 hover:text-gray-700">
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>
          
          <div className="relative">
            <textarea
              placeholder="Enter a message here..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            ></textarea>
            
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <Calendar className="h-5 w-5" />
              </button>
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <Phone className="h-5 w-5" />
              </button>
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <Info className="h-5 w-5" />
              </button>
              <button className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right panel - Message Templates */}
      {selectedConversation && (
        <div className="w-64 border-l border-gray-200 bg-white flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-medium text-lg">Draft Messages for Mary</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messageTemplates.map((template) => (
              <div key={template.id} className="rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{template.title}</span>
                    <button 
                      onClick={() => handleTemplateClick(template)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600">{template.subtitle}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-b-lg">
                  <p className="text-sm text-gray-800">{template.content}</p>
                  <div className="flex justify-end mt-3">
                    <button 
                      onClick={() => handleTemplateClick(template)}
                      className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center"
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;