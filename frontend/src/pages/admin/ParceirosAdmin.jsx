import { useEffect, useState } from 'react'
import BackButton from '../../components/ui/BackButton'

import {
  listarPaises,
  listarEstadosBrasil,
  listarMunicipiosPorEstado
} from '../../services/localidadesService'

import {
  listarParceiros,
  salvarParceiro,
  enviarLogoParceiro
} from '../../services/parceirosService'

function ParceirosAdmin() {
  const [parceiros, setParceiros] = useState([])

  const [nomeFantasia, setNomeFantasia] = useState('')
  const [razaoSocial, setRazaoSocial] = useState('')
  const [logo, setLogo] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [logoPublicId, setLogoPublicId] = useState('')
  const [logoArquivo, setLogoArquivo] = useState(null)
  const [logoPreview, setLogoPreview] = useState('')

  const [cnpj, setCnpj] = useState('')
  const [responsavel, setResponsavel] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [tipoParceria, setTipoParceria] = useState('')
  const [area, setArea] = useState('')
  const [endereco, setEndereco] = useState('')
  const [status, setStatus] = useState('Ativo')
  const [obs, setObs] = useState('')

  const [paises, setPaises] = useState([])
  const [estados, setEstados] = useState([])
  const [municipios, setMunicipios] = useState([])

  const [pais, setPais] = useState('BR')
  const [estadoId, setEstadoId] = useState('')
  const [estadoNome, setEstadoNome] = useState('')
  const [municipio, setMunicipio] = useState('')

  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    setParceiros(listarParceiros())

    async function carregar() {
      setPaises(await listarPaises())
      setEstados(await listarEstadosBrasil())
    }

    carregar()
  }, [])

  useEffect(() => {
    async function carregarMunicipios() {
      if (!estadoId) {
        setMunicipios([])
        return
      }

      setMunicipios(await listarMunicipiosPorEstado(estadoId))
    }

    carregarMunicipios()
  }, [estadoId])

  function limparFormulario() {
    setNomeFantasia('')
    setRazaoSocial('')
    setLogo('')
    setLogoUrl('')
    setLogoPublicId('')
    setLogoArquivo(null)

    if (logoPreview) {
      URL.revokeObjectURL(logoPreview)
    }

    setLogoPreview('')
    setCnpj('')
    setResponsavel('')
    setTelefone('')
    setEmail('')
    setTipoParceria('')
    setArea('')
    setEndereco('')
    setObs('')
    setEstadoId('')
    setEstadoNome('')
    setMunicipio('')
    setStatus('Ativo')
  }

  /*
    Seleciona a logo.

    Agora a logo não é convertida para base64.
    Ela fica temporariamente no estado e só é enviada para Cloudinary ao salvar.
  */
  function selecionarLogo(e) {
    const arquivo = e.target.files?.[0]

    if (!arquivo) return

    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp']

    if (!tiposPermitidos.includes(arquivo.type)) {
      alert('Envie uma logo em JPG, PNG ou WEBP.')
      e.target.value = ''
      return
    }

    const limiteMB = 5
    const tamanhoMB = arquivo.size / (1024 * 1024)

    if (tamanhoMB > limiteMB) {
      alert(`A logo possui ${tamanhoMB.toFixed(2)} MB. O limite é ${limiteMB} MB.`)
      e.target.value = ''
      return
    }

    if (logoPreview) {
      URL.revokeObjectURL(logoPreview)
    }

    setLogoArquivo(arquivo)
    setLogoPreview(URL.createObjectURL(arquivo))

    /*
      Limpamos campos antigos para evitar salvar logo errada.
    */
    setLogo('')
    setLogoUrl('')
    setLogoPublicId('')
  }

  async function salvar(e) {
    e.preventDefault()

    if (!nomeFantasia.trim() || !cnpj.trim()) {
      alert('Informe nome fantasia e CNPJ.')
      return
    }

    try {
      setSalvando(true)

      let logoFinal = logo || logoUrl || ''
      let logoUrlFinal = logoUrl || ''
      let logoPublicIdFinal = logoPublicId || ''

      /*
        Se uma logo nova foi selecionada, envia para Cloudinary.
      */
      if (logoArquivo) {
        const upload = await enviarLogoParceiro(logoArquivo)

        logoFinal = upload.imagemUrl
        logoUrlFinal = upload.imagemUrl
        logoPublicIdFinal = upload.imagemPublicId
      }

      const paisNome = paises.find((p) => p.codigo === pais)?.nome || 'Brazil'

      const novo = salvarParceiro({
        nomeFantasia,
        razaoSocial,
        logo: logoFinal,
        logoUrl: logoUrlFinal,
        logoPublicId: logoPublicIdFinal,
        imagemUrl: logoUrlFinal,
        imagemPublicId: logoPublicIdFinal,
        cnpj,
        responsavel,
        telefone,
        email,
        tipoParceria,
        area,
        paisCodigo: pais,
        pais: paisNome,
        estadoId,
        estado: estadoNome,
        municipio,
        endereco,
        status,
        obs
      })

      setParceiros([novo, ...parceiros])
      limparFormulario()

      alert('Parceiro cadastrado com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar parceiro:', error)
      alert(error.message || 'Erro ao salvar parceiro.')
    } finally {
      setSalvando(false)
    }
  }

  function obterLogoParceiro(parceiro) {
    return parceiro.logoUrl || parceiro.imagemUrl || parceiro.logo || ''
  }

  return (
    <main style={styles.page}>
      <BackButton />

      <section style={styles.header}>
        <h1 style={styles.title}>Cadastro de Parceiros</h1>

        <p style={styles.subtitle}>
          Cadastre empresas e instituições parceiras.
        </p>
      </section>

      <form onSubmit={salvar} style={styles.card}>
        <h2 style={styles.formTitle}>Novo Parceiro</h2>

        <input
          style={styles.input}
          placeholder="Nome Fantasia *"
          value={nomeFantasia}
          onChange={(e) => setNomeFantasia(e.target.value)}
        />

        <label style={styles.label}>Logo do parceiro</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={styles.input}
          onChange={selecionarLogo}
        />

        {logoPreview && (
          <div style={styles.logoPreviewBox}>
            <img
              src={logoPreview}
              alt="Prévia da logo"
              style={styles.logoPreview}
            />

            <p style={styles.helperText}>
              A logo será enviada para a Cloudinary ao salvar.
            </p>
          </div>
        )}

        <input
          style={styles.input}
          placeholder="Razão Social"
          value={razaoSocial}
          onChange={(e) => setRazaoSocial(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="CNPJ *"
          value={cnpj}
          onChange={(e) => setCnpj(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Responsável"
          value={responsavel}
          onChange={(e) => setResponsavel(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          style={styles.input}
          value={tipoParceria}
          onChange={(e) => setTipoParceria(e.target.value)}
        >
          <option value="">Tipo de parceria</option>
          <option>Financeira</option>
          <option>Material</option>
          <option>Institucional</option>
          <option>Voluntariado</option>
        </select>

        <input
          style={styles.input}
          placeholder="Área de atuação"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />

        <h3 style={styles.sectionTitle}>Localização</h3>

        <select
          style={styles.input}
          value={pais}
          onChange={(e) => setPais(e.target.value)}
        >
          {paises.map((p) => (
            <option key={p.codigo} value={p.codigo}>
              {p.nome}
            </option>
          ))}
        </select>

        <select
          style={styles.input}
          value={estadoId}
          onChange={(e) => {
            const estado = estados.find((item) => String(item.id) === e.target.value)
            setEstadoId(e.target.value)
            setEstadoNome(estado?.nome || '')
          }}
        >
          <option value="">Selecione o estado</option>
          {estados.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nome}
            </option>
          ))}
        </select>

        <select
          style={styles.input}
          value={municipio}
          onChange={(e) => setMunicipio(e.target.value)}
        >
          <option value="">Selecione o município</option>
          {municipios.map((m) => (
            <option key={m.id} value={m.nome}>
              {m.nome}
            </option>
          ))}
        </select>

        <input
          style={styles.input}
          placeholder="Endereço"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
        />

        <select
          style={styles.input}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>Ativo</option>
          <option>Inativo</option>
        </select>

        <textarea
          style={styles.textarea}
          placeholder="Observações"
          value={obs}
          onChange={(e) => setObs(e.target.value)}
        />

        <button
          type="submit"
          style={styles.button}
          disabled={salvando}
        >
          {salvando ? 'Salvando...' : 'Salvar Parceiro'}
        </button>
      </form>

      <section style={styles.listCard}>
        <h2 style={styles.formTitle}>Parceiros cadastrados</h2>

        {parceiros.length === 0 ? (
          <p style={styles.helperText}>Nenhum parceiro cadastrado.</p>
        ) : (
          parceiros.map((p) => {
            const logoParceiro = obterLogoParceiro(p)

            return (
              <div key={p.id} style={styles.item}>
                <div>
                  {logoParceiro ? (
                    <img
                      src={logoParceiro}
                      alt={p.nomeFantasia}
                      style={styles.logoMini}
                    />
                  ) : (
                    <div style={styles.logoMiniFallback}>
                      {p.nomeFantasia?.charAt(0)}
                    </div>
                  )}
                </div>

                <strong>{p.nomeFantasia}</strong>
                <span>{p.tipoParceria}</span>
                <span>{p.municipio} - {p.estado}</span>
                <span>{p.status}</span>
              </div>
            )
          })
        )}
      </section>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f1f7ff',
    padding: '32px'
  },
  header: {
    maxWidth: '760px',
    margin: '0 auto 24px'
  },
  title: {
    color: '#0B3D91',
    fontSize: '2.4rem',
    margin: 0
  },
  subtitle: {
    color: '#475569'
  },
  card: {
    maxWidth: '760px',
    margin: '0 auto',
    background: '#ffffff',
    padding: '30px',
    borderRadius: '18px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
  },
  listCard: {
    maxWidth: '1000px',
    margin: '28px auto 0',
    background: '#ffffff',
    padding: '25px',
    borderRadius: '18px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
  },
  formTitle: {
    color: '#002855'
  },
  sectionTitle: {
    color: '#0B3D91',
    marginTop: '18px'
  },
  label: {
    display: 'block',
    color: '#334155',
    fontWeight: '800',
    marginBottom: '6px'
  },
  input: {
    width: '100%',
    height: '46px',
    marginBottom: '12px',
    borderRadius: '10px',
    border: '1px solid #bfdbfe',
    background: '#f8fbff',
    padding: '0 12px',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    minHeight: '90px',
    marginBottom: '12px',
    borderRadius: '10px',
    border: '1px solid #bfdbfe',
    background: '#f8fbff',
    padding: '12px',
    boxSizing: 'border-box'
  },
  button: {
    background: '#ffc928',
    color: '#002855',
    border: 'none',
    padding: '14px 24px',
    borderRadius: '10px',
    fontWeight: '900',
    cursor: 'pointer'
  },
  item: {
    display: 'grid',
    gridTemplateColumns: '70px 2fr 1fr 1.5fr 1fr',
    gap: '12px',
    alignItems: 'center',
    padding: '14px 0',
    borderBottom: '1px solid #e5e7eb'
  },
  logoPreviewBox: {
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '14px',
    padding: '12px',
    marginBottom: '12px'
  },
  logoPreview: {
    width: '160px',
    height: '90px',
    objectFit: 'contain',
    display: 'block',
    background: '#fff',
    borderRadius: '10px',
    border: '1px solid #dbeafe'
  },
  helperText: {
    color: '#64748b',
    fontSize: '14px'
  },
  logoMini: {
    width: '56px',
    height: '42px',
    objectFit: 'contain',
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '8px'
  },
  logoMiniFallback: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    background: '#0B3D91',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '900'
  }
}

export default ParceirosAdmin