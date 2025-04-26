import React, { createContext, useContext, useState, useEffect } from 'react';

interface UnreadCountContextType {
  chatUnreadCount: number;
  outreachUnreadCount: number;
  updateChatUnreadCount: (count: number) => void;
  updateOutreachUnreadCount: (count: number) => void;
}

const UnreadCountContext = createContext<UnreadCountContextType>({
  chatUnreadCount: 0,
  outreachUnreadCount: 0,
  updateChatUnreadCount: () => {},
  updateOutreachUnreadCount: () => {},
});

export const useUnreadCount = () => useContext(UnreadCountContext);

export const UnreadCountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatUnreadCount, setChatUnreadCount] = useState(0);
  const [outreachUnreadCount, setOutreachUnreadCount] = useState(0);

  const updateChatUnreadCount = (count: number) => {
    setChatUnreadCount(count);
  };

  const updateOutreachUnreadCount = (count: number) => {
    setOutreachUnreadCount(count);
  };

  return (
    <UnreadCountContext.Provider
      value={{
        chatUnreadCount,
        outreachUnreadCount,
        updateChatUnreadCount,
        updateOutreachUnreadCount,
      }}
    >
      {children}
    </UnreadCountContext.Provider>
  );
}; 