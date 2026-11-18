export class FalhaDaApi extends Error {
 constructor(status,message){super(message);this.status=status;}
}
export async function chamarOperacao(operation,sessionToken,payload={},clientBucket='') {
 const token=process.env.HOSTGATOR_BRIDGE_TOKEN;
 if(!token)throw new FalhaDaApi(503,'Ponte ainda não configurada.');
 const response=await fetch('https://casamento-flavio-victoria.com.br/api/operacoes.php',{
  method:'POST',headers:{'Content-Type':'application/json','X-Bridge-Token':token},
  body:JSON.stringify({operation,session_token:sessionToken,payload,client_bucket:clientBucket}),
  redirect:'error',signal:AbortSignal.timeout(15000)
 });
 const data=await response.json();
 if(!response.ok||data.ok!==true)throw new FalhaDaApi(response.status>=400&&response.status<500?response.status:503,typeof data.message==='string'?data.message:'Ponte indisponível.');
 return data;
}
