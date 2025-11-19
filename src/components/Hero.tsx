import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Linkedin, Github } from "lucide-react";
import profileImage from "@/assets/profile.jpg";
import heroBackground from "@/assets/hero-background.png";
import { motion } from "framer-motion";

const Hero = () => {
  const fullText = "Mais que dados, estratégia.|Mais que insights, resultados.";

  const highlightWords = (text: string) => {
    const sentences = text.split("|");
    return sentences.map((sentence, sentenceIndex) => (
      <motion.div
        key={sentenceIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 + sentenceIndex * 0.3, duration: 0.8 }}
      >
        {sentence.split(" ").map((word, index) => {
          const cleanWord = word.replace(/[.,]/g, "");
          if (cleanWord === "estratégia") {
            return (
              <span key={index} className="text-gold">
                {word}{" "}
              </span>
            );
          }
          if (cleanWord === "resultados") {
            return (
              <span key={index} className="text-primary">
                {word}{" "}
              </span>
            );
          }
          return <span key={index}>{word} </span>;
        })}
      </motion.div>
    ));
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.75), rgba(17, 24, 39, 0.75)), url(${heroBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="container mx-auto px-4 py-20 z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Profile Image */}
          <motion.div
            className="relative group"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-gold rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <img
              src={profileImage}
              alt="Flávio Bezerra"
              className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full object-cover border-4 border-background shadow-2xl"
            />
          </motion.div>

          {/* Name */}
          <motion.div
            className="space-y-4 px-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground break-words">
              Flávio Menegueço Bezerra
            </h1>
          </motion.div>

          {/* Tagline */}
          <div className="min-h-[4rem] flex flex-col items-center px-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-script text-foreground">
            {highlightWords(fullText)}
          </div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap gap-4 justify-center pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transform hover:scale-105 transition-all duration-200"
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
              className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transform hover:scale-105 transition-all duration-200"
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
                <svg
                  className="mr-2 h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                </svg>
                Medium
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
