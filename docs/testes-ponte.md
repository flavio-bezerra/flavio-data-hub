# Registro de Testes da Ponte de Integração (Vercel / HostGator)

Data: 13/11/2026  
Ambiente de Execução: Windows / PowerShell  
Endpoints:
- **HostGator (Direto)**: `https://casamento-flavio-victoria.com.br/api/execute-sql.php`
- **Vercel (Proxy)**: `https://flavio-data-hub-backend.vercel.app/api/execute-sql`

---

## 1. Resumo Executivo da Validação

A matriz completa de testes da ponte foi executada com sucesso em **13/11/2026**. Os resultados confirmam:
1. **Autenticação rigorosa**: Tanto a HostGator (`hash_equals`) quanto a Vercel (`timingSafeEqual`) barram imediatamente requisições sem token ou com tokens incorretos/fictícios com **HTTP 401**, sem tocar no banco de dados e sem expor detalhes internos.
2. **Métodos HTTP**: Ambas as pontas rejeitam métodos não permitidos (ex: `GET`) com **HTTP 405** e cabeçalho `Allow: POST`.
3. **Validação de Payload**: Payloads malformados, JSON inválido, campos ausentes ou tipos incorretos são rejeitados com **HTTP 400**.
4. **Proteção contra SQL Arbitrário**:
   - O PHP na HostGator aceita estritamente a consulta fixa normalizada `select 1 as teste`. Qualquer outra instrução (como `SELECT 2 AS teste` ou tentativa de ponto e vírgula `;`) é rejeitada com **HTTP 400** (`"Somente a consulta de diagnóstico está habilitada"`).
   - O proxy na Vercel converte respostas de erro upstream não-2xx em **HTTP 502**, preservando integralmente a mensagem de erro da HostGator.
   - Ponto e vírgula é bloqueado na Vercel antes mesmo de contatar a HostGator com **HTTP 400** (`"Apenas SELECT simples é permitido"`).
5. **Privacidade e Gestão de Segredos**: As variáveis foram consolidadas no arquivo `.env.local` (ignorado pelo Git via `.gitignore` e `*.local`). Um arquivo `.env.example` foi disponibilizado como modelo para novas variáveis. Nenhum segredo foi incluído em commits ou logs.

---

## 2. Matriz Completa de Testes e Resultados Observados

| # | Alvo | Caso de Teste | Método | Entrada / Corpo | Status Observado | Cabeçalho `Allow` | Corpo da Resposta Observado |
|---|---|---|---|---|---|---|---|
| 1 | **HostGator** | Sem token | POST | `{"sql":"SELECT 1 AS teste"}` | **401** | — | `{"ok":false,"message":"Não autorizado"}` |
| 2 | **Vercel** | Sem token | POST | `{"sql":"SELECT 1 AS teste"}` | **401** | — | `{"ok":false,"message":"Não autorizado"}` |
| 3 | **HostGator** | Token inválido | POST | `{"sql":"SELECT 1 AS teste"}` | **401** | — | `{"ok":false,"message":"Não autorizado"}` |
| 4 | **Vercel** | Token inválido | POST | `{"sql":"SELECT 1 AS teste"}` | **401** | — | `{"ok":false,"message":"Não autorizado"}` |
| 5 | **HostGator** | Positivo | POST | `{"sql":"SELECT 1 AS teste"}` | **200** | — | `{"ok":true,"rows":[{"teste":1}]}` |
| 6 | **Vercel** | Positivo | POST | `{"sql":"SELECT 1 AS teste"}` | **200** | — | `{"ok":true,"rows":[{"teste":1}]}` |
| 7 | **HostGator** | Método inválido | GET | *(sem corpo)* | **405** | `POST` | `{"ok":false,"message":"Método não permitido"}` |
| 8 | **Vercel** | Método inválido | GET | *(sem corpo)* | **405** | `POST` | `{"ok":false,"message":"Método não permitido"}` |
| 9 | **HostGator** | JSON inválido | POST | `{` | **400** | — | `{"ok":false,"message":"Corpo inválido"}` |
| 10 | **Vercel** | JSON inválido | POST | `{` | **400** | — | *(Parser JSON HTTP 400 - Solicitação Incorreta)* |
| 11 | **HostGator** | SQL ausente | POST | `{}` | **400** | — | `{"ok":false,"message":"Informe a consulta SQL"}` |
| 12 | **Vercel** | SQL ausente | POST | `{}` | **400** | — | `{"ok":false,"message":"Informe a consulta SQL"}` |
| 13 | **HostGator** | Tipo inválido | POST | `{"sql":123}` | **400** | — | `{"ok":false,"message":"Informe a consulta SQL"}` |
| 14 | **Vercel** | Tipo inválido | POST | `{"sql":123}` | **400** | — | `{"ok":false,"message":"Informe a consulta SQL"}` |
| 15 | **HostGator** | SQL vazio | POST | `{"sql":""}` | **400** | — | `{"ok":false,"message":"Informe a consulta SQL"}` |
| 16 | **Vercel** | SQL vazio | POST | `{"sql":""}` | **400** | — | `{"ok":false,"message":"Informe a consulta SQL"}` |
| 17 | **HostGator** | Outra leitura | POST | `{"sql":"SELECT 2 AS teste"}` | **400** | — | `{"ok":false,"message":"Somente a consulta de diagnóstico está habilitada"}` |
| 18 | **Vercel** | Outra leitura | POST | `{"sql":"SELECT 2 AS teste"}` | **502** | — | `{"ok":false,"message":"Somente a consulta de diagnóstico está habilitada"}` |
| 19 | **HostGator** | Ponto e vírgula | POST | `{"sql":"SELECT 1 AS teste;"}` | **400** | — | `{"ok":false,"message":"Somente a consulta de diagnóstico está habilitada"}` |
| 20 | **Vercel** | Ponto e vírgula | POST | `{"sql":"SELECT 1 AS teste;"}` | **400** | — | `{"ok":false,"message":"Apenas SELECT simples é permitido"}` |

---

## 3. Comportamento e Nuances Identificados

1. **Mapeamento de Status HostGator vs Vercel:**
   - Na HostGator, quando a consulta não é exatamente a fixa, o PHP responde diretamente com `HTTP 400`.
   - Na Vercel, o proxy Node passa pelo seu filtro inicial (`isAllowedSelect`, que aceita `SELECT 2 AS teste`), dispara o `fetch` para a HostGator, recebe o `400` do PHP e o mapeia como `HTTP 502` com a linha `return res.status(response.ok ? 200 : 502).json(data);`. A mensagem original do PHP é preservada no JSON.
2. **Filtro local de sanitização na Vercel:**
   - Tentativas com ponto e vírgula (`;`) são barradas logo no backend da Vercel (`HTTP 400 - Apenas SELECT simples é permitido`), economizando uma ida desnecessária à HostGator.
3. **Resistência a Erros de Sintaxe JSON:**
   - A HostGator trata com `file_get_contents('php://input')` + `json_decode`, retornando `HTTP 400 - Corpo inválido`.
   - A Vercel (Next.js / Node body-parser) rejeita o corpo malformado com `HTTP 400 - Solicitação Incorreta`.

---

## 4. Estado das Pendências

- [x] Testes negativos de autenticação (sem token / token inválido).
- [x] Testes de métodos HTTP não permitidos (GET).
- [x] Testes de payload malformado e validação de tipos de campos.
- [x] Validação de bloqueio contra consultas SQL diferentes da fixa.
- [x] Mapeamento e documentação das diferenças de status (400 vs 502) entre direto e proxy.
- [ ] Remoção ou confirmação dos diagnósticos legados no cPanel (`bridge-check.php`, `health.php`, `casamento-private` em `public_html/api`).
- [ ] Definição da primeira operação real do banco e sua autorização específica antes de qualquer novo endpoint.
