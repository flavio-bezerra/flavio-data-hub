import { Target } from "lucide-react";
import SubtleBackground from "@/components/SubtleBackground";
import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-secondary/50 relative overflow-hidden">
      {/* Background Tech Pattern */}
      <SubtleBackground />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-center">
              {t.about.title}
            </h2>
          </ScrollReveal>

          <div className="space-y-8 text-xl text-muted-foreground leading-relaxed">
            {/* Site Objective Block */}
            <ScrollReveal delay={0.1}>
              <div className="p-4 sm:p-6 rounded-lg bg-gradient-to-r from-primary/10 to-gold/10 border border-white/10 mb-8">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="p-3 rounded-lg bg-background/50 text-primary shadow-sm">
                    <Target size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{t.about.objectiveTitle}</h3>
                    <p className="text-base sm:text-lg text-muted-foreground">
                      {t.about.objectiveText}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="p-4 sm:p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-colors duration-300 hover:scale-[1.02] transform transition-transform">
                <span className="text-foreground font-semibold text-xl sm:text-2xl">{t.about.experience1.part1}</span>
                {t.about.experience1.part2}
                <span className="text-primary font-semibold">{t.about.experience1.part3}</span>
                {t.about.experience1.part4}
                <span className="text-gold font-semibold">{t.about.experience1.part5}</span>
                {t.about.experience1.part6}
                <span className="text-gold font-semibold">{t.about.experience1.part7}</span>
                {t.about.experience1.part8}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <p className="p-4 sm:p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-gold/20 hover:border-gold/40 transition-colors duration-300 hover:scale-[1.02] transform transition-transform">
                {t.about.experience2.part1}
                <span className="font-semibold text-gold">{t.about.experience2.highlight1}</span>
                {t.about.experience2.part2}
                <span className="text-primary font-semibold">{t.about.experience2.highlight2}</span>
                {t.about.experience2.part3}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="text-center pt-4 sm:pt-8">
                <p className="text-xl sm:text-2xl md:text-3xl font-script text-foreground p-4 sm:p-6 rounded-lg bg-gradient-to-r from-primary/10 to-gold/10 border border-primary/30 hover:scale-105 transition-transform duration-300">
                  {t.about.tagline.part1}<span className="text-gold">{t.about.tagline.highlight1}</span>.
                  <br />
                  {t.about.tagline.part2}<span className="text-primary">{t.about.tagline.highlight2}</span>.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <p className="text-lg text-muted-foreground text-center mt-12 italic">
                {t.about.finalText}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
