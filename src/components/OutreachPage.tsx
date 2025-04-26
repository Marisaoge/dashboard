import React, { useState, useEffect } from 'react';
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
  Filter,
  Settings,
  X
} from 'lucide-react';
import NewTextMessageModal from './NewTextMessageModal';
import { useUnreadCount } from '../contexts/UnreadCountContext';

interface Conversation {
  id: string;
  name: string;
  initial: string;
  lastMessage: string;
  time: string;
  unread: boolean;
}

interface Message {
  id: string;
  sender: 'user' | 'patient' | 'system';
  initial: string;
  name: string;
  content: string;
  timestamp: string;
  isAutomated?: boolean;
}

interface EmailTemplate {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface AutoResponseSettings {
  enabled: boolean;
  message: string;
}

const OutreachPage: React.FC = () => {
  // Sample conversations data
  const conversations: Conversation[] = [
    {
      id: 'joe',
      name: 'Joe Smith',
      initial: 'J',
      lastMessage: 'Hi Joseph. Thank you for your...',
      time: '50m',
      unread: true
    },
    {
      id: 'janet',
      name: 'Janet Twist',
      initial: 'J',
      lastMessage: 'Thank you for your help! Will s...',
      time: '4d',
      unread: false
    },
    {
      id: 'sarah',
      name: 'Sarah Johnson',
      initial: 'S',
      lastMessage: 'I completed my daily check-in...',
      time: '2h',
      unread: true
    },
    {
      id: 'michael',
      name: 'Michael Chen',
      initial: 'M',
      lastMessage: 'Yes, I received the new device...',
      time: '1h',
      unread: false
    },
    {
      id: 'emma',
      name: 'Emma Williams',
      initial: 'E',
      lastMessage: 'My blood pressure today was...',
      time: '3h',
      unread: true
    },
    {
      id: 'david',
      name: 'David Martinez',
      initial: 'D',
      lastMessage: 'The new medication schedule is...',
      time: '5h',
      unread: false
    },
    {
      id: 'lisa',
      name: 'Lisa Anderson',
      initial: 'L',
      lastMessage: 'Thanks for checking in on me...',
      time: '1d',
      unread: false
    },
    {
      id: 'robert',
      name: 'Robert Taylor',
      initial: 'R',
      lastMessage: 'I have a question about the...',
      time: '2d',
      unread: true
    },
    {
      id: 'patricia',
      name: 'Patricia Garcia',
      initial: 'P',
      lastMessage: 'My symptoms have improved since...',
      time: '3d',
      unread: false
    },
    {
      id: 'james',
      name: 'James Wilson',
      initial: 'J',
      lastMessage: 'Can we reschedule my appointment...',
      time: '5d',
      unread: false
    },
    {
      id: 'maria',
      name: 'Maria Rodriguez',
      initial: 'M',
      lastMessage: 'The exercise program is going well...',
      time: '1w',
      unread: false
    },
    {
      id: 'thomas',
      name: 'Thomas Lee',
      initial: 'T',
      lastMessage: 'I logged all my meals for today...',
      time: '1w',
      unread: false
    }
  ];

  // Sample messages for conversations
  const initialMessages: Record<string, Message[]> = {
    janet: [
      {
        id: '1',
        sender: 'patient',
        initial: 'J',
        name: 'Janet Twist',
        content: 'Hello, I need to ask about my blood pressure readings from yesterday.',
        timestamp: '3:45 PM'
      },
      {
        id: '2',
        sender: 'system',
        initial: 'M',
        name: 'Motiv',
        content: 'Thank you for your message. This is an automated reply from Motiv. For emergencies, call 911. Messages sent outside 8 AM–4 PM EST will be answered within 1 business day.',
        timestamp: '3:45 PM',
        isAutomated: true
      },
      {
        id: '3',
        sender: 'user',
        initial: 'M',
        name: 'Motiv',
        content: 'Hi Janet, I can help you with that. Your readings from yesterday were within the normal range. Is there something specific you\'re concerned about?',
        timestamp: '3:50 PM'
      },
      {
        id: '4',
        sender: 'patient',
        initial: 'J',
        name: 'Janet Twist',
        content: 'Yes, I noticed the systolic number was a bit higher than usual.',
        timestamp: '4:02 PM'
      },
      {
        id: '5',
        sender: 'system',
        initial: 'M',
        name: 'Motiv',
        content: 'Thank you for your message. This is an automated reply from Motiv. For emergencies, call 911. Messages sent outside 8 AM–4 PM EST will be answered within 1 business day.',
        timestamp: '4:02 PM',
        isAutomated: true
      },
      {
        id: '6',
        sender: 'user',
        initial: 'M',
        name: 'Motiv',
        content: 'A slight variation is normal throughout the day. As long as it stays below 140, there\'s no immediate concern. Keep monitoring and let me know if you see it go above that level.',
        timestamp: '4:05 PM'
      }
    ],
    joe: [
      {
        id: '1',
        sender: 'patient',
        initial: 'J',
        name: 'Joe Smith',
        content: 'Hi, I received my new blood pressure monitor today.',
        timestamp: '10:15 AM'
      },
      {
        id: '2',
        sender: 'user',
        initial: 'M',
        name: 'Motiv',
        content: 'Great! Let me know how your new device works out, and have a great weekend!',
        timestamp: '10:30 AM'
      }
    ],
    sarah: [
      {
        id: '1',
        sender: 'patient',
        initial: 'S',
        name: 'Sarah Johnson',
        content: 'I completed my daily check-in and logged all my measurements.',
        timestamp: '2:30 PM'
      },
      {
        id: '2',
        sender: 'user',
        initial: 'M',
        name: 'Motiv',
        content: 'Excellent work, Sarah! Keep up the great progress. How are you feeling today?',
        timestamp: '2:45 PM'
      }
    ],
    michael: [
      {
        id: '1',
        sender: 'user',
        initial: 'M',
        name: 'Motiv',
        content: 'Hi Michael, did you receive your new monitoring device?',
        timestamp: '11:30 AM'
      },
      {
        id: '2',
        sender: 'patient',
        initial: 'M',
        name: 'Michael Chen',
        content: 'Yes, I received the new device. The setup instructions were very helpful.',
        timestamp: '12:15 PM'
      }
    ],
    emma: [
      {
        id: '1',
        sender: 'patient',
        initial: 'E',
        name: 'Emma Williams',
        content: 'My blood pressure reading today was 128/82.',
        timestamp: '9:15 AM'
      },
      {
        id: '2',
        sender: 'user',
        initial: 'M',
        name: 'Motiv',
        content: 'That\'s great Emma! Your readings are showing good improvement. Keep following your treatment plan.',
        timestamp: '9:30 AM'
      }
    ],
    david: [
      {
        id: '1',
        sender: 'user',
        initial: 'M',
        name: 'Motiv',
        content: 'I\'ve updated your medication schedule in the app. Please review it when you have a chance.',
        timestamp: '1:20 PM'
      },
      {
        id: '2',
        sender: 'patient',
        initial: 'D',
        name: 'David Martinez',
        content: 'Thank you, I\'ll check it right now.',
        timestamp: '1:45 PM'
      }
    ]
  };

  const [activeTab, setActiveTab] = useState<'text' | 'email'>('text');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string>('janet');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('client-invite');
  const [emailSubject, setEmailSubject] = useState('Please ignore this email');
  const [emailTo, setEmailTo] = useState('');
  const [emailContent, setEmailContent] = useState(
    'Apologies this email was sent to you by accident, please don\'t click on the "Accept Invite" button in this email.\n\n' +
    'Look out for the correct email: You should soon receive a separate email from hello@withmotiv.com entitled "Welcome to Endeavor Health\'s Virtual Cardiac Wellness, powered by Motiv! Create your account now." Please check your main inbox and your Spam folder just in case.\n\n' +
    'Next Steps: Please follow the instructions in the correct email to create and log into your Motiv Account.\n\n' +
    'If you have any questions or need further assistance, please contact us at 1-855-542-1232 or hello@withmotiv.com.'
  );
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filterType, setFilterType] = useState<'my-patients' | 'all-patients'>('my-patients');
  const [conversationMessages, setConversationMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [conversationsState, setConversationsState] = useState<Conversation[]>(conversations);
  const [showSettings, setShowSettings] = useState(false);
  const [autoResponseSettings, setAutoResponseSettings] = useState<AutoResponseSettings>({
    enabled: true,
    message: 'Thank you for your message. This is an automated reply from Motiv. For emergencies, call 911. Messages sent outside 8 AM–4 PM EST will be answered within 1 business day.'
  });
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const { updateOutreachUnreadCount } = useUnreadCount();
  
  // Email templates
  const emailTemplates: EmailTemplate[] = [
    {
      id: 'client-invite',
      name: 'Client Invite',
      icon: <Users className="h-6 w-6 text-white" />,
      description: 'Invite a new client to join Motiv'
    },
    {
      id: 'appointment-confirmed',
      name: 'Appointment Confirmed',
      icon: <Calendar className="h-6 w-6 text-blue-600" />,
      description: 'Confirm an appointment with a client'
    },
    {
      id: 'appointment-reminder',
      name: 'Appointment Reminder',
      icon: <Bell className="h-6 w-6 text-blue-600" />,
      description: 'Remind a client about an upcoming appointment'
    },
    {
      id: 'embeddable-appointment',
      name: 'Embeddable Appointment Created',
      icon: <Calendar className="h-6 w-6 text-blue-600" />,
      description: 'Notify a client about an embeddable appointment'
    },
    {
      id: 'package-purchased',
      name: 'Package Purchased',
      icon: <Package className="h-6 w-6 text-blue-600" />,
      description: 'Confirm a package purchase'
    },
    {
      id: 'program-emails',
      name: 'Program Emails',
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      description: 'Send program-related information'
    },
    {
      id: 'reactivation-emails',
      name: 'Reactivation Emails',
      icon: <RefreshCw className="h-6 w-6 text-blue-600" />,
      description: 'Reactivate a client account'
    }
  ];

  // Calculate total unread count
  const totalUnreadCount = conversationsState.reduce((sum, conversation) => 
    sum + (conversation.unread ? 1 : 0), 0
  );

  // Update unread count in context whenever it changes
  useEffect(() => {
    updateOutreachUnreadCount(totalUnreadCount);
  }, [totalUnreadCount, updateOutreachUnreadCount]);

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversation(conversationId);
    // Mark conversation as read when clicked
    setConversationsState(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unread: false }
          : conv
      )
    );
  };

  // Filter conversations based on search query and filter type
  const filteredConversations = conversationsState.filter(conversation => {
    const matchesSearch = conversation.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterType === 'my-patients') {
      return matchesSearch && ['janet', 'joe'].includes(conversation.id);
    }
    return matchesSearch;
  });

  const handleSendMessage = () => {
    if (messageInput.trim() === '' || !selectedConversation) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      initial: 'M',
      name: 'Motiv',
      content: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    };

    setConversationMessages(prev => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), newMessage]
    }));
    
    setMessageInput('');
  };

  const handleSaveTemplate = () => {
    // In a real app, you would save the template to an API
    alert('Template saved successfully!');
  };

  const handleSendEmail = () => {
    // In a real app, you would send the email to an API
    alert('Email sent successfully!');
  };

  const handlePatientMessage = (conversationId: string, message: Message) => {
    // Add the patient's message
    setConversationMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), message]
    }));

    // If auto-response is enabled, add the automated response
    if (autoResponseSettings.enabled) {
      const autoResponse: Message = {
        id: Date.now().toString(),
        sender: 'system',
        initial: 'M',
        name: 'Motiv',
        content: autoResponseSettings.message,
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        isAutomated: true
      };

      // Add the auto-response after a short delay to simulate system processing
      setTimeout(() => {
        setConversationMessages(prev => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), autoResponse]
        }));
      }, 1000);
    }
  };

  const handleMarkAsUnread = () => {
    if (selectedConversation) {
      setConversationsState(prev => 
        prev.map(conv => 
          conv.id === selectedConversation 
            ? { ...conv, unread: true }
            : conv
        )
      );
      setShowMoreOptions(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      <div className="flex flex-1 min-h-0">
        {/* Left panel - Conversation list or Template list */}
        <div className="w-96 border-r border-gray-200 bg-white flex flex-col min-h-0">
          <div className="border-b border-gray-200 bg-white z-10">
            <div className="flex p-4">
              <h2 className="text-lg font-medium text-gray-900">Text Messages</h2>
              <button
                onClick={() => setShowSettings(true)}
                className="ml-auto p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {activeTab === 'text' ? (
            <>
              {/* Search and filter */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between gap-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search by name"
                      className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                      className="flex items-center justify-center p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                    >
                      <Filter className="h-5 w-5" />
                    </button>
                    {showFilterDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <button
                          className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${filterType === 'my-patients' ? 'text-blue-600' : 'text-gray-700'}`}
                          onClick={() => {
                            setFilterType('my-patients');
                            setShowFilterDropdown(false);
                          }}
                        >
                          My Patients
                        </button>
                        <button
                          className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${filterType === 'all-patients' ? 'text-blue-600' : 'text-gray-700'}`}
                          onClick={() => {
                            setFilterType('all-patients');
                            setShowFilterDropdown(false);
                          }}
                        >
                          All Patients
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowNewMessageModal(true)}
                    className="flex items-center justify-center p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Conversation list */}
              <div className="flex-1 overflow-y-auto min-h-0">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    className={`w-full p-4 flex items-center border-b border-gray-100 hover:bg-gray-50 ${
                      selectedConversation === conversation.id ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => handleConversationClick(conversation.id)}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-3">
                      {conversation.initial}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex justify-between items-center">
                        <span className={`font-medium ${conversation.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                          {conversation.name}
                        </span>
                        <div className="flex items-center gap-2">
                          {conversation.unread && (
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          )}
                          <span className={`text-sm ${conversation.unread ? 'text-gray-900' : 'text-gray-500'}`}>
                            {conversation.time}
                          </span>
                        </div>
                      </div>
                      <p className={`text-sm truncate ${conversation.unread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 p-4">
              <div className="flex justify-end mb-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                  <span>New Email from Template</span>
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {emailTemplates.map((template) => (
                  <button
                    key={template.id}
                    className={`flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 ${
                      selectedTemplate === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 ${
                      template.id === 'client-invite' ? 'bg-blue-600' : 'bg-white border border-blue-200'
                    }`}>
                      {template.icon}
                    </div>
                    <div className="text-sm font-medium text-center">{template.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Right panel - Messages or Email Template Editor */}
        <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden">
          {activeTab === 'text' ? (
            selectedConversation ? (
              <>
                {/* Conversation header */}
                <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-3">
                      {conversations.find(c => c.id === selectedConversation)?.initial || '?'}
                    </div>
                    <div>
                      <div className="font-medium">{conversations.find(c => c.id === selectedConversation)?.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                      <Info className="h-5 w-5" />
                    </button>
                    <div className="relative">
                      <button 
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                        onClick={() => setShowMoreOptions(!showMoreOptions)}
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                      {showMoreOptions && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                            onClick={handleMarkAsUnread}
                          >
                            Mark as Unread
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Messages container */}
                <div className="flex-1 overflow-y-auto min-h-0">
                  <div className="p-4 space-y-4">
                    {conversationMessages[selectedConversation]?.map((message) => (
                      <div key={message.id} className={`mb-4 flex ${message.sender === 'user' || message.sender === 'system' ? 'justify-end' : ''}`}>
                        {message.sender === 'patient' && (
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-2 flex-shrink-0">
                            {message.initial}
                          </div>
                        )}
                        <div className={`flex-1 max-w-[80%] ${message.sender === 'user' || message.sender === 'system' ? 'ml-auto' : ''}`}>
                          <div className={`flex items-center mb-1 ${message.sender === 'user' || message.sender === 'system' ? 'justify-end' : ''}`}>
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
                            {message.sender !== 'user' && (
                              <div className="font-medium text-sm mb-1 flex items-center">
                                {message.name}
                                {message.isAutomated && (
                                  <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                                    Automated Response
                                  </span>
                                )}
                              </div>
                            )}
                            {message.sender === 'user' && (
                              <div className="font-medium text-sm mb-1 text-blue-100">
                                Motiv
                              </div>
                            )}
                            <div className="whitespace-pre-line">{message.content}</div>
                          </div>
                        </div>
                        {(message.sender === 'user' || message.sender === 'system') && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium ml-2 flex-shrink-0">
                            {message.initial}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Date separator */}
                    <div className="flex items-center justify-center my-4">
                      <div className="bg-gray-200 text-gray-500 text-xs px-3 py-1 rounded-full">
                        Tuesday, October 3, 2023
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Message input */}
                <div className="bg-white border-t border-gray-200 p-4">
                  <div className="relative">
                    <textarea
                      placeholder="Type your message..."
                      className="w-full border border-gray-300 rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={2}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    ></textarea>
                    <button 
                      className="absolute right-3 bottom-3 text-blue-600 hover:text-blue-800"
                      onClick={handleSendMessage}
                    >
                      <Send className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p className="mb-4">Select a conversation or start a new one</p>
                <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  <Plus className="h-5 w-5 mr-2" />
                  New Message
                </button>
              </div>
            )
          ) : (
            <div className="flex-1 flex flex-col">
              {/* Email template header */}
              <div className="bg-blue-600 p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-white text-lg font-medium flex items-center">
                    Client Invite <HelpCircle className="h-4 w-4 ml-2" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100"
                    onClick={handleSaveTemplate}
                  >
                    Save Template
                  </button>
                  <button 
                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 flex items-center"
                    onClick={handleSendEmail}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Send
                  </button>
                </div>
              </div>
              
              {/* Email template editor */}
              <div className="flex-1 bg-gray-100 p-4">
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="patient@example.com"
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <div className="flex">
                      <select className="border border-gray-300 rounded-l-md px-3 py-2 bg-white text-sm">
                        <option>Custom</option>
                      </select>
                      <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-r-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <input
                        type="text"
                        className="border border-gray-300 rounded-md px-3 py-1 mr-2 w-20 text-sm"
                        placeholder="Hi"
                      />
                      <span className="text-gray-600 text-sm">(Client's First Name),</span>
                    </div>
                    
                    <div className="border border-gray-200 rounded-md mb-4">
                      <div className="flex items-center border-b border-gray-200 px-2 py-1">
                        <button className="p-1 text-gray-500 hover:text-gray-700">
                          <Bold className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-gray-700">
                          <Italic className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-gray-700">
                          <Underline className="h-4 w-4" />
                        </button>
                        <span className="mx-1 text-gray-300">|</span>
                        <select className="text-sm border-none focus:ring-0 py-1 px-2">
                          <option>Normal</option>
                        </select>
                        <span className="mx-1 text-gray-300">|</span>
                        <button className="p-1 text-gray-500 hover:text-gray-700">
                          <List className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-gray-700">
                          <AlignLeft className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-gray-700">
                          <AlignCenter className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-gray-700">
                          <AlignRight className="h-4 w-4" />
                        </button>
                        <span className="mx-1 text-gray-300">|</span>
                        <button className="p-1 text-gray-500 hover:text-gray-700">
                          <Link2 className="h-4 w-4" />
                        </button>
                      </div>
                      <textarea
                        className="w-full p-3 border-none focus:ring-0 resize-none"
                        rows={12}
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <NewTextMessageModal
        isOpen={showNewMessageModal}
        onClose={() => setShowNewMessageModal(false)}
        onSelectPatient={(patient) => {
          // Set the selected conversation to show the patient's messages
          setSelectedConversation(patient.id);
          // Close the modal
          setShowNewMessageModal(false);
          // Clear any existing search query
          setSearchQuery('');
        }}
      />

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Text Message Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Automated Response</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoResponseSettings.enabled}
                      onChange={(e) => setAutoResponseSettings(prev => ({
                        ...prev,
                        enabled: e.target.checked
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <textarea
                  value={autoResponseSettings.message}
                  onChange={(e) => setAutoResponseSettings(prev => ({
                    ...prev,
                    message: e.target.value
                  }))}
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter automated response message..."
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowSettings(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutreachPage;