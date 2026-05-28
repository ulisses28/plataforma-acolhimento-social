import { Navigate, useLocation } from 'react-router-dom'
import {
  limparSessaoAdmin,
  sessaoAdminExpirada
} from '../utils/sessaoAdmin'

function ProtectedAdminRoute({ children }) {
  const location = useLocation()

  const adminLogado = localStorage.getItem('admin-auth')
  const precisaTrocarSenha = localStorage.getItem('admin-trocar-senha')

  if (!adminLogado || sessaoAdminExpirada()) {
    limparSessaoAdmin()
    return <Navigate to="/admin/login" />
  }

  if (
    precisaTrocarSenha === 'true' &&
    location.pathname !== '/admin/alterar-senha'
  ) {
    return <Navigate to="/admin/alterar-senha" />
  }

  return children
}

export default ProtectedAdminRoute