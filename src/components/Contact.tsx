import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Linkedin, Send, Mail, Loader2 } from "lucide-react";
import logo from "@/assets/logo-white.png";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ThreeBackground from "./ThreeBackground";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://platform.linkedin.com/badges/js/profile.js";
    script.async = true;
    script.defer = true;
    script.type = "text/javascript";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/flaviomenegueco@gmail.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          _subject: `Novo contato do site: ${formData.name}`,
          _template: "table",
          _captcha: "false"
        })
      });

      if (response.ok) {
        toast.success("Mensagem enviada com sucesso!", {
          description: "Obrigado pelo contato. Retornarei em breve."
        });
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        throw new Error("Falha ao enviar mensagem");
      }
    } catch (error) {
      toast.error("Erro ao enviar mensagem", {
        description: "Por favor, tente novamente mais tarde ou contate via LinkedIn."
      });
      console.error("Erro no envio:", error);
    } finally {
      setIsSubmitting(false);
    }
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
      <ThreeBackground />
      <div className="absolute inset-0 bg-background/90" />

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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                    className="bg-secondary/50 border-border/50 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="tel"
                    placeholder="Seu Telefone (Opcional)"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                    className="min-h-[120px] bg-secondary/50 border-border/50 focus:border-primary"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 group"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      Enviando...
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      Enviar Email
                      <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
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

                <div className="badge-base LI-profile-badge opacity-80" data-locale="pt_BR" data-size="large" data-theme="light" data-type="HORIZONTAL" data-vanity="flavio-m-bezerra" data-version="v1">
                  <a className="badge-base__link LI-simple-link" href="https://br.linkedin.com/in/flavio-m-bezerra?trk=profile-badge"></a>
                </div>
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
