import React, { useState } from 'react';
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
  HelpCircle
} from 'lucide-react';

interface Conversation {
  id: string;
  name: string;
  initial: string;
  lastMessage: string;
  time: string;
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

const OutreachPage: React.FC = () => {
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
  
  // Sample conversations data
  const conversations: Conversation[] = [
    {
      id: 'joe',
      name: 'Joe Smith',
      initial: 'J',
      lastMessage: 'Hi Joseph. Thank you for your...',
      time: '50m'
    },
    {
      id: 'janet',
      name: 'Janet Twist',
      initial: 'J',
      lastMessage: 'Thank you for your help! Will s...',
      time: '4d'
    },
    {
      id: 'janet2',
      name: 'Janet Twist',
      initial: 'J',
      lastMessage: 'I am also including in that sa...',
      time: '4d'
    },
    {
      id: 'janet3',
      name: 'Janet Twist',
      initial: 'K',
      lastMessage: 'Thank you!',
      time: '4d'
    },
    {
      id: 'janet4',
      name: 'Janet Twist',
      initial: 'M',
      lastMessage: 'I am also including in that sa...',
      time: '4d'
    },
    {
      id: 'janet5',
      name: 'Janet Twist',
      initial: 'E',
      lastMessage: 'I am also including in that sa...',
      time: '4d'
    },
    {
      id: 'janet6',
      name: 'Janet Twist',
      initial: 'E',
      lastMessage: 'I am also including in that sa...',
      time: '4d'
    }
  ];

  // Sample messages for the selected conversation
  const messages: Record<string, Message[]> = {
    janet: [
      {
        id: '1',
        sender: 'user',
        initial: 'M',
        name: 'Marisa Oge',
        content: 'I am also including in that same box a return label to return the old blood pressure device at your earliest convenience. Thanks again!',
        timestamp: '3:45 PM'
      },
      {
        id: '2',
        sender: 'patient',
        initial: 'J',
        name: 'Janet Twist',
        content: 'Ok thanks',
        timestamp: '4:02 PM'
      },
      {
        id: '3',
        sender: 'system',
        initial: 'M',
        name: 'Motiv',
        content: 'Thank you for your response. This is an automated message from Motiv. If this is a medical emergency, please contact 911.\nIf you have any questions, please message your Coach using the chat feature in the Motiv app or click here: www.withmotiv.com. Chat messages sent outside the normal business hours of 8am-4pm EST will be responded to within 1 business day, or the next business day if sent on the weekend.\nIf you are interested in enrolling with Motiv but haven\'t yet, please call us at: 1-855-542-1232.',
        timestamp: '3d ago',
        isAutomated: true
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
        name: 'Marisa Oge',
        content: 'Great! Let me know how your new device works out, and have a great weekend!',
        timestamp: '10:30 AM'
      }
    ]
  };

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

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation => 
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageInput.trim() === '') return;
    
    // In a real app, you would send the message to an API
    // and then update the UI after a successful response
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

  return (
    <div className="flex-1 flex flex-col w-full">
      

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Conversation list or Template list */}
        <div className="w-96 border-r border-gray-200 bg-white flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold mb-4">Outreach</h1>
            
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  className={`px-6 py-2 text-sm font-medium ${
                    activeTab === 'text'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('text')}
                >
                  Text
                </button>
                <button
                  className={`px-6 py-2 text-sm font-medium ${
                    activeTab === 'email'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('email')}
                >
                  Email
                </button>
              </div>
            </div>
          </div>
          
          {activeTab === 'text' ? (
            <>
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name"
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              {/* Conversation list */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    className={`w-full p-4 flex items-center border-b border-gray-100 hover:bg-gray-50 ${
                      selectedConversation === conversation.id ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-3">
                      {conversation.initial}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex justify-between">
                        <span className="font-medium">{conversation.name}</span>
                        <span className="text-sm text-gray-500">{conversation.time}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
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
        <div className="flex-1 flex flex-col bg-gray-50">
          {activeTab === 'text' ? (
            selectedConversation ? (
              <>
                {/* Conversation header */}
                <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
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
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages[selectedConversation]?.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.sender !== 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-2 flex-shrink-0">
                          {message.initial}
                        </div>
                      )}
                      <div className={`max-w-[75%] ${message.sender === 'user' ? 'bg-blue-600 text-white' : message.isAutomated ? 'bg-gray-100 border border-gray-200' : 'bg-white border border-gray-200'} rounded-lg p-3 shadow-sm`}>
                        {message.sender !== 'user' && (
                          <div className="font-medium text-sm mb-1">{message.name}</div>
                        )}
                        <div className="whitespace-pre-line">{message.content}</div>
                        <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'} text-right`}>
                          {message.timestamp}
                        </div>
                      </div>
                      {message.sender === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium ml-2 flex-shrink-0">
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
                
                {/* Message input */}
                <div className="bg-white border-t border-gray-200 p-4">
                  <div className="relative">
                    <textarea
                      placeholder="Type your message..."
                      className="w-full border border-gray-300 rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={2}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
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
    </div>
  );
};

export default OutreachPage;