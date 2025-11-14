import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Products from "./components/Products/Products";
import ProductSegmentsModal from "./components/ProductSegmentsModal/ProductSegmentsModal";
import Brands from "./components/Brands/Brands";
import Clients from "./components/Clients/Clients";
import WhyChooseUs from "./components/WhyChooseUs/WhyChooseUs";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import "./App.css";

function App() {
  const sectionsRef = useRef<HTMLElement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.1,
      },
    );

    const currentSections = sectionsRef.current;

    currentSections.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      currentSections.forEach((section) => {
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <div className="App">
      <Navbar />
      <Hero />
      <main>
        <About ref={addToRefs} />
        <Products ref={addToRefs} onOpenModal={() => setIsModalOpen(true)} />
        <Brands ref={addToRefs} />
        <Clients ref={addToRefs} />
        <WhyChooseUs ref={addToRefs} />
        <Contact ref={addToRefs} />
      </main>
      <Footer />
      <ProductSegmentsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default App;
