# URL Shortener API
Este projeto é uma API RESTful desenvolvida em Node.js para encurtamento de URLs. Ele permite que os usuários registrem URLs longas e recebam uma URL curta em troca, que redireciona para o endereço original. A API também oferece funcionalidades para autenticação, listagem, edição e exclusão de URLs, além de contabilizar o número de acessos.

## Funcionalidades
* **Cadastro de Usuários:** Usuários podem se registrar com um e-mail e senha.
* **Autenticação de Usuários:** Usuários registrados podem fazer login e obter um token JWT para autenticação.
* **Encurtamento de URLs:** Qualquer usuário pode encurtar uma URL, mas apenas URLs criadas por usuários autenticados são associadas a eles.
* **Listagem de URLs:** Usuários autenticados podem listar as URLs encurtadas por eles, incluindo a contagem de cliques.
* **Edição de URLs:** Usuários autenticados podem editar o endereço original das URLs que criaram
* **Exclusão de URLs:** URLs podem ser excluídas logicamente, permanecendo inacessíveis.
* **Redirecionamento:** URLs encurtadas redirecionam para o endereço original e contam o número de cliques.

## Tecnologias Utilizadas
* **Node.js:** Plataforma de desenvolvimento.
* **Express:** Framework para construção da API REST.
* **SQLite:** Banco de dados utilizado para armazenar as informações.
* **Sequelize:** ORM para manipulação do banco de dados.
* **JWT (JSON Web Tokens):** Para autenticação de usuários.
* **bcryptjs:** Para hash de senhas.
* **shortid:** Para gerar identificadores curtos e únicos.
* **Jest:** Framework de testes unitários.
* **Supertest:** Biblioteca para testes de integração com a API.

## Instalação
1. **Clone o repositório**
```
git clone https://github.com/pedroronchini/url-shortener.git
cd url-shortener
```
2. **Instale as dependências**
```
npm install
```
3. **Configuração do Banco de Dados**
Não há necessidade de configuração adicional para o SQLite, pois ele é um banco de dados embutido. O banco será criado automaticamente na primeira execução.
4. **Execução do Projeto:**
Inicie o servidor:
```
npm start
```
5. **Execução dos Testes:**
Para rodar os testes unitários e de integração, use:
```
npm test
```

## Endpoints
