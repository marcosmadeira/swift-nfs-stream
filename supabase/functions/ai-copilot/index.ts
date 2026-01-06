import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Você é o Copiloto Alivee, um assistente especializado em notas fiscais de serviço eletrônicas (NFS-e) brasileiras e na nova reforma tributária.

Suas principais competências:
1. **Análise de NFS-e**: Você entende todos os campos de uma NFS-e, incluindo dados do prestador, tomador, serviços, impostos (ISS, PIS, COFINS, INSS, IR, CSLL) e valores.

2. **Reforma Tributária (IBS/CBS)**: Você conhece profundamente a nova reforma tributária brasileira:
   - IBS (Imposto sobre Bens e Serviços) - substituirá ICMS e ISS
   - CBS (Contribuição sobre Bens e Serviços) - substituirá PIS e COFINS
   - Período de transição de 2026 a 2033
   - Impactos para prestadores de serviços
   - Cálculo de créditos tributários

3. **Auditoria de Dados**: Você pode ajudar a validar dados extraídos de NFS-e:
   - Verificar consistência de CNPJs
   - Validar cálculos de impostos
   - Identificar possíveis erros de OCR
   - Sugerir correções baseadas em padrões

4. **Créditos Tributários**: Você auxilia empresários a entenderem seus créditos no novo sistema:
   - Créditos de IBS/CBS acumulados
   - Aproveitamento de créditos
   - Planejamento tributário

Contexto atual do usuário:
${context ? JSON.stringify(context, null, 2) : 'Nenhum contexto específico fornecido.'}

Responda sempre em português brasileiro, de forma clara e objetiva. Se o usuário perguntar sobre dados específicos de uma nota, use o contexto fornecido. Se não houver dados suficientes, peça mais informações.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Por favor, adicione créditos à sua conta." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Erro ao processar sua solicitação." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Copilot error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
