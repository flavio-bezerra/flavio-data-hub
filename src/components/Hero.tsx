import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Linkedin, Github } from "lucide-react";
import profileImage from "@/assets/profile.jpg";
import heroBackground from "@/assets/hero-background.png";

const Hero = () => {
  const [typedText, setTypedText] = useState("");
  const fullText = "Mais que dados, estratégia.|Mais que insights, resultados.";
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  const highlightWords = (text: string) => {
    const sentences = text.split('|');
    return sentences.map((sentence, sentenceIndex) => (
      <div key={sentenceIndex}>
        {sentence.split(' ').map((word, index) => {
          const cleanWord = word.replace(/[.,]/g, '');
          if (cleanWord === 'estratégia') {
            return (
              <span key={index} className="text-gold">
                {word}{' '}
              </span>
            );
          }
          if (cleanWord === 'resultados') {
            return (
              <span key={index} className="text-primary">
                {word}{' '}
              </span>
            );
          }
          return <span key={index}>{word} </span>;
        })}
      </div>
    ));
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.75), rgba(17, 24, 39, 0.75)), url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="container mx-auto px-4 py-20 z-10">
        <div className="flex flex-col items-center text-center space-y-8 animate-fade-in-up">
          {/* Profile Image */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-gold rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <img
              src={profileImage}
              alt="Flávio Bezerra"
              className="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover border-4 border-background shadow-2xl"
            />
          </div>

          {/* Name */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground">
              Flávio Menegueço Bezerra
            </h1>
          </div>

          {/* Typing Tagline */}
          <div className="min-h-[4rem] flex items-center">
            <p className="text-3xl md:text-4xl lg:text-5xl font-script text-foreground">
              {highlightWords(typedText.replace('|', ''))}
              <span className="animate-pulse">|</span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center pt-8">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-primary/50"
              asChild
            >
              <a
                href="https://www.linkedin.com/in/flavio-m-bezerra"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="mr-2 h-5 w-5" />
                LinkedIn
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transform hover:scale-105 transition-all duration-200"
              asChild
            >
              <a
                href="https://github.com/flavio-bezerra"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gold text-gold hover:bg-gold hover:text-background transform hover:scale-105 transition-all duration-200"
              asChild
            >
              <a
                href="https://flaviombezerra.medium.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                </svg>
                Medium
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
