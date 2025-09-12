# Projeto To-Do List com NoSQL (MongoDB)

Este é um projeto de uma lista de tarefas simples construído com Node.js, Express, MongoDB e uma interface em HTML/JS puro.

## Funcionalidades

- **Criar** novas tarefas com título e descrição.
- **Ler** todas as tarefas, exibidas em ordem de criação.
- **Atualizar** o status de uma tarefa para "concluída" ou "não concluída".
- **Excluir** tarefas.
- **Exportar** todas as tarefas para um arquivo JSON.

## Justificativa da Modelagem de Dados

**Banco de Dados Escolhido:** MongoDB.

**Justificativa:**

O modelo de documentos do MongoDB foi escolhido porque cada tarefa pode ser representada de forma natural e independente como um documento JSON. Isso oferece flexibilidade para adicionar novos campos no futuro (como `prioridade` ou `data de vencimento`) sem a necessidade de migrações de esquema complexas, como seria em um banco SQL.

A estrutura de uma tarefa (`title`, `description`, `completed`) se encaixa perfeitamente em um documento, e as operações de CRUD são diretas e eficientes.

**Índices:**

Um índice foi criado no campo `createdAt` (gerado pelos `timestamps` do Mongoose) para otimizar a consulta que busca e ordena as tarefas pela data de criação, garantindo que a listagem seja sempre rápida, mesmo com um grande volume de dados.

## Como Rodar o Projeto

### Pré-requisitos

- Node.js e npm instalados.
- Uma instância do MongoDB (local ou em um serviço como o MongoDB Atlas).

### Passos

1. **Clone o repositório:**
   ```bash
   git clone <url-do-seu-repositorio>
   cd <nome-do-repositorio>
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   - Crie um arquivo `.env` na pasta `backend`.
   - Adicione a sua string de conexão do MongoDB:
     ```env
     MONGO_URI=mongodb+srv://...
     JWT_SECRET=seu_segredo_super_secreto_para_jwt
     ```
     > **Nota de Segurança:** O arquivo `.env` contém informações sensíveis e **não deve** ser enviado para o GitHub. O arquivo `.gitignore` já está configurado para impedir isso.

4. **Inicie o servidor:**
   ```bash
   node backend/server.js
   ```

5. **Acesse a aplicação:**
   Abra seu navegador e acesse `http://localhost:3000`.
