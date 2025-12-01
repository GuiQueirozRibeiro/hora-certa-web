# 🚀 Deploy para Hostinger

## Pré-requisitos
- Conta na Hostinger com acesso FTP ou File Manager
- Node.js instalado localmente

## Passos para Deploy

### 1. Fazer Build do Projeto
```bash
npm run build
```

Isso irá gerar uma pasta `out` com os arquivos estáticos.

### 2. Preparar Arquivos
Após o build, a pasta `out` conterá todos os arquivos necessários:
- `index.html`
- `_next/` (pasta com assets otimizados)
- Outros arquivos estáticos

### 3. Upload para Hostinger

#### Opção A: Via File Manager (Recomendado)
1. Acesse o painel da Hostinger
2. Vá em **Files > File Manager**
3. Navegue até `public_html` (ou pasta do seu domínio)
4. **DELETE** todos os arquivos antigos da pasta
5. Faça upload de **TODOS** os arquivos da pasta `out`
6. Certifique-se que o `.htaccess` foi copiado (pode estar oculto)

#### Opção B: Via FTP
1. Use um cliente FTP (FileZilla, WinSCP, etc)
2. Conecte com suas credenciais da Hostinger
3. Navegue até `public_html`
4. Delete arquivos antigos
5. Faça upload de todos os arquivos da pasta `out`

### 4. Verificar .htaccess
Certifique-se que o arquivo `.htaccess` está presente na raiz do `public_html`. Ele é essencial para:
- Rotas funcionarem corretamente
- Configurar cache
- Habilitar compressão

### 5. Testar o Site
Acesse seu domínio e verifique:
- ✅ Página inicial carrega
- ✅ Links de navegação funcionam
- ✅ Imagens aparecem
- ✅ Animações funcionam

## Estrutura Final na Hostinger
```
public_html/
├── .htaccess
├── index.html
├── _next/
│   ├── static/
│   └── ...
├── app-store-badge.png
├── GooglePlay.png
└── outros arquivos...
```

## 🔧 Troubleshooting

### Página 404 ao navegar
- Verifique se o `.htaccess` existe e está configurado corretamente

### Imagens não aparecem
- Certifique-se que todas as imagens da pasta `public` foram copiadas
- Verifique permissões dos arquivos (644 para arquivos, 755 para pastas)

### CSS não carrega
- Limpe o cache do navegador (Ctrl+Shift+R)
- Verifique se a pasta `_next` foi copiada completamente

### Erros 500
- Verifique o `.htaccess` por erros de sintaxe
- Verifique os logs de erro no painel da Hostinger

## 📝 Comandos Úteis

### Build de produção
```bash
npm run build
```

### Testar build localmente
```bash
npx serve out
```

## 🔄 Atualizações Futuras
Para atualizar o site:
1. Faça as alterações no código
2. Execute `npm run build`
3. Faça upload apenas dos arquivos modificados da pasta `out`
4. Limpe o cache do CDN (se estiver usando)

## ⚠️ Importante
- Sempre faça backup antes de substituir arquivos
- Teste localmente antes de fazer deploy
- Use HTTPS para melhor segurança e SEO
