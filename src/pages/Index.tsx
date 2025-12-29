import Hero from "@/components/Hero";
import About from "@/components/About";
import WhatIsDataScience from "@/components/WhatIsDataScience";
import Methodology from "@/components/Methodology";
import DataTeam from "@/components/DataTeam";
import RoiCalculator from "@/components/RoiCalculator"; // Importar o novo componente
import Portfolio from "@/components/Portfolio";
import Contact from "@/components/Contact";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Index = () => {
  return (
    <main className="min-h-screen">
      <LanguageSwitcher />
      <Hero />
      <About />
      <WhatIsDataScience />
      <Methodology />
      <DataTeam />
      <RoiCalculator /> {/* Adicionar o componente aqui */}
      <Portfolio />
      <Contact />
    </main>
  );
};

export default Index;