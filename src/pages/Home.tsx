import Hero from '../components/Hero';
import AboutUs from '../components/AboutUs';
import Services from '../components/Services';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <>
      {/* Mantenemos los IDs para que la Navbar pueda hacer scroll hacia ellos */}
      <div id="inicio">
        <Hero />
      </div>
      
      <div id="nosotros">
        <AboutUs />
      </div>

      <div id="servicios">
        <Services />
      </div>
      
      <div id="contacto">
        <Contact />
      </div>
    </>
  );
}