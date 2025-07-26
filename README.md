# AI Prompt Manager

Uma aplicação completa para gerenciamento de prompts de IA desenvolvida com Vue 3, Pinia e Vue Router.

## 🚀 Funcionalidades

### Principais
- **CRUD Completo**: Criar, ler, atualizar e deletar prompts
- **Sistema de Busca**: Pesquisa por título, conteúdo e tags
- **Filtros Avançados**: Por categoria, data e favoritos
- **Gerador de Prompts**: Baseado em templates personalizáveis
- **Sistema de Favoritos**: Marque prompts importantes
- **Categorização**: Organize prompts por categorias
- **Sistema de Tags**: Adicione tags para melhor organização

### Técnicas
- **Persistência Local**: Armazenamento via localStorage
- **Clipboard API**: Copie prompts com um clique
- **Interface Responsiva**: Funciona em desktop e mobile
- **Tema Escuro**: Design otimizado para uso prolongado
- **Navegação SPA**: Navegação fluida entre páginas

## 🎨 Design

### Paleta de Cores
- **Grafite**: `#1a1a1a`, `#0d1117`
- **Cinzas**: `#2d2d2d`, `#3a3a3a`, `#4a4a4a`
- **Contraste**: `#58a6ff` (azul interativo)

### Características
- Tema escuro obrigatório
- Tipografia otimizada (Inter)
- Micro-interações suaves
- Cards com hover effects
- Gradientes sutis

## 🛠️ Stack Tecnológica

- **Vue 3** com Composition API
- **Pinia** para gerenciamento de estado
- **Vue Router** para navegação
- **TypeScript** para tipagem
- **Tailwind CSS** para estilização
- **Heroicons** para ícones
- **Vite** como bundler

## 📦 Instalação

```bash
# Clone o repositório
git clone <repository-url>

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🗂️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── AppHeader.vue   # Cabeçalho da aplicação
│   ├── AppSidebar.vue  # Barra lateral de navegação
│   └── PromptCard.vue  # Card de prompt
├── stores/             # Stores do Pinia
│   └── promptStore.ts  # Store principal dos prompts
├── views/              # Páginas da aplicação
│   ├── Dashboard.vue   # Página inicial
│   ├── CreatePrompt.vue # Criar novo prompt
│   ├── Library.vue     # Biblioteca de prompts
│   ├── PromptGenerator.vue # Gerador de prompts
│   └── Settings.vue    # Configurações
├── router/             # Configuração de rotas
│   └── index.ts
├── App.vue             # Componente raiz
├── main.ts             # Ponto de entrada
└── style.css           # Estilos globais
```

## 📝 Como Usar

### 1. Dashboard
- Visualize estatísticas dos seus prompts
- Acesse prompts recentes
- Navegue rapidamente para outras seções

### 2. Criar Prompt
- Adicione título e conteúdo
- Selecione categoria
- Adicione tags personalizadas
- Marque como favorito

### 3. Biblioteca
- Visualize todos os prompts
- Use filtros avançados
- Pesquise por texto
- Ordene por diferentes critérios

### 4. Gerador
- Selecione templates pré-definidos
- Preencha variáveis personalizadas
- Gere prompts automaticamente
- Salve ou copie o resultado

### 5. Configurações
- Visualize estatísticas
- Exporte/importe dados
- Gerencie backup dos prompts

## 🔧 Funcionalidades Avançadas

### Filtros e Busca
- Busca em tempo real
- Filtros por categoria
- Ordenação personalizada
- Visualização apenas de favoritos

### Templates de Prompt
- **Análise de Código**: Para revisão de código
- **Criação de Conteúdo**: Para marketing
- **Resolução de Problemas**: Abordagem estruturada

### Gerenciamento de Dados
- Exportação em JSON
- Importação de backups
- Limpeza completa de dados
- Persistência automática

## 📱 Responsividade

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🎯 Próximas Funcionalidades

- [ ] Sincronização na nuvem
- [ ] Compartilhamento de prompts
- [ ] Themes personalizáveis
- [ ] Integração com APIs de IA
- [ ] Histórico de uso
- [ ] Estatísticas avançadas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🔗 Links Úteis

- [Vue 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)