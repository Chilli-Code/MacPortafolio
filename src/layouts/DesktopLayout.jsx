// src/layouts/DesktopLayout.jsx
import { Suspense } from "react";
import { Navbar, Welcome, Dock } from "#components/Desktop";
import { Terminal, Safari, Profile, Settings, Chat, Finder, Contact, Galery, Resume, Text, ImageWindowContent } from "#components/Desktop/windows";


const DesktopLayout = ({ user, onLogout }) => {
  return (
    <main>
        
      <Navbar onLogout={onLogout} user={user} />
      <Welcome />
      <Dock />
      
      <Suspense fallback={null}>
        <Terminal />
        <Safari />
        <Finder />
        <Contact />
        <Galery />
        <Profile />
        <ImageWindowContent />
        <Settings />
        <Resume />
        <Text />
        <Chat />

      </Suspense>
    </main>
  );
};

export default DesktopLayout;