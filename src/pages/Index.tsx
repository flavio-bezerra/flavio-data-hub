import Hero from "@/components/Hero";
import About from "@/components/About";
import WhatIsDataScience from "@/components/WhatIsDataScience";
import Portfolio from "@/components/Portfolio";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <WhatIsDataScience />
      <Portfolio />
      <Contact />
    </main>
  );
};

export default Index;
