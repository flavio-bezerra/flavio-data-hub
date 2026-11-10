import { Button } from "@/components/ui/button";

export default function Presentes() {
  const exemplos = [
    { id: "jantar", titulo: "Um jantar a dois", descricao: "Um brinde ao começo da nossa vida juntos.", valor: 150 },
    { id: "passeio", titulo: "Um passeio inesquecível", descricao: "Mais uma memória para a nossa coleção.", valor: 300 },
    { id: "viagem", titulo: "Um pedacinho da lua de mel", descricao: "Uma contribuição para a próxima aventura.", valor: 500 },
  ];
  return (
    <section id="presentes" aria-labelledby="presentes-titulo" className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 id="presentes-titulo" className="font-display text-4xl md:text-5xl">Presentes com carinho</h2>
          <p className="mt-5 font-display text-xl leading-relaxed">Sua presença é o nosso presente mais especial.</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Para quem desejar nos presentear, estamos preparando uma lista de presentes simbólicos.</p>
          <p className="mt-4 text-xs font-medium text-primary">Prévia da lista · itens e valores ilustrativos · pagamento indisponível</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {exemplos.map((presente) => <article key={presente.id} className="flex flex-col gap-5 border bg-card p-6 md:p-8">
            <div className="flex min-h-24 items-center justify-center border-b pb-5 font-display text-4xl text-primary" aria-hidden="true">V <span className="mx-2 font-script">&</span> F</div>
            <h3 className="font-display text-2xl">{presente.titulo}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{presente.descricao}</p>
            <p className="mt-auto font-display text-2xl">{presente.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            <Button variant="outline" size="lg" disabled>Pagamento em breve</Button>
          </article>)}
        </div>
      </div>
    </section>
  );
}
