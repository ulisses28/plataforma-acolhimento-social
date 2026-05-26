import { Navigate } from 'react-router-dom'

function ProtectedAdminRoute({ children }) {
  const adminLogado =
    localStorage.getItem('admin-auth')

  if (!adminLogado) {
    return <Navigate to="/admin/login" />
  }

  return children
}

export default ProtectedAdminRoute