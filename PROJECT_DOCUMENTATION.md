# Documentação do Projeto: Cebola & Alho

## Visão Geral

Cebola & Alho é uma aplicação web construída com Next.js e Tailwind CSS, projetada para ser um gerador de receitas inteligente e personalizado. O núcleo da aplicação é uma funcionalidade que utiliza a API da OpenAI (gpt-4o) para criar receitas com base nos ingredientes que o usuário tem em sua despensa, no seu humor e no seu nível de habilidade culinária.

O projeto foi desenvolvido para ser uma solução moderna e escalável, aproveitando as melhores práticas do ecossistema Next.js, incluindo o App Router para uma navegação otimizada e renderização no servidor (SSR).

## Estrutura do Projeto

O projeto segue uma estrutura de diretórios organizada e semântica, facilitando a manutenção e a colaboração.

- **`/app`**: Contém a estrutura de rotas e as páginas da aplicação, utilizando o App Router do Next.js. Cada diretório corresponde a um segmento da URL.
- **`/components`**: Abriga os componentes React reutilizáveis, como o cabeçalho (`Header.tsx`), o rodapé (`Footer.tsx`) e outros elementos da interface.
- **`/lib`**: Inclui a lógica de negócios e as integrações com serviços externos, como a API da OpenAI e a conexão com o Supabase.
- **`/public`**: Armazena os arquivos estáticos, como imagens, fontes e o `favicon.ico`.
- **`/src`**: Contém o código-fonte da aplicação, incluindo a lógica do lado do servidor e as configurações da API.
- **`/types`**: Define os tipos TypeScript utilizados em todo o projeto, garantindo a segurança e a consistência dos dados.

## Funcionalidades Principais

- **Gerador de Receitas com IA**: O usuário pode inserir ingredientes, seu humor e nível de habilidade para receber uma receita personalizada, gerada pelo gpt-4o.
- **Navegação Intuitiva**: A aplicação possui uma estrutura de navegação clara, com páginas como "Home", "Receitas", "Blog" e "Sobre".
- **Design Responsivo**: A interface foi construída com Tailwind CSS, garantindo uma experiência de usuário consistente em dispositivos móveis e desktops.
- **Integração com Supabase**: O projeto utiliza o Supabase para gerenciar a autenticação de usuários e o armazenamento de dados.

## Como Executar o Projeto Localmente

Para executar o projeto em um ambiente de desenvolvimento, siga os passos abaixo:

1. **Clone o repositório**:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   - Crie um arquivo `.env.local` na raiz do projeto.
   - Adicione as chaves da API da OpenAI e do Supabase, conforme o exemplo abaixo:
     ```
     OPENAI_API_KEY=sua_chave_da_api_da_openai
     NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
     NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
     ```

4. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

   A aplicação estará disponível em `http://localhost:3000`.

## Scripts Disponíveis

- **`npm run dev`**: Inicia o servidor de desenvolvimento.
- **`npm run build`**: Compila a aplicação para produção.
- **`npm run start`**: Inicia o servidor de produção após a compilação.
- **`npm run lint`**: Executa o linter para verificar a qualidade do código.

## Implantação na Vercel

O projeto está pronto para ser implantado na Vercel. Para fazer o deploy, siga os passos abaixo:

1. **Crie uma conta na Vercel**: Acesse [vercel.com](https://vercel.com) e crie uma conta.
2. **Importe o projeto**: Conecte sua conta do GitHub, GitLab ou Bitbucket e importe o repositório do projeto.
3. **Configure as variáveis de ambiente**: Na Vercel, adicione as mesmas variáveis de ambiente que você configurou no arquivo `.env.local`.
4. **Faça o deploy**: A Vercel detectará automaticamente que o projeto é um Next.js e fará o deploy com as configurações padrão.

## Considerações Finais

O projeto "Cebola & Alho" é uma aplicação robusta e bem-estruturada, pronta para ser implantada e escalada. A combinação de Next.js, Tailwind CSS e a API da OpenAI oferece uma base sólida para o desenvolvimento de novas funcionalidades e aprimoramentos futuros.