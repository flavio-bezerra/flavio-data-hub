export type Language = 'pt' | 'en' | 'es';

export const translations = {
    pt: {
        hero: {
            tagline: "Mais que dados, estratégia.|Mais que insights, resultados.",
            linkedin: "LinkedIn",
            github: "GitHub",
            medium: "Medium"
        },
        about: {
            title: "Sobre Mim",
            objectiveTitle: "Objetivo deste Hub",
            objectiveText: "Este hub é o ponto de convergência entre dados técnicos e decisão estratégica. Aqui, traduzo algoritmos complexos em alavancas de negócio, demonstrando como a Ciência de Dados deixa de ser um custo para se tornar um motor de eficiência.",
            experience1: {
                part1: "Data Science",
                part2: " foi a forma pela qual meu foco em ",
                part3: "resolver problemas complexos",
                part4: " se concretizou. A partir de uma estrutura sólida baseada na ",
                part5: "análise de dados internos",
                part6: ", tornou-se possível reduzir custos, otimizar processos e, principalmente, gerar resultados de alta performance de maneira ",
                part7: "mensurável",
                part8: " e alinhada ao core do negócio."
            },
            experience2: {
                part1: "Ao longo da confecção de diversos projetos nas áreas de ",
                highlight1: "Varejo, Indústria, Supply Chain, P&D/Técnico, Jurídico, Financeiro, Administrativo, Marketing & Vendas, RH/People Analytics e Customer Success",
                part2: ", aprofundei minha especialização em ",
                highlight2: "Machine Learning, IA Generativa (LLMs), Análise Exploratória (EDA) e MLOps",
                part3: "."
            },
            tagline: {
                part1: "Mais que dados, ",
                highlight1: "estratégia",
                part2: "Mais que insights, ",
                highlight2: "resultados"
            },
            finalText: "Antes de gerar valor, precisamos construir uma visão comum sobre o verdadeiro significado da Ciência de Dados no ambiente corporativo."
        },
        whatIsData: {
            title: "O que é Ciência de Dados?",
            mckinsey: "\"Analytics é a ferramenta essencial para transformar dados brutos em vantagem competitiva, otimizando operações e criando novos modelos de negócio.\"",
            gartner: "\"Uma disciplina que une métodos científicos, algoritmos e sistemas para extrair conhecimento e insights valiosos de grandes volumes de dados.\"",
            bain: "\"Advanced Analytics permite descobrir padrões ocultos e prever comportamentos futuros para resolver os problemas mais complexos e críticos.\"",
            unifyingTitle: "A Definição Unificadora",
            unifyingText: "\"Ciência de Dados não é sobre complexidade de código, é sobre redução de incerteza. É a arte de usar o histórico da empresa para tomar decisões futuras com maior probabilidade de acerto.\"",
            vennIntro: "O modelo conceitual que melhor define essa disciplina é um Diagrama de Venn que a posiciona na interseção de três pilares fundamentais:",
            pillarsTitle: "Os Três Pilares da Ciência de Dados",
            pillar1: "Programação",
            pillar2: "Estatística",
            pillar3: "Negócio",
            card1Title: "1. Programação (A Ferramenta)",
            card1Text: "Não é apenas sobre escrever código. É a capacidade de manipular grandes volumes de dados, assim como implementar algoritmos complexos em sistemas que funcionam em escala, 24 horas por dia.",
            card2Title: "2. Estatística (A Bússola)",
            card2Text: "Não é apenas matemática complexa. É o rigor necessário para separar o que é um sinal real do que é apenas ruído ou coincidência, garantindo segurança na decisão.",
            card3Title: "3. Negócio (O Alvo)",
            card3Text: "O pilar mais importante. Sem um problema de negócio claro para resolver, todo o resto é apenas um exercício acadêmico. É o que transforma dados em dinheiro ou eficiência.",
            intersectionTitle: "4. A Interseção (Onde o Valor Nasce)",
            intersectionText: "\"Meu trabalho acontece onde esses três mundos se encontram. Uso a tecnologia e a matemática não como fim, mas como meio para responder às perguntas que tiram o sono dos gestores e entregar resultados concretos.\"",
            scopeTitle: "Do Escopo ao Deploy",
            scopeText: "Cada projeto terá o seu grau de entrega, dependente do problema a ser resolvido e do nível de maturidade do departamento. Entretanto, podemos classificar um projeto de ML Clássico e Generativo nos seguintes níveis:",
            tabClassic: "ML Clássico",
            tabGenAI: "IA Generativa",
            classicLevels: [
                {
                    title: "1. Descrevendo (O que aconteceu?)",
                    description: "Visão consolidada do histórico.",
                    details: "A Análise Descritiva é o primeiro nível e se concentra em responder à pergunta: \"O que aconteceu?\". Seu principal objetivo é consolidar e resumir dados históricos para fornecer uma visão clara do passado. Isso é comumente alcançado através de relatórios, dashboards e visualizações de dados que mostram métricas e KPIs, permitindo que a organização tenha uma compreensão básica de seu desempenho."
                },
                {
                    title: "2. Diagnosticando (Por que aconteceu?)",
                    description: "Investigação para encontrar a causa raiz.",
                    details: "Subindo um nível, a Análise Diagnóstica busca entender \"Por que aconteceu?\". Em vez de apenas observar os dados, este estágio envolve uma investigação mais profunda para descobrir as causas raízes por trás de um evento ou tendência. Utilizando técnicas como drill-down e análise de correlação."
                },
                {
                    title: "3. Prevendo (O que vai acontecer?)",
                    description: "Uso de Machine Learning para prever o futuro.",
                    details: "A Análise Preditiva muda o foco do passado para o futuro, respondendo à pergunta: \"O que vai acontecer?\". Neste nível, são aplicados modelos estatísticos e de Machine Learning sobre dados históricos para prever tendências e comportamentos futuros. Exemplos incluem previsão de demanda e churn."
                },
                {
                    title: "4. Prescrevendo (O que devemos fazer?)",
                    description: "Modelos de otimização para recomendar ações.",
                    details: "Por fim, a Análise Prescritiva representa o nível mais avançado de maturidade, focado em determinar \"O que devemos fazer?\". Ela vai além da simples previsão, utilizando modelos de otimização e simulação para recomendar as melhores ações possíveis e o impacto esperado de cada decisão."
                }
            ],
            genAILevels: [
                {
                    title: "1. Engenharia de Prompt",
                    description: "Otimização de comandos para LLMs.",
                    details: "A Engenharia de Prompt é a prática de desenhar, testar e otimizar as instruções dadas a um Modelo de Linguagem de Larga Escala (LLM) para obter as respostas mais precisas, relevantes e úteis. É uma habilidade fundamental que envolve fornecer contexto e restrições claras."
                },
                {
                    title: "2. RAG (Busca Aumentada)",
                    description: "Conectando LLMs a dados privados.",
                    details: "O RAG (Retrieval-Augmented Generation) é uma técnica que potencializa um LLM ao conectá-lo a uma base de conhecimento externa, como documentos privados da empresa. O modelo busca informações relevantes e as usa como contexto para gerar uma resposta precisa e baseada em dados privados."
                },
                {
                    title: "3. Fine-tuning (Especialização)",
                    description: "Treinando o modelo em tarefas específicas.",
                    details: "O Fine-tuning é o processo de continuar o treinamento de um LLM pré-treinado com um conjunto de dados menor e específico de um domínio. Isso o torna um especialista em um estilo de linguagem particular ou em uma tarefa muito nichada."
                },
                {
                    title: "4. Multi-Agentes (Autonomia)",
                    description: "IAs que planejam e executam tarefas.",
                    details: "Os sistemas Multi-Agentes representam um nível avançado de autonomia, onde múltiplos agentes colaboram para resolver um problema complexo. Um agente planejador pode quebrar uma tarefa grande em subtarefas delegadas a agentes especialistas."
                }
            ],
            finalText: "Com o conceito claro, surge o desafio: como gerir estes projetos num ambiente onde a incerteza é alta? É aqui que entra o método."
        },
        contact: {
            title: "Vamos nos Conectar?",
            subtitle: "Interessado em trocar ideias sobre dados e inovação? Envie uma mensagem ou conecte-se no LinkedIn.",
            formTitle: "Envie uma Mensagem",
            namePlaceholder: "Seu Nome",
            emailPlaceholder: "Seu Email",
            phonePlaceholder: "Seu Telefone (Opcional)",
            messagePlaceholder: "Sua Mensagem",
            submitButton: "Enviar Email",
            sendingButton: "Enviando...",
            socialText: "Prefere redes sociais? Vamos conectar no LinkedIn!",
            copyright: "Todos os direitos reservados.",
            successMessage: "Mensagem enviada com sucesso!",
            successDescription: "Obrigado pelo contato. Retornarei em breve.",
            errorMessage: "Erro ao enviar mensagem",
            errorDescription: "Por favor, tente novamente mais tarde ou contate via LinkedIn."
        },
        methodology: {
            title: "Metodologia de Projeto",
            description: "Sabendo agora como podemos entregar um projeto (níveis de complexidade), vale mostrar como estruturamos as entregas, visto que, em Ciência de Dados, não podemos comprovar que seremos capazes de entregar um modelo treinado com boas métricas de assertividade antes de testar um cross validation com dados reais.",
            crispTitle: "As 6 Etapas do Ciclo CRISP-DM",
            clickPrompt: "Clique em uma etapa",
            agileVsData: "Data Science vs. Agile",
            softwareDev: {
                title: "Desenvolvimento de Software",
                text: "Metodologias Ágeis (Scrum) focam em **velocidade de entrega**. O objetivo é claro (ex: \"criar login\"), o risco é o tempo."
            },
            dataScience: {
                title: "Data Science",
                text: "O risco é a viabilidade técnica. O CRISP-DM existe para 'falhar rápido' (fail fast) ou validar o valor antes de escalar o investimento, protegendo o orçamento do projeto."
            },
            highlight: "O **CRISP-DM** atua como um escudo contra a incerteza: permite falhar rápido e barato na fase de testes, ou avançar com precisão cirúrgica antes de mobilizar grandes recursos de engenharia.",
            finalText: "Um método robusto é essencial, mas não roda sozinho. Quem são as peças-chave para executar este ciclo?"
        },
        crispStages: [
            {
                short: "Entendimento do Negócio",
                full: "1. Entendimento do Negócio (Business Understanding)",
                details: "A etapa mais importante. Antes de escrever qualquer código, focamos em entender: Qual é a dor do negócio? O que queremos resolver? E como vamos medir o sucesso (KPIs)?",
            },
            {
                short: "Entendimento dos Dados",
                full: "2. Entendimento dos Dados (Data Understanding)",
                details: "Olhamos para o que temos em casa. Os dados existem? São confiáveis? Têm qualidade suficiente para responder nossas perguntas? Agimos como detetives.",
            },
            {
                short: "Preparação dos Dados",
                full: "3. Preparação dos Dados (Data Preparation)",
                details: "A parte 'invisível' e mais trabalhosa (90% do tempo). Limpar, organizar e traduzir os dados brutos para uma linguagem que o computador entenda.",
            },
            {
                short: "Modelagem",
                full: "4. Modelagem (Modeling)",
                details: "Aqui a 'mágica' acontece. Testamos diferentes algoritmos para encontrar aquele que melhor aprende com o passado para prever o futuro com precisão.",
            },
            {
                short: "Avaliação",
                full: "5. Avaliação (Evaluation)",
                details: "O teste de fogo. Verificamos se o modelo realmente aprendeu ou apenas decorou, testando-o em dados inéditos (Cross-Validation) para garantir sua eficácia.",
            },
            {
                short: "Implantação",
                full: "6. Implantação (Deployment)",
                details: "Tirar do laboratório e colocar na vida real. O modelo passa a tomar decisões ou gerar recomendações automaticamente, integrado aos sistemas da empresa.",
            }
        ],
        dataTeam: {
            title: "Composição de uma Squad de Dados",
            description: "Nenhum projeto de dados de sucesso é feito por uma pessoa só. É como um time de futebol: cada jogador tem sua posição, e juntos vencem o jogo. Aqui estão os papéis essenciais:",
            roles: [
                {
                    name: "Business Stakeholder (O Patrocinador)",
                    desc: "O Patrocinador Estratégico. Define os KPIs e requisitos de negócio, validando se a solução técnica atende à estratégia corporativa. É responsável pela aprovação da Prova de Conceito (PoC) e pela confirmação do retorno sobre o investimento (ROI).",
                },
                {
                    name: "Product Owner (O Tradutor)",
                    desc: "A ponte entre a estratégia e a execução técnica. Gerencia o backlog do produto e prioriza as entregas baseadas em valor de negócio. Traduz necessidades complexas em User Stories claras, garantindo que o time desenvolva a feature certa no momento certo.",
                },
                {
                    name: "Engenheiro de Dados (O Arquiteto)",
                    desc: "Projeta e mantém arquiteturas escaláveis (Data Lakes/Warehouses). Constrói pipelines de ETL/ELT robustos que integram, limpam e disponibilizam dados de diversas fontes, garantindo a qualidade e a governança da matéria-prima analítica.",
                },
                {
                    name: "Analista de Dados / BI (O Historiador)",
                    desc: "Especialista em análise descritiva e diagnóstica. Utiliza SQL e ferramentas de Data Viz para transformar dados brutos em dashboards interativos, monitorando métricas históricas e identificando padrões que explicam o comportamento do negócio.",
                },
                {
                    name: "Cientista de Dados (O Estrategista/Preditivo)",
                    desc: "Foca em análise preditiva e prescritiva. Aplica estatística avançada e algoritmos de Machine Learning para treinar modelos que antecipam cenários futuros, realizam recomendações automatizadas e otimizam a tomada de decisão.",
                },
                {
                    name: "Engenheiro de MLOps (O Piloto)",
                    desc: "Operacionaliza o ciclo de vida do modelo. Implementa esteiras de CI/CD para automação, garante o deploy seguro em produção e monitora a saúde dos modelos (Data/Model Drift), assegurando escalabilidade e alta disponibilidade.",
                }
            ],
            finalText: "Com o método definido e a equipa montada, resta a pergunta mais importante de qualquer executivo: Quanto vou ganhar com isso?"
        },
        roiCalculator: {
            title: "Priorização pelo ROI",
            description: "Agora que entendemos o que é Ciência de Dados, quais são suas entregas e como as diferentes posições se relacionam, é hora de definir como mensurar o impacto de cada projeto. A seguir, apresento um esboço de cálculos baseado na metodologia World Class e Green Belt.",
            investment: {
                title: "1. Investimento (Custos)",
                description: "Recursos consumidos para executar o projeto. Inclui tempo da equipe, infraestrutura e ferramentas.",
                people: {
                    title: "Pessoas (Tempo da Equipe)",
                    description: "Quanto tempo a equipe vai dedicar ao projeto? Multiplique pelas horas e pelo salário. Esse é o custo de oportunidade: o que eles poderiam estar fazendo?"
                },
                technology: {
                    title: "Tecnologia & Ferramentas",
                    description: "Servidores na nuvem, licenças de software, armazenamento de dados. Tudo que é necessário para rodar a solução."
                }
            },
            generates: "Gera",
            return: {
                title: "2. Retorno (Ganhos)",
                description: "Valor gerado para o negócio. Pode ser aumento de receita, redução de custos, eficiência ou mitigação de riscos.",
                revenue: {
                    title: "Aumento de Receita",
                    description: "Dinheiro novo entrando. Ex: Sistema de recomendação que aumenta vendas."
                },
                pnl: {
                    title: "Impacto direto no P&L (Lucros e Perdas)",
                    description: "Dinheiro que deixa de sair do caixa. Ex: Redução de estoque parado, menos desperdício."
                },
                efficiency: {
                    title: "Custo de Oportunidade e Eficiência Operacional",
                    description: "O time faz mais em menos tempo. Ex: Automação de relatórios que liberaba 10h/semana."
                },
                losses: {
                    title: "Evitar Perdas Futuras",
                    description: "Problemas que não aconteceram. Ex: Detectar fraude antes do prejuízo, evitar multas, reter clientes."
                }
            },
            formula: {
                title: "A FÓRMULA DE OURO",
                gains: "Ganhos",
                costs: "Custos",
                rule: "*Regra de Ouro:",
                ruleText: "Se o projeto não tem um ROI positivo claro e mensurável, ele não sai do papel. Priorizamos o que traz retorno real, não o que é apenas \"legal\" ou \"inovador\". A Ciência de Dados deve pagar-se a si mesma."
            },
            finalText: "A teoria é clara. Agora, convido você a explorar minha página e ver como transformei essa mentalidade em cenários reais."
        },
        portfolio: {
            title: "Portfólio de Soluções",
            subtitle: "Onde a Teoria Encontra a Prática",
            description: "Mais do que apenas listar tecnologias, acredito em demonstrar valor real. Meu trabalho se concentra em transformar desafios de negócio complexos em soluções de dados funcionais, com uma entrega end-to-end: do código à documentação técnica e de negócio detalhada, garantindo que o projeto seja sustentável, auditável e compreensível por todos os stakeholders.",
            invite: "Convido você a explorar os projetos, códigos e artigos onde detalho essas implementações:",
            cta: "Veja como esses conceitos são aplicados na prática:",
            items: [
                {
                    title: "Análise Diagnóstica e Inferência Estatística",
                    description: "Antes de prever o futuro, é preciso compreender profundamente o presente e o passado. Realizo análises exploratórias robustas, aplicando inferência estatística para validar hipóteses e análises diagnósticas para identificar a causa raiz de comportamentos e anomalias nos dados."
                },
                {
                    title: "Pesquisa Operacional e Simulação",
                    description: "Para cenários de alta complexidade, combino o poder preditivo do Machine Learning com a precisão de sistemas de simulação e otimização matemática. Essa abordagem híbrida permite testar cenários (\"what-if\") e tomar decisões ótimas em ambientes dinâmicos."
                },
                {
                    title: "De Modelos de Machine Learning à Produção (MLOps)",
                    description: "Não basta criar um modelo; ele precisa gerar valor em produção. Minha experiência cobre o ciclo completo, desde a Análise Exploratória (EDA) até o deployment e monitoramento contínuo, assegurando a escalabilidade e a governança das soluções."
                },
                {
                    title: "IA Generativa (LLMs) para Negócios",
                    description: "Vou além do hype. Aplico LLMs para criar soluções práticas, como assistentes virtuais e otimização de processos baseados em texto, focando estritamente em aplicações que trazem um ROI claro para a organização."
                },
                {
                    title: "Core Business vs. Back-Office",
                    description: "A ciência de dados é transversal e deve permear toda a organização. Minha especialização é traduzir as necessidades específicas de diversas frentes (Varejo, Indústria, Supply Chain, P&D/Técnico, Jurídico, Financeiro, Administrativo, Marketing & Vendas, RH/People Analytics e Customer Success) em modelos de dados eficientes que resolvem problemas reais de negócio."
                }
            ],
            buttons: {
                linkedin: "Ver Resumo dos Projetos",
                github: "Ver Códigos",
                medium: "Ler Artigos"
            }
        }
    },
    en: {
        hero: {
            tagline: "More than data, strategy.|More than insights, results.",
            linkedin: "LinkedIn",
            github: "GitHub",
            medium: "Medium"
        },
        about: {
            title: "About Me",
            objectiveTitle: "Hub Objective",
            objectiveText: "This hub is the meeting point between technical data and strategic decision-making. Here, I translate complex algorithms into business levers, demonstrating how Data Science ceases to be a cost to become an engine of efficiency.",
            experience1: {
                part1: "Data Science",
                part2: " was the way my focus on ",
                part3: "solving complex problems",
                part4: " materialized. Based on a solid structure of ",
                part5: "internal data analysis",
                part6: ", it became possible to reduce costs, optimize processes, and, above all, generate high-performance results in a ",
                part7: "measurable",
                part8: " way aligned with the core business."
            },
            experience2: {
                part1: "Throughout the development of various projects in ",
                highlight1: "Retail, Industry, Supply Chain, R&D/Technical, Legal, Financial, Administrative, Marketing & Sales, HR/People Analytics, and Customer Success",
                part2: ", I deepened my specialization in ",
                highlight2: "Machine Learning, Generative AI (LLMs), Exploratory Data Analysis (EDA), and MLOps",
                part3: "."
            },
            tagline: {
                part1: "More than data, ",
                highlight1: "strategy",
                part2: "More than insights, ",
                highlight2: "results"
            },
            finalText: "Before generating value, we need to build a common vision of the true meaning of Data Science in the corporate environment."
        },
        whatIsData: {
            title: "What is Data Science?",
            mckinsey: "\"Analytics is the essential tool for transforming raw data into competitive advantage, optimizing operations, and creating new business models.\"",
            gartner: "\"A discipline that unites scientific methods, algorithms, and systems to extract knowledge and valuable insights from large volumes of data.\"",
            bain: "\"Advanced Analytics allows discovering hidden patterns and predicting future behaviors to solve the most complex and critical problems.\"",
            unifyingTitle: "The Unifying Definition",
            unifyingText: "\"Data Science is not about code complexity, it is about uncertainty reduction. It is the art of using the company's history to make future decisions with greater probability of accuracy.\"",
            vennIntro: "The conceptual model that best defines this discipline is a Venn Diagram positioning it at the intersection of three fundamental pillars:",
            pillarsTitle: "The Three Pillars of Data Science",
            pillar1: "Programming",
            pillar2: "Statistics",
            pillar3: "Business",
            card1Title: "1. Programming (The Tool)",
            card1Text: "It's not just about writing code. It is the ability to manipulate large volumes of data, as well as implementing complex algorithms in systems that work at scale, 24 hours a day.",
            card2Title: "2. Statistics (The Compass)",
            card2Text: "It's not just complex math. It is the rigor necessary to separate what is a real signal from what is just noise or coincidence, ensuring security in decision making.",
            card3Title: "3. Business (The Target)",
            card3Text: "The most important pillar. Without a clear business problem to solve, everything else is just an academic exercise. It is what transforms data into money or efficiency.",
            intersectionTitle: "4. The Intersection (Where Value is Born)",
            intersectionText: "\"My work happens where these three worlds meet. I use technology and math not as an end, but as a means to answer the questions that keep managers awake at night and deliver concrete results.\"",
            scopeTitle: "From Scope to Deploy",
            scopeText: "Each project will have its degree of delivery, depending on the problem to be solved and the department's maturity level. However, we can classify a Classic ML and Generative project into the following levels:",
            tabClassic: "Classic ML",
            tabGenAI: "Generative AI",
            classicLevels: [
                {
                    title: "1. Describing (What happened?)",
                    description: "Consolidated view of history.",
                    details: "Descriptive Analysis is the first level and focuses on answering the question: \"What happened?\". Its main objective is to consolidate and summarize historical data to provide a clear view of the past. This is commonly achieved through reports, dashboards, and data visualizations showing metrics and KPIs."
                },
                {
                    title: "2. Diagnosing (Why did it happen?)",
                    description: "Investigation to find the root cause.",
                    details: "Moving up a level, Diagnostic Analysis seeks to understand \"Why did it happen?\". Instead of just observing the data, this stage involves a deeper investigation to discover the root causes behind an event or trend, using techniques like drill-down and correlation analysis."
                },
                {
                    title: "3. Predicting (What will happen?)",
                    description: "Using Machine Learning to predict the future.",
                    details: "Predictive Analysis shifts the focus from the past to the future, answering the question: \"What will happen?\". At this level, statistical and Machine Learning models are applied to historical data to predict future trends and behaviors. Examples include demand forecasting and churn."
                },
                {
                    title: "4. Prescribing (What should we do?)",
                    description: "Optimization models to recommend actions.",
                    details: "Finally, Prescriptive Analysis represents the most advanced level of maturity, focused on determining \"What should we do?\". It goes beyond simple prediction, using optimization and simulation models to recommend the best possible actions and the expected impact of each decision."
                }
            ],
            genAILevels: [
                {
                    title: "1. Prompt Engineering",
                    description: "Optimizing commands for LLMs.",
                    details: "Prompt Engineering is the practice of designing, testing, and optimizing instructions given to a Large Language Model (LLM) to obtain the most accurate, relevant, and useful responses. It is a fundamental skill involving context and clear constraints."
                },
                {
                    title: "2. RAG (Augmented Search)",
                    description: "Connecting LLMs to private data.",
                    details: "RAG (Retrieval-Augmented Generation) is a technique that empowers an LLM by connecting it to an external knowledge base, like private company documents. The model retrieves relevant information and uses it as context to generate precise responses based on private data."
                },
                {
                    title: "3. Fine-tuning (Specialization)",
                    description: "Training the model on specific tasks.",
                    details: "Fine-tuning is the process of continuing the training of a pre-trained LLM with a smaller, domain-specific dataset. This makes it an expert in a particular language style or a very niche task."
                },
                {
                    title: "4. Multi-Agents (Autonomy)",
                    description: "AIs that plan and execute tasks.",
                    details: "Multi-Agent systems represent an advanced level of autonomy where multiple agents collaborate to solve a complex problem. A planner agent can break a large task into subtasks delegated to specialist agents."
                }
            ],
            finalText: "With the concept clear, the challenge arises: how to manage these projects in an environment where uncertainty is high? This is where the method comes in."
        },
        contact: {
            title: "Let's Connect?",
            subtitle: "Interested in exchanging ideas about data and innovation? Send a message or connect on LinkedIn.",
            formTitle: "Send a Message",
            namePlaceholder: "Your Name",
            emailPlaceholder: "Your Email",
            phonePlaceholder: "Your Phone (Optional)",
            messagePlaceholder: "Your Message",
            submitButton: "Send Email",
            sendingButton: "Sending...",
            socialText: "Prefer social media? Let's connect on LinkedIn!",
            copyright: "All rights reserved.",
            successMessage: "Message sent successfully!",
            successDescription: "Thanks for reaching out. I'll get back to you soon.",
            errorMessage: "Error sending message",
            errorDescription: "Please try again later or contact via LinkedIn."
        },
        methodology: {
            title: "Project Methodology",
            description: "Knowing now how we can deliver a project (levels of complexity), it is worth showing how we structure deliveries, given that in Data Science, we cannot prove that we will be able to deliver a trained model with good assertiveness metrics before testing a cross validation with real data.",
            crispTitle: "The 6 Steps of the CRISP-DM Cycle",
            clickPrompt: "Click on a step",
            agileVsData: "Data Science vs. Agile",
            softwareDev: {
                title: "Software Development",
                text: "Agile methodologies (Scrum) focus on **delivery speed**. The goal is clear (e.g., \"create login\"), the risk is time."
            },
            dataScience: {
                title: "Data Science",
                text: "The risk is technical feasibility. CRISP-DM exists to 'fail fast' or validate value before scaling investment, protecting the project budget."
            },
            highlight: "**CRISP-DM** acts as a shield against uncertainty: it allows failing fast and cheap in the testing phase, or advancing with surgical precision before mobilizing large engineering resources.",
            finalText: "A robust method is essential, but it doesn't run alone. Who are the key players to execute this cycle?"
        },
        crispStages: [
            {
                short: "Business Understanding",
                full: "1. Business Understanding",
                details: "The most important step. Before writing any code, we focus on understanding: What is the business pain? What do we want to solve? And how will we measure success (KPIs)?",
            },
            {
                short: "Data Understanding",
                full: "2. Data Understanding",
                details: "We look at what we have at home. Do the data exist? Are they reliable? Do they have enough quality to answer our questions? We act like detectives.",
            },
            {
                short: "Data Preparation",
                full: "3. Data Preparation",
                details: "The 'invisible' and most laborious part (90% of the time). Cleaning, organizing, and translating raw data into a language that the computer understands.",
            },
            {
                short: "Modeling",
                full: "4. Modeling",
                details: "Where the 'magic' happens. We test different algorithms to find the one that best learns from the past to predict the future accurately.",
            },
            {
                short: "Evaluation",
                full: "5. Evaluation",
                details: "The fire test. We verify if the model really learned or just memorized, testing it on unseen data (Cross-Validation) to ensure its effectiveness.",
            },
            {
                short: "Deployment",
                full: "6. Deployment",
                details: "Taking it from the lab to real life. The model starts making decisions or generating recommendations automatically, integrated into company systems.",
            }
        ],
        dataTeam: {
            title: "Data Squad Composition",
            description: "No successful data project is done by one person alone. It's like a soccer team: each player has their position, and together they win the game. Here are the essential roles:",
            roles: [
                {
                    name: "Business Stakeholder (The Sponsor)",
                    desc: "The Strategic Sponsor. Defines KPIs and business requirements, validating if the technical solution meets corporate strategy. Responsible for PoC approval and confirming ROI.",
                },
                {
                    name: "Product Owner (The Translator)",
                    desc: "The bridge between strategy and technical execution. Manages product backlog and prioritizes deliveries based on business value. Translates complex needs into clear User Stories.",
                },
                {
                    name: "Data Engineer (The Architect)",
                    desc: "Designs and maintains scalable architectures (Data Lakes/Warehouses). Builds robust ETL/ELT pipelines integrating, cleaning, and making data available from various sources.",
                },
                {
                    name: "Data Analyst / BI (The Historian)",
                    desc: "Specialist in descriptive and diagnostic analysis. Uses SQL and Data Viz tools to transform raw data into interactive dashboards, monitoring historical metrics.",
                },
                {
                    name: "Data Scientist (The Strategist/Predictive)",
                    desc: "Focuses on predictive and prescriptive analysis. Applies advanced statistics and Machine Learning algorithms to train models that anticipate future scenarios.",
                },
                {
                    name: "MLOps Engineer (The Pilot)",
                    desc: "Operationalizes the model lifecycle. Implements CI/CD pipelines for automation, ensures secure production deployment, and monitors model health (Data/Model Drift).",
                }
            ],
            finalText: "With the method defined and the team assembled, the most important question for any executive remains: How much will I earn from this?"
        },
        roiCalculator: {
            title: "Prioritization by ROI",
            description: "Now that we understand what Data Science is, what its deliverables are, and how different roles relate, it's time to define how to measure the impact of each project. Below, I present a calculation outline based on World Class and Green Belt methodology.",
            investment: {
                title: "1. Investment (Costs)",
                description: "Resources consumed to execute the project. Includes team time, infrastructure, and tools.",
                people: {
                    title: "People (Team Time)",
                    description: "How much time will the team dedicate to the project? Multiply by hours and salary. This is the opportunity cost: what could they be doing instead?"
                },
                technology: {
                    title: "Technology & Tools",
                    description: "Cloud servers, software licenses, data storage. Everything needed to run the solution."
                }
            },
            generates: "Generates",
            return: {
                title: "2. Return (Gains)",
                description: "Value generated for the business. Can be revenue increase, cost reduction, efficiency, or risk mitigation.",
                revenue: {
                    title: "Revenue Increase",
                    description: "New money coming in. Ex: Recommendation system that increases sales."
                },
                pnl: {
                    title: "Direct P&L Impact (Profit & Loss)",
                    description: "Money that stops leaving the cash flow. Ex: Reduction of idle stock, less waste."
                },
                efficiency: {
                    title: "Opportunity Cost and Operational Efficiency",
                    description: "The team does more in less time. Ex: Report automation that freed up 10h/week."
                },
                losses: {
                    title: "Avoid Future Losses",
                    description: "Problems that didn't happen. Ex: Detecting fraud before loss, avoiding fines, retaining customers."
                }
            },
            formula: {
                title: "THE GOLD FORMULA",
                gains: "Gains",
                costs: "Costs",
                rule: "*Gold Rule:",
                ruleText: "If the project doesn't have a clear and measurable positive ROI, it doesn't get off the ground. We prioritize what brings real return, not just what is \"cool\" or \"innovative\". Data Science must pay for itself."
            },
            finalText: "The theory is clear. Now, I invite you to explore my page and see how I transformed this mindset into real scenarios."
        },
        portfolio: {
            title: "Solutions Portfolio",
            subtitle: "Where Theory Meets Practice",
            description: "More than just listing technologies, I believe in demonstrating real value. My work focuses on transforming complex business challenges into functional data solutions, with end-to-end delivery: from code to detailed technical and business documentation, ensuring the project is sustainable, auditable, and understandable by all stakeholders.",
            invite: "I invite you to explore the projects, code, and articles where I detail these implementations:",
            cta: "See how these concepts are applied in practice:",
            items: [
                {
                    title: "Diagnostic Analysis and Statistical Inference",
                    description: "Before predicting the future, one must deeply understand the present and the past. I perform robust exploratory analyses, applying statistical inference to validate hypotheses and diagnostic analyses to identify the root cause of behaviors and anomalies in the data."
                },
                {
                    title: "Operational Research and Simulation",
                    description: "For highly complex scenarios, I combine the predictive power of Machine Learning with the precision of simulation systems and mathematical optimization. This hybrid approach allows testing scenarios (\"what-if\") and making optimal decisions in dynamic environments."
                },
                {
                    title: "From Machine Learning Models to Production (MLOps)",
                    description: "It's not enough to create a model; it must generate value in production. My experience covers the complete cycle, from Exploratory Analysis (EDA) to deployment and continuous monitoring, ensuring scalability and governance of solutions."
                },
                {
                    title: "Generative AI (LLMs) for Business",
                    description: "I go beyond the hype. I apply LLMs to create practical solutions, such as virtual assistants and text-based process optimization, focusing strictly on applications that bring a clear ROI to the organization."
                },
                {
                    title: "Core Business vs. Back-Office",
                    description: "Data science is transversal and should permeate the entire organization. My specialization is translating specific needs from various fronts (Retail, Industry, Supply Chain, R&D/Technical, Legal, Financial, Administrative, Marketing & Sales, HR/People Analytics, and Customer Success) into efficient data models that solve real business problems."
                }
            ],
            buttons: {
                linkedin: "View Project Summary",
                github: "View Code",
                medium: "Read Articles"
            }
        }
    },
    es: {
        hero: {
            tagline: "Más que datos, estrategia.|Más que insights, resultados.",
            linkedin: "LinkedIn",
            github: "GitHub",
            medium: "Medium"
        },
        about: {
            title: "Sobre Mí",
            objectiveTitle: "Objetivo de este Hub",
            objectiveText: "Este hub es el punto de convergencia entre datos técnicos y decisión estratégica. Aquí, traduzco algoritmos complejos en palancas de negocio, demostrando cómo la Ciencia de Datos deja de ser un costo para convertirse en un motor de eficiencia.",
            experience1: {
                part1: "Data Science",
                part2: " fue la forma en que mi enfoque en ",
                part3: "resolver problemas complejos",
                part4: " se concretó. A partir de una estructura sólida basada en el ",
                part5: "análisis de datos internos",
                part6: ", fue posible reducir costos, optimizar procesos y, sobre todo, generar resultados de alto rendimiento de manera ",
                part7: "medible",
                part8: " y alineada con el núcleo del negocio."
            },
            experience2: {
                part1: "A lo largo de la realización de diversos proyectos en las áreas de ",
                highlight1: "Retail, Industria, Cadena de Suministro, I+D/Técnico, Legal, Financiero, Administrativo, Marketing y Ventas, RRHH/People Analytics y Customer Success",
                part2: ", profundicé mi especialización en ",
                highlight2: "Machine Learning, IA Generativa (LLMs), Análisis Exploratorio (EDA) y MLOps",
                part3: "."
            },
            tagline: {
                part1: "Más que datos, ",
                highlight1: "estrategia",
                part2: "Más que insights, ",
                highlight2: "resultados"
            },
            finalText: "Antes de generar valor, necesitamos construir una visión común sobre el verdadero significado de la Ciencia de Datos en el entorno corporativo."
        },
        whatIsData: {
            title: "¿Qué es Ciencia de Datos?",
            mckinsey: "\"Analytics es la herramienta esencial para transformar datos brutos en ventaja competitiva, optimizando operaciones y creando nuevos modelos de negocio.\"",
            gartner: "\"Una disciplina que une métodos científicos, algoritmos y sistemas para extraer conocimiento e insights valiosos de grandes volúmenes de datos.\"",
            bain: "\"Advanced Analytics permite descubrir patrones ocultos y predecir comportamientos futuros para resolver los problemas más complejos y críticos.\"",
            unifyingTitle: "La Definición Unificadora",
            unifyingText: "\"Ciencia de Datos no es sobre complejidad de código, es sobre reducción de incertidumbre. Es el arte de usar el historial de la empresa para tomar decisiones futuras con mayor probabilidad de acierto.\"",
            vennIntro: "El modelo conceptual que mejor define esta disciplina es un Diagrama de Venn que la posiciona en la intersección de tres pilares fundamentales:",
            pillarsTitle: "Los Tres Pilares de la Ciencia de Datos",
            pillar1: "Programación",
            pillar2: "Estadística",
            pillar3: "Negocio",
            card1Title: "1. Programación (La Herramienta)",
            card1Text: "No es solo escribir código. Es la capacidad de manipular grandes volúmenes de datos, así como implementar algoritmos complejos en sistemas que funcionan a escala, las 24 horas del día.",
            card2Title: "2. Estadística (La Brújula)",
            card2Text: "No es solo matemáticas complejas. Es el rigor necesario para separar lo que es una señal real de lo que es solo ruido o coincidencia, garantizando seguridad en la decisión.",
            card3Title: "3. Negocio (El Objetivo)",
            card3Text: "El pilar más importante. Sin un problema de negocio claro que resolver, todo lo demás es solo un ejercicio académico. Es lo que transforma datos en dinero o eficiencia.",
            intersectionTitle: "4. La Intersección (Donde Nace el Valor)",
            intersectionText: "\"Mi trabajo ocurre donde estos tres mundos se encuentran. Uso la tecnología y las matemáticas no como fin, sino como medio para responder a las preguntas que quitan el sueño a los gerentes y entregar resultados concretos.\"",
            scopeTitle: "Del Alcance al Despliegue",
            scopeText: "Cada proyecto tendrá su grado de entrega, dependiendo del problema a resolver y del nivel de madurez del departamento. Sin embargo, podemos clasificar un proyecto de ML Clásico y Generativo en los siguientes niveles:",
            tabClassic: "ML Clásico",
            tabGenAI: "IA Generativa",
            classicLevels: [
                {
                    title: "1. Describiendo (¿Qué pasó?)",
                    description: "Visión consolidada del historial.",
                    details: "El Análisis Descriptivo es el primer nivel y se concentra en responder a la pregunta: \"¿Qué pasó?\". Su objetivo principal es consolidar datos históricos para proporcionar una visión clara del pasado. Esto se logra comúnmente a través de informes y tableros que muestran métricas y KPIs."
                },
                {
                    title: "2. Diagnosticando (¿Por qué pasó?)",
                    description: "Investigación para encontrar la causa raíz.",
                    details: "Subiendo un nivel, el Análisis de Diagnóstico busca entender \"¿Por qué pasó?\". En lugar de solo observar datos, esta etapa implica una investigación más profunda para descubrir las causas detrás de un evento o tendencia, utilizando técnicas como drill-down."
                },
                {
                    title: "3. Prediciendo (¿Qué pasará?)",
                    description: "Uso de Machine Learning para predecir el futuro.",
                    details: "El Análisis Predictivo cambia el enfoque del pasado al futuro, respondiendo a la pregunta: \"¿Qué pasará?\". En este nivel, se aplican modelos estadísticos y de Machine Learning sobre datos históricos para predecir tendencias futuras. Ejemplos incluyen previsión de demanda y churn."
                },
                {
                    title: "4. Prescribiendo (¿Qué debemos hacer?)",
                    description: "Modelos de optimización para recomendar acciones.",
                    details: "Finalmente, el Análisis Prescriptivo representa el nivel más avanzado, enfocado en determinar \"¿Qué debemos hacer?\". Va más allá de la predicción, utilizando modelos de optimización para recomendar las mejores acciones posibles y el impacto esperado."
                }
            ],
            genAILevels: [
                {
                    title: "1. Ingeniería de Prompts",
                    description: "Optimización de comandos para LLMs.",
                    details: "La Ingeniería de Prompts es la práctica de diseñar, probar y optimizar las instrucciones dadas a un Modelo de Lenguaje de Gran Escala (LLM) para obtener respuestas precisas y útiles. Es una habilidad fundamental que implica proporcionar contexto y restricciones claras."
                },
                {
                    title: "2. RAG (Búsqueda Aumentada)",
                    description: "Conectando LLMs a datos privados.",
                    details: "RAG (Retrieval-Augmented Generation) es una técnica que potencia un LLM conectándolo a una base de conocimientos externa. El modelo busca información relevante y la usa como contexto para generar una respuesta precisa basada en datos privados."
                },
                {
                    title: "3. Fine-tuning (Especialización)",
                    description: "Entrenando el modelo en tareas específicas.",
                    details: "El Fine-tuning es el proceso de continuar el entrenamiento de un LLM con un conjunto de datos menor y específico. Esto lo convierte en un experto en un estilo de lenguaje particular o en una tarea muy nicho."
                },
                {
                    title: "4. Multi-Agentes (Autonomía)",
                    description: "IAs que planifican y ejecutan tareas.",
                    details: "Los sistemas Multi-Agentes representan un nivel avanzado de autonomía donde múltiples agentes colaboran para resolver un problema complejo. Un agente planificador puede dividir una tarea grande en subtareas delegadas a agentes especialistas."
                }
            ],
            finalText: "Con el concepto claro, surge el desafío: ¿cómo gestionar estos proyectos en un entorno donde la incertidumbre es alta? Aquí es donde entra el método."
        },
        contact: {
            title: "¿Conectamos?",
            subtitle: "¿Interesado en intercambiar ideas sobre datos e innovación? Envía un mensaje o conecta en LinkedIn.",
            formTitle: "Envía un Mensaje",
            namePlaceholder: "Tu Nombre",
            emailPlaceholder: "Tu Email",
            phonePlaceholder: "Tu Teléfono (Opcional)",
            messagePlaceholder: "Tu Mensaje",
            submitButton: "Enviar Email",
            sendingButton: "Enviando...",
            socialText: "¿Prefieres las redes sociales? ¡Conectemos en LinkedIn!",
            copyright: "Todos los derechos reservados.",
            successMessage: "¡Mensaje enviado con éxito!",
            successDescription: "Gracias por contactar. Te responderé pronto.",
            errorMessage: "Error al enviar mensaje",
            errorDescription: "Por favor, intenta nuevamente más tarde o contacta vía LinkedIn."
        },
        methodology: {
            title: "Metodología del Proyecto",
            description: "Sabiendo ahora cómo podemos entregar un proyecto (niveles de complejidad), vale la pena mostrar cómo estructuramos las entregas, dado que en Ciencia de Datos no podemos probar que seremos capaces de entregar un modelo entrenado con buenas métricas antes de probar una validación cruzada con datos reales.",
            crispTitle: "Las 6 Etapas del Ciclo CRISP-DM",
            clickPrompt: "Haga clic en una etapa",
            agileVsData: "Data Science vs. Agile",
            softwareDev: {
                title: "Desarrollo de Software",
                text: "Las metodologías ágiles (Scrum) se centran en la **velocidad de entrega**. El objetivo es claro (ej: \"crear login\"), el riesgo es el tiempo."
            },
            dataScience: {
                title: "Data Science",
                text: "El riesgo es la viabilidad técnica. CRISP-DM existe para 'fallar rápido' o validar el valor antes de escalar la inversión, protegiendo el presupuesto del proyecto."
            },
            highlight: "**CRISP-DM** actúa como un escudo contra la incertidumbre: permite fallar rápido y barato en la fase de pruebas, o avanzar con precisión quirúrgica antes de movilizar grandes recursos de ingeniería.",
            finalText: "Un método robusto es esencial, pero no funciona solo. ¿Quiénes son las piezas clave para ejecutar este ciclo?"
        },
        crispStages: [
            {
                short: "Entendimiento del Negocio",
                full: "1. Entendimiento del Negocio (Business Understanding)",
                details: "La etapa más importante. Antes de escribir cualquier código, nos enfocamos en entender: ¿Cuál es el dolor del negocio? ¿Qué queremos resolver? ¿Y cómo mediremos el éxito (KPIs)?",
            },
            {
                short: "Entendimiento de los Datos",
                full: "2. Entendimiento de los Datos (Data Understanding)",
                details: "Miramos lo que tenemos en casa. ¿Existen los datos? ¿Son confiables? ¿Tienen calidad suficiente para responder nuestras preguntas? Actuamos como detectives.",
            },
            {
                short: "Preparación de los Datos",
                full: "3. Preparación de los Datos (Data Preparation)",
                details: "La parte 'invisible' y más laboriosa (90% del tiempo). Limpiar, organizar y traducir los datos brutos a un lenguaje que la computadora entienda.",
            },
            {
                short: "Modelado",
                full: "4. Modelado (Modeling)",
                details: "Donde ocurre la 'magia'. Probamos diferentes algoritmos para encontrar el que mejor aprenda del pasado para predecir el futuro con precisión.",
            },
            {
                short: "Evaluación",
                full: "5. Evaluación (Evaluation)",
                details: "La prueba de fuego. Verificamos si el modelo realmente aprendió o solo memorizó, probándolo en datos inéditos (Cross-Validation) para garantizar su efectividad.",
            },
            {
                short: "Despliegue",
                full: "6. Despliegue (Deployment)",
                details: "Sacarlo del laboratorio y ponerlo en la vida real. El modelo comienza a tomar decisiones o generar recomendaciones automáticamente, integrado a los sistemas de la empresa.",
            }
        ],
        dataTeam: {
            title: "Composición de un Squad de Datos",
            description: "Ningún proyecto de datos exitoso es hecho por una sola persona. Es como un equipo de fútbol: cada jugador tiene su posición, y juntos ganan el juego. Aquí están los roles esenciales:",
            roles: [
                {
                    name: "Business Stakeholder (El Patrocinador)",
                    desc: "El Patrocinador Estratégico. Define los KPIs y requisitos de negocio, validando si la solución técnica cumple con la estrategia corporativa. Responsable de la aprobación de la PoC y de confirmar el ROI.",
                },
                {
                    name: "Product Owner (El Traductor)",
                    desc: "El puente entre la estrategia y la ejecución técnica. Gestiona el backlog del producto y prioriza las entregas basadas en valor de negocio. Traduce necesidades complejas en Historias de Usuario claras.",
                },
                {
                    name: "Ingeniero de Datos (El Arquitecto)",
                    desc: "Diseña y mantiene arquitecturas escalables (Data Lakes/Warehouses). Construye pipelines de ETL/ELT robustos que integran, limpian y disponibilizan datos de diversas fuentes.",
                },
                {
                    name: "Analista de Datos / BI (El Historiador)",
                    desc: "Especialista en análisis descriptivo y diagnóstico. Utiliza SQL y herramientas de Data Viz para transformar datos brutos en dashboards interactivos, monitoreando métricas históricas.",
                },
                {
                    name: "Científico de Datos (El Estratega/Predictivo)",
                    desc: "Se enfoca en análisis predictivo y prescriptivo. Aplica estadística avanzada y algoritmos de Machine Learning para entrenar modelos que anticipan escenarios futuros.",
                },
                {
                    name: "Ingeniero de MLOps (El Piloto)",
                    desc: "Operacionaliza el ciclo de vida del modelo. Implementa pipelines de CI/CD para automatización, asegura el despliegue seguro en producción y monitorea la salud de los modelos.",
                }
            ],
            finalText: "Con el método definido y el equipo reunido, la pregunta más importante para cualquier ejecutivo sigue siendo: ¿Cuánto ganaré con esto?"
        },
        roiCalculator: {
            title: "Priorización por ROI",
            description: "Ahora que entendemos qué es la Ciencia de Datos, cuáles son sus entregables y cómo se relacionan los diferentes roles, es hora de definir cómo medir el impacto de cada proyecto. A continuación, presento un esquema de cálculo basado en la metodología World Class y Green Belt.",
            investment: {
                title: "1. Inversión (Costos)",
                description: "Recursos consumidos para ejecutar el proyecto. Incluye tiempo del equipo, infraestructura y herramientas.",
                people: {
                    title: "Personas (Tiempo del Equipo)",
                    description: "¿Cuánto tiempo dedicará el equipo al proyecto? Multiplique por las horas y el salario. Este es el costo de oportunidad: ¿qué podrían estar haciendo en su lugar?"
                },
                technology: {
                    title: "Tecnología y Herramientas",
                    description: "Servidores en la nube, licencias de software, almacenamiento de datos. Todo lo necesario para ejecutar la solución."
                }
            },
            generates: "Genera",
            return: {
                title: "2. Retorno (Ganancias)",
                description: "Valor generado para el negocio. Puede ser aumento de ingresos, reducción de costos, eficiencia o mitigación de riesgos.",
                revenue: {
                    title: "Aumento de Ingresos",
                    description: "Dinero nuevo entrando. Ej: Sistema de recomendación que aumenta las ventas."
                },
                pnl: {
                    title: "Impacto directo en P&L (Pérdidas y Ganancias)",
                    description: "Dinero que deja de salir de la caja. Ej: Reducción de inventario inactivo, menos desperdicio."
                },
                efficiency: {
                    title: "Costo de Oportunidad y Eficiencia Operacional",
                    description: "El equipo hace más en menos tiempo. Ej: Automatización de informes que liberaba 10h/semana."
                },
                losses: {
                    title: "Evitar Pérdidas Futuras",
                    description: "Problemas que no ocurrieron. Ej: Detectar fraude antes de la pérdida, evitar multas, retener clientes."
                }
            },
            formula: {
                title: "LA FÓRMULA DE ORO",
                gains: "Ganancias",
                costs: "Costos",
                rule: "*Regla de Oro:",
                ruleText: "Si el proyecto no tiene un ROI positivo claro y medible, no despega. Priorizamos lo que trae retorno real, no solo lo que es \"genial\" o \"innovador\". La Ciencia de Datos debe pagarse a sí misma."
            },
            finalText: "La teoría es clara. Ahora, te invito a explorar mi página y ver cómo transformé esta mentalidad en escenarios reales."
        },
        portfolio: {
            title: "Portafolio de Soluciones",
            subtitle: "Donde la Teoría Encuentra la Práctica",
            description: "Más que solo enumerar tecnologías, creo en demostrar valor real. Mi trabajo se centra en transformar desafíos de negocio complejos en soluciones de datos funcionales, con una entrega de extremo a extremo: desde el código hasta la documentación técnica y de negocio detallada, asegurando que el proyecto sea sostenible, auditable y comprensible para todos los interesados.",
            invite: "Te invito a explorar los proyectos, códigos y artículos donde detallo estas implementaciones:",
            cta: "Mira cómo se aplican estos conceptos en la práctica:",
            items: [
                {
                    title: "Análisis Diagnóstico e Inferencia Estadística",
                    description: "Antes de predecir el futuro, hay que comprender profundamente el presente y el pasado. Realizo análisis exploratorios robustos, aplicando inferencia estadística para validar hipótesis y análisis diagnósticos para identificar la causa raíz de comportamientos y anomalías en los datos."
                },
                {
                    title: "Investigación Operativa y Simulación",
                    description: "Para escenarios de alta complejidad, combino el poder predictivo del Machine Learning con la precisión de sistemas de simulación y optimización matemática. Este enfoque híbrido permite probar escenarios (\"what-if\") y tomar decisiones óptimas en entornos dinámicos."
                },
                {
                    title: "De Modelos de Machine Learning a Producción (MLOps)",
                    description: "No basta con crear un modelo; debe generar valor en producción. Mi experiencia cubre el ciclo completo, desde el Análisis Exploratorio (EDA) hasta el despliegue y monitoreo continuo, asegurando la escalabilidad y gobernanza de las soluciones."
                },
                {
                    title: "IA Generativa (LLMs) para Negocios",
                    description: "Voy más allá del hype. Aplico LLMs para crear soluciones prácticas, como asistentes virtuales y optimización de procesos basados en texto, enfocándome estrictamente en aplicaciones que traen un ROI claro para la organización."
                },
                {
                    title: "Negocio Principal vs. Back-Office",
                    description: "La ciencia de datos es transversal y debe impregnar toda la organización. Mi especialización es traducir las necesidades específicas de varios frentes (Minorista, Industria, Cadena de Suministro, I+D/Técnico, Legal, Financiero, Administrativo, Marketing y Ventas, RRHH/People Analytics y Éxito del Cliente) en modelos de datos eficientes que resuelven problemas reales de negocio."
                }
            ],
            buttons: {
                linkedin: "Ver Resumen de Proyectos",
                github: "Ver Códigos",
                medium: "Leer Artículos"
            }
        }
    }
};

