import { Navigate, useLocation } from 'react-router-dom'
import {
  limparSessaoAdmin,
  registrarAtividadeAdmin,
  sessaoAdminExpirada,
  sessaoAdminInativa
} from '../utils/sessaoAdmin'

function ProtectedAdminRoute({ children }) {
  const location = useLocation()

  const adminLogado = localStorage.getItem('admin-auth')
  const precisaTrocarSenha = localStorage.getItem('admin-trocar-senha')

  if (!adminLogado || sessaoAdminExpirada() || sessaoAdminInativa()) {
    limparSessaoAdmin()
    return <Navigate to="/admin/login" replace />
  }

  registrarAtividadeAdmin()

  if (
    precisaTrocarSenha === 'true' &&
    location.pathname !== '/admin/alterar-senha'
  ) {
    return <Navigate to="/admin/alterar-senha" replace />
  }

  return children
}

export default ProtectedAdminRoute