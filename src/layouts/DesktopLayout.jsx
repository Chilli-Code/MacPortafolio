import useWindowStore from "#store/window";
import { Suspense } from "react";
import { Navbar, Welcome, Dock } from "#components/Desktop";
import { Terminal, Safari, Profile, Settings, Resume,Finder,  Contact, Galery, Text, Chat, ImageWindowContent } from "#components/Desktop/windows/";

const DesktopLayout = ({ user, onLogout }) => {
  const windows = useWindowStore(state => state.windows);
  return (
    <main>
      <Navbar onLogout={onLogout} user={user} />
      <Welcome />
      <Dock />
      
      <Suspense fallback={null}>
        {windows.terminal?.isOpen && <Terminal />}
        {windows.safari?.isOpen && <Safari />}
        {windows.finder?.isOpen && <Finder />}
        {windows.contact?.isOpen && <Contact />}
        {windows.galery?.isOpen && <Galery />}
        {windows.profile?.isOpen && <Profile />}
        {windows.imgfile?.isOpen && <ImageWindowContent />}
        {windows.settings?.isOpen && <Settings />}
        {windows.resume?.isOpen && <Resume />}
        {windows.txtfile?.isOpen && <Text />}
        {windows.chat?.isOpen && <Chat />}
      </Suspense>
    </main>
  );
};

export default DesktopLayout;