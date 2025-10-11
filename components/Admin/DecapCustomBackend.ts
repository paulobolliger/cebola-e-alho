// components/Admin/DecapCustomBackend.ts

import CMS from 'decap-cms-app'

// 1. URL da API Route de proxy
const API_BASE = '/api/cms'

// 2. Cliente de Autenticação para o CMS (Usa o mesmo token de Supabase)
class Auth {
  token = ''

  // O CMS chama esta função para tentar se logar
  async authenticate(credentials: any): Promise<void> {
    // Nesta implementação, dependemos do SupabaseAuthProvider do Next.js
    // para gerenciar o login. Este método será simplificado para apenas 
    // retornar o usuário se o token for válido.
    
    // Decap chama auth_url (GET) para obter o token de sessão
    const response = await fetch(`${API_BASE}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    })

    if (!response.ok) {
        throw new Error('Falha na autenticação do Decap CMS.')
    }
  }

  // O CMS chama getUser para obter os dados do usuário
  async getUser() {
    // Retorna um objeto de usuário compatível com o Decap
    const userResponse = await fetch(`${API_BASE}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${this.token}`,
        },
    })
    
    if (!userResponse.ok) {
        throw new Error('Não foi possível carregar os dados do usuário.')
    }

    const userData = await userResponse.json()
    
    // Assume que a API Route retorna { email, name }
    return { name: userData.name || userData.email, email: userData.email }
  }

  // O Decap chama este método para fazer o logout
  async logout(): Promise<void> {
    // O logout é manipulado pelo SupabaseAuthProvider.
    // Basta limpar o token local, se houver.
    this.token = ''
    return Promise.resolve()
  }
}

// 3. Cliente de Conteúdo (CRUD)
class SupabaseBackend {
  auth: Auth
  cmsConfig: any
  entries: { [key: string]: any } = {}

  constructor(cmsConfig: any) {
    this.auth = new Auth()
    this.cmsConfig = cmsConfig
  }

  // O CMS chama esta função para inicializar e se conectar à coleção
  async init(options: any): Promise<any> {
    // Obtém o token do Supabase armazenado no localStorage (após login via Magic Link)
    const storedSession = localStorage.getItem(`sb-${this.cmsConfig.backend.auth_url}-auth-token`);
    if (storedSession) {
        const session = JSON.parse(storedSession);
        this.auth.token = session.access_token;
    }
    
    return {
      api: this.auth
    }
  }

  // Chama a API Route para executar a ação de CRUD
  async request(action: string, payload: any = {}): Promise<any> {
    const headers: any = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.token}`
    }

    const response = await fetch(`${API_BASE}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ action, ...payload })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || `Erro CMS: ${action}`)
    }

    return response.json()
  }

  // CRUD READ (Listagem)
  async listEntries(collection: any) {
    const result = await this.request('listEntries', { collection: collection.name })
    return { entries: result }
  }

  // CRUD READ (Detalhe)
  async getEntry(collection: any, slug: string) {
    const data = await this.request('getEntry', { collection: collection.name, slug })
    return {
      file: { path: slug, name: slug },
      data: data
    }
  }
  
  // CRUD CREATE/UPDATE
  async persistEntry(collection: any, entry: any, mediaFiles: any, options: any) {
    // A ação é "createEntry" ou "updateEntry"
    const action = entry.path ? 'updateEntry' : 'createEntry'
    const result = await this.request(action, { collection: collection.name, entry })
    return result
  }

  // CRUD DELETE
  async deleteEntry(collection: any, slug: string) {
    return this.request('deleteEntry', { collection: collection.name, slug })
  }
  
  // Implementação de Mídia (Opcional, pode ser deixado de lado por enquanto)
  async getMedia(): Promise<any> { return [] }
  async getMediaFile(): Promise<any> { return null }
  async persistMedia(): Promise<any> { return null }
}

// 4. Registro no CMS
CMS.registerBackend('supabase-cms', SupabaseBackend)

// 5. Exporte a função de registro
export const registerCustomBackend = () => {
    // Função dummy para garantir que o arquivo é um módulo e foi executado.
}