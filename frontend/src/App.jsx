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
import Vagas from './pages/public/Vagas'
import Noticias from './pages/public/Noticias'
import NoticiaDetalhe from './pages/public/NoticiaDetalhe'
import AssistenteVirtual from './components/ui/AssistenteVirtual'
import Tutorial from './pages/public/Tutorial'

import DashboardAdmin from './pages/admin/DashboardAdmin'
import ParceirosAdmin from './pages/admin/ParceirosAdmin'
import DoadoresAdmin from './pages/admin/DoadoresAdmin'
import PrestacaoContasAdmin from './pages/admin/PrestacaoContasAdmin'
import RelatoriosAdmin from './pages/admin/RelatoriosAdmin'
import PendentesAdmin from './pages/admin/PendentesAdmin'
import DoadorDetalheAdmin from './pages/admin/DoadorDetalheAdmin'
import GraficosAdmin from './pages/admin/GraficosAdmin'
import NossasNecessidades from './pages/public/NossasNecessidades'
import NoticiasAdmin from './pages/admin/NoticiasAdmin'
import VagasAdmin from './pages/admin/VagasAdmin'
import BancoCurriculosAdmin from './pages/admin/BancoCurriculosAdmin'
import HistoricoNecessidadesAdmin from './pages/admin/HistoricoNecessidadesAdmin'

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
        <Route path="/necessidades" element={<NossasNecessidades />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/doador/login" element={<DoadorLogin />} />
        <Route path="/doador/painel" element={<PainelDoadorPublico />} />
        <Route path="/vagas" element={<Vagas />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/noticias/:id" element={<NoticiaDetalhe />} />
        <Route path="/tutorial" element={<Tutorial />} />

        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/parceiros" element={<ParceirosAdmin />} />
        <Route path="/admin/doadores" element={<DoadoresAdmin />} />
        <Route path="/admin/doadores/:id" element={<DoadorDetalheAdmin />} />
        <Route path="/admin/prestacao-contas" element={<PrestacaoContasAdmin />} />
        <Route path="/admin/relatorios" element={<RelatoriosAdmin />} />
        <Route path="/admin/pendentes" element={<PendentesAdmin />} />
        <Route path="/admin/graficos" element={<GraficosAdmin />} />
        <Route path="/nossas-necessidades" element={<NossasNecessidades />} />
        <Route path="/admin/noticias" element={<NoticiasAdmin />} />
        <Route path="/admin/vagas" element={<VagasAdmin />} />
        <Route path="/admin/banco-curriculos" element={<BancoCurriculosAdmin />} />
        <Route path="/admin/necessidades/historico" element={<HistoricoNecessidadesAdmin />}/>

      
      </Routes>

      {mostrarLayoutPublico && <Footer />}
      {!isAdmin && <AssistenteVirtual />}
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