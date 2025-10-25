import AboutHero from "./components/AboutHero";
import Mission from "./components/Mission";
import Values from "./components/Values";
import Stats from "./components/Stats";
import Team from "./components/Team";
import ContactSection from "./components/ContactSection";

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Gradient Background */}
      <div className="bg-linear-to-br from-blue-600 via-purple-600 to-indigo-700">
        <AboutHero />
      </div>

      {/* Mission Section - White Background */}
      <div className="bg-white">
        <Mission />
      </div>

      {/* Values Section - Light Gray Background */}
      <Values />

      {/* Stats Section - Blue Gradient Background */}
      <Stats />

      {/* Team Section - White Background */}
      <Team />

      {/* Contact Section - Gray Background */}
      <ContactSection />
    </div>
  );
};

export default AboutPage;
