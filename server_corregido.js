// 🔒 SERVIDOR BACKEND SEGURO - VOLTAIC
// Protege todas las API keys y datos sensibles
// ✅ CONFIGURADO PARA: voltaicspa.cl

require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const fetch = require('node-fetch');
const validator = require('validator');

const app = express();
const PORT = process.env.PORT || 3000;

// ⚔️ MIDDLEWARE DE SEGURIDAD
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.static('.'));

// 🔐 CORS - CONFIGURADO PARA voltaicspa.cl
const allowedOrigins = [
  'https://voltaicspa.cl',
  'https://www.voltaicspa.cl',
  'http://localhost:3000',
  'http://localhost:8000',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Demasiadas peticiones, intenta más tarde',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// 🤖 ENDPOINT: Chat con IA (Groq API)
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, message, captchaToken } = req.body;
    const userMessage = prompt || message;

    // Validar input
    if (!userMessage || typeof userMessage !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Mensaje inválido'
      });
    }

    if (userMessage.length > 5000) {
      return res.status(400).json({
        success: false,
        error: 'Mensaje muy largo'
      });
    }

    // Sanitizar input
    const sanitizedMessage = validator.escape(userMessage);

    // Llamar a Groq API
    const response = await fetch(process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `Eres el Asesor IA de Voltaic Automatizaciones. Tu objetivo: entender necesidades y llevar a cierre profesional.

TONO:
- Profesional pero cálido. Directo sin ser tosco.
- Natural y conversacional, como un experto que habla sin rodeos pero con respeto.
- Claramente IA: lenguaje estructurado, directo, sin fingir ser humano.

ESTRATEGIA DE CONVERSACIÓN:
1. PRIMERAS 2 PREGUNTAS: Responde lo que pregunten (general, específico, como funciona, etc). Escucha bien.
2. TERCERA PREGUNTA EN ADELANTE: Responde MÁS BREVEMENTE + PIVOTA A SOLUCIÓN.
   - Ejemplo: "Eso es clave. Exactamente eso es lo que automatiza nuestro bot. ¿Cuántos mensajes al día reciben sin responder?"
   - Objetivo: pasar de "¿qué es?" a "¿cuál es tu caso?"

REGLAS:
1. CONCISO: 2-3 párrafos máximo. Sin relleno ni frases vacías tipo "¡Hola!", "estoy aquí para ayudarte".
2. PRIMER MENSAJE: Saluda brevemente + pregunta qué necesita. Es breve pero cálido.
3. DIRECTA: Responde datos concretos. Si piden precios, das números. Si preguntan cómo, lo explicas directo.
4. AMABLE: Usa "te/tu", tono conversacional. Reconoce lo que pregunta. Empatía sin exceso.
5. TRANSPARENTE: Si no sabes, lo dices. Si es limitación IA, lo mencionas naturalmente.
6. UNA PREGUNTA: Máximo una por mensaje, estratégica y natural.
7. CIERRE: Cuando tengas info de su caso → propón demo, diagnóstico gratis o próximo paso concreto.
8. FORMATO: Negritas solo lo importante. Párrafos cortos. Ideal WhatsApp.

Español siempre. Eres profesional pero humano. La conversación fluye natural pero siempre con dirección.`
          },
          {
            role: 'user',
            content: sanitizedMessage
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      console.error(`Groq API error: ${response.status}`);
      return res.status(500).json({
        success: false,
        error: 'Error al conectar con la IA'
      });
    }

    const data = await response.json();

    // Extraer respuesta
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.status(500).json({
        success: false,
        error: 'Respuesta inválida de la IA'
      });
    }

    const aiResponse = data.choices[0].message.content;

    return res.status(200).json({
      success: true,
      reply: aiResponse,
      response: aiResponse // Para compatibilidad con index.html
    });

  } catch (error) {
    console.error('Error en /api/chat:', error);
    return res.status(500).json({
      success: false,
      error: 'Error procesando tu mensaje',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'voltaic-chat' });
});

// Middleware anti-bots
const BOT_USER_AGENTS = [
  'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget',
  'python', 'java', 'ruby', 'perl', 'php', 'node'
];

function isBotUserAgent(userAgent) {
  if (!userAgent) return true;
  return BOT_USER_AGENTS.some(bot =>
    userAgent.toLowerCase().includes(bot)
  );
}

app.use((req, res, next) => {
  const userAgent = req.get('user-agent') || '';
  if (isBotUserAgent(userAgent)) {
    console.warn(`Bot detectado: ${userAgent}`);
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  next();
});

// Verificar reCAPTCHA
async function verifyRecaptcha(token) {
  // En desarrollo, aceptar cualquier token
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }

  if (!token || !process.env.RECAPTCHA_SECRET_KEY) {
    return true; // En Vercel sin secret key, permitir
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
    });

    const data = await response.json();

    if (!data.success || data.score < parseFloat(process.env.RECAPTCHA_THRESHOLD || 0.5)) {
      console.warn(`reCAPTCHA fallido: score=${data.score}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error verificando reCAPTCHA:', error);
    return true; // Permitir si hay error
  }
}

// Error handler global
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor Voltaic corriendo en puerto ${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS habilitado para: voltaicspa.cl`);
});
