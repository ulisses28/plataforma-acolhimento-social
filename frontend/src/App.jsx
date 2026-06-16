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
import DoadorLogin from './pages/public/DoadorLogin'
import PainelDoadorPublico from './pages/public/PainelDoadorPublico'
import Vagas from './pages/public/Vagas'
import Noticias from './pages/public/Noticias'
import Artigos from './pages/public/Artigos'
import ArtigoDetalhe from './pages/public/ArtigoDetalhe'
import NoticiaDetalhe from './pages/public/NoticiaDetalhe'
import VideosEducativos from './pages/public/VideosEducativos'
import Tutorial from './pages/public/Tutorial'
import JogoAventuraBlocos from './pages/public/JogoAventuraBlocos'
import JogosDiversao from './pages/public/JogosDiversao'
import NossasNecessidades from './pages/public/NossasNecessidades'
import DoadorDoar from './pages/public/DoadorDoar'
import GovernancaInstitucional from './pages/public/GovernancaInstitucional'
import RedefinirSenha from './pages/public/RedefinirSenha'
import EnviarCurriculo from './pages/public/EnviarCurriculo'



import AssistenteVirtual from './components/ui/AssistenteVirtual'

import AdminLogin from './pages/admin/AdminLogin'
import DashboardAdmin from './pages/admin/DashboardAdmin'
import ParceirosAdmin from './pages/admin/ParceirosAdmin'
import DoadoresAdmin from './pages/admin/DoadoresAdmin'
import PrestacaoContasAdmin from './pages/admin/PrestacaoContasAdmin'
import RelatoriosAdmin from './pages/admin/RelatoriosAdmin'
import PendentesAdmin from './pages/admin/PendentesAdmin'
import DoadorDetalheAdmin from './pages/admin/DoadorDetalheAdmin'
import GraficosAdmin from './pages/admin/GraficosAdmin'
import NoticiasAdmin from './pages/admin/NoticiasAdmin'
import VagasAdmin from './pages/admin/VagasAdmin'
import BancoCurriculosAdmin from './pages/admin/BancoCurriculosAdmin'
import HistoricoNecessidadesAdmin from './pages/admin/HistoricoNecessidadesAdmin'
import GovernancaAdmin from './pages/admin/GovernancaAdmin'
import ProtectedAdminRoute from './routes/ProtectedAdminRoute'
import AlterarSenhaAdmin from './pages/admin/AlterarSenhaAdmin'
import AuditoriaAdmin from './pages/admin/AuditoriaAdmin'
import ConfiguracoesAdmin from './pages/admin/ConfiguracoesAdmin'

function Layout() {
  const location = useLocation()

  const isHome = location.pathname === '/'
  const isAdmin = location.pathname.startsWith('/admin')
  const isGame = location.pathname.startsWith('/jogos/')

  const mostrarLayoutPublico = !isHome && !isAdmin && !isGame

  return (
    <>
      {mostrarLayoutPublico && <Navbar />}

      <Routes>
        {/* ROTAS PÚBLICAS */}

        <Route path="/" element={<Home />} />

        <Route
          path="/quem-somos"
          element={<QuemSomos />}
        />

        <Route
          path="/projetos"
          element={<Projetos />}
        />

        <Route
          path="/transparencia"
          element={<Transparencia />}
        />

        <Route
          path="/voluntario"
          element={<Voluntario />}
        />

        <Route
          path="/parceiros"
          element={<Parceiros />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/doar-agora"
          element={<DoarAgora />}
        />
        <Route path="/doador/doar" element={<DoadorDoar />} />
        <Route
          path="/necessidades"
          element={<NossasNecessidades />}
        />

        <Route
          path="/nossas-necessidades"
          element={<NossasNecessidades />}
        />

        <Route
          path="/doador/login"
          element={<DoadorLogin />}
        />

        <Route
          path="/doador/painel"
          element={<PainelDoadorPublico />}
        />

        <Route
          path="/vagas"
          element={<Vagas />}
        />
        <Route
          path="/enviar-curriculo"
          element={<EnviarCurriculo />}
        />

        <Route
          path="/noticias"
          element={<Noticias />}
        />
        
        <Route
          path="/noticias/:id"
          element={<NoticiaDetalhe />}
        />
        <Route
          path="/artigos"
          element={<Artigos />}
        />

        <Route
          path="/artigos/:slug"
          element={<ArtigoDetalhe />}
        />
        <Route
          path="/tutorial"
          element={<Tutorial />}
        />
        <Route
          path="/galeria-videos"
          element={<VideosEducativos />}
        />
        <Route
          path="/jogos/aventura-blocos"
          element={<JogoAventuraBlocos />}
        />
        <Route
          path="/jogos-diversao"
          element={<JogosDiversao />}
        />
        <Route
          path="/governanca-institucional"
          element={<GovernancaInstitucional />}
        />
        <Route
          path="/redefinir-senha"
          element={<RedefinirSenha />}
        />
        {/* LOGIN ADMIN */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* ROTAS ADMIN PROTEGIDAS */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <DashboardAdmin />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/parceiros"
          element={
            <ProtectedAdminRoute>
              <ParceirosAdmin />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/doadores"
          element={
            <ProtectedAdminRoute>
              <DoadoresAdmin />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/doadores/:id"
          element={
            <ProtectedAdminRoute>
              <DoadorDetalheAdmin />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/prestacao-contas"
          element={
            <ProtectedAdminRoute>
              <PrestacaoContasAdmin />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/relatorios"
          element={
            <ProtectedAdminRoute>
              <RelatoriosAdmin />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/pendentes"
          element={
            <ProtectedAdminRoute>
              <PendentesAdmin />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/graficos"
          element={
            <ProtectedAdminRoute>
              <GraficosAdmin />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/noticias"
          element={
            <ProtectedAdminRoute>
              <NoticiasAdmin />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/vagas"
          element={
            <ProtectedAdminRoute>
              <VagasAdmin />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/banco-curriculos"
          element={
            <ProtectedAdminRoute>
              <BancoCurriculosAdmin />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/necessidades/historico"
          element={
            <ProtectedAdminRoute>
              <HistoricoNecessidadesAdmin />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/governanca"
          element={
            <ProtectedAdminRoute>
              <GovernancaAdmin />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/alterar-senha"
          element={
            <ProtectedAdminRoute>
              <AlterarSenhaAdmin />
            </ProtectedAdminRoute>
          }
          />
          <Route
            path="/admin/auditoria"
            element={
              <ProtectedAdminRoute>
                <AuditoriaAdmin />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/configuracoes"
            element={
              <ProtectedAdminRoute>
                <ConfiguracoesAdmin />
              </ProtectedAdminRoute>
            }
          />
      </Routes>

      {mostrarLayoutPublico && <Footer />}

      {!isAdmin && !isGame && <AssistenteVirtual />}
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