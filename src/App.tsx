import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import Contact from './components/Contact';

function App() {
  return (
    // Este div principal es ideal para aplicar un fondo oscuro global más adelante
    <div className="min-h-screen bg-gray-900 text-white"> 
      <Hero />
      <AboutUs />
      <Services />
      <Contact />
    </div>
  );
}

export default App;