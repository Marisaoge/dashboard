import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './Home';
import ChatPage from './components/ChatPage';
import CalendarPage from './components/CalendarPage';
import KitsPage from './components/KitsPage';
import FormsPage from './components/FormsPage';
import OutreachPage from './components/OutreachPage';
import Reports from './components/Reports';
import Points from './components/Points';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="kits" element={<KitsPage />} />
          <Route path="forms" element={<FormsPage />} />
          <Route path="outreach" element={<OutreachPage />} />
          <Route path="reports" element={<Reports />} />
          <Route path="points" element={<Points />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;