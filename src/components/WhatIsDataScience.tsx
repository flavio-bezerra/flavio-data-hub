import { useState, useRef } from "react";
import {
  Search,
  AlertCircle,
  TrendingUp,
  Lightbulb,
  Brain,
} from "lucide-react";
import CustomScatterShape from "./CustomScatterShape";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  ScatterChart,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Scatter,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { motion, useInView } from "framer-motion";
import SubtleBackground from "@/components/SubtleBackground";
import { useLanguage } from "@/contexts/LanguageContext";

const WhatIsDataScience = () => {
  const { t } = useLanguage();
  const [hoveredPillar, setHoveredPillar] = useState<number | null>(null);
  const [activeClassic, setActiveClassic] = useState<string | undefined>(
    "descritiva"
  );
  const [activeGenAI, setActiveGenAI] = useState<string | undefined>("prompt");

  const vennRef = useRef<HTMLDivElement>(null);
  const isVennInView = useInView(vennRef, { once: false, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.4, // Increased delay for more distinct steps
        type: "spring",
        stiffness: 70, // Softer spring
        damping: 15, // Smoother settle
      } as const,
    }),
    hovered: {
      scale: 1.1,
      opacity: 1,
      transition: { duration: 0.3 },
    },
    dimmed: {
      scale: 1,
      opacity: 0.3,
      transition: { duration: 0.3 },
    },
  };

  const getCircleVariant = (index: number) => {
    if (!isVennInView) return "hidden";
    if (hoveredPillar === index) return "hovered";
    if (
      hoveredPillar !== null &&
      hoveredPillar !== index &&
      hoveredPillar !== 3
    )
      return "dimmed";
    return "visible";
  };

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Animated Background */}
      <SubtleBackground />

      <div className="container mx-auto px-4 relative z-10">
        {/* Definition */}
        <motion.div
          className="max-w-4xl mx-auto mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
        >
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-center gradient-text leading-tight pb-2"
            variants={itemVariants}
          >
            {t.whatIsData.title}
          </motion.h2>

          {/* Market Perspectives Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* McKinsey */}
            <motion.div
              className="bg-card p-6 rounded-xl border border-primary/20 shadow-lg hover:shadow-primary/10 hover:border-primary/40 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4 border-b border-primary/20 pb-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <TrendingUp size={20} />
                </div>
                <h4 className="font-bold text-primary">McKinsey</h4>
              </div>
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                {t.whatIsData.mckinsey}
              </p>
            </motion.div>

            {/* Gartner */}
            <motion.div
              className="bg-card p-6 rounded-xl border border-gold/20 shadow-lg hover:shadow-gold/10 hover:border-gold/40 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4 border-b border-gold/20 pb-3">
                <div className="p-2 rounded-lg bg-gold/10 text-gold group-hover:bg-gold/20 transition-colors">
                  <Search size={20} />
                </div>
                <h4 className="font-bold text-gold">Gartner</h4>
              </div>
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                {t.whatIsData.gartner}
              </p>
            </motion.div>

            {/* Bain */}
            <motion.div
              className="bg-card p-6 rounded-xl border border-wine/20 shadow-lg hover:shadow-wine/10 hover:border-wine/40 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4 border-b border-wine/20 pb-3">
                <div className="p-2 rounded-lg bg-wine/10 text-wine group-hover:bg-wine/20 transition-colors">
                  <Lightbulb size={20} />
                </div>
                <h4 className="font-bold text-wine">Bain & Company</h4>
              </div>
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                {t.whatIsData.bain}
              </p>
            </motion.div>
          </div>

          {/* Unifying Definition */}
          <motion.div
            className="bg-gradient-to-r from-primary/5 via-gold/5 to-wine/5 p-8 rounded-xl border border-white/10 text-center relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px]" />
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4 text-foreground">
                {t.whatIsData.unifyingTitle}
              </h3>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                {t.whatIsData.unifyingText}
              </p>
            </div>
          </motion.div>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-muted-foreground text-center leading-relaxed mt-4 sm:mt-6"
            variants={itemVariants}
          >
            {t.whatIsData.vennIntro}
          </motion.p>
        </motion.div>

        {/* Three Pillars Section */}
        <motion.div
          className="max-w-6xl mx-auto mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
        >
          <motion.div
            className="text-center mb-12"
            variants={containerVariants}
          >
            <motion.h3
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-8 sm:mb-12 px-4"
              variants={itemVariants}
            >
              {t.whatIsData.pillarsTitle}
            </motion.h3>

            {/* Main Content Grid: Diagram (Left) + Cards (Right) */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center justify-items-center mb-12 px-4">
              {/* Left Column: Venn Diagram */}
              <div className="w-full flex justify-center lg:justify-end relative z-10">
                <div
                  ref={vennRef}
                  className="relative w-full max-w-[400px] aspect-square mx-auto"
                >
                  {/* Programming Circle - Top Center */}
                  <motion.div
                    className={`absolute top-0 left-1/2 rounded-full border-2 sm:border-3 md:border-4 flex items-center justify-center pb-[15%] cursor-pointer z-10 transition-all duration-300 ${hoveredPillar === 3
                      ? "bg-white/30 border-white"
                      : "bg-primary/30 border-primary"
                      }`}
                    style={{
                      width: "55%",
                      height: "55%",
                      x: "-50%",
                    }}
                    custom={0}
                    initial="hidden"
                    animate={getCircleVariant(0)}
                    variants={circleVariants}
                    onMouseEnter={() => setHoveredPillar(0)}
                    onMouseLeave={() => setHoveredPillar(null)}
                  >
                    <span
                      className={`font-bold text-xs sm:text-sm md:text-base pointer-events-none px-1 text-center break-words w-full ${hoveredPillar === 3 ? "text-white" : "text-primary"
                        }`}
                    >
                      {t.whatIsData.pillar1}
                    </span>
                  </motion.div>

                  {/* Statistics Circle - Bottom Left */}
                  <motion.div
                    className={`absolute bottom-[5%] left-[5%] rounded-full border-2 sm:border-3 md:border-4 flex items-center justify-center pt-[15%] pr-[15%] cursor-pointer z-10 transition-all duration-300 ${hoveredPillar === 3
                      ? "bg-white/30 border-white"
                      : "bg-gold/30 border-gold"
                      }`}
                    style={{
                      width: "55%",
                      height: "55%",
                    }}
                    custom={1}
                    initial="hidden"
                    animate={getCircleVariant(1)}
                    variants={circleVariants}
                    onMouseEnter={() => setHoveredPillar(1)}
                    onMouseLeave={() => setHoveredPillar(null)}
                  >
                    <span
                      className={`font-bold text-xs sm:text-sm md:text-base pointer-events-none text-center break-words leading-tight w-full px-1 ${hoveredPillar === 3 ? "text-white" : "text-gold"
                        }`}
                    >
                      {t.whatIsData.pillar2}
                    </span>
                  </motion.div>

                  {/* Business Circle - Bottom Right */}
                  <motion.div
                    className={`absolute bottom-[5%] right-[5%] rounded-full border-2 sm:border-3 md:border-4 flex items-center justify-center pt-[15%] pl-[15%] cursor-pointer z-10 transition-all duration-300 ${hoveredPillar === 3
                      ? "bg-white/30 border-white"
                      : "bg-wine/30 border-wine"
                      }`}
                    style={{
                      width: "55%",
                      height: "55%",
                    }}
                    custom={2}
                    initial="hidden"
                    animate={getCircleVariant(2)}
                    variants={circleVariants}
                    onMouseEnter={() => setHoveredPillar(2)}
                    onMouseLeave={() => setHoveredPillar(null)}
                  >
                    <span
                      className={`font-bold text-xs sm:text-sm md:text-base pointer-events-none text-center break-words leading-tight w-full px-1 ${hoveredPillar === 3 ? "text-white" : "text-wine"
                        }`}
                    >
                      {t.whatIsData.pillar3}
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Right Column: Cards 1, 2, 3 */}
              <div className="w-full flex flex-col gap-4 lg:justify-center text-left relative z-20">
                {/* Programming */}
                <motion.div
                  className={`w-full p-4 rounded-lg ${hoveredPillar !== null &&
                    hoveredPillar !== 0 &&
                    hoveredPillar !== 3
                    ? "opacity-30 scale-95"
                    : ""
                    } ${hoveredPillar === 0 || hoveredPillar === 3
                      ? "scale-105 ring-2 ring-primary bg-primary/5"
                      : "bg-card/30"
                    }`}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  onMouseEnter={() => setHoveredPillar(0)}
                  onMouseLeave={() => setHoveredPillar(null)}
                >
                  <h4 className="text-lg sm:text-xl font-bold mb-2 text-primary">
                    {t.whatIsData.card1Title}
                  </h4>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {t.whatIsData.card1Text}
                  </p>
                </motion.div>

                {/* Statistics */}
                <motion.div
                  className={`w-full p-4 rounded-lg ${hoveredPillar !== null &&
                    hoveredPillar !== 1 &&
                    hoveredPillar !== 3
                    ? "opacity-30 scale-95"
                    : ""
                    } ${hoveredPillar === 1 || hoveredPillar === 3
                      ? "scale-105 ring-2 ring-gold bg-gold/5"
                      : "bg-card/30"
                    }`}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  onMouseEnter={() => setHoveredPillar(1)}
                  onMouseLeave={() => setHoveredPillar(null)}
                >
                  <h4 className="text-lg sm:text-xl font-bold mb-2 text-gold">
                    {t.whatIsData.card2Title}
                  </h4>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {t.whatIsData.card2Text}
                  </p>
                </motion.div>

                {/* Business */}
                <motion.div
                  className={`w-full p-4 rounded-lg ${hoveredPillar !== null &&
                    hoveredPillar !== 2 &&
                    hoveredPillar !== 3
                    ? "opacity-30 scale-95"
                    : ""
                    } ${hoveredPillar === 2 || hoveredPillar === 3
                      ? "scale-105 ring-2 ring-wine bg-wine/5"
                      : "bg-card/30"
                    }`}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  onMouseEnter={() => setHoveredPillar(2)}
                  onMouseLeave={() => setHoveredPillar(null)}
                >
                  <h4 className="text-lg sm:text-xl font-bold mb-2 text-wine">
                    {t.whatIsData.card3Title}
                  </h4>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {t.whatIsData.card3Text}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Conclusion */}
            <motion.div
              className={`max-w-4xl mx-auto text-left p-6 rounded-lg cursor-pointer relative z-20 ${hoveredPillar !== null && hoveredPillar !== 3
                ? "opacity-30 scale-95"
                : ""
                } ${hoveredPillar === 3
                  ? "scale-105 ring-2 ring-foreground bg-foreground/5"
                  : "bg-card/30"
                }`}
              onMouseEnter={() => setHoveredPillar(3)}
              onMouseLeave={() => setHoveredPillar(null)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h4 className="text-2xl font-bold mb-4 text-center">
                {t.whatIsData.intersectionTitle}
              </h4>
              <p className="text-lg text-muted-foreground leading-relaxed text-center">
                {t.whatIsData.intersectionText}
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
            viewport={{ once: false, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.h3
              className="text-3xl md:text-4xl font-bold mb-4"
              variants={itemVariants}
            >
              {t.whatIsData.scopeTitle}
            </motion.h3>
            <motion.p
              className="text-xl text-muted-foreground mb-16"
              variants={itemVariants}
            >
              {t.whatIsData.scopeText}
            </motion.p>

            <Tabs defaultValue="classic" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-card-foreground/5">
                <TabsTrigger value="classic">{t.whatIsData.tabClassic}</TabsTrigger>
                <TabsTrigger value="gen-ai">{t.whatIsData.tabGenAI}</TabsTrigger>
              </TabsList>

              {/* Tab Content 1: ML Clássico */}
              <TabsContent value="classic">
                {(() => {
                  const classicMLLevels = [
                    {
                      id: "descritiva",
                      icon: Search,
                      title: t.whatIsData.classicLevels[0].title,
                      description: t.whatIsData.classicLevels[0].description,
                      details: t.whatIsData.classicLevels[0].details,
                      value: 1,
                      complexity: 1,
                      color: "hsl(var(--primary))",
                    },
                    {
                      id: "diagnostica",
                      icon: AlertCircle,
                      title: t.whatIsData.classicLevels[1].title,
                      description: t.whatIsData.classicLevels[1].description,
                      details: t.whatIsData.classicLevels[1].details,
                      value: 1.8,
                      complexity: 2,
                      color: "#a855f7",
                    },
                    {
                      id: "preditiva",
                      icon: TrendingUp,
                      title: t.whatIsData.classicLevels[2].title,
                      description: t.whatIsData.classicLevels[2].description,
                      details: t.whatIsData.classicLevels[2].details,
                      value: 3.2,
                      complexity: 3,
                      color: "hsl(var(--primary))",
                    },
                    {
                      id: "prescritiva",
                      icon: Lightbulb,
                      title: t.whatIsData.classicLevels[3].title,
                      description: t.whatIsData.classicLevels[3].description,
                      details: t.whatIsData.classicLevels[3].details,
                      value: 5.8,
                      complexity: 4,
                      color: "hsl(var(--gold))",
                    },
                  ];

                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                      {/* Chart 1: Classic ML (Left Column) */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="bg-card rounded-lg p-1 sm:p-6 border aspect-square flex flex-col max-w-md mx-auto w-full"
                      >
                        <h4 className="text-lg font-semibold mb-4 text-left px-2 sm:px-0">
                          Valor vs. Complexidade
                        </h4>
                        <div className="flex-1 w-full min-h-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart
                              margin={{
                                top: 20,
                                right: 25,
                                bottom: 20,
                                left: 0,
                              }}
                            >
                              <defs>
                                <marker
                                  id="arrowhead-classic-x"
                                  markerWidth="10"
                                  markerHeight="7"
                                  refX="0"
                                  refY="3.5"
                                  orient="auto"
                                >
                                  <polygon
                                    points="0 0, 10 3.5, 0 7"
                                    fill="hsl(var(--muted-foreground))"
                                  />
                                </marker>
                                <marker
                                  id="arrowhead-classic-y"
                                  markerWidth="10"
                                  markerHeight="7"
                                  refX="0"
                                  refY="3.5"
                                  orient="-90"
                                >
                                  <polygon
                                    points="0 0, 10 3.5, 0 7"
                                    fill="hsl(var(--muted-foreground))"
                                  />
                                </marker>
                              </defs>
                              <XAxis
                                type="number"
                                dataKey="complexity"
                                name="Complexidade"
                                domain={[0, 5]}
                                ticks={[]}
                                axisLine={{
                                  stroke: "hsl(var(--muted-foreground))",
                                  strokeWidth: 2,
                                  markerEnd: "url(#arrowhead-classic-x)",
                                }}
                                label={{
                                  value: "Complexidade",
                                  position: "insideBottomRight",
                                  offset: -5,
                                  fill: "hsl(var(--muted-foreground))",
                                  fontSize: 12,
                                }}
                              />
                              <YAxis
                                type="number"
                                dataKey="value"
                                name="Valor"
                                domain={[0, 7]}
                                ticks={[]}
                                axisLine={{
                                  stroke: "hsl(var(--muted-foreground))",
                                  strokeWidth: 2,
                                  markerStart: "url(#arrowhead-classic-y)",
                                }}
                                label={{
                                  value: "Valor",
                                  angle: 0,
                                  position: "insideTopLeft",
                                  offset: 10,
                                  dy: 20,
                                  dx: 5,
                                  fill: "hsl(var(--muted-foreground))",
                                  fontSize: 12,
                                }}
                              />
                              <RechartsTooltip
                                cursor={false}
                                content={({ payload }) => {
                                  if (payload && payload.length > 0) {
                                    const data = payload[0].payload;
                                    return (
                                      <div className="bg-popover border border-border p-3 rounded shadow-lg">
                                        <p className="font-bold text-popover-foreground">
                                          {data.title}
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                          {data.description}
                                        </p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Scatter
                                data={classicMLLevels}
                                shape={(props: any) => (
                                  <CustomScatterShape
                                    {...props}
                                    activeId={activeClassic}
                                    data={classicMLLevels}
                                  />
                                )}
                                onClick={(data: any) => {
                                  if (data && data.payload) {
                                    setActiveClassic(data.payload.id);
                                  }
                                }}
                              />
                            </ScatterChart>
                          </ResponsiveContainer>
                        </div>
                      </motion.div>

                      {/* Accordion 1: Classic ML (Right Column) */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col justify-start h-full lg:min-h-[600px]"
                      >
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
                                    <div
                                      className="p-3 rounded-lg bg-card-foreground/10"
                                      style={{ color: item.color }}
                                    >
                                      <Icon className="w-6 h-6 shrink-0" />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-bold text-base text-foreground">
                                        {item.title}
                                      </h4>
                                      <p className="text-sm text-muted-foreground font-normal mt-1">
                                        {item.description}
                                      </p>
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="pl-16 pr-4 pt-2">
                                    <p className="text-muted-foreground leading-relaxed">
                                      {item.details}
                                    </p>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            );
                          })}
                        </Accordion>
                      </motion.div>
                    </div>
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
                      title: t.whatIsData.genAILevels[0].title,
                      description: t.whatIsData.genAILevels[0].description,
                      details: t.whatIsData.genAILevels[0].details,
                      value: 1,
                      complexity: 1,
                      color: "hsl(var(--wine-light))",
                    },
                    {
                      id: "rag",
                      icon: Brain,
                      title: t.whatIsData.genAILevels[1].title,
                      description: t.whatIsData.genAILevels[1].description,
                      details: t.whatIsData.genAILevels[1].details,
                      value: 1.8,
                      complexity: 2,
                      color: "hsl(var(--wine-medium))",
                    },
                    {
                      id: "finetuning",
                      icon: Brain,
                      title: t.whatIsData.genAILevels[2].title,
                      description: t.whatIsData.genAILevels[2].description,
                      details: t.whatIsData.genAILevels[2].details,
                      value: 3.2,
                      complexity: 3,
                      color: "hsl(var(--wine-dark))",
                    },
                    {
                      id: "agents",
                      icon: Brain,
                      title: t.whatIsData.genAILevels[3].title,
                      description: t.whatIsData.genAILevels[3].description,
                      details: t.whatIsData.genAILevels[3].details,
                      value: 5.8,
                      complexity: 4,
                      color: "hsl(var(--wine-deeper))",
                    },
                  ];

                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                      {/* Chart 2: GenAI (Left Column) */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="bg-card rounded-lg p-1 sm:p-6 border aspect-square flex flex-col max-w-md mx-auto w-full"
                      >
                        <h4 className="text-lg font-semibold mb-4 text-left px-2 sm:px-0">
                          Valor vs. Complexidade
                        </h4>
                        <div className="flex-1 w-full min-h-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart
                              margin={{
                                top: 20,
                                right: 25,
                                bottom: 20,
                                left: 0,
                              }}
                            >
                              <defs>
                                <marker
                                  id="arrowhead-genai-x"
                                  markerWidth="10"
                                  markerHeight="7"
                                  refX="0"
                                  refY="3.5"
                                  orient="auto"
                                >
                                  <polygon
                                    points="0 0, 10 3.5, 0 7"
                                    fill="hsl(var(--muted-foreground))"
                                  />
                                </marker>
                                <marker
                                  id="arrowhead-genai-y"
                                  markerWidth="10"
                                  markerHeight="7"
                                  refX="0"
                                  refY="3.5"
                                  orient="-90"
                                >
                                  <polygon
                                    points="0 0, 10 3.5, 0 7"
                                    fill="hsl(var(--muted-foreground))"
                                  />
                                </marker>
                              </defs>
                              <XAxis
                                type="number"
                                dataKey="complexity"
                                name="Complexidade"
                                domain={[0, 5]}
                                ticks={[]}
                                axisLine={{
                                  stroke: "hsl(var(--muted-foreground))",
                                  strokeWidth: 2,
                                  markerEnd: "url(#arrowhead-genai-x)",
                                }}
                                label={{
                                  value: "Complexidade",
                                  position: "insideBottomRight",
                                  offset: -5,
                                  fill: "hsl(var(--muted-foreground))",
                                  fontSize: 12,
                                }}
                              />
                              <YAxis
                                type="number"
                                dataKey="value"
                                name="Valor"
                                domain={[0, 7]}
                                ticks={[]}
                                axisLine={{
                                  stroke: "hsl(var(--muted-foreground))",
                                  strokeWidth: 2,
                                  markerStart: "url(#arrowhead-genai-y)",
                                }}
                                label={{
                                  value: "Valor",
                                  angle: 0,
                                  position: "insideTopLeft",
                                  offset: 10,
                                  dy: 20,
                                  dx: 5,
                                  fill: "hsl(var(--muted-foreground))",
                                  fontSize: 12,
                                }}
                              />
                              <RechartsTooltip
                                cursor={false}
                                content={({ payload }) => {
                                  if (payload && payload.length > 0) {
                                    const data = payload[0].payload;
                                    return (
                                      <div className="bg-popover border border-border p-3 rounded shadow-lg">
                                        <p className="font-bold text-popover-foreground">
                                          {data.title}
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                          {data.description}
                                        </p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Scatter
                                data={genAILevels}
                                shape={(props: any) => (
                                  <CustomScatterShape
                                    {...props}
                                    activeId={activeGenAI}
                                    data={genAILevels}
                                  />
                                )}
                                onClick={(data: any) => {
                                  if (data && data.payload) {
                                    setActiveGenAI(data.payload.id);
                                  }
                                }}
                              />
                            </ScatterChart>
                          </ResponsiveContainer>
                        </div>
                      </motion.div>

                      {/* Accordion 2: GenAI (Right Column) */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col justify-start h-full lg:min-h-[600px]"
                      >
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
                                    <div
                                      className="p-3 rounded-lg bg-card-foreground/10"
                                      style={{ color: item.color }}
                                    >
                                      <Icon className="w-6 h-6 shrink-0" />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-bold text-base text-foreground">
                                        {item.title}
                                      </h4>
                                      <p className="text-sm text-muted-foreground font-normal mt-1">
                                        {item.description}
                                      </p>
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="pl-16 pr-4 pt-2">
                                    <p className="text-muted-foreground leading-relaxed">
                                      {item.details}
                                    </p>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            );
                          })}
                        </Accordion>
                      </motion.div>
                    </div>
                  );
                })()}
              </TabsContent>
            </Tabs>
            <motion.p
              className="text-lg text-muted-foreground text-center mt-12 italic"
              variants={itemVariants}
            >
              {t.whatIsData.finalText}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default WhatIsDataScience;
