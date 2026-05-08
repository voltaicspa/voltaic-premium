# 🚀 GUÍA RÁPIDA DE REEMPLAZO - VOLTAIC

**Estado:** ✅ LISTO PARA REEMPLAZAR  
**Tiempo:** 5 minutos  
**Dominio:** voltaicspa.cl  

---

## 📋 ARCHIVOS A REEMPLAZAR

### 1️⃣ ARCHIVO CRÍTICO: `server.js`

#### ¿Dónde está?
```
Tu carpeta → Web_Nueva_Voltaic → server.js
```

#### ¿Qué hacer?
1. **Descarga:** El archivo `server_corregido.js` que está en tu carpeta
2. **Borra:** Todo el contenido del `server.js` actual
3. **Pega:** El contenido de `server_corregido.js` en el `server.js`
4. **Guarda:** Ctrl+S

#### ¿Qué cambió?
- ✅ **CORS ahora acepta:** `voltaicspa.cl` y `www.voltaicspa.cl`
- ✅ **System prompt mejorado:** Especializado para Voltaic
- ✅ **Respuesta compatible:** Devuelve `response` + `reply`
- ✅ **Error handling robusto:** Funciona sin variables faltantes

---

### 2️⃣ ARCHIVO: `index.html`

#### ¿Dónde está?
```
Tu carpeta → Web_Nueva_Voltaic → index.html
```

#### ¿Qué verificar?
Busca al final del archivo (antes de `</body>`) y asegúrate de que tenga este script:

```html
<script>
  // Conexión del Chat con el Servidor Voltaic
  const chatForm = document.querySelector('#chat-form');
  const chatInput = document.querySelector('#chat-input');
  const chatBox = document.querySelector('#chat-box');

  if (chatForm) {
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = chatInput.value.trim();
      if (!msg) return;

      // Mostrar mensaje del usuario
      chatBox.innerHTML += `<div style="color: #10b981; margin-bottom: 10px;"><b>Tú:</b> ${msg}</div>`;
      chatInput.value = '';

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: msg })
        });
        const data = await res.json();
        if (data.success) {
          chatBox.innerHTML += `<div style="color: white; margin-bottom: 10px;"><b>Voltaic IA:</b> ${data.response}</div>`;
        }
      } catch (err) {
        chatBox.innerHTML += `<div style="color: red;">Error: El servidor no responde</div>`;
      }
      chatBox.scrollTop = chatBox.scrollHeight;
    });
  }
</script>
```

**Si NO lo tiene:** Agrega ese código justo antes de `</body>`

---

## 🔐 PASO 3: CONFIGURAR EN VERCEL (CRUCIAL)

Sin esto, el chat **NO funcionará** en producción.

### Pasos:

1. **Abre tu dashboard de Vercel**
   - Ve a: https://vercel.com/dashboard

2. **Selecciona tu proyecto**
   - Busca: `voltaic-premium` o `web-nueva-voltaic`
   - Click en él

3. **Ve a Settings**
   - Click en "Settings" en la barra superior

4. **Environment Variables**
   - Click en "Environment Variables" (lado izquierdo)

5. **Agrega las variables:**

| Variable | Valor | Dónde obtenerlo |
|----------|-------|-----------------|
| `GROQ_API_KEY` | `gsk_...` | https://console.groq.com → API Keys |
| `GROQ_API_URL` | `https://api.groq.com/openai/v1/chat/completions` | Copiar tal cual |
| `NODE_ENV` | `production` | Copiar tal cual |

6. **Click en "Save"**

7. **Redeploy automático**
   - Vercel redepoya automáticamente
   - Espera 2-3 minutos
   - ✅ Listo

---

## ✅ VERIFICACIÓN POST-REEMPLAZO

### Paso 1: Testear Localmente
```bash
# En tu terminal:
cd Web_Nueva_Voltaic
npm install
npm start

# Abre: http://localhost:3000
# Click en el chat
# Escribe: "Hola, tengo una tienda"
# Espera respuesta de la IA
```

### Paso 2: Testear en Vercel
```
1. Abre: https://voltaicspa.cl
2. Click en botón flotante (chat)
3. Escribe: "Automatiza mi WhatsApp"
4. ✅ Deberías ver respuesta de la IA
```

### Paso 3: Verificar Logs
Si hay error, revisa en Vercel:
- Ve a "Deployments"
- Click en el deployment actual
- Click en "Logs"
- Busca qué falta

---

## 🔴 ERRORES COMUNES Y SOLUCIONES

### Error: "CORS blocked"
```
❌ Problema: El cliente no puede conectar con el servidor
✅ Solución: 
   - Verifica que CORS incluya tu dominio
   - En server_corregido.js ya está: voltaicspa.cl
   - Si usas otro dominio, edita línea 24-28
```

### Error: "API Key not found"
```
❌ Problema: GROQ_API_KEY no está en Vercel
✅ Solución:
   1. Ve a Vercel Dashboard → Settings → Environment Variables
   2. Verifica que GROQ_API_KEY esté ahí
   3. Si falta, agrégalo
   4. Redeploy en Projects
```

### Error: "500 Error procesando"
```
❌ Problema: Falta una variable .env
✅ Solución:
   1. Abre Vercel Logs para ver detalle
   2. Probablemente falta: GROQ_API_URL
   3. Agrégalo en Environment Variables
   4. Redeploy
```

### El chat no aparece
```
❌ Problema: El script en index.html no existe o está mal
✅ Solución:
   1. Abre index.html
   2. Busca: <script> // Conexión del Chat
   3. Si no está, copia el script de ARCHIVO: `index.html`
   4. Guarda y redeploy
```

---

## 📝 CHECKLIST FINAL

- [ ] Descargué `server_corregido.js`
- [ ] Reemplacé el contenido del `server.js` actual
- [ ] Verifiqué que `index.html` tiene el script de chat
- [ ] Agregué 3 variables en Vercel Dashboard
- [ ] Hice Redeploy en Vercel
- [ ] Testé en http://localhost:3000
- [ ] Testé en https://voltaicspa.cl
- [ ] ✅ El chat responde con IA

---

## 🎯 RESULTADO ESPERADO

Cuando abras **https://voltaicspa.cl**:

1. ✅ Botón flotante aparece en esquina inferior derecha
2. ✅ Click en el botón abre un chat
3. ✅ Escribes un mensaje
4. ✅ La IA responde (Groq Llama 3.1)
5. ✅ El chat es conversacional y especializado en Voltaic

---

## 📞 SI ALGO FALLA

**Punto de contacto en Vercel:**
1. Ve a tu proyecto
2. Click en "Deployments"
3. Busca el último deployment
4. Click en él
5. Click en "Logs"
6. Busca mensajes de error rojo
7. Google el error (usualmente variable faltante)

---

## ⏱️ TIEMPO ESTIMADO

- Reemplazar archivos: **2 minutos**
- Configurar Vercel: **2 minutos**
- Redeploy Vercel: **3 minutos**
- Testing: **2 minutos**

**Total: 9 minutos**

---

**¿Listo? Empieza por descargar `server_corregido.js` y reemplaza tu `server.js`** 🚀

