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

