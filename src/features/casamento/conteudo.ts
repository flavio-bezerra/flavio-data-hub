export const casamento = {
  nomes: "Victória & Flávio",
  data: "10 de outubro de 2027",
  dataIso: "2027-10-10T13:30:00-03:00",
  diaDaSemana: "Domingo",
  dia: "10",
  mes: "outubro",
  ano: "2027",
  horario: "13h30",
  local: "DellaTorres Eventos",
  cidade: "Mairiporã — SP",
  recepcao: "Recepção a seguir no mesmo local",
  poema: "O amor é uma companhia.\nJá não sei andar só pelos caminhos,\nPorque os meus caminhos já não são só meus;",
  autor: "Alberto Caeiro",
  historia: null as string | null,
  endereco: null as string | null,
  mapaUrl: null as string | null,
  prazoPresenca: null as string | null,
} as const;

export const secoes = [
  { id: "historia", titulo: "Nossa história" },
  { id: "casamento", titulo: "O casamento" },
  { id: "orientacoes", titulo: "Orientações" },
  { id: "presentes", titulo: "Presentes" },
  { id: "presenca", titulo: "Confirmar presença" },
] as const;

export const orientacoes = [
  {
    id: "traje",
    pergunta: "Qual será o traje?",
    resposta: `O traje escolhido é <strong>esporte fino</strong>. Mas, queremos que vocês se sintam elegantes e, acima de tudo, muito confortáveis para aproveitar cada momento conosco.<br/><br/>
Para os <strong>homens</strong>, sugerimos calça social ou de sarja, camisa social ou casual e sapatênis ou sapato casual. Gravata e blazer são totalmente opcionais.<br/><br/>
Para as <strong>mulheres</strong>, sugerimos vestidos (curtos, midi ou longos), macacões ou conjuntos elegantes em tecidos leves. Como nossa celebração acontecerá em um espaço com gramado, indicamos priorizar saltos mais grossos (como salto bloco) ou plataformas para maior conforto ao caminhar.<br/><br/>
Sobre cores e tecidos, o evento começa no início da tarde, por isso tecidos fluidos e cores alegres combinam super bem com o clima do dia. Nossas madrinhas estarão vestindo tons de azul e verde, mas sintam-se totalmente à vontade caso queiram usar essas cores também. Apenas pedimos para evitarem o branco e tons muito próximos a ele, por exemplo off-white e bege claro, ou tons que se assemelhem ao branco ao tirar foto.`,
    pendente: false,
  },
  {
    id: "chegada",
    pergunta: "Onde e que horas será a cerimônia e a recepção?",
    resposta: `Celebraremos no <strong>Sítio Della Torre</strong>, em Mairiporã — SP.<br/><br/>
Nossa cerimônia começará pontualmente às <strong>13h30</strong>, por isso recomendamos que se programem com antecedência para evitar imprevistos no trajeto.<br/><br/>
A recepção acontecerá no mesmo local, logo após a cerimônia.`,
    pendente: false,
  },
  {
    id: "transporte",
    pergunta: "Como chegar, estacionamento e onde se hospedar?",
    resposta: `O Sítio Della Torre está localizado na <strong>Estrada Municipal Santo Antônio, 270 – Jardim Sandra II, Mairiporã – SP</strong>.<br/><br/>
Para quem for de carro, a melhor e mais rápida rota de acesso é pela <strong>Rodovia Fernão Dias</strong>.<br/><br/>
O local conta com <strong>estacionamento pago no espaço</strong>.<br/><br/>
No entanto, como teremos bebidas alcoólicas na festa, sugerimos priorizar o uso de transporte por aplicativo (como Uber).<br/><br/>
Também contaremos com um <strong>serviço de van oficial</strong>, com ida e volta, saindo de um hotel parceiro selecionado na região. Em breve divulgaremos aqui o nome do hotel oficial, horários e instruções para reserva. Aguardem mais atualizações.`,
    pendente: false,
  },
  {
    id: "familia",
    pergunta: "Como funciona a confirmação da família?",
    resposta: `Cada família terá um representante responsável pela confirmação de presença.<br/><br/>
Enviaremos o código de acesso à página de confirmação diretamente para o representante via WhatsApp. Ao acessar, ele deverá preencher os dados completos (nome, documento, telefone e e-mail) de todos os integrantes incluídos no convite.<br/><br/>
Os demais membros da família também receberão o convite para que fiquem por dentro de todas as informações e detalhes do nosso grande dia, mas toda a confirmação será centralizada no representante.`,
    pendente: false,
  },
  {
    id: "prazo",
    pergunta: "Até quando posso confirmar?",
    resposta: `Pedimos que a confirmação de presença seja feita até o dia <strong>10/08/2027</strong> (2 meses antes do casamento). A confirmação é super rápida e deve ser realizada diretamente aqui no site pelo representante da família, utilizando o código exclusivo enviado via WhatsApp.`,
    pendente: false,
  },
  {
    id: "nao-pode-ir",
    pergunta: "O que fazer caso não possamos ir?",
    resposta: `Entendemos que imprevistos acontecem. Por isso, caso a presença já tenha sido confirmada, mas surja algum contratempo que impeça a ida de alguém do convite, pedimos a gentileza de nos avisar o mais breve possível para ajustarmos nossa lista.`,
    pendente: false,
  },
] as const;

export interface PresenteItem {
  id: string;
  titulo: string;
  descricao: string;
  valor: number;
  livre?: boolean;
  imagem: string;
}

export const presentesCatalogo: readonly PresenteItem[] = [
  {
    "id": "filtro",
    "titulo": "Filtro de óleo para o Escort",
    "descricao": "Para o clássico continuar rodando rumo às próximas histórias.",
    "valor": 50,
    "imagem": "/rebranding/presentes/filtro.webp"
  },
  {
    "id": "jantar",
    "titulo": "Um jantar a dois",
    "descricao": "Um brinde ao começo da nossa vida juntos.",
    "valor": 150,
    "imagem": "/rebranding/presentes/jantar.webp"
  },
  {
    "id": "viagem",
    "titulo": "Um pedacinho da lua de mel",
    "descricao": "Uma contribuição para a próxima aventura.",
    "valor": 500,
    "imagem": "/rebranding/presentes/viagem.webp"
  },
  {
    "id": "gasolina",
    "titulo": "Gasolina para o Escort chegar ao altar",
    "descricao": "Amor move montanhas. O Escort ainda prefere gasolina.",
    "valor": 80,
    "imagem": "/rebranding/presentes/escort.webp"
  },
  {
    "id": "cafe",
    "titulo": "Café para o noivo funcionar",
    "descricao": "Uma dose de disposição para os planos do casal.",
    "valor": 100,
    "imagem": "/rebranding/presentes/cafe.webp"
  },
  {
    "id": "pizza",
    "titulo": "Pizza para a primeira discussão terminar bem",
    "descricao": "Meia de cada sabor. A paz começa na borda.",
    "valor": 120,
    "imagem": "/rebranding/presentes/pizza.webp"
  },
  {
    "id": "kit",
    "titulo": "Kit de sobrevivência do marido",
    "descricao": "Paciência, bom humor e a frase: você tem razão, amor.",
    "valor": 180,
    "imagem": "/rebranding/presentes/kit.webp"
  },
  {
    "id": "passeio",
    "titulo": "Um passeio inesquecível",
    "descricao": "Mais uma memória para a nossa coleção.",
    "valor": 300,
    "imagem": "/rebranding/presentes/passeio.webp"
  },
  {
    "id": "mounjaro",
    "titulo": "Mounjaro para a noiva",
    "descricao": "Uma cota bem-humorada para os planos da noiva. Só simbólica!",
    "valor": 350,
    "imagem": "/rebranding/presentes/mounjaro.webp"
  },
  {
    "id": "terapia",
    "titulo": "Terapia para quem escolher a decoração",
    "descricao": "Porque discutir cinquenta tons de azul também cansa.",
    "valor": 200,
    "imagem": "/rebranding/presentes/terapia.webp"
  },
  {
    "id": "paz",
    "titulo": "Uma diária de paz: ninguém pergunta dos filhos",
    "descricao": "Um dia inteiro sem a pergunta: e o bebê, vem quando?",
    "valor": 250,
    "imagem": "/rebranding/presentes/paz.webp"
  },
  {
    "id": "voo",
    "titulo": "Upgrade do voo",
    "descricao": "Porque amor não aumenta o espaço para as pernas.",
    "valor": 700,
    "imagem": "/rebranding/presentes/voo.webp"
  },
  {
    "id": "brinde",
    "titulo": "Um jantar de lua de mel sem converter o câmbio",
    "descricao": "Hoje a gente olha o cardápio, não a cotação.",
    "valor": 400,
    "imagem": "/rebranding/presentes/brinde.webp"
  },
  {
    "id": "aventura",
    "titulo": "Patrocínio oficial da próxima aventura",
    "descricao": "Seu carinho embarca com a gente na próxima descoberta.",
    "valor": 1000,
    "imagem": "/rebranding/presentes/aventura.webp"
  },
  {
    "id": "cota-livre",
    "titulo": "Cota de carinho livre",
    "descricao": "Escolha o valor e deixe sua mensagem para nossa nova história.",
    "valor": 0,
    "imagem": "/rebranding/presentes/cota-livre.webp",
    "livre": true
  }
];
