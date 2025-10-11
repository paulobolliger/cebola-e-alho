// app/api/cms/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { serverSupabase } from '@/lib/supabaseClient' // Cliente secreto para CRUD
import { clientSupabase } from '@/lib/supabaseClient' // Cliente público para checagem de auth
import { headers } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'

// --- 1. FUNÇÕES DE LÓGICA DE BANCO DE DADOS (CRUD) ---

// Define a estrutura esperada para inserção/atualização
interface PostData {
  title: string
  slug: string
  content: string
  excerpt: string
  author: string
  image_url: string
  created_at: string
}

// Lógica de mapeamento da entrada do Decap para a linha do Supabase
const mapDecapEntryToSupabaseRow = (entry: any): PostData => {
  // Converte a string de data (se presente)
  const createdAt = entry.created_at || new Date().toISOString()
  
  return {
    title: entry.title,
    slug: entry.slug,
    content: entry.content,
    excerpt: entry.excerpt,
    author: entry.author,
    image_url: entry.image_url,
    created_at: createdAt,
  }
}

// Ação: LISTAR POSTS
async function listEntries() {
  const { data, error } = await serverSupabase
    .from('posts')
    .select('id, title, slug, created_at, excerpt')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Erro ao listar posts do Supabase: ' + error.message)
  }

  // O Decap espera um array de objetos com 'path' e 'data' (JSON stringificado)
  const entries = data.map(post => ({
    path: post.slug, // A path é usada para a URL interna do CMS
    data: JSON.stringify(post),
  }))

  return NextResponse.json(entries)
}

// Ação: OBTER UM POST
async function getEntry(slug: string) {
  const { data, error } = await serverSupabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    throw new Error(`Post com slug ${slug} não encontrado.`)
  }

  // Retorna os dados como um objeto simples para o Decap
  return NextResponse.json(data)
}

// Ação: CRIAR OU ATUALIZAR POST
async function persistEntry(entry: any, isUpdate: boolean) {
  const postData = mapDecapEntryToSupabaseRow(entry.data)
  
  if (isUpdate) {
    // Atualização: busca pelo ID/slug e atualiza
    const { error } = await serverSupabase
      .from('posts')
      .update(postData)
      .eq('slug', entry.slug) // Atualiza onde o slug coincide
      .select()

    if (error) {
      throw new Error('Falha ao atualizar post: ' + error.message)
    }

    return NextResponse.json({ message: 'Post atualizado com sucesso!' })

  } else {
    // Criação: insere um novo post com ID e slug
    const newId = uuidv4()
    const { error } = await serverSupabase
      .from('posts')
      .insert({ ...postData, id: newId })
      .select()

    if (error) {
      throw new Error('Falha ao criar novo post: ' + error.message)
    }

    // Retorna o novo ID para o Decap
    return NextResponse.json({ id: newId, slug: postData.slug })
  }
}

// Ação: DELETAR POST
async function deleteEntry(slug: string) {
  const { error } = await serverSupabase
    .from('posts')
    .delete()
    .eq('slug', slug)

  if (error) {
    throw new Error('Falha ao deletar post: ' + error.message)
  }

  return NextResponse.json({ message: 'Post deletado com sucesso!' })
}


// --- 2. ROTEAMENTO E SEGURANÇA (HANDLER PRINCIPAL) ---

// Checagem de Autenticação (Função Helper)
async function checkAuth(request: NextRequest) {
  const headersList = headers()
  const authorization = headersList.get('Authorization')

  if (!authorization) {
    return { authorized: false, response: NextResponse.json({ message: 'Não autorizado.' }, { status: 401 }) }
  }

  const token = authorization.replace('Bearer ', '')
  
  // Verifica a sessão usando o cliente público (checa se o token é válido)
  const { data: { user }, error: authError } = await clientSupabase.auth.getUser(token)

  if (authError || !user) {
    return { authorized: false, response: NextResponse.json({ message: 'Sessão inválida ou expirada.' }, { status: 401 }) }
  }

  return { authorized: true, user }
}


// Handler Principal que recebe as requisições POST do Decap CMS
export async function POST(request: NextRequest) {
  const auth = await checkAuth(request)
  if (!auth.authorized) {
    return auth.response
  }
  
  let payload: any
  try {
    payload = await request.json()
  } catch (e) {
    return NextResponse.json({ message: 'Payload inválido.' }, { status: 400 })
  }

  const { action, collection, slug, entry } = payload

  if (collection !== 'blog' && collection !== 'posts') {
    return NextResponse.json({ message: 'Coleção não suportada.' }, { status: 400 })
  }

  try {
    switch (action) {
      case 'listEntries':
        return listEntries()
      case 'getEntry':
        return getEntry(slug)
      case 'createEntry':
        // Ação de criar (entry é o objeto de conteúdo)
        return persistEntry(entry, false)
      case 'updateEntry':
        // Ação de atualizar (entry é o objeto de conteúdo, slug é a chave)
        return persistEntry(entry, true)
      case 'deleteEntry':
        return deleteEntry(slug)
      default:
        return NextResponse.json({ message: `Ação CMS não suportada: ${action}` }, { status: 400 })
    }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Erro interno ao processar a requisição CMS.'
    console.error(`Erro ao processar ação CMS ${action}:`, errorMessage)
    return NextResponse.json({ message: errorMessage }, { status: 500 })
  }
}

// Endpoint de Autenticação (GET) - Usado pelo Decap para checar se o token é válido
export async function GET(request: NextRequest) {
  const auth = await checkAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  // Se autorizado, retorna os dados básicos do usuário para o Decap
  return NextResponse.json({
    email: auth.user!.email,
    name: auth.user!.email?.split('@')[0], // Nome derivado do email
  })
}