import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Linkedin, Send, Mail } from "lucide-react";
import logo from "@/assets/logo-white.png";
import { motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Contato via Site: ${formData.name}`);
    const body = encodeURIComponent(`Nome: ${formData.name}\nEmail: ${formData.email}\n\nMensagem:\n${formData.message}`);
    window.location.href = `mailto:flaviomenegueco@gmail.com?subject=${subject}&body=${body}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-20 bg-background border-t border-border relative overflow-hidden">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          className="absolute top-0 left-1/3 w-96 h-96 bg-primary rounded-full blur-3xl"
          animate={{ 
            y: [0, 40, 0],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/3 w-96 h-96 bg-gold rounded-full blur-3xl"
          animate={{ 
            y: [0, -40, 0],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="text-center mb-12">
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 gradient-text leading-tight pb-2"
              variants={itemVariants}
            >
              Vamos nos Conectar?
            </motion.h2>
            
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-muted-foreground"
              variants={itemVariants}
            >
              Interessado em trocar ideias sobre dados e inovação? 
              Envie uma mensagem ou conecte-se no LinkedIn.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            
            {/* Contact Form */}
            <motion.div 
              className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border shadow-lg"
              variants={itemVariants}
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Envie uma Mensagem
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input 
                    placeholder="Seu Nome" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-secondary/50 border-border/50 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Input 
                    type="email" 
                    placeholder="Seu Email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-secondary/50 border-border/50 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Textarea 
                    placeholder="Sua Mensagem" 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="min-h-[120px] bg-secondary/50 border-border/50 focus:border-primary"
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 group">
                  Enviar Email
                  <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </motion.div>

            {/* Social & Info */}
            <motion.div 
              className="flex flex-col items-center justify-center h-full space-y-8"
              variants={itemVariants}
            >
              <div className="text-center space-y-6">
                <p className="text-muted-foreground">
                  Prefere redes sociais? Vamos conectar no LinkedIn!
                </p>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="bg-[#0077b5] hover:bg-[#006396] text-white w-full sm:w-auto transition-all duration-300 shadow-lg group"
                    asChild
                  >
                    <a
                      href="https://www.linkedin.com/in/flavio-m-bezerra"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                      Conectar no LinkedIn
                    </a>
                  </Button>
                </motion.div>
              </div>

              {/* Logo */}
              <motion.div 
                className="flex justify-center pt-8"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <img src={logo} alt="FMB Logo" className="h-24 opacity-80 hover:opacity-100 transition-opacity duration-300" />
              </motion.div>

              {/* Tagline */}
              <div className="text-center">
                <p className="text-xl font-script text-foreground">
                  Mais que dados, <span className="text-gold">estratégia</span>.{" "}
                  <br />
                  Mais que insights, <span className="text-primary">resultados</span>.
                </p>
              </div>
            </motion.div>

          </div>

          {/* Copyright */}
          <motion.p 
            className="text-sm text-muted-foreground text-center mt-16"
            variants={itemVariants}
          >
            © {new Date().getFullYear()} Flávio Menegueço Bezerra. Todos os direitos reservados.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
