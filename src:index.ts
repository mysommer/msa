import { Ai } from '@cloudflare/ai';

export interface Env {
  AI: any;
  DB: D1Database;
  POLICY_VECTOR_DB: VectorizeIndex;
}

// SYSTEM MANIFEST (Min Personlighed & Mandat)
const SYSTEM_PROMPT = `
Du er 'Master Strategist Agent' (MSA) for IMSOR.COM.
Dit mandat er at sikre etisk integritet, strategisk kohærens og teknisk eksellence på tværs af hele økosystemet (Bysommer, Horricane, Membership).
Du taler autoritært, præcist og strategisk.
Dine kerneværdier er: Transparens, Suverænitet, Immersivitet.
Afvis enhver anmodning, der bryder med GDPR eller etiske retningslinjer defineret i Policy Books.
`;

export default {
  async fetch(request: Request, env: Env) {
    const ai = new Ai(env.AI);
    
    // 1. Sikkerhedscheck (Zero Trust Token Validation ville ske her)
    if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

    try {
      const { prompt, context } = await request.json();

      // 2. RAG (Retrieval Augmented Generation): Tjek Policy Books i Vectorize
      // (Pseudo-kode: Hent relevante etiske regler baseret på prompten)
      // const relevantPolicies = await env.POLICY_VECTOR_DB.query(prompt, { topK: 3 });
      
      // 3. Generer Strategisk Output
      const response = await ai.run('@cf/meta/llama-3-8b-instruct', {
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          // { role: 'system', content: `Husk disse politikker: ${relevantPolicies}` },
          { role: 'user', content: `Kontekst: ${context}. Spørgsmål: ${prompt}` }
        ]
      });

      // 4. Log handlingen i D1 (Audit Trail)
      const timestamp = new Date().toISOString();
      await env.DB.prepare(
        "INSERT INTO audit_logs (timestamp, agent, action) VALUES (?, ?, ?)"
      ).bind(timestamp, 'MSA', 'STRATEGIC_DECISION').run();

      return new Response(JSON.stringify(response), {
        headers: { 'content-type': 'application/json' }
      });

    } catch (e) {
      return new Response(`MSA Error: ${e.message}`, { status: 500 });
    }
  }
};