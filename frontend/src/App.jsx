import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/public/Home'
import QuemSomos from './pages/public/QuemSomos'
import Projetos from './pages/public/Projetos'
import Transparencia from './pages/public/Transparencia'
import Voluntario from './pages/public/Voluntario'
import Parceiros from './pages/public/Parceiros'
import Login from './pages/public/Login'
import AdminLogin from './pages/admin/AdminLogin'
import DoadorLogin from './pages/public/DoadorLogin'
import PainelDoador from './pages/public/PainelDoador'
import DashboardAdmin from './pages/admin/DashboardAdmin'
import ParceirosAdmin from './pages/admin/ParceirosAdmin'
import DoadoresAdmin from './pages/admin/DoadoresAdmin'
import PrestacaoContasAdmin from './pages/admin/PrestacaoContasAdmin'
import RelatoriosAdmin from './pages/admin/RelatoriosAdmin'
import PendentesAdmin from './pages/admin/PendentesAdmin'
function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quem-somos" element={<QuemSomos />} />
        <Route path="/projetos" element={<Projetos />} />
        <Route path="/transparencia" element={<Transparencia />} />
        <Route path="/voluntario" element={<Voluntario />} />
        <Route path="/parceiros" element={<Parceiros />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/doador/login" element={<DoadorLogin />} />
        <Route path="/doador/painel" element={<PainelDoador />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/parceiros" element={<ParceirosAdmin />} />
        <Route path="/admin/doadores" element={<DoadoresAdmin />} />
        <Route path="/admin/prestacao-contas" element={<PrestacaoContasAdmin />} />
        <Route path="/admin/relatorios" element={<RelatoriosAdmin />} />
        <Route path="/admin/pendentes" element={<PendentesAdmin />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  )
}

export default App