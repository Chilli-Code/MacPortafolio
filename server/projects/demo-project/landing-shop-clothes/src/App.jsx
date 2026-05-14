import Design from "./components/Design";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import MisitionSection from "./components/MisitionSection";
import ShopSection from "./components/ShopSection";
import TaglineSection from "./components/TaglineSection";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";
const App = () => {

  const contentRef = useRef(null)

  useEffect(() =>{
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
    const smoother = ScrollSmoother.create({
      content: "#smooth-content",
      smooth: 1.8,
      effects: true,

    })

    return () =>{
      smoother && smoother.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill())
    };
  },[])

  return(
  <div id="smooth-content" ref={contentRef} className="min-h-screen bg-white antialiased">
  <h2>Bienvenidosss</h2>
    <Header />
    <HeroSection />
    <TaglineSection />
    <ShopSection />
    <MisitionSection />
    <Design />
    <Footer />
  </div>
  );
};

export default App;
