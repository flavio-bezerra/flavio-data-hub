export const casamento = {
  nomes: "Victória & Flávio",
  data: "10 de outubro de 2027",
  dataIso: "2027-10-10T14:00:00-03:00",
  diaDaSemana: "Domingo",
  horario: "14h",
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
  { id: "chegada", pergunta: "Onde será a cerimônia e a recepção?", resposta: "Celebraremos no DellaTorres Eventos, em Mairiporã — SP. A recepção será no mesmo local, após a cerimônia das 14h.", pendente: false },
  { id: "transporte", pergunta: "Como chegar e onde se hospedar?", resposta: "Endereço completo, opções de acesso e sugestões de hospedagem serão incluídos após confirmação.", pendente: true },
  { id: "familia", pergunta: "Como funciona a confirmação da família?", resposta: "Cada convite terá seu próprio link ou código. A confirmação será individual para as pessoas incluídas no convite.", pendente: false },
  { id: "prazo", pergunta: "Até quando posso confirmar?", resposta: "O prazo exato será informado aqui e no convite. Nossa meta de organização é fevereiro, com dia e ano ainda a definir.", pendente: true },
] as const;
