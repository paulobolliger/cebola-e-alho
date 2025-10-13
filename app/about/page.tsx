export default function AboutPage() {
  return (
    // CORREÇÃO: Removido 'bg-background' para herdar a cor branca do layout.
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto bg-surface p-8 md:p-12 rounded-lg shadow-lg border border-border">
          <h1 className="font-display font-black text-4xl md:text-5xl text-primary mb-6 text-center">
            🧅 Sobre Nós
          </h1>
          <div className="prose lg:prose-xl max-w-none text-text-secondary space-y-6">
            <p>
              Somos apaixonados por comida de verdade — daquelas que começam com o barulhinho do alho dourando na frigideira e terminam com gente sorindo à mesa. O Cebola & Alho nasceu dessa mistura simples e poderosa: o prazer de cozinhar e a vontade de compartilhar sabores, histórias e segredos de cozinha sem frescura.
            </p>
            <p>
              Aqui, acreditamos que cozinhar é um ato de amor, mas também de curiosidade, improviso e diversão. A cada receita, a gente te convida a redescobrir o prazer de preparar algo gostoso — seja um jantar rápido de terça-feira ou um almoço de domingo com a família toda reunida.
            </p>
            <p>
              Usamos ingredientes acessíveis, técnicas que funcionam e um tempero extra de humor. Porque, convenhamos: o mundo precisa de mais risadas e menos panelas queimadas.
            </p>
            <p className="text-center font-display font-bold text-text-primary text-xl pt-4">
              🍳 Cebola & Alho — o sabor da vida real, feito com alma, simplicidade e uma pitada de coragem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}