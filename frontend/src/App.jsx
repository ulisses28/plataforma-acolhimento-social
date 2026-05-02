import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

import Home from './pages/public/Home'
import QuemSomos from './pages/public/QuemSomos'
import Projetos from './pages/public/Projetos'
import Transparencia from './pages/public/Transparencia'
import Voluntario from './pages/public/Voluntario'
import Parceiros from './pages/public/Parceiros'
import Login from './pages/public/Login'
import DoarAgora from './pages/public/DoarAgora'
import AdminLogin from './pages/admin/AdminLogin'
import DoadorLogin from './pages/public/DoadorLogin'
import PainelDoadorPublico from './pages/public/PainelDoadorPublico'

import DashboardAdmin from './pages/admin/DashboardAdmin'
import ParceirosAdmin from './pages/admin/ParceirosAdmin'
import DoadoresAdmin from './pages/admin/DoadoresAdmin'
import PrestacaoContasAdmin from './pages/admin/PrestacaoContasAdmin'
import RelatoriosAdmin from './pages/admin/RelatoriosAdmin'
import PendentesAdmin from './pages/admin/PendentesAdmin'
import DoadorDetalheAdmin from './pages/admin/DoadorDetalheAdmin'
import GraficosAdmin from './pages/admin/GraficosAdmin'

function Layout() {
  const location = useLocation()

  const isHome = location.pathname === '/'
  const isAdmin = location.pathname.startsWith('/admin')

  const mostrarLayoutPublico = !isHome && !isAdmin

  return (
    <>
      {mostrarLayoutPublico && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quem-somos" element={<QuemSomos />} />
        <Route path="/projetos" element={<Projetos />} />
        <Route path="/transparencia" element={<Transparencia />} />
        <Route path="/voluntario" element={<Voluntario />} />
        <Route path="/parceiros" element={<Parceiros />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doar-agora" element={<DoarAgora />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/doador/login" element={<DoadorLogin />} />
        <Route path="/doador/painel" element={<PainelDoadorPublico />} />

        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/parceiros" element={<ParceirosAdmin />} />
        <Route path="/admin/doadores" element={<DoadoresAdmin />} />
        <Route path="/admin/doadores/:id" element={<DoadorDetalheAdmin />} />
        <Route path="/admin/prestacao-contas" element={<PrestacaoContasAdmin />} />
        <Route path="/admin/relatorios" element={<RelatoriosAdmin />} />
        <Route path="/admin/pendentes" element={<PendentesAdmin />} />
        <Route path="/admin/graficos" element={<GraficosAdmin />} />
      </Routes>

      {mostrarLayoutPublico && <Footer />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

export default App