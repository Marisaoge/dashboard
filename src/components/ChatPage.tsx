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
  Lightbulb,
  MessageSquarePlus
} from 'lucide-react';
import Header from './Header';
import { useUnreadCount } from '../contexts/UnreadCountContext';

interface Message {
  id: string;
  sender: 'user' | 'patient' | 'system';
  initial: string;
  name: string;
  content: string;
  timestamp: string;
  isAutomated?: boolean;
  isLink?: boolean;
  isDeleted?: boolean;
  deletedAt?: string;
}

interface Conversation {
  id: string;
  patientName: string;
  coachName: string;
  initial: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isRead: boolean;
}

interface MessageTemplate {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  category: string;
}

interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  mrn: string;
}

const ChatPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const { updateChatUnreadCount } = useUnreadCount();
  
  const conversations: Conversation[] = [
    { id: "joe-smith", patientName: "Joe Smith", coachName: "Marisa Oge", initial: "JS", lastMessage: "Thanks for checking in!", time: "2:15 PM", unreadCount: 2, isRead: false },
    { id: "mandi_tom", patientName: "Tom Hazlett", coachName: "Mandi Freund", initial: "TH", lastMessage: "Thanks!!", time: "1:21 PM", unreadCount: 0, isRead: true },
    { id: "kyle_nancy", patientName: "Nancy A.", coachName: "Kyle", initial: "NA", lastMessage: "Perfect! Thx", time: "12:39 PM", unreadCount: 1, isRead: false },
    { id: "ashleigh_ana", patientName: "Ana M", coachName: "Ashleigh", initial: "AM", lastMessage: "Hi Ana, see below for A...", time: "12:24 PM", unreadCount: 0, isRead: true },
    { id: "rachel_jeffrey", patientName: "Jeffrey M", coachName: "Rachel", initial: "JM", lastMessage: "not resting", time: "11:47 AM", unreadCount: 0, isRead: true },
    { id: "rachel_iris", patientName: "Iris", coachName: "Rachel", initial: "IS", lastMessage: "Oh no- I did see you ar...", time: "11:37 AM", unreadCount: 0, isRead: true },
    { id: "mandi_leo", patientName: "Leo", coachName: "Mandi", initial: "LM", lastMessage: "Hi Leo, I wanted to shar...", time: "11:29 AM", unreadCount: 0, isRead: true },
    { id: "mary", patientName: "Mary SMITHTESTNEW", coachName: "Marisa", initial: "MS", lastMessage: "", time: "Sep 27", unreadCount: 0, isRead: true },
    { id: "abit", patientName: "Abit GurungTEST", coachName: "Marisa", initial: "AG", lastMessage: "", time: "Aug 29", unreadCount: 0, isRead: true },
    { id: "joe", patientName: "Schmo Joe", coachName: "Marisa", initial: "SJ", lastMessage: "", time: "Aug 28", unreadCount: 0, isRead: true },
    { id: "marisa1", patientName: "Marisa TESTS", coachName: "Marisa", initial: "MT", lastMessage: "", time: "Aug 25", unreadCount: 0, isRead: true },
    { id: "marisa2", patientName: "Marisa TEST", coachName: "Marisa", initial: "MT", lastMessage: "", time: "Aug 25", unreadCount: 0, isRead: true },
    { id: "monica", patientName: "Monica TESTjones", coachName: "Marisa", initial: "MT", lastMessage: "", time: "Aug 16", unreadCount: 0, isRead: true },
    { id: "ashleigh", patientName: "Ashleigh TEST", coachName: "Marisa", initial: "AT", lastMessage: "", time: "Aug 09", unreadCount: 0, isRead: true },
    { id: "marytest", patientName: "MaryTEST SmiTEST", coachName: "Marisa", initial: "MS", lastMessage: "Another test", time: "Jul 28", unreadCount: 0, isRead: true },
    { id: "marisaoge", patientName: "MarisaTEST Oge", coachName: "Marisa", initial: "MO", lastMessage: "", time: "May 22", unreadCount: 0, isRead: true },
    { id: "margo", patientName: "Margo Smithtest2", coachName: "Marisa", initial: "MS", lastMessage: "", time: "May 18", unreadCount: 0, isRead: true },
    { id: "bonnie", patientName: "Bonnie Test", coachName: "Marisa", initial: "BT", lastMessage: "", time: "May 15", unreadCount: 0, isRead: true }
  ];

  const [selectedConversation, setSelectedConversation] = useState<string | null>(patientId || "mary");
  const [messageInput, setMessageInput] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStatusOption, setSelectedStatusOption] = useState<string | null>(null);
  const [conversationTypeFilter, setConversationTypeFilter] = useState("all");
  const [patientViewFilter, setPatientViewFilter] = useState("my");
  const [isDraftCollapsed, setIsDraftCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [searchPatientQuery, setSearchPatientQuery] = useState('');
  const [conversationsState, setConversationsState] = useState<Conversation[]>(conversations);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    mary: [
      {
        id: '1',
        sender: 'system',
        initial: 'RC',
        name: 'Remote Care',
        content: 'Welcome to your care program! Your care team will be using this chat to communicate with you throughout your journey.',
        timestamp: 'Aug 03',
        isAutomated: true
      },
      {
        id: '2',
        sender: 'user',
        initial: 'MO',
        name: 'Marisa Oge',
        content: "Hi Mary! I'm Marisa, and I'll be your dedicated care coach. How are you feeling today?",
        timestamp: '9:30 AM'
      },
      {
        id: '3',
        sender: 'patient',
        initial: 'MS',
        name: 'Mary Smith',
        content: "Hi Marisa! Thanks for checking in. I'm doing okay, but I've been having some trouble sleeping lately.",
        timestamp: '9:45 AM'
      },
      {
        id: '4',
        sender: 'user',
        initial: 'MO',
        name: 'Marisa Oge',
        content: "I'm sorry to hear about your sleep troubles. That can be really frustrating. Can you tell me more about what's been happening? For example, do you have trouble falling asleep, staying asleep, or both?",
        timestamp: '10:00 AM'
      },
      {
        id: '5',
        sender: 'patient',
        initial: 'MS',
        name: 'Mary Smith',
        content: "I can fall asleep fine, but I keep waking up around 3 AM and then can't get back to sleep. It's been happening almost every night this week.",
        timestamp: '10:15 AM'
      },
      {
        id: '6',
        sender: 'user',
        initial: 'MO',
        name: 'Marisa Oge',
        content: "Thank you for sharing that, Mary. Waking up in the middle of the night can really impact how you feel during the day. I've shared some resources about sleep hygiene in your learning materials. Would you like to discuss some strategies during our next session?",
        timestamp: '10:30 AM'
      },
      {
        id: '7',
        sender: 'patient',
        initial: 'MS',
        name: 'Mary Smith',
        content: "Yes, that would be really helpful. I'll take a look at those materials before our next call.",
        timestamp: '10:45 AM'
      },
      {
        id: '8',
        sender: 'user',
        initial: 'MO',
        name: 'Marisa Oge',
        content: "Perfect! I've also noticed you've been great with logging your blood pressure readings this week. Keep up the great work! 👏",
        timestamp: '11:00 AM'
      },
      {
        id: '9',
        sender: 'patient',
        initial: 'MS',
        name: 'Mary Smith',
        content: "Thanks! I've been trying to make it a regular part of my morning routine.",
        timestamp: '11:15 AM'
      }
    ],
    "joe-smith": [
      {
        id: '1',
        sender: 'system',
        initial: 'RC',
        name: 'Remote Care',
        content: 'Welcome to your care program! Your care team will be using this chat to communicate with you throughout your journey.',
        timestamp: '2:00 PM',
        isAutomated: true
      },
      {
        id: '2',
        sender: 'user',
        initial: 'MO',
        name: 'Marisa Oge',
        content: "Hi Joe! How are you feeling today?",
        timestamp: '2:05 PM'
      },
      {
        id: '3',
        sender: 'patient',
        initial: 'JS',
        name: 'Joe Smith',
        content: "Hi Marisa! I'm doing well, thanks for asking. I just had a question about my medication schedule.",
        timestamp: '2:10 PM'
      },
      {
        id: '4',
        sender: 'patient',
        initial: 'JS',
        name: 'Joe Smith',
        content: "Should I take my morning dose before or after breakfast?",
        timestamp: '2:11 PM'
      }
    ],
    "kyle_nancy": [
      {
        id: '1',
        sender: 'system',
        initial: 'RC',
        name: 'Remote Care',
        content: 'Welcome to your care program! Your care team will be using this chat to communicate with you throughout your journey.',
        timestamp: '12:30 PM',
        isAutomated: true
      },
      {
        id: '2',
        sender: 'user',
        initial: 'KY',
        name: 'Kyle',
        content: "Hi Nancy! How's your day going?",
        timestamp: '12:35 PM'
      },
      {
        id: '3',
        sender: 'patient',
        initial: 'NA',
        name: 'Nancy A.',
        content: "Hi Kyle! I'm doing well. Just wanted to let you know I completed my weekly goals!",
        timestamp: '12:40 PM'
      }
    ]
  });

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
  const getDisplayName = (conversation?: Conversation) => {
    if (!conversation) return '';
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

  // Sample patient data - replace with your actual patient data
  const patients: Patient[] = [
    { id: '1', name: 'John Smith', dateOfBirth: '1980-05-15', mrn: 'MRN123456' },
    { id: '2', name: 'Sarah Johnson', dateOfBirth: '1992-08-22', mrn: 'MRN789012' },
    { id: '3', name: 'Michael Brown', dateOfBirth: '1975-11-30', mrn: 'MRN345678' },
    // Add more patients as needed
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchPatientQuery.toLowerCase()) ||
    patient.mrn.toLowerCase().includes(searchPatientQuery.toLowerCase())
  );

  const handleStartNewChat = (patient: Patient) => {
    // Add logic to start a new chat with the selected patient
    setShowNewChatModal(false);
    setSearchPatientQuery('');
    // You would typically create a new conversation here
    // and set it as the selected conversation
  };

  useEffect(() => {
    if (showNewChatModal && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showNewChatModal]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      initial: 'MO', // You might want to get this from the logged-in user
      name: 'Marisa Oge', // You might want to get this from the logged-in user
      content: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    };

    setMessages(prevMessages => ({
      ...prevMessages,
      [selectedConversation]: [
        ...(prevMessages[selectedConversation] || []),
        newMessage
      ]
    }));

    setMessageInput('');
  };

  const handleDeleteMessage = (messageId: string, conversationId: string) => {
    setMessages(prevMessages => ({
      ...prevMessages,
      [conversationId]: prevMessages[conversationId].map(msg => 
        msg.id === messageId 
          ? {
              ...msg,
              isDeleted: true,
              deletedAt: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
            }
          : msg
      )
    }));
  };

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversation(conversationId);
    // Update the conversation's read status in state
    setConversationsState(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversationId 
          ? { ...conv, isRead: true, unreadCount: 0 }
          : conv
      )
    );
  };

  // Calculate total unread count
  const totalUnreadCount = conversationsState.reduce((sum, conversation) => 
    sum + (conversation.unreadCount || 0), 0
  );

  // Update unread count in context whenever it changes
  useEffect(() => {
    updateChatUnreadCount(totalUnreadCount);
  }, [totalUnreadCount, updateChatUnreadCount]);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        {/* Left panel - Conversation list */}
        <div className="w-72 border-r border-gray-200 bg-white flex flex-col">
          {/* Header buttons row */}
          <div className="p-4 flex gap-2">
            <button
              onClick={() => setShowNewChatModal(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors flex-1"
            >
              <MessageSquarePlus className="h-4 w-4" />
              <span className="text-sm">New Chat</span>
            </button>

            <div ref={dropdownRef} className="relative flex-1">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg border border-gray-200 px-3 py-2 group transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
                  <span className="text-sm text-gray-700 truncate">Filter</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {userDropdownOpen && (
                <div className="absolute left-full top-0 ml-2 w-72 bg-white border border-gray-200 shadow-lg z-50 rounded-lg">
                  <div className="px-3 py-2 space-y-1">
                    <button 
                      className="w-full flex items-center justify-between hover:bg-gray-50 rounded-md px-3 py-2"
                      onClick={() => {
                        setSelectedStatusOption('Active');
                        setUserDropdownOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        <Activity className="h-5 w-5 mr-3 text-gray-600" />
                        <span>Active</span>
                      </div>
                      <span className="bg-gray-100 px-2.5 py-0.5 rounded-full text-sm">99+</span>
                    </button>
                    
                    <button 
                      className="w-full flex items-center justify-between hover:bg-gray-50 rounded-md px-3 py-2"
                      onClick={() => {
                        setSelectedStatusOption('Scheduled');
                        setUserDropdownOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-3 text-gray-600" />
                        <span>Scheduled</span>
                      </div>
                      <span className="bg-gray-100 px-2.5 py-0.5 rounded-full text-sm">0</span>
                    </button>
                    
                    <button 
                      className="w-full flex items-center justify-between hover:bg-gray-50 rounded-md px-3 py-2"
                      onClick={() => {
                        setSelectedStatusOption('Archived');
                        setUserDropdownOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        <Package className="h-5 w-5 mr-3 text-gray-600" />
                        <span>Archived</span>
                      </div>
                      <span className="bg-gray-100 px-2.5 py-0.5 rounded-full text-sm">0</span>
                    </button>
                    
                    <button 
                      className="w-full flex items-center justify-between hover:bg-gray-50 rounded-md px-3 py-2"
                      onClick={() => {
                        setSelectedStatusOption('Closed');
                        setUserDropdownOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        <X className="h-5 w-5 mr-3 text-gray-600" />
                        <span>Closed</span>
                      </div>
                      <span className="bg-gray-100 px-2.5 py-0.5 rounded-full text-sm">10</span>
                    </button>
                  </div>

                  <div className="border-t border-gray-200 mt-2 p-3">
                    <button 
                      className="w-full flex items-center justify-between mb-4"
                      onClick={() => setFiltersExpanded(!filtersExpanded)}
                    >
                      <span className="font-medium">Filters</span>
                      <Filter className={`h-5 w-5 text-blue-600 transition-transform ${filtersExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {filtersExpanded && (
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-2">Patient View</p>
                          <div className="grid grid-cols-2 border border-gray-200 rounded-lg overflow-hidden divide-x divide-gray-200">
                            <button 
                              className={`py-2 text-sm ${patientViewFilter === 'my' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                              onClick={() => setPatientViewFilter('my')}
                            >
                              My Patients
                            </button>
                            <button 
                              className={`py-2 text-sm ${patientViewFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                              onClick={() => setPatientViewFilter('all')}
                            >
                              All Patients
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-2">Status</p>
                          <div className="grid grid-cols-3 border border-gray-200 rounded-lg overflow-hidden divide-x divide-gray-200">
                            <button 
                              className={`py-2 text-sm ${statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                              onClick={() => setStatusFilter('all')}
                            >
                              All
                            </button>
                            <button 
                              className={`py-2 text-sm ${statusFilter === 'unread' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                              onClick={() => setStatusFilter('unread')}
                            >
                              Unread
                            </button>
                            <button 
                              className={`py-2 text-sm ${statusFilter === 'read' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                              onClick={() => setStatusFilter('read')}
                            >
                              Read
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-2">Conversation Type</p>
                          <div className="grid grid-cols-3 border border-gray-200 rounded-lg overflow-hidden divide-x divide-gray-200">
                            <button 
                              className={`py-2 text-sm ${conversationTypeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                              onClick={() => setConversationTypeFilter('all')}
                            >
                              All
                            </button>
                            <button 
                              className={`py-2 text-sm ${conversationTypeFilter === 'individual' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                              onClick={() => setConversationTypeFilter('individual')}
                            >
                              Individual
                            </button>
                            <button 
                              className={`py-2 text-sm ${conversationTypeFilter === 'community' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
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
          
          {/* Active Filters Display */}
          <div className="px-4 pb-3 flex flex-wrap gap-2">
            <div className="inline-flex items-center bg-blue-50 text-blue-700 rounded-full px-2 py-1 text-xs">
              <span>{patientViewFilter === 'my' ? 'My Patients' : 'All Patients'}</span>
              {patientViewFilter !== 'my' && (
                <button 
                  onClick={() => setPatientViewFilter('my')}
                  className="ml-1 hover:text-blue-900"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="inline-flex items-center bg-blue-50 text-blue-700 rounded-full px-2 py-1 text-xs">
              <span>{selectedStatusOption || 'All Status'}</span>
              {selectedStatusOption && (
                <button 
                  onClick={() => setSelectedStatusOption(null)}
                  className="ml-1 hover:text-blue-900"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="inline-flex items-center bg-blue-50 text-blue-700 rounded-full px-2 py-1 text-xs">
              <span>{conversationTypeFilter === 'all' ? 'All Conversation Types' : conversationTypeFilter.charAt(0).toUpperCase() + conversationTypeFilter.slice(1)}</span>
              {conversationTypeFilter !== 'all' && (
                <button 
                  onClick={() => setConversationTypeFilter('all')}
                  className="ml-1 hover:text-blue-900"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
          
          {/* Search bar */}
          <div className="px-4 pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-colors"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto custom-scrollbar border-t border-gray-100">
            {conversationsState.map(conversation => (
              <div
                key={conversation.id}
                className="relative group"
              >
                <button
                  className={`w-full p-3 flex items-center border-b border-gray-100 hover:bg-gray-50 ${
                    selectedConversation === conversation.id ? 'bg-blue-50' : ''
                  } ${!conversation.isRead ? 'bg-blue-50/50' : ''}`}
                  onClick={() => handleConversationClick(conversation.id)}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-3">
                    {conversation.initial}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex justify-between items-center pr-7">
                      <span className={`text-sm ${!conversation.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {getDisplayName(conversation)}
                      </span>
                      <div className="flex items-center gap-2">
                        {conversation.unreadCount > 0 && (
                          <span className="h-2 w-2 bg-red-500 rounded-full"></span>
                        )}
                        <span className="text-xs text-gray-500">{conversation.time}</span>
                      </div>
                    </div>
                    {conversation.lastMessage && (
                      <p className={`text-xs ${!conversation.isRead ? 'text-gray-900' : 'text-gray-500'} truncate`}>
                        {conversation.lastMessage}
                      </p>
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
        <div className={`flex-1 flex flex-col ${isDraftCollapsed ? 'mr-0' : ''} h-[calc(100vh-64px)] overflow-hidden`}>
          {/* Chat header */}
          <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0 sticky top-0 z-10">
            <div className="font-medium">
              {selectedConversation && getDisplayName(conversations.find(c => c.id === selectedConversation))}
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
          <div className="flex-1 overflow-y-auto bg-gray-50 min-h-0">
            <div className="p-4">
              {selectedConversation && messages[selectedConversation]?.map(message => (
                <div key={message.id} className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : ''}`}>
                  {message.sender === 'patient' && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-2 flex-shrink-0">
                      {message.initial}
                    </div>
                  )}
                  <div className={`flex-1 max-w-[80%] ${message.sender === 'user' ? 'ml-auto' : ''}`}>
                    <div className={`flex items-center mb-1 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                      <span className="text-sm font-medium mr-2">{message.name}</span>
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                    </div>
                    <div className={`group relative p-3 rounded-lg ${
                      message.sender === 'patient' 
                        ? 'bg-white border border-gray-200' 
                        : message.sender === 'system'
                        ? 'bg-gray-100 border border-gray-200'
                        : 'bg-blue-600 text-white'
                    }`}>
                      {message.isDeleted ? (
                        <div className="italic text-gray-500 text-sm">
                          Message deleted at {message.deletedAt}
                        </div>
                      ) : (
                        <>
                          {message.content}
                          {message.sender === 'user' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMessage(message.id, selectedConversation!);
                              }}
                              className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4 text-gray-500" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium ml-2 flex-shrink-0">
                      {message.initial}
                    </div>
                  )}
                </div>
              ))}
              
              {(!selectedConversation || !messages[selectedConversation] || messages[selectedConversation].length === 0) && (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                  <p>You haven't sent or received a message yet.</p>
                  <p>Enter a message below and press "Send."</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Message input area */}
          <div className="bg-white border-t border-gray-200 sticky bottom-0 z-10">
            {/* Formatting toolbar */}
            <div className="flex items-center gap-6 px-6 h-12 border-b border-gray-200">
              <button className="hover:bg-gray-100 rounded p-1.5">
                <Bold className="h-4 w-4 text-gray-700" />
              </button>
              <button className="hover:bg-gray-100 rounded p-1.5">
                <Italic className="h-4 w-4 text-gray-700" />
              </button>
              <button className="hover:bg-gray-100 rounded p-1.5">
                <Underline className="h-4 w-4 text-gray-700" />
              </button>
              <button className="hover:bg-gray-100 rounded p-1.5">
                <List className="h-4 w-4 text-gray-700" />
              </button>
              <button className="hover:bg-gray-100 rounded p-1.5">
                <Link2 className="h-4 w-4 text-gray-700" />
              </button>
              <button className="hover:bg-gray-100 rounded p-1.5">
                <PlayCircle className="h-4 w-4 text-gray-700" />
              </button>
              <button className="hover:bg-gray-100 rounded p-1.5">
                <Lightbulb className="h-4 w-4 text-gray-700" />
              </button>
            </div>

            {/* Text area */}
            <div className="p-4">
              <textarea
                placeholder="Enter a message here..."
                className="w-full h-[100px] px-4 py-3 text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
            </div>

            {/* Bottom toolbar */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
              {/* Left side - attachment buttons */}
              <div className="flex items-center gap-4">
                <button className="text-blue-600 hover:bg-gray-100 rounded p-1.5">
                  <Image className="h-5 w-5" />
                </button>
                <button className="text-blue-600 hover:bg-gray-100 rounded p-1.5">
                  <Film className="h-5 w-5" />
                </button>
                <button className="text-blue-600 hover:bg-gray-100 rounded p-1.5">
                  <Paperclip className="h-5 w-5" />
                </button>
              </div>

              {/* Right side - mic and send */}
              <div className="flex items-center gap-4">
                <button className="text-blue-600 hover:bg-gray-100 rounded p-1.5">
                  <Mic className="h-5 w-5" />
                </button>
                <button
                  onClick={handleSendMessage}
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
            <div className="flex items-center p-4 border-b border-gray-200 h-14">
              <button
                onClick={() => setIsDraftCollapsed(!isDraftCollapsed)}
                className="hover:bg-gray-100 rounded-full transition-colors"
              >
                {isDraftCollapsed ? (
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                )}
              </button>
              {!isDraftCollapsed && (
                <h2 className="font-medium text-lg ml-2">
                  Draft Chats for {selectedConversation && conversations.find(c => c.id === selectedConversation)?.patientName.split(' ')[0]}
                </h2>
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

        {/* New Chat Modal */}
        {showNewChatModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[500px] max-h-[600px] flex flex-col">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">New Chat</h2>
                <button
                  onClick={() => {
                    setShowNewChatModal(false);
                    setSearchPatientQuery('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search patients by name or MRN..."
                    value={searchPatientQuery}
                    onChange={(e) => setSearchPatientQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {filteredPatients.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No patients found
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredPatients.map((patient) => (
                      <button
                        key={patient.id}
                        onClick={() => handleStartNewChat(patient)}
                        className="w-full p-3 flex items-center justify-between hover:bg-gray-50 rounded-lg group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="text-left">
                            <div className="font-medium">{patient.name}</div>
                            <div className="text-sm text-gray-500">
                              DOB: {new Date(patient.dateOfBirth).toLocaleDateString()} • MRN: {patient.mrn}
                            </div>
                          </div>
                        </div>
                        <MessageSquarePlus className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;