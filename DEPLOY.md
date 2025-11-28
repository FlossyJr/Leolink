# 🎨 LeoLink Frontend - Deploy no Render

## Quick Start

### Variáveis de Ambiente Necessárias no Render

```env
REACT_APP_API_URL=https://seu-backend.onrender.com
```

### Build & Publish

- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`

## ⚠️ IMPORTANTE

Antes de fazer deploy, edite o arquivo `.env.production` com a URL do seu backend:

```env
REACT_APP_API_URL=https://leolink-backend.onrender.com
```

Depois commit e push:

```bash
git add .env.production
git commit -m "Atualizar URL do backend"
git push origin main
```

## Documentação Completa

Veja [DEPLOY_RENDER.md](../DEPLOY_RENDER.md) na raiz do projeto para instruções completas.

## Comandos Úteis

```bash
# Build local
npm run build

# Testar build localmente
npx serve -s build

# Verificar variáveis de ambiente
echo $REACT_APP_API_URL
```

## Troubleshooting

### API não responde
- Verifique console do navegador (F12)
- Confirme que `REACT_APP_API_URL` está correta
- Teste o backend diretamente: `https://seu-backend.onrender.com/health`

### CORS Error
- Adicione URL do frontend no `CORS_ORIGIN` do backend
- Aguarde redeploy do backend
- Limpe cache do navegador (Ctrl+Shift+Delete)

### Build falha
- Verifique erros de TypeScript
- Execute `npm run build` localmente primeiro
- Corrija todos os warnings
