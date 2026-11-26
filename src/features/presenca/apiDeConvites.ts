import { z } from 'zod';

export const idDoConvite = z.union([z.number(), z.string().regex(/^\d+$/)]).transform(Number).pipe(z.number().int().min(1).max(Number.MAX_SAFE_INTEGER));
export const numeroDeConvites = z.union([z.number(), z.string().regex(/^\d+$/)]).transform(Number).pipe(z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER));
export const grupoDoConvite = z.object({ id: idDoConvite, label: z.string() });
export const comprovanteDoConvite = z.object({ protocol: z.string().regex(/^[a-f0-9]{32}$/), confirmed_at: z.string().datetime() });
export const transporte = z.enum(['undecided', 'car', 'app', 'van']);
export const hospedagem = z.enum(['undecided', 'no', 'yes']);
export const rotulosTransporte = { undecided: 'Ainda não decidimos', car: 'Carro', app: 'Uber ou outro app', van: 'Van' } as const;
export const detalhesDoConvite = z.object({ ok: z.literal(true), group: grupoDoConvite.extend({ external_id: z.string().nullable(), contact_phone: z.string().nullable(), responsible_email: z.string().nullable(), deadline: z.string().datetime().nullable(), receipt: comprovanteDoConvite.nullable(), lodging_intent: hospedagem.default('undecided'), hotel_name: z.string().nullish(), arrival_mode: transporte.default('undecided'), table_number: idDoConvite.nullish(), table_visible: z.boolean().optional() }), guests: z.array(z.object({ id: idDoConvite, display_name: z.string(), contact_phone: z.string().nullable(), attendance: z.enum(['pending', 'yes', 'no']), revision: numeroDeConvites, arrival_override: transporte.nullish() })) });

export async function pedirAoConvite<T extends z.ZodTypeAny>(rota: 'convites' | 'confirmacoes', csrf: string, dados: object, schema: T): Promise<z.output<T>> {
  const resposta = await fetch(`/api/${rota}.php`, { method: 'POST', credentials: 'same-origin', cache: 'no-store', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf }, body: JSON.stringify(dados) });
  const corpo: unknown = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    const falha = z.object({ message: z.string() }).safeParse(corpo);
    throw new Error(falha.success ? falha.data.message : 'Serviço de convites indisponível.');
  }
  const resultado = schema.safeParse(corpo);
  if (!resultado.success) throw new Error('Resposta do serviço de convites indisponível.');
  return resultado.data;
}
