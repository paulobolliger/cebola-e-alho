import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import Link from 'next/link';

// Mock de dados (simulando uma busca em um CMS ou banco de dados)
const getPostBySlug = async (slug: string) => {
  // Em um app real, aqui você faria uma busca no Supabase
  const posts = [
    {
      slug: '5-dicas-de-organizacao-na-cozinha',
      title: '5 Dicas de Organização na Cozinha que Vão Mudar Sua Vida',
      description:
        'Descubra como pequenas mudanças na organização da sua cozinha podem economizar tempo e reduzir o estresse.',
      image: '/blog-card.png',
      content: `
        <p>Manter a cozinha organizada é fundamental para quem busca mais praticidade no dia a dia. Uma cozinha bem arrumada não só otimiza o tempo de preparo das refeições, mas também torna o ambiente mais agradável e funcional.</p>
        <h2 class="text-2xl font-bold my-4">1. Categorize Seus Utensílios</h2>
        <p>Agrupe itens semelhantes. Panelas com panelas, talheres com talheres, potes com potes. Isso facilita na hora de encontrar o que você precisa.</p>
        <h2 class="text-2xl font-bold my-4">2. Use e Abuse de Organizadores</h2>
        <p>Divisórias de gaveta, potes herméticos para mantimentos e prateleiras extras podem fazer milagres pelo seu espaço.</p>
        <h2 class="text-2xl font-bold my-4">3. Otimize a Despensa</h2>
        <p>Coloque os itens que você usa com mais frequência na frente e os de uso esporádico atrás. Use etiquetas para identificar potes e recipientes.</p>
        <h2 class="text-2xl font-bold my-4">4. Crie uma Estação de Café</h2>
        <p>Se você é um amante de café, junte tudo que precisa para prepará-lo em um só lugar: cafeteira, xícaras, açúcar, filtros e o pó de café.</p>
        <h2 class="text-2xl font-bold my-4">5. Limpeza Semanal</h2>
        <p>Reserve um tempo toda semana para dar uma geral na cozinha, limpando bancadas, verificando a validade dos alimentos e guardando o que está fora do lugar.</p>
      `,
    },
    // Adicione outros posts mockados aqui se necessário
  ];

  return posts.find((post) => post.slug === slug);
};

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Geração de metadados dinâmicos para SEO
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post não encontrado',
    };
  }

  return {
    title: `${post.title} | Blog Cebola & Alho`,
    description: post.description,
  };
}

// O componente da página PRECISA ser 'async' para usar 'await'
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // É preciso usar 'await' para esperar a promise ser resolvida
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="bg-surface p-6 md:p-10 rounded-xl shadow-lg border border-border">
        <header className="mb-8 border-b border-border pb-4">
          <h1 className="text-4xl md:text-5xl font-display font-black text-primary leading-tight">
            {post.title}
          </h1>
          <p className="mt-2 text-lg text-text-secondary">{post.description}</p>
        </header>

        <div className="relative w-full h-80 mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div
          className="prose prose-lg max-w-none prose-h2:text-primary prose-p:text-text-primary prose-p:font-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <div className="text-center mt-12">
        <Link
          href="/blog"
          className="inline-block bg-accent text-white py-3 px-6 rounded-lg hover:opacity-90 transition font-display font-bold text-lg"
        >
          Voltar para o Blog
        </Link>
      </div>
    </div>
  );
}