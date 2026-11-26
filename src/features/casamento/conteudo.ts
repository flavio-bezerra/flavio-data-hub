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
  endereco: "Estrada Municipal Santo Antônio, 270 · Jardim Sandra II",
  mapaUrl: "https://share.google/L0x8K9IaHNxRe33Fl",
  mapaEmbedUrl: "https://www.google.com/maps?" + new URLSearchParams({ q: "Sítio Della Torre, Estrada Municipal Santo Antônio, 270, Mairiporã - SP", output: "embed" }),
  instagramUrl: "https://www.instagram.com/sitiodellatorre/",

  prazoPresenca: null as string | null,
} as const;

export const secoes = [
  { id: "historia", titulo: "Nossa história" },
  { id: "casamento", titulo: "O casamento" },
  { id: "orientacoes", titulo: "Orientações" },
  { id: "presentes", titulo: "Presentes" },
  { id: "presenca", titulo: "Confirmar presença" },
] as const;

export const hoteisIndicados: readonly { nome: string; reserva: string; contato?: string; trajeto?: string }[] = [];

export const orientacoes = [
  {
    id: "chegada",
    titulo: "Cerimônia e recepção",
    destaque: `${casamento.horario} · ${casamento.local}`,
    paragrafos: [
      "A cerimônia começa pontualmente, em Mairiporã (SP). Se puderem, cheguem um pouco antes para se acomodar com calma. Depois da cerimônia, a festa continua no mesmo local.",
    ],
  },
  {
    id: "transporte",
    titulo: "Como chegar",
    destaque: casamento.endereco,
    paragrafos: [
      "Para quem vem de carro, o acesso é pela Rodovia Fernão Dias. Há estacionamento pago no local. Se forem beber, que tal combinar uma carona ou usar um carro de aplicativo?",
      "A van fará o trajeto de ida e volta entre os dois hotéis indicados e o DellaTorres Eventos. Vamos publicar aqui os pontos de embarque, os horários e como solicitar lugar.",
    ],
  },
  {
    id: "traje",
    titulo: "O que vestir",
    destaque: "Esporte fino",
    paragrafos: [
      "Para uma festa à tarde, tecidos leves vão bem. Calça de sarja com camisa, vestido, macacão ou um conjunto são boas opções. Gravata e blazer são opcionais. Como há gramado, prefiram calçados confortáveis ou saltos mais largos.",
      "Azul e verde estão liberados. Só pedimos que evitem branco e tons bem próximos, como off-white e bege muito claro.",
    ],
  },
  {
    id: "familia",
    titulo: "Confirme sua presença",
    destaque: "Até 10 de agosto de 2027",
    paragrafos: [
      "Basta uma pessoa responder por todos que estão no mesmo convite. Abram o link enviado pelo WhatsApp ou, se receberam só o código, entrem na Área do convidado e informem o código depois do login.",
      "Se os planos mudarem, avisem a gente assim que puderem.",
    ],
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
    "id": "cota-livre",
    "titulo": "Cota de carinho livre",
    "descricao": "Escolha o valor e deixe sua mensagem para nossa nova história.",
    "valor": 0,
    "imagem": "/rebranding/presentes/cota-livre.webp",
    "livre": true
  },
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
    "id": "pilates-pos-ressaca",
    "titulo": "Pilates pós-ressaca",
    "descricao": "Depois de tanto brinde e pista de dança, até alongar vira evento.",
    "valor": 350,
    "imagem": "/rebranding/presentes/pilates-pos-ressaca.webp"
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
  }
];
