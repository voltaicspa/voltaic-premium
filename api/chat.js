// 🤖 VERCEL API ROUTE: Chat con Groq IA
// Este endpoint funciona en producción (Vercel)

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, message, captchaToken } = req.body;
  const userMessage = prompt || message;

  // Validaciones básicas
  if (!userMessage || typeof userMessage !== "string") {
    return res.status(400).json({
      success: false,
      error: "Mensaje inválido"
    });
  }

  if (userMessage.length > 5000) {
    return res.status(400).json({
      success: false,
      error: "Mensaje muy largo"
    });
  }

  try {
    // Llamar a Groq API desde Vercel
    const response = await fetch(process.env.GROQ_API_URL || "https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
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
          { role: "user", content: userMessage }
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();

    // Validar respuesta
    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid response from Groq");
    }

    const aiResponse = data.choices[0].message.content;

    return res.status(200).json({
      success: true,
      reply: aiResponse,
      response: aiResponse
    });
  } catch (error) {
    console.error("Error en /api/chat:", error);
    return res.status(500).json({
      success: false,
      error: "Error procesando tu mensaje",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
}
