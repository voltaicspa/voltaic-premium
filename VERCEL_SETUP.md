# 🚀 Guía de Deploy a Vercel

## ✅ Pre-requisitos

- Cuenta en [vercel.com](https://vercel.com)
- Código subido a GitHub
- Variables de entorno configuradas

## 📋 Paso 1: Crear Proyecto en Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa tu repositorio de GitHub
3. Vercel detectará automáticamente que es un proyecto Next.js/Node
4. Click en **Deploy**

## 🔐 Paso 2: Configurar Variables de Entorno en Vercel

En el panel de Vercel, ve a: **Settings → Environment Variables**

Agrega estas variables:

```
GROQ_API_URL = https://api.groq.com/openai/v1/chat/completions
GROQ_API_KEY = (tu clave de Groq API)
RECAPTCHA_SECRET_KEY = (tu clave secreta de reCAPTCHA)
RECAPTCHA_THRESHOLD = 0.5
ALLOWED_ORIGINS = https://tudominio.com,https://www.tudominio.com
GOOGLE_SHEETS_URL = (si usas Google Sheets)
```

## 📍 Paso 3: Actualizar CORS en Producción

En `server.js`, la variable `ALLOWED_ORIGINS` leerá del .env.

Para Vercel, asegúrate de que incluya:
- Tu dominio principal: `https://tudominio.com`
- Con y sin www: `https://www.tudominio.com`

## 🧪 Paso 4: Testear la API

Después del deploy, tu API estará en:
```
https://tu-proyecto.vercel.app/api/chat
```

Prueba con curl:
```bash
curl -X POST https://tu-proyecto.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hola","captchaToken":"mock-token-desarrollo-local"}'
```

## 🔗 Paso 5: Actualizar Frontend

En tu `index.html` o `script.js`, actualiza el endpoint:

```javascript
// Cambiar de:
const API_URL = 'http://localhost:3000/api/chat';

// A:
const API_URL = 'https://tu-proyecto.vercel.app/api/chat';
```

## ⚠️ Solución de Problemas

### Error: CORS blocked
- Verifica que `ALLOWED_ORIGINS` incluya tu dominio
- En desarrollo local, usa: `http://localhost:3000`

### Error: API Key not found
- Ve a Vercel → Settings → Environment Variables
- Asegúrate de que las variables están establecidas
- Redeploy después de cambiar variables

### Error: 405 Method not allowed
- Verifica que estés haciendo POST, no GET
- El endpoint es `/api/chat`, no `/api/chat/`

## 📱 Deploy Automático

Cada vez que hagas push a GitHub:
1. Vercel detecta el cambio automáticamente
2. Redeploy automático en 1-2 minutos
3. Cero downtime

## 🎯 Próximos Pasos

- [ ] Configurar dominio personalizado
- [ ] Habilitar HTTPS (automático en Vercel)
- [ ] Monitorear logs en Vercel Dashboard
- [ ] Configurar alertas de errores
