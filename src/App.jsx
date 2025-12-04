
import { Navbar, Welcome, Dock, Home } from "#components";
import { Terminal, Safari, Resume, Finder, Text, ImageWindowContent, Contact, Galery, Profile, Settings, } from "#windows";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import "./app.css";
gsap.registerPlugin(Draggable);

const App = () =>{
  return(
    <main>
      <Navbar />
      <Welcome />
      <Dock />
      <Terminal />
      <Safari />
      <Resume />
      <Finder />
      <Text />
      <ImageWindowContent />
      <Contact />
      <Home />
      <Galery />
      <Profile />
      <Settings />
    </main>
  )
}

export default App;