# Projeto To-Do List com NoSQL (MongoDB)
# Projeto To-Do List 

Este é um projeto de uma lista de tarefas simples construído com Node.js, Express, MongoDB e uma interface em HTML/JS puro.
Este é um projeto de uma aplicação de lista de tarefas (To-Do List) completa, construída com o stack MERN (MongoDB, Express, Node.js) e um frontend em HTML, CSS e JavaScript puro. A aplicação permite que os usuários se registrem, façam login e gerenciem suas próprias tarefas pessoais.

## Funcionalidades
## ✨ Funcionalidades

- **Criar** novas tarefas com título e descrição.
- **Ler** todas as tarefas, exibidas em ordem de criação.
- **Atualizar** o status de uma tarefa para "concluída" ou "não concluída".
- **Excluir** tarefas.
- **Exportar** todas as tarefas para um arquivo JSON.
- **Autenticação de Usuário**: Sistema seguro de registro e login com JSON Web Tokens (JWT).
- **Gerenciamento de Tarefas (CRUD)**:
  - **Criar**: Adicionar novas tarefas com título, descrição e nível de prioridade (alta, média, baixa).
  - **Ler**: Visualizar todas as tarefas associadas ao usuário logado.
  - **Atualizar**: Editar o título e a descrição de uma tarefa, e marcar tarefas como concluídas ou pendentes.
  - **Excluir**: Remover tarefas da lista.
- **Busca e Ordenação**:
  - Ordenar tarefas por data de criação ou por prioridade.
  - Buscar tarefas dinamicamente pelo título.
- **Perfil de Usuário**: Uma página de perfil que exibe estatísticas sobre as tarefas do usuário (total, concluídas, pendentes, contagem por prioridade).
- **Exportação de Dados**: Funcionalidade para exportar todas as tarefas do usuário para um arquivo JSON.

## Justificativa da Modelagem de Dados
## 🚀 Tecnologias Utilizadas

**Banco de Dados Escolhido:** MongoDB.
- **Backend**:
  - **Node.js**: Ambiente de execução JavaScript no servidor.
  - **Express.js**: Framework para construção de APIs REST.
  - **MongoDB**: Banco de dados NoSQL orientado a documentos.
  - **Mongoose**: ODM (Object Data Modeling) para interagir com o MongoDB.
  - **JSON Web Token (JWT)**: Para gerenciamento de sessões e autenticação baseada em token.
  - **bcrypt.js**: Para hashing e segurança de senhas.
  - **dotenv**: Para gerenciar variáveis de ambiente.

**Justificativa:**
- **Frontend**:
  - **HTML5**
  - **CSS3**
  - **JavaScript (Vanilla JS)**: Para manipulação do DOM e lógica da interface.

O modelo de documentos do MongoDB foi escolhido porque cada tarefa pode ser representada de forma natural e independente como um documento JSON. Isso oferece flexibilidade para adicionar novos campos no futuro (como `prioridade` ou `data de vencimento`) sem a necessidade de migrações de esquema complexas, como seria em um banco SQL.


## ⚙️ Configuração e Instalação

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [MongoDB](https://www.mongodb.com/try/download/community). Você pode instalar localmente ou usar um serviço em nuvem como o [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### Passos

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    cd seu-repositorio/
    ```

2.  **Instale as dependências do backend:**
    Navegue até a pasta `backend` e execute o comando:
    ```bash
    cd backend
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo chamado `.env` dentro da pasta `backend`. Este arquivo guardará suas credenciais de banco de dados e o segredo do JWT.

    Copie o conteúdo abaixo para o seu arquivo `.env`:
    ```env
    # String de conexão do MongoDB (local ou de um serviço como o Atlas)
    MONGO_URI=mongodb://localhost:27017/todo-list

    # Segredo para gerar os tokens JWT (pode ser qualquer string aleatória e segura)
    JWT_SECRET=seu_segredo_super_secreto_aqui
    ```
    > **Nota:** Se estiver usando o MongoDB Atlas, substitua a `MONGO_URI` pela string de conexão fornecida por eles.

## ▶️ Executando a Aplicação

1.  **Inicie o servidor backend:**
    Ainda na pasta `backend`, execute o comando:
    ```bash
    npm start
    ```
    O servidor será iniciado na porta `3000` (ou na porta definida pela variável de ambiente `PORT`).

2.  **Acesse a aplicação:**
    Abra seu navegador e acesse `http://localhost:3000`.

    A aplicação estará pronta para uso! Você pode criar uma conta, fazer login e começar a gerenciar suas tarefas.

## 📝 Justificativa da Modelagem de Dados

**Banco de Dados Escolhido:** MongoDB.

**Justificativa:** O modelo de documentos do MongoDB foi escolhido porque cada tarefa pode ser representada de forma natural e independente como um documento JSON. Isso oferece flexibilidade para adicionar novos campos no futuro (como `prioridade` ou `data de vencimento`) sem a necessidade de migrações de esquema complexas, como seria em um banco SQL. A estrutura de uma tarefa (`title`, `description`, `completed`, `priority`) se encaixa perfeitamente em um documento, e as operações de CRUD são diretas e eficientes.

**Índices:**

Um índice foi criado no campo `createdAt` (gerado pelos `timestamps` do Mongoose) para otimizar a consulta que busca e ordena as tarefas pela data de criação, garantindo que a listagem seja sempre rápida, mesmo com um grande volume de dados.

