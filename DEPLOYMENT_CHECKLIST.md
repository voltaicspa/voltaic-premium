# ✅ Checklist de Deploy a Vercel

## 🔧 Errores Corregidos

### 1. **Syntax Errors en server.js** ✅
- ✅ `Bearer +API_KEY` → `'Bearer ' + API_KEY` (línea 68)
- ✅ `Error(Groq API error: +status)` → `` `Error: ${status}` `` (línea 80)
- ✅ `console.warn(🤖 Bot...)` → `` console.warn(`🤖 Bot...`) `` (línea 184)
- ✅ `body: secret=+key+&response=+token` → `` `secret=${key}&response=${token}` `` (línea 204)
- ✅ `console.log(🔒 Servidor...)` → `` console.log(`🔒 Servidor...`) `` (línea 233)

### 2. **CORS Configuration** ✅
- ✅ CORS ahora es dinámico via `ALLOWED_ORIGINS` en .env
- ✅ Soporta múltiples dominios (separados por coma)
- ✅ En desarrollo: localhost:3000, localhost:8000, 127.0.0.1:3000

### 3. **API Consistency** ✅
- ✅ `api/chat.js` ahora usa **Groq API** (no Anthropic)
- ✅ Consistente con `server.js`
- ✅ Listo para Vercel sin cambios de código

## 🚀 Deployment a Vercel (PASO A PASO)

### Paso 1: Preparar GitHub
```bash
git add .
git commit -m "Fix: CORS, syntax errors, Groq API setup"
git push origin main
```

### Paso 2: Crear Proyecto en Vercel
1. Ve a [vercel.com/new](https://vercel.com/new)
2. Conecta tu repositorio GitHub
3. Click en **Deploy**

### Paso 3: Agregar Variables de Entorno
En Vercel Dashboard → **Settings → Environment Variables**, agrega:

```
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
GROQ_API_KEY=[TU_CLAVE_GROQ]
RECAPTCHA_SECRET_KEY=[TU_CLAVE_RECAPTCHA]
RECAPTCHA_THRESHOLD=0.5
ALLOWED_ORIGINS=https://tudominio.com,https://www.tudominio.com
GOOGLE_SHEETS_URL=[TU_URL_SHEETS]
NODE_ENV=production
```

### Paso 4: Redeploy
Después de agregar variables, click en **Redeploy** en Vercel.

### Paso 5: Testear API
```bash
curl -X POST https://tu-proyecto.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Test","captchaToken":"mock-token-desarrollo-local"}'
```

## 📝 Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `server.js` | Syntax fixes + CORS dinámico |
| `api/chat.js` | Cambio a Groq API |
| `.env.example` | Creado con variables requeridas |
| `VERCEL_SETUP.md` | Guía de deployment |

## 🔍 Verificación Local (antes de push)

```bash
# 1. Instalar dependencias
npm install

# 2. Crear .env.local con tus claves
cp .env.example .env.local
# ... editar .env.local con tus valores

# 3. Correr servidor local
npm start
# o: node server.js

# 4. Testear API en otra terminal
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hola","captchaToken":"mock-token-desarrollo-local"}'
```

## ⚠️ Errores Comunes y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| CORS blocked | ALLOWED_ORIGINS no incluye tu dominio | Agregar dominio a .env |
| 500 - Missing API Key | Variable de entorno no configurada en Vercel | Ir a Settings → Environment Variables |
| 400 - Prompt required | Frontend no envía prompt | Verificar que script.js envía datos |
| 403 - Bot detected | User-Agent contiene palabra clave bot | Usar navegador real, no curl |

## 📞 Siguientes Pasos

1. **Dominio personalizado** (opcional)
   - Vercel → Settings → Domains
   
2. **Monitoreo**
   - Vercel → Analytics para ver uso
   
3. **Alertas** (opcional)
   - Integrar con Slack o email para errores
   
4. **CI/CD**
   - Vercel automáticamente redeploy en cada push

---

✅ **COMPLETADO**: Tu proyecto está listo para Vercel

Próximo: `git push` y deploy desde Vercel dashboard
