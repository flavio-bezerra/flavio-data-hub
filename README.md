# Bem-vindo ao Flávio Data Hub
Este repositório contém o código-fonte do projeto "Flávio Data Hub".
**URL do Projeto no Lovable**: https://lovable.dev/projects/f9d339c5-bfce-496a-975e-6b4d9e5ca7c4
## Como Editar o Código
Este projeto foi iniciado no [Lovable](https://lovable.dev/projects/f9d339c5-bfce-496a-975e-6b4d9e5ca7c4) para um bootstrap rápido (vibe code), mas o desenvolvimento principal é feito localmente via VS Code (ou outro IDE).
O projeto é sincronizado entre o Lovable e o GitHub, permitindo flexibilidade:
**1. Usando seu IDE preferido (Ex: VS Code) - (Recomendado)**
Você pode clonar este repositório e trabalhar localmente. As alterações enviadas (push) para o repositório serão refletidas de volta no Lovable.
O único requisito é ter o Node.js e o npm instalados - [instale com o nvm](https://github.com/nvm-sh/nvm#installing-and-updating).
Siga estes passos:
```sh
# Passo 1: Clone o repositório usando a URL Git do projeto.
git clone <URL_DO_SEU_GIT>
# Passo 2: Navegue até o diretório do projeto.
cd <NOME_DO_SEU_PROJETO>
# Passo 3: Instale as dependências necessárias.
npm i
# Passo 4: Inicie o servidor de desenvolvimento com auto-reloading e preview instantâneo.
npm run dev
```
**2. Usando o Lovable**
Você ainda pode visitar a [página do projeto no Lovable](https://lovable.dev/projects/f9d339c5-bfce-496a-975e-6b4d9e5ca7c4) para edições rápidas por prompts. As alterações feitas no Lovable serão comitadas automaticamente ste repositório.
**Outras formas de editar:**
* **Diretamente no GitHub:**
    * Navegue até o arquivo desejado.
    * Clique no botão "Edit" (ícone de lápis) no canto superior direito da visualização do arquivo.
    * Faça suas alterações e faça o commit.
* **Usando GitHub Codespaces:**
    * Navegue até a página principal do seu repositório.
    * Clique no botão "Code" (verde) no canto superior direito.
    * Selecione a aba "Codespaces".
    * Clique em "New codespace" para iniciar um novo ambiente Codespace.
    * Edite os arquivos diretamente no Codespace, faça o commit e envie (push) suas alterações.
## Tecnologias Utilizadas
Este projeto é construído com:
* Vite
* TypeScript
* React
* shadcn-ui
* Tailwind CSS
## Como fazer o deploy?
O deploy de produção deste projeto é feito na **HostGator**. O processo de automação (CI/CD) está detalhado no artigo:
* *Desbloqueando o Portfólio: Do Low-Code ao Deploy Automático com Lovable, GitHub e HostGator | by Flavio Bezerra | Nov, 2025 | Medium*
Os métodos de deploy configurados são:
* **Via GitHub Actions (CI/CD) - (Método Principal):**
    Este repositório possui um workflow (`.github/workflows/deploy.yml`) que faz o build (`npm run build`) e o deploy automático via FTP para a HostGator sempre que um push é feito para a branch `main`.
* **Via cPanel:**
    O arquivo `.cpanel.yml` também está configurado para executar o build e copiar os arquivos da pasta `dist/` para o diretório de deploy.
* **Via Lovable (Para Previews):**
    O deploy do Lovable (Share -> Publish) pode ser usado para previews rápidos, embora o deploy de produção seja na HostGator.