import { useState, useRef } from "react";
import { Search, AlertCircle, TrendingUp, Lightbulb, Brain } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, ScatterChart, XAxis, YAxis, Tooltip as RechartsTooltip, Scatter, CartesianGrid, ReferenceLine } from "recharts";
import { motion, useInView } from "framer-motion";

const WhatIsDataScience = () => {
  const [hoveredPillar, setHoveredPillar] = useState<number | null>(null);
  const [activeClassic, setActiveClassic] = useState<string | undefined>("descritiva");
  const [activeGenAI, setActiveGenAI] = useState<string | undefined>("prompt");

  const vennRef = useRef<HTMLDivElement>(null);
  const isVennInView = useInView(vennRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.2,
        type: "spring",
        stiffness: 100,
        damping: 10
      } as const
    }),
    hovered: { 
      scale: 1.1, 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    dimmed: { 
      scale: 1, 
      opacity: 0.3,
      transition: { duration: 0.3 }
    }
  };

  const getCircleVariant = (index: number) => {
    if (!isVennInView) return "hidden";
    if (hoveredPillar === index) return "hovered";
    if (hoveredPillar !== null && hoveredPillar !== index && hoveredPillar !== 3) return "dimmed";
    return "visible";
  };

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute top-20 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-96 h-96 bg-wine rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Definition */}
        <motion.div
          className="max-w-4xl mx-auto mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-center gradient-text leading-tight pb-2"
            variants={itemVariants}
          >
            O que é Ciência de Dados?
          </motion.h2>

          {/* Market Perspectives Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* McKinsey */}
            <motion.div
              className="bg-card p-6 rounded-xl border border-primary/20 shadow-lg hover:shadow-primary/10 hover:border-primary/40 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4 border-b border-primary/20 pb-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <TrendingUp size={20} />
                </div>
                <h4 className="font-bold text-primary">McKinsey</h4>
              </div>
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                "Analytics é a ferramenta essencial para transformar dados brutos em <span className="text-foreground font-medium">vantagem competitiva</span>, otimizando operações e criando novos modelos de negócio."
              </p>
            </motion.div>

            {/* Gartner */}
            <motion.div
              className="bg-card p-6 rounded-xl border border-gold/20 shadow-lg hover:shadow-gold/10 hover:border-gold/40 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4 border-b border-gold/20 pb-3">
                <div className="p-2 rounded-lg bg-gold/10 text-gold group-hover:bg-gold/20 transition-colors">
                  <Search size={20} />
                </div>
                <h4 className="font-bold text-gold">Gartner</h4>
              </div>
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                "Uma disciplina que une <span className="text-foreground font-medium">métodos científicos</span>, algoritmos e sistemas para extrair conhecimento e insights valiosos de grandes volumes de dados."
              </p>
            </motion.div>

            {/* Bain */}
            <motion.div
              className="bg-card p-6 rounded-xl border border-wine/20 shadow-lg hover:shadow-wine/10 hover:border-wine/40 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4 border-b border-wine/20 pb-3">
                <div className="p-2 rounded-lg bg-wine/10 text-wine group-hover:bg-wine/20 transition-colors">
                  <Lightbulb size={20} />
                </div>
                <h4 className="font-bold text-wine">Bain & Company</h4>
              </div>
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                "Advanced Analytics permite descobrir padrões ocultos e <span className="text-foreground font-medium">prever comportamentos futuros</span> para resolver os problemas mais complexos e críticos."
              </p>
            </motion.div>
          </div>

          {/* Unifying Definition */}
          <motion.div
            className="bg-gradient-to-r from-primary/5 via-gold/5 to-wine/5 p-8 rounded-xl border border-white/10 text-center relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px]" />
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4 text-foreground">A Definição Unificadora</h3>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                "Ciência de Dados não é sobre complexidade de código, é sobre <span className="text-foreground font-medium">redução de incerteza</span>.
                É a arte de usar o histórico da empresa para tomar decisões futuras com maior probabilidade de acerto."
              </p>
            </div>
          </motion.div>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-muted-foreground text-center leading-relaxed mt-4 sm:mt-6"
            variants={itemVariants}
          >
            O modelo conceitual que melhor define essa disciplina é um <span className="font-semibold">Diagrama de Venn</span> que
            a posiciona na interseção de três pilares fundamentais:
          </motion.p>
        </motion.div>

        {/* Three Pillars Section */}
        <motion.div
          className="max-w-6xl mx-auto mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="text-center mb-12"
            variants={containerVariants}
          >
            <motion.h3
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-8 sm:mb-12 px-4"
              variants={itemVariants}
            >
              Os Três Pilares da Ciência de Dados
            </motion.h3>

            {/* Main Content Grid: Diagram (Left) + Cards (Right) */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center justify-items-center mb-12 px-4">

              {/* Left Column: Venn Diagram */}
              <div className="w-full flex justify-center lg:justify-end relative z-10">
                <div ref={vennRef} className="relative w-full max-w-[400px] aspect-square mx-auto">


                  {/* Programming Circle - Top Center */}
                  <motion.div
                    className={`absolute top-0 left-1/2 rounded-full border-2 sm:border-3 md:border-4 flex items-center justify-center pb-[15%] cursor-pointer z-10 transition-all duration-300 ${hoveredPillar === 3 ? "bg-white/30 border-white" : "bg-primary/30 border-primary"}`}
                    style={{
                      width: '55%',
                      height: '55%',
                      x: "-50%"
                    }}
                    custom={0}
                    initial="hidden"
                    animate={getCircleVariant(0)}
                    variants={circleVariants}
                    onMouseEnter={() => setHoveredPillar(0)}
                    onMouseLeave={() => setHoveredPillar(null)}
                  >
                    <span className={`font-bold text-xs sm:text-sm md:text-base pointer-events-none px-1 text-center break-words w-full ${hoveredPillar === 3 ? "text-white" : "text-primary"}`}>Programação</span>
                  </motion.div>

                  {/* Statistics Circle - Bottom Left */}
                  <motion.div
                    className={`absolute bottom-[5%] left-[5%] rounded-full border-2 sm:border-3 md:border-4 flex items-center justify-center pt-[15%] pr-[15%] cursor-pointer z-10 transition-all duration-300 ${hoveredPillar === 3 ? "bg-white/30 border-white" : "bg-gold/30 border-gold"}`}
                    style={{
                      width: '55%',
                      height: '55%',
                    }}
                    custom={1}
                    initial="hidden"
                    animate={getCircleVariant(1)}
                    variants={circleVariants}
                    onMouseEnter={() => setHoveredPillar(1)}
                    onMouseLeave={() => setHoveredPillar(null)}
                  >
                    <span className={`font-bold text-xs sm:text-sm md:text-base pointer-events-none text-center break-words leading-tight w-full px-1 ${hoveredPillar === 3 ? "text-white" : "text-gold"}`}>Estatística</span>
                  </motion.div>

                  {/* Business Circle - Bottom Right */}
                  <motion.div
                    className={`absolute bottom-[5%] right-[5%] rounded-full border-2 sm:border-3 md:border-4 flex items-center justify-center pt-[15%] pl-[15%] cursor-pointer z-10 transition-all duration-300 ${hoveredPillar === 3 ? "bg-white/30 border-white" : "bg-wine/30 border-wine"}`}
                    style={{
                      width: '55%',
                      height: '55%',
                    }}
                    custom={2}
                    initial="hidden"
                    animate={getCircleVariant(2)}
                    variants={circleVariants}
                    onMouseEnter={() => setHoveredPillar(2)}
                    onMouseLeave={() => setHoveredPillar(null)}
                  >
                    <span className={`font-bold text-xs sm:text-sm md:text-base pointer-events-none text-center break-words leading-tight w-full px-1 ${hoveredPillar === 3 ? "text-white" : "text-wine"}`}>Negócio</span>
                  </motion.div>
                </div>
              </div>

              {/* Right Column: Cards 1, 2, 3 */}
              <div className="w-full flex flex-col gap-4 lg:justify-center text-left relative z-20">
                {/* Programming */}
                <motion.div
                  className={`w-full p-4 rounded-lg ${hoveredPillar !== null && hoveredPillar !== 0 && hoveredPillar !== 3 ? "opacity-30 scale-95" : ""} ${hoveredPillar === 0 || hoveredPillar === 3 ? "scale-105 ring-2 ring-primary bg-primary/5" : "bg-card/30"}`}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  onMouseEnter={() => setHoveredPillar(0)}
                  onMouseLeave={() => setHoveredPillar(null)}
                >
                  <h4 className="text-lg sm:text-xl font-bold mb-2 text-primary">
                    1. Programação (A Ferramenta)
                  </h4>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Não é apenas sobre escrever código. É a capacidade de manipular grandes volumes de dados, assim como implementar algoritmos complexos em sistemas que funcionam em escala, 24 horas por dia.
                  </p>
                </motion.div>

                {/* Statistics */}
                <motion.div
                  className={`w-full p-4 rounded-lg ${hoveredPillar !== null && hoveredPillar !== 1 && hoveredPillar !== 3 ? "opacity-30 scale-95" : ""} ${hoveredPillar === 1 || hoveredPillar === 3 ? "scale-105 ring-2 ring-gold bg-gold/5" : "bg-card/30"}`}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  onMouseEnter={() => setHoveredPillar(1)}
                  onMouseLeave={() => setHoveredPillar(null)}
                >
                  <h4 className="text-lg sm:text-xl font-bold mb-2 text-gold">
                    2. Estatística (A Bússola)
                  </h4>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Não é apenas matemática complexa. É o rigor necessário para separar o que é um sinal real do que é apenas ruído ou coincidência, garantindo segurança na decisão.
                  </p>
                </motion.div>

                {/* Business */}
                <motion.div
                  className={`w-full p-4 rounded-lg ${hoveredPillar !== null && hoveredPillar !== 2 && hoveredPillar !== 3 ? "opacity-30 scale-95" : ""} ${hoveredPillar === 2 || hoveredPillar === 3 ? "scale-105 ring-2 ring-wine bg-wine/5" : "bg-card/30"}`}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  onMouseEnter={() => setHoveredPillar(2)}
                  onMouseLeave={() => setHoveredPillar(null)}
                >
                  <h4 className="text-lg sm:text-xl font-bold mb-2 text-wine">
                    3. Negócio (O Alvo)
                  </h4>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    O pilar mais importante. Sem um problema de negócio claro para resolver, todo o resto é apenas um exercício acadêmico. É o que transforma dados em dinheiro ou eficiência.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Conclusion */}
            <motion.div
              className={`max-w-4xl mx-auto text-left p-6 rounded-lg cursor-pointer relative z-20 ${hoveredPillar !== null && hoveredPillar !== 3 ? "opacity-30 scale-95" : ""} ${hoveredPillar === 3 ? "scale-105 ring-2 ring-foreground bg-foreground/5" : "bg-card/30"}`}
              onMouseEnter={() => setHoveredPillar(3)}
              onMouseLeave={() => setHoveredPillar(null)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h4 className="text-2xl font-bold mb-4 text-center">
                4. A Interseção<br />(Onde o Valor Nasce)
              </h4>
              <p className="text-lg text-muted-foreground leading-relaxed text-center">
                "Meu trabalho acontece onde esses três mundos se encontram. Uso a tecnologia e a matemática não como fim, mas como meio para responder às perguntas que tiram o sono dos gestores e entregar resultados concretos."
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Approach - New Maturity Sections */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.h3
              className="text-3xl md:text-4xl font-bold mb-4"
              variants={itemVariants}
            >
              Do Escopo ao Deploy
            </motion.h3>
            <motion.p
              className="text-xl text-muted-foreground mb-16"
              variants={itemVariants}
            >
              Cada projeto terá o seu grau de entrega, dependente do problema a ser resolvido e do nível de maturidade do departamento. Entretanto, podemos classificar um projeto de ML Clássico e Generativo nos seguintes níveis:
            </motion.p>

            <Tabs defaultValue="classic" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-card-foreground/5">
                <TabsTrigger value="classic">Maturidade (ML Clássico)</TabsTrigger>
                <TabsTrigger value="gen-ai">Maturidade (IA Generativa)</TabsTrigger>
              </TabsList>

              {/* Tab Content 1: ML Clássico */}
              <TabsContent value="classic">

                {(() => {
                  const classicMLLevels = [
                    {
                      id: "descritiva",
                      icon: Search,
                      title: "1. Descrevendo (O que aconteceu?)",
                      description: "Visão consolidada do histórico.",
                      details: "A Análise Descritiva é o primeiro nível e se concentra em responder à pergunta: \"O que aconteceu?\". Seu principal objetivo é consolidar e resumir dados históricos para fornecer uma visão clara do passado. Isso é comumente alcançado através de relatórios, dashboards e visualizações de dados que mostram métricas e KPIs (Indicadores-Chave de Performance), permitindo que a organização tenha uma compreensão básica de seu desempenho, como o total de vendas do último trimestre.",
                      value: 1,
                      complexity: 1,
                      color: "hsl(var(--primary))"
                    },
                    {
                      id: "diagnostica",
                      icon: AlertCircle,
                      title: "2. Diagnosticando (Por que aconteceu?)",
                      description: "Investigação para encontrar a causa raiz.",
                      details: "Subindo um nível, a Análise Diagnóstica busca entender \"Por que aconteceu?\". Em vez de apenas observar os dados, este estágio envolve uma investigação mais profunda para descobrir as causas raízes por trás de um evento ou tendência. Utilizando técnicas como drill-down (aprofundamento nos dados) e análise de correlação, ela tenta explicar por que, por exemplo, as vendas caíram em uma determinada região, talvez identificando uma nova campanha de um concorrente ou um problema logístico.",
                      value: 1.8,
                      complexity: 2,
                      color: "#a855f7"
                    },
                    {
                      id: "preditiva",
                      icon: TrendingUp,
                      title: "3. Prevendo (O que vai acontecer?)",
                      description: "Uso de Machine Learning para prever o futuro.",
                      details: "A Análise Preditiva muda o foco do passado para o futuro, respondendo à pergunta: \"O que vai acontecer?\". Neste nível, são aplicados modelos estatísticos e de Machine Learning sobre dados históricos para prever tendências e comportamentos futuros. Exemplos clássicos incluem a previsão de demanda de produtos (forecasting), a identificação de clientes com alto risco de cancelamento (churn) ou a estimativa da probabilidade de fraude em uma transação.",
                      value: 3.2,
                      complexity: 3,
                      color: "hsl(var(--primary))"
                    },
                    {
                      id: "prescritiva",
                      icon: Lightbulb,
                      title: "4. Prescrevendo (O que devemos fazer?)",
                      description: "Modelos de otimização para recomendar ações.",
                      details: "Por fim, a Análise Prescritiva representa o nível mais avançado de maturidade, focado em determinar \"O que devemos fazer?\". Ela vai além da simples previsão, utilizando modelos de otimização e simulação para recomendar as melhores ações possíveis e o impacto esperado de cada decisão. Em vez de apenas prever a demanda, a análise prescritiva sugeriria, por exemplo, qual o nível ideal de estoque e o melhor preço para maximizar o lucro, ajudando a otimizar ativamente as estratégias de negócio.",
                      value: 5.8,
                      complexity: 4,
                      color: "hsl(var(--gold))"
                    }
                  ];

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
                    >
                      {/* Chart 1: Classic ML (Left Column) */}
                      <div className="bg-card rounded-lg p-1 sm:p-6 border aspect-square flex flex-col max-w-md mx-auto w-full">
                        <h4 className="text-lg font-semibold mb-4 text-left px-2 sm:px-0">Valor vs. Complexidade</h4>
                        <div className="flex-1 w-full min-h-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 25, bottom: 20, left: 0 }}>
                              <defs>
                                <marker id="arrowhead-classic-x" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                                  <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground))" />
                                </marker>
                                <marker id="arrowhead-classic-y" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="-90">
                                  <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground))" />
                                </marker>
                              </defs>
                              <XAxis
                                type="number"
                                dataKey="complexity"
                                name="Complexidade"
                                domain={[0, 5]}
                                ticks={[]}
                                axisLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 2, markerEnd: 'url(#arrowhead-classic-x)' }}
                                label={{ value: 'Complexidade', position: 'insideBottomRight', offset: -5, fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                              />
                              <YAxis
                                type="number"
                                dataKey="value"
                                name="Valor"
                                domain={[0, 7]}
                                ticks={[]}
                                axisLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 2, markerStart: 'url(#arrowhead-classic-y)' }}
                                label={{ value: 'Valor', angle: 0, position: 'insideTopLeft', offset: 10, dy: 20, dx: 5, fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                              />
                              <RechartsTooltip
                                cursor={false}
                                content={({ payload }) => {
                                  if (payload && payload.length > 0) {
                                    const data = payload[0].payload;
                                    return (
                                      <div className="bg-popover border border-border p-3 rounded shadow-lg">
                                        <p className="font-bold text-popover-foreground">{data.title}</p>
                                        <p className="text-sm text-muted-foreground mt-1">{data.description}</p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Scatter
                                data={classicMLLevels}
                                shape={(props: any) => {
                                  const { cx, cy, payload } = props;
                                  const isActive = activeClassic === payload.id;
                                  const index = classicMLLevels.findIndex(item => item.id === payload.id);

                                  // Satellite configuration: Chaotic, organic scatter
                                  const satelliteCount = 100;
                                  const satellites = Array.from({ length: satelliteCount }).map((_, i) => {
                                    const seed = index * 100 + i;
                                    // Pseudo-random generator
                                    const rand = (s: number) => {
                                      const x = Math.sin(s) * 43758.5453;
                                      return x - Math.floor(x);
                                    };

                                    const rX = rand(seed * 1.1);
                                    const rY = rand(seed * 1.2);
                                    const rSize = rand(seed * 1.3);

                                    // Spread across the chart (approx 300x300)
                                    // Using cubic power to bias towards center naturally but without radial lines
                                    const spread = 280;
                                    const offsetX = (Math.pow(2 * rX - 1, 3)) * spread;
                                    const offsetY = (Math.pow(2 * rY - 1, 3)) * spread;

                                    const size = 1 + rSize * 4; // 1-5px

                                    return {
                                      cx: cx + offsetX,
                                      cy: cy + offsetY,
                                      r: size
                                    };
                                  });

                                  return (
                                    <g>
                                      {isActive && satellites.map((sat, i) => (
                                        <motion.circle
                                          key={`sat-${i}`}
                                          cx={sat.cx}
                                          cy={sat.cy}
                                          r={sat.r}
                                          fill={payload.color}
                                          initial={{ opacity: 0, scale: 0 }}
                                          animate={{ opacity: 0.6, scale: 1 }}
                                          transition={{ duration: 0.4, delay: i * 0.03 }}
                                          style={{ pointerEvents: 'none' }}
                                        />
                                      ))}
                                      <motion.circle
                                        cx={cx}
                                        cy={cy}
                                        r={isActive ? 20 : 14}
                                        fill={payload.color}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{
                                          scale: isActive ? 1.2 : 1,
                                          opacity: isActive ? 1 : 0.6,
                                          r: isActive ? 20 : 14
                                        }}
                                        transition={{
                                          duration: 0.5,
                                          delay: index * 0.15,
                                          type: "spring",
                                          stiffness: 200,
                                          damping: 15
                                        }}
                                        whileHover={{ scale: 1.3, opacity: 1 }}
                                        className="cursor-pointer"
                                        onClick={() => setActiveClassic(payload.id)}
                                        style={{ outline: 'none' }}
                                      />
                                    </g>
                                  );
                                }}
                              />
                            </ScatterChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Accordion 1: Classic ML (Right Column) */}
                      <div className="flex flex-col justify-center h-full">
                        <Accordion
                          type="single"
                          collapsible
                          value={activeClassic}
                          onValueChange={setActiveClassic}
                          className="w-full"
                        >
                          {classicMLLevels.map((item) => {
                            const Icon = item.icon;
                            return (
                              <AccordionItem key={item.id} value={item.id}>
                                <AccordionTrigger className="p-4 hover:no-underline rounded-lg hover:bg-card-foreground/5 data-[state=open]:bg-card-foreground/10">
                                  <div className="flex items-center gap-4 w-full pr-4 text-left">
                                    <div className="p-3 rounded-lg bg-card-foreground/10" style={{ color: item.color }}>
                                      <Icon className="w-6 h-6 shrink-0" />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-bold text-base text-foreground">{item.title}</h4>
                                      <p className="text-sm text-muted-foreground font-normal mt-1">{item.description}</p>
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="pl-16 pr-4 pt-2">
                                    <p className="text-muted-foreground leading-relaxed">{item.details}</p>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            );
                          })}
                        </Accordion>
                      </div>
                    </motion.div>
                  );
                })()}
              </TabsContent>

              {/* Tab Content 2: IA Generativa */}
              <TabsContent value="gen-ai">

                {(() => {
                  const genAILevels = [
                    {
                      id: "prompt",
                      icon: Brain,
                      title: "1. Engenharia de Prompt",
                      description: "Otimização de comandos para LLMs.",
                      details: "A Engenharia de Prompt é a prática de desenhar, testar e otimizar as instruções (prompts) dadas a um Modelo de Linguagem de Larga Escala (LLM) para obter as respostas mais precisas, relevantes e úteis. É uma habilidade fundamental que envolve não apenas fazer a pergunta certa, mas também fornecer contexto suficiente, exemplos (técnica conhecida como few-shot learning) e restrições claras para guiar o modelo a executar tarefas complexas com alta qualidade, desde resumir textos até gerar código.",
                      value: 1,
                      complexity: 1,
                      color: "hsl(var(--wine-light))"
                    },
                    {
                      id: "rag",
                      icon: Brain,
                      title: "2. RAG (Busca Aumentada)",
                      description: "Conectando LLMs a dados privados.",
                      details: "O RAG (Retrieval-Augmented Generation) é uma técnica que potencializa um LLM ao conectá-lo a uma base de conhecimento externa, como documentos privados da empresa, e-mails ou um banco de dados. Em vez de depender apenas do conhecimento estático com o qual foi treinado, o modelo primeiro \"busca\" (retrieve) informações relevantes dessa fonte de dados externa e, em seguida, usa esses dados \"aumentados\" como contexto para gerar uma resposta precisa, atualizada e baseada em informações privadas que o modelo originalmente desconhecia.",
                      value: 1.8,
                      complexity: 2,
                      color: "hsl(var(--wine-medium))"
                    },
                    {
                      id: "finetuning",
                      icon: Brain,
                      title: "3. Fine-tuning (Especialização)",
                      description: "Treinando o modelo em tarefas específicas.",
                      details: "O Fine-tuning (Ajuste Fino ou Especialização) é o processo de continuar o treinamento de um LLM pré-treinado, mas agora com um conjunto de dados menor e específico de um domínio ou tarefa. Diferente do RAG, que injeta conhecimento no prompt, o fine-tuning modifica os \"pesos\" internos do próprio modelo. Isso o torna um especialista em um estilo de linguagem particular (como o tom de voz de uma marca), em um formato de dados específico (como laudos médicos) ou em uma tarefa muito nichada, melhorando drasticamente seu desempenho e comportamento naquela área.",
                      value: 3.2,
                      complexity: 3,
                      color: "hsl(var(--wine-dark))"
                    },
                    {
                      id: "agents",
                      icon: Brain,
                      title: "4. Multi-Agentes (Autonomia)",
                      description: "IAs que planejam e executam tarefas.",
                      details: "Os sistemas Multi-Agentes representam um nível avançado de autonomia, onde múltiplas \"IAs\" (agentes), cada uma muitas vezes impulsionada por um LLM, colaboram para resolver um problema complexo que seria difícil para um único modelo. Um agente \"planejador\" pode quebrar uma tarefa grande (ex: \"analisar concorrentes e criar um plano de marketing\") em subtarefas, que são então delegadas e executadas por agentes \"especialistas\" (ex: um agente de pesquisa, um agente redator, um agente analista), que trabalham de forma coordenada para entregar um resultado final completo.",
                      value: 5.8,
                      complexity: 4,
                      color: "hsl(var(--wine-deeper))"
                    }
                  ];

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
                    >
                      {/* Chart 2: GenAI (Left Column) */}
                      <div className="bg-card rounded-lg p-1 sm:p-6 border aspect-square flex flex-col max-w-md mx-auto w-full">
                        <h4 className="text-lg font-semibold mb-4 text-left px-2 sm:px-0">Valor vs. Complexidade</h4>
                        <div className="flex-1 w-full min-h-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 25, bottom: 20, left: 0 }}>
                              <defs>
                                <marker id="arrowhead-genai-x" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                                  <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground))" />
                                </marker>
                                <marker id="arrowhead-genai-y" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="-90">
                                  <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground))" />
                                </marker>
                              </defs>
                              <XAxis
                                type="number"
                                dataKey="complexity"
                                name="Complexidade"
                                domain={[0, 5]}
                                ticks={[]}
                                axisLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 2, markerEnd: 'url(#arrowhead-genai-x)' }}
                                label={{ value: 'Complexidade', position: 'insideBottomRight', offset: -5, fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                              />
                              <YAxis
                                type="number"
                                dataKey="value"
                                name="Valor"
                                domain={[0, 7]}
                                ticks={[]}
                                axisLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 2, markerStart: 'url(#arrowhead-genai-y)' }}
                                label={{ value: 'Valor', angle: 0, position: 'insideTopLeft', offset: 10, dy: 20, dx: 5, fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                              />
                              <RechartsTooltip
                                cursor={false}
                                content={({ payload }) => {
                                  if (payload && payload.length > 0) {
                                    const data = payload[0].payload;
                                    return (
                                      <div className="bg-popover border border-border p-3 rounded shadow-lg">
                                        <p className="font-bold text-popover-foreground">{data.title}</p>
                                        <p className="text-sm text-muted-foreground mt-1">{data.description}</p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Scatter
                                data={genAILevels}
                                shape={(props: any) => {
                                  const { cx, cy, payload } = props;
                                  const isActive = activeGenAI === payload.id;
                                  const index = genAILevels.findIndex(item => item.id === payload.id);

                                  // Satellite configuration: Chaotic, organic scatter
                                  const satelliteCount = 100;
                                  const satellites = Array.from({ length: satelliteCount }).map((_, i) => {
                                    const seed = index * 100 + i;
                                    // Pseudo-random generator
                                    const rand = (s: number) => {
                                      const x = Math.sin(s) * 43758.5453;
                                      return x - Math.floor(x);
                                    };

                                    const rX = rand(seed * 1.1);
                                    const rY = rand(seed * 1.2);
                                    const rSize = rand(seed * 1.3);

                                    // Spread across the chart (approx 300x300)
                                    // Using cubic power to bias towards center naturally but without radial lines
                                    const spread = 280;
                                    const offsetX = (Math.pow(2 * rX - 1, 3)) * spread;
                                    const offsetY = (Math.pow(2 * rY - 1, 3)) * spread;

                                    const size = 1 + rSize * 4; // 1-5px

                                    return {
                                      cx: cx + offsetX,
                                      cy: cy + offsetY,
                                      r: size
                                    };
                                  });

                                  return (
                                    <g>
                                      {isActive && satellites.map((sat, i) => (
                                        <motion.circle
                                          key={`sat-${i}`}
                                          cx={sat.cx}
                                          cy={sat.cy}
                                          r={sat.r}
                                          fill={payload.color}
                                          initial={{ opacity: 0, scale: 0 }}
                                          animate={{ opacity: 0.6, scale: 1 }}
                                          transition={{ duration: 0.4, delay: i * 0.03 }}
                                          style={{ pointerEvents: 'none' }}
                                        />
                                      ))}
                                      <motion.circle
                                        cx={cx}
                                        cy={cy}
                                        r={isActive ? 20 : 14}
                                        fill={payload.color}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{
                                          scale: isActive ? 1.2 : 1,
                                          opacity: isActive ? 1 : 0.6,
                                          r: isActive ? 20 : 14
                                        }}
                                        transition={{
                                          duration: 0.5,
                                          delay: index * 0.15,
                                          type: "spring",
                                          stiffness: 200,
                                          damping: 15
                                        }}
                                        whileHover={{ scale: 1.3, opacity: 1 }}
                                        className="cursor-pointer"
                                        onClick={() => setActiveGenAI(payload.id)}
                                        style={{ outline: 'none' }}
                                      />
                                    </g>
                                  );
                                }}
                              />
                            </ScatterChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Accordion 2: GenAI (Right Column) */}
                      <div className="flex flex-col justify-center h-full">
                        <Accordion
                          type="single"
                          collapsible
                          value={activeGenAI}
                          onValueChange={setActiveGenAI}
                          className="w-full"
                        >
                          {genAILevels.map((item) => {
                            const Icon = item.icon;
                            return (
                              <AccordionItem key={item.id} value={item.id}>
                                <AccordionTrigger className="p-4 hover:no-underline rounded-lg hover:bg-card-foreground/5 data-[state=open]:bg-card-foreground/10">
                                  <div className="flex items-center gap-4 w-full pr-4 text-left">
                                    <div className="p-3 rounded-lg bg-card-foreground/10" style={{ color: item.color }}>
                                      <Icon className="w-6 h-6 shrink-0" />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-bold text-base text-foreground">{item.title}</h4>
                                      <p className="text-sm text-muted-foreground font-normal mt-1">{item.description}</p>
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="pl-16 pr-4 pt-2">
                                    <p className="text-muted-foreground leading-relaxed">{item.details}</p>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            );
                          })}
                        </Accordion>
                      </div>
                    </motion.div>
                  );
                })()}
              </TabsContent>
            </Tabs>
            <motion.p
              className="text-lg text-muted-foreground text-center mt-12 italic"
              variants={itemVariants}
            >
              Com o conceito claro, surge o desafio: como gerir estes projetos num ambiente onde a incerteza é alta? É aqui que entra o método.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default WhatIsDataScience;
