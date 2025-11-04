'use client'

import AboutHero from "./components/AboutHero";
import Mission from "./components/Mission";
import Values from "./components/Values";
import Stats from "./components/Stats";
import Team from "./components/Team";
import ContactSection from "./components/ContactSection";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <AboutHero />
      <Mission />
      <Values />
      <Stats />
      <Team />
      <ContactSection />
    </div>
  );
};

export default AboutPage;
