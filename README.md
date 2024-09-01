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
* **Docker:** Para containerização e fácil implantação da aplicação

## Instalação
  #### Pré-requisitos
  * **Docker:** Certifique-se de que o Docker está instalado em sua máquina.

1. **Clone o repositório**
```
git clone https://github.com/pedroronchini/url-shortener.git
cd url-shortener
```
2. **Configuração de Variáveis de Ambiente**

   Crie um arquivo **.env** na raiz do projeto com as variáveis necessárias:
   ```
    PORT=3000
    SECRET_KEY=your_secret_key_here
   ```
3.  **Construção da Imagem Docker**

  Construa a imagem Docker para o projeto:
  ```
    docker build -t url-shortener .
  ```
4.  **Execução do Contêiner**

  Inicie o contêiner Docker:
  ```
    docker run -p 3000:3000 --env-file .env url-shortener
  ```
  Agora, a API estará disponível em **http://localhost:3000**.
5.  **Execução dos Testes**
  Para rodar os testes unitários e de integração dentro do contêiner, utilize o comando:
  ```
    docker run --env-file .env url-shortener npm test
  ```
## Considerações Finais
Este projeto é um exemplo básico de uma API REST para encurtamento de URLs, com autenticação e manipulação de URLs, desenvolvido em Node.js e Docker. Ele pode ser expandido e modificado conforme as necessidades do usuário.
