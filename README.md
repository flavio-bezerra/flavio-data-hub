# Bem-vindo ao Flávio Data Hub

Este repositório contém o código-fonte do projeto "Flávio Data Hub".

## Como Editar o Código

Este projeto usa React, TypeScript, Shadcn UI e Tailwind CSS.

**1. Configuração do Ambiente**

Você pode clonar este repositório e trabalhar localmente.
O único requisito é ter o Node.js e o npm instalados - [instale com o nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

Siga estes passos:

```sh
# Passo 1: Clone o repositório
git clone <URL_DO_SEU_GIT>

# Passo 2: Navegue até o diretório do projeto.
cd flavio-data-hub

# Passo 3: Instale as dependências necessárias.
npm i

# Passo 4: Inicie o servidor de desenvolvimento com auto-reloading.
npm run dev
```

## Tecnologias Utilizadas

Este projeto é construído com:

* Vite
* TypeScript
* React
* shadcn-ui
* Tailwind CSS

## Como fazer o deploy?

O deploy de produção deste projeto é feito na **HostGator**.

Os métodos de deploy configurados são:

* **Via GitHub Actions (CI/CD) - (Método Principal):**
    Este repositório possui um workflow (`.github/workflows/deploy.yml`) que faz o build (`npm run build`) e o deploy automático via FTP para a HostGator sempre que um push é feito para a branch `main`.

* **Via cPanel:**
    O arquivo `.cpanel.yml` também está configurado para executar o build e copiar os arquivos da pasta `dist/` para o diretório de deploy.