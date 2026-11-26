const escapar = valor => String(valor).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function montarComunicado({ template, subject, message }, destinatario, origin) {
  const acesso = `${origin}/meu-convite`;
  const titulos = { table: 'Sua mesa no nosso casamento', reminder: 'Lembrete de confirmação de presença', hotel: 'Hospedagem para o nosso casamento', van: 'Transporte para o nosso casamento', guide: 'Nosso casamento está chegando!', thanks: 'Obrigado por celebrar com a gente!' };
  const titulo = Object.hasOwn(titulos,template) ? titulos[template] : subject;
  const recado = template === 'table' ? `Vamos celebrar juntos! A mesa do seu convite é a ${destinatario.table_number}.` : template === 'reminder' ? 'Já sabe se vai celebrar com a gente? Entre no site para responder por sua família.' : '';
  const mesa = template === 'guide' && destinatario.table_number ? `Sua mesa: ${destinatario.table_number}. Confira a informação atualizada em Meu convite.` : '';
  const linhas = [`Olá, ${destinatario.label}!`, recado, message, mesa, 'Com carinho,\nVictória & Flávio'].filter(Boolean);
  const text = `${linhas.join('\n\n')}\n\nMeu convite: ${acesso}`;
  const html = `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><body style="margin:0;background:#faf8f3;color:#2f3f35"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:16px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:white;font-family:Georgia,serif"><tr><td align="center" background="${escapar(origin)}/rebranding/aquarela-azul.webp" style="padding:20px;background-color:#eef3f5;background-image:url('${escapar(origin)}/rebranding/aquarela-azul.webp');background-size:cover;background-position:center"><img src="${escapar(origin)}/monograma-vf.png" width="76" alt="Victória e Flávio"><p style="margin:8px 0 0;color:#34506a">Victória &amp; Flávio</p></td></tr><tr><td style="padding:24px"><h1 style="font-size:25px;color:#34506a">${escapar(titulo)}</h1>${linhas.map(l=>`<p style="font-size:16px;line-height:1.55">${escapar(l).replace(/\n/g,'<br>')}</p>`).join('')}<p><a href="${escapar(acesso)}" style="display:inline-block;padding:12px 18px;background:#34506a;color:#fff;text-decoration:none">Abrir meu convite</a></p></td></tr></table></td></tr></table></body></html>`;
  return { subject: titulo, text, html };
}
