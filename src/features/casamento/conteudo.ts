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
  { id: "traje", pergunta: "Qual será o traje?", resposta: "Vamos compartilhar aqui o traje escolhido para a celebração.", pendente: true },
  { id: "chegada", pergunta: "Onde será a cerimônia e a recepção?", resposta: "Celebraremos no DellaTorres Eventos, em Mairiporã — SP. A recepção será no mesmo local, após a cerimônia das 13h30.", pendente: false },
  { id: "transporte", pergunta: "Como chegar e onde se hospedar?", resposta: "Endereço completo, opções de acesso e sugestões de hospedagem serão incluídos após confirmação.", pendente: true },
  { id: "familia", pergunta: "Como funciona a confirmação da família?", resposta: "Cada convite terá seu próprio link ou código. A confirmação será individual para as pessoas incluídas no convite.", pendente: false },
  { id: "prazo", pergunta: "Até quando posso confirmar?", resposta: "O prazo exato será informado aqui e no convite. Nossa meta de organização é fevereiro, com dia e ano ainda a definir.", pendente: true },
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
