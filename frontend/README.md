# FeiraEtec — Frontend

Next.js 14 (App Router) + Tailwind. Consome a API em `backend/`.

## Configuração do login com Google

O login/cadastro com Google usa Google Identity Services (via `@react-oauth/google`
no frontend + `google-auth-library` no backend, verificando o ID token). Para
funcionar em desenvolvimento, é preciso cadastrar um Client ID OAuth no Google
Cloud Console:

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/) e crie um
   projeto (ou use um existente).
2. Vá em **APIs e serviços → Tela de consentimento OAuth**.
   - Tipo de usuário: **Externo**.
   - Modo de publicação: **Teste** (não precisa passar por verificação do
     Google enquanto estiver em desenvolvimento).
   - Em **Usuários de teste**, adicione as contas Google que vão logar na
     aplicação — enquanto o app estiver em modo Teste, só essas contas
     conseguem entrar.
3. Vá em **APIs e serviços → Credenciais → Criar credenciais → ID do cliente OAuth**.
   - Tipo de aplicativo: **Aplicativo da Web**.
   - Em **Origens JavaScript autorizadas**, adicione a URL onde o frontend
     roda em desenvolvimento: `http://localhost:3000`.
4. Copie o **Client ID** gerado e configure nas duas pontas:
   - `frontend/.env.local`: `NEXT_PUBLIC_GOOGLE_CLIENT_ID=...apps.googleusercontent.com`
   - `backend` (variável `GOOGLE_CLIENT_ID`, mesmo valor): ver `docker-compose.yml`
     / `.env` na raiz do projeto — o backend não lê `backend/.env`, as
     variáveis chegam via `docker-compose.yml`.

**Sem cadastrar a origem, o popup do Google falha** com um erro do tipo
`origin_mismatch` (ou, no console do navegador, `[GSI_LOGGER]: The given
origin is not allowed for the given client ID`) e o login não funciona. Se o
frontend rodar em outra porta (ex: `3001`), essa origem também precisa ser
adicionada na lista.
