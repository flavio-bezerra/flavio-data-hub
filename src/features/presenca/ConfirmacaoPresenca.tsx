import { Navigate, useParams } from 'react-router-dom';

export default function ConfirmacaoPresenca() {
  const { codigo } = useParams();
  return <Navigate replace to={codigo && /^[a-f0-9]{64}$/.test(codigo) ? `/meu-convite#codigo=${codigo}` : '/meu-convite#codigo=invalido'} />;
}
