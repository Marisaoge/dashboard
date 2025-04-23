import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  CheckCircle,
  Edit2,
  Filter,
  TrendingUp,
  Image,
  Film,
  Paperclip,
  Mic,
  PlayCircle,
  Lightbulb
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'patient' | 'system';
  initial: string;
  name: string;
  content: string;
  timestamp: string;
  isAutomated?: boolean;
  isLink?: boolean;
}

interface Conversation {
  id: string;
  patientName: string;
  coachName: string;
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
  const { patientId } = useParams<{ patientId: string }>();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(patientId || "mary");
  const [messageInput, setMessageInput] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [conversationTypeFilter, setConversationTypeFilter] = useState("all");
  const [patientViewFilter, setPatientViewFilter] = useState("my");
  const [isDraftCollapsed, setIsDraftCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
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
    { id: "mandi_tom", patientName: "Tom Hazlett", coachName: "Mandi Freund", initial: "TH", lastMessage: "Thanks!!", time: "1:21 PM" },
    { id: "kyle_nancy", patientName: "Nancy A.", coachName: "Kyle", initial: "NA", lastMessage: "Perfect! Thx", time: "12:39 PM" },
    { id: "ashleigh_ana", patientName: "Ana M", coachName: "Ashleigh", initial: "AM", lastMessage: "Hi Ana, see below for A...", time: "12:24 PM" },
    { id: "rachel_jeffrey", patientName: "Jeffrey M", coachName: "Rachel", initial: "JM", lastMessage: "not resting", time: "11:47 AM" },
    { id: "rachel_iris", patientName: "Iris", coachName: "Rachel", initial: "IS", lastMessage: "Oh no- I did see you ar...", time: "11:37 AM" },
    { id: "mandi_leo", patientName: "Leo", coachName: "Mandi", initial: "LM", lastMessage: "Hi Leo, I wanted to shar...", time: "11:29 AM" },
    { id: "mary", patientName: "Mary SMITHTESTNEW", coachName: "Marisa", initial: "MS", lastMessage: "", time: "Sep 27" },
    { id: "abit", patientName: "Abit GurungTEST", coachName: "Marisa", initial: "AG", lastMessage: "", time: "Aug 29" },
    { id: "joe", patientName: "Schmo Joe", coachName: "Marisa", initial: "SJ", lastMessage: "", time: "Aug 28" },
    { id: "marisa1", patientName: "Marisa TESTS", coachName: "Marisa", initial: "MT", lastMessage: "", time: "Aug 25" },
    { id: "marisa2", patientName: "Marisa TEST", coachName: "Marisa", initial: "MT", lastMessage: "", time: "Aug 25" },
    { id: "monica", patientName: "Monica TESTjones", coachName: "Marisa", initial: "MT", lastMessage: "", time: "Aug 16" },
    { id: "ashleigh", patientName: "Ashleigh TEST", coachName: "Marisa", initial: "AT", lastMessage: "", time: "Aug 09" },
    { id: "marytest", patientName: "MaryTEST SmiTEST", coachName: "Marisa", initial: "MS", lastMessage: "Another test", time: "Jul 28" },
    { id: "marisaoge", patientName: "MarisaTEST Oge", coachName: "Marisa", initial: "MO", lastMessage: "", time: "May 22" },
    { id: "margo", patientName: "Margo Smithtest2", coachName: "Marisa", initial: "MS", lastMessage: "", time: "May 18" },
    { id: "bonnie", patientName: "Bonnie Test", coachName: "Marisa", initial: "BT", lastMessage: "", time: "May 15" },
  ];

  const messages: Record<string, Message[]> = {
    mary: [
      {
        id: '1',
        sender: 'system',
        initial: 'RC',
        name: 'Remote Care',
        content: 'hi there',
        timestamp: 'Aug 03',
        isAutomated: true
      },
      {
        id: '2',
        sender: 'system',
        initial: 'RC',
        name: 'Remote Care',
        content: 'https://docs.google.com/...',
        timestamp: 'Aug 03',
        isAutomated: true,
        isLink: true
      }
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

  // Helper function to get display name based on filter
  const getDisplayName = (conversation: Conversation) => {
    if (patientViewFilter === 'all') {
      return `${conversation.coachName}, ${conversation.patientName}`;
    }
    return conversation.patientName;
  };

  // Add new click handler for the menu
  const handleMenuClick = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === conversationId ? null : conversationId);
  };

  // Add handlers for menu actions
  const handleArchive = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    // TODO: Implement archive functionality
    setActiveMenu(null);
  };

  const handleClose = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    // TODO: Implement close functionality
    setActiveMenu(null);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left panel - Conversation list */}
      <div className="w-72 border-r border-gray-200 bg-white flex flex-col">
        {/* User dropdown */}
        <div className="border-b border-gray-200">
          <div ref={dropdownRef} className="relative">
            <button 
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="w-full p-3 flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Filter className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium">Filter</span>
                  {!userDropdownOpen && (
                    <span className="text-xs text-gray-500">
                      {patientViewFilter === 'my' ? 'My Patients, ' : 'All Patients, '}
                      {statusFilter !== 'all' ? `${statusFilter}, ` : ''}
                      {conversationTypeFilter !== 'all' ? conversationTypeFilter : ''}
                    </span>
                  )}
                </div>
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
                        <p className="text-sm font-medium mb-2">Patient View</p>
                        <div className="flex border border-gray-300 rounded-md overflow-hidden">
                          <button 
                            className={`flex-1 py-2 text-center text-sm ${patientViewFilter === 'my' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                            onClick={() => setPatientViewFilter('my')}
                          >
                            My Patients
                          </button>
                          <button 
                            className={`flex-1 py-2 text-center text-sm ${patientViewFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                            onClick={() => setPatientViewFilter('all')}
                          >
                            All Patients
                          </button>
                        </div>
                      </div>

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
            <div
              key={conversation.id}
              className="relative group"
            >
              <button
                className={`w-full p-3 flex items-center border-b border-gray-100 hover:bg-gray-50 ${selectedConversation === conversation.id ? 'bg-blue-50' : ''}`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-3">
                  {conversation.initial}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex justify-between items-center pr-7">
                    <span className="font-medium text-sm">{getDisplayName(conversation)}</span>
                    <span className="text-xs text-gray-500">{conversation.time}</span>
                  </div>
                  {conversation.lastMessage && (
                    <p className="text-xs text-gray-500 truncate">{conversation.lastMessage}</p>
                  )}
                </div>
              </button>

              {/* Three dots menu button */}
              <button
                className={`absolute right-3 top-3 p-1 rounded-full hover:bg-gray-200 ${
                  activeMenu === conversation.id ? 'visible' : 'invisible group-hover:visible'
                }`}
                onClick={(e) => handleMenuClick(e, conversation.id)}
              >
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </button>

              {/* Dropdown menu */}
              {activeMenu === conversation.id && (
                <div className="absolute right-2 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-1 min-w-[120px]">
                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center text-gray-700"
                    onClick={(e) => handleArchive(e, conversation.id)}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Archive
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center text-gray-700"
                    onClick={(e) => handleClose(e, conversation.id)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Close
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Middle panel - Chat */}
      <div className={`flex-1 flex flex-col ${isDraftCollapsed ? 'mr-0' : ''}`}>
        {/* Chat header */}
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
          <div className="font-medium">
            {selectedConversation && getDisplayName(conversations.find(c => c.id === selectedConversation)!)}
          </div>
          <div className="relative">
            <button 
              className="p-1 hover:bg-gray-100 rounded-full"
              onClick={(e) => handleMenuClick(e, selectedConversation || '')}
            >
              <MoreHorizontal className="h-5 w-5 text-gray-600" />
            </button>
            
            {/* Dropdown menu */}
            {activeMenu === selectedConversation && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-1 min-w-[120px]">
                <button
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center text-gray-700"
                  onClick={(e) => handleArchive(e, selectedConversation || '')}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Archive
                </button>
                <button
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center text-gray-700"
                  onClick={(e) => handleClose(e, selectedConversation || '')}
                >
                  <X className="h-4 w-4 mr-2" />
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4">
            {selectedConversation && messages[selectedConversation]?.map(message => (
              <div key={message.id} className="mb-4 flex">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-2 flex-shrink-0">
                  {message.initial}
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="text-sm font-medium mr-2">{message.name}</span>
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
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
        </div>
        
        {/* Message input area */}
        <div className="bg-white border-t border-gray-200">
          {/* Formatting toolbar */}
          <div className="flex items-center gap-6 px-6 h-14 border-b border-gray-200">
            <button className="hover:bg-gray-100 rounded p-1.5">
              <Bold className="h-5 w-5 text-gray-700" />
            </button>
            <button className="hover:bg-gray-100 rounded p-1.5">
              <Italic className="h-5 w-5 text-gray-700" />
            </button>
            <button className="hover:bg-gray-100 rounded p-1.5">
              <Underline className="h-5 w-5 text-gray-700" />
            </button>
            <button className="hover:bg-gray-100 rounded p-1.5">
              <List className="h-5 w-5 text-gray-700" />
            </button>
            <button className="hover:bg-gray-100 rounded p-1.5">
              <Link2 className="h-5 w-5 text-gray-700" />
            </button>
            <button className="hover:bg-gray-100 rounded p-1.5">
              <PlayCircle className="h-5 w-5 text-gray-700" />
            </button>
            <button className="hover:bg-gray-100 rounded p-1.5">
              <Lightbulb className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          {/* Text area */}
          <div className="p-6">
            <textarea
              placeholder="Enter a message here..."
              className="w-full h-[250px] px-4 py-3 text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
          </div>

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            {/* Left side - attachment buttons */}
            <div className="flex items-center gap-4">
              <button className="text-blue-600 hover:bg-gray-100 rounded p-1.5">
                <Image className="h-6 w-6" />
              </button>
              <button className="text-blue-600 hover:bg-gray-100 rounded p-1.5">
                <Film className="h-6 w-6" />
              </button>
              <button className="text-blue-600 hover:bg-gray-100 rounded p-1.5">
                <Paperclip className="h-6 w-6" />
              </button>
            </div>

            {/* Right side - mic and send */}
            <div className="flex items-center gap-4">
              <button className="text-blue-600 hover:bg-gray-100 rounded p-1.5">
                <Mic className="h-6 w-6" />
              </button>
              <button
                onClick={() => {
                  // Handle sending the message
                }}
                className="flex items-center gap-1 px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                <span className="font-medium">Send</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right panel - Message Templates */}
      {selectedConversation && (
        <div className={`${isDraftCollapsed ? 'w-12' : 'w-64'} border-l border-gray-200 bg-white flex flex-col h-full overflow-hidden transition-all duration-300`}>
          <div className="flex items-center p-4 border-b border-gray-200">
            <button
              onClick={() => setIsDraftCollapsed(!isDraftCollapsed)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors mr-2"
            >
              {isDraftCollapsed ? (
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-600" />
              )}
            </button>
            {!isDraftCollapsed && (
              <h2 className="font-medium text-lg flex-1">Draft Messages for Mary</h2>
            )}
          </div>
          
          {!isDraftCollapsed && (
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
          )}
        </div>
      )}
    </div>
  );
};

export default ChatPage;