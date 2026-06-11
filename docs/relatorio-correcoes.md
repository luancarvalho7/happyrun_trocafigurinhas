# Relatório de Correções — HappyRun Trocafigurinhas

**Data:** 10/06/2026  
**Responsável:** Tiago  
**Total de correções:** 5

---

### 1. Campo de nome sem validação

O campo "Como te chama?" permitia digitar números, avançar com apenas uma letra, ou prosseguir sem digitar nada — o que causaria nomes inválidos aparecendo para outros usuários.

**Correção:** O campo agora bloqueia números automaticamente e o botão CONTINUAR só funciona com no mínimo 3 letras.

---

### 2. Campos de figurinha aceitavam apenas números

Os campos de figurinhas repetidas e faltantes bloqueavam letras e não tinham limite de caracteres. Isso impedia o cadastro de figurinhas com código alfanumérico, como `BRA1` ou `GC4`.

**Correção:** Agora aceitam letras e números, com limite de 5 caracteres. Caracteres especiais continuam bloqueados.

---

### 3. Botão de remover figurinha não funcionava

Ao adicionar figurinhas, o `×` ao lado de cada uma era apenas visual — clicar nele não tinha nenhum efeito. Não havia como desfazer um erro sem reiniciar.

**Correção:** O `×` agora é um botão funcional que remove a figurinha da lista imediatamente.

---

### 4. Voltar da tela de match reiniciava a busca

Após encontrar uma troca ("Achamos uma troca!"), pressionar voltar exibia novamente a animação de busca e retornava automaticamente para a mesma tela — prendendo o usuário num loop.

**Correção:** O botão voltar agora leva diretamente à tela de edição de figurinhas, sem repetir a busca.

---

### 5. Ano incorreto no logo

O logo exibia "COPA DO MUNDO 2022" em todas as telas do aplicativo.

**Correção:** Atualizado para "COPA DO MUNDO 2026".

---

### Arquivos alterados

| Arquivo | Alterações |
|---|---|
| `src/App.tsx` | Validação do nome, inputs de figurinha, remoção de chips, navegação do botão voltar, ano do logo |
| `src/index.css` | Estilo do botão de remover figurinha |
