import { useEffect, useState } from 'react'

import {
  salvarCurriculo,
  lerArquivoComoBase64
} from '../../services/curriculosService'

function EnviarCurriculo() {
  const [estados, setEstados] = useState([])
  const [municipios, setMunicipios] = useState([])

  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    sexo: '',
    estado: '',
    municipio: '',
    mensagem: '',
    lgpd: false,
    curriculo: null,
    recomendacao: null
  })

  useEffect(() => {
    async function carregarEstados() {
      const resposta = await fetch(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'
      )

      const dados = await resposta.json()
      setEstados(dados)
    }

    carregarEstados()
  }, [])

  useEffect(() => {
    async function carregarMunicipios() {
      if (!form.estado) {
        setMunicipios([])
        return
      }

      const resposta = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${form.estado}/municipios`
      )

      const dados = await resposta.json()
      setMunicipios(dados)
    }

    carregarMunicipios()
  }, [form.estado])

  function alterar(campo, valor) {
    setForm({
      ...form,
      [campo]: valor
    })
  }

  async function enviar(e) {
    e.preventDefault()

    if (!form.nome.trim()) {
      alert('Informe o nome completo.')
      return
    }

    if (!form.email.trim()) {
      alert('Informe o e-mail.')
      return
    }

    if (!form.curriculo) {
      alert('Anexe o currículo em PDF.')
      return
    }

    if (!form.lgpd) {
      alert('É necessário aceitar os termos LGPD.')
      return
    }

    const curriculoBase64 = await lerArquivoComoBase64(form.curriculo)

    const recomendacaoBase64 = form.recomendacao
      ? await lerArquivoComoBase64(form.recomendacao)
      : ''

    salvarCurriculo({
      nome: form.nome,
      email: form.email,
      telefone: form.telefone,
      sexo: form.sexo,
      estado: form.estado,
      municipio: form.municipio,
      mensagem: form.mensagem,
      curriculoNome: form.curriculo?.name || '',
      curriculoBase64,
      recomendacaoNome: form.recomendacao?.name || '',
      recomendacaoBase64
    })

    alert('Currículo enviado com sucesso.')

    setForm({
      nome: '',
      email: '',
      telefone: '',
      sexo: '',
      estado: '',
      municipio: '',
      mensagem: '',
      lgpd: false,
      curriculo: null,
      recomendacao: null
    })
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1 style={styles.title}>Banco de Currículos</h1>

        <p style={styles.subtitle}>
          Candidate-se às oportunidades e faça parte da missão do Lar Batista Albertine Meador.
        </p>

        <form onSubmit={enviar} style={styles.form}>
          <label style={styles.label}>Nome completo</label>
          <input
            style={styles.input}
            value={form.nome}
            onChange={(e) => alterar('nome', e.target.value)}
          />

          <label style={styles.label}>E-mail</label>
          <input
            type="email"
            style={styles.input}
            value={form.email}
            onChange={(e) => alterar('email', e.target.value)}
          />

          <label style={styles.label}>Telefone</label>
          <input
            style={styles.input}
            value={form.telefone}
            onChange={(e) => alterar('telefone', e.target.value)}
          />

          <label style={styles.label}>Sexo / Identidade de gênero</label>
          <select
            style={styles.input}
            value={form.sexo}
            onChange={(e) => alterar('sexo', e.target.value)}
          >
            <option value="">Selecione</option>
            <option>Masculino</option>
            <option>Feminino</option>
            <option>Homem Trans</option>
            <option>Mulher Trans</option>
            <option>Travesti</option>
            <option>Não Binário</option>
            <option>Gênero Fluido</option>
            <option>Agênero</option>
            <option>Intersexo</option>
            <option>Prefiro não informar</option>
            <option>Outro</option>
          </select>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Estado</label>
              <select
                style={styles.input}
                value={form.estado}
                onChange={(e) => {
                  alterar('estado', e.target.value)
                  alterar('municipio', '')
                }}
              >
                <option value="">Selecione</option>
                {estados.map((estado) => (
                  <option key={estado.id} value={estado.sigla}>
                    {estado.nome}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Município</label>
              <select
                style={styles.input}
                value={form.municipio}
                onChange={(e) => alterar('municipio', e.target.value)}
                disabled={!form.estado}
              >
                <option value="">Selecione</option>
                {municipios.map((cidade) => (
                  <option key={cidade.id} value={cidade.nome}>
                    {cidade.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label style={styles.label}>Currículo em PDF</label>
          <input
            type="file"
            accept=".pdf"
            style={styles.fileInput}
            onChange={(e) => alterar('curriculo', e.target.files[0])}
          />

          <label style={styles.label}>Carta de apresentação ou recomendação</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            style={styles.fileInput}
            onChange={(e) => alterar('recomendacao', e.target.files[0])}
          />

          <label style={styles.label}>Apresentação profissional</label>
          <textarea
            style={styles.textarea}
            value={form.mensagem}
            onChange={(e) => alterar('mensagem', e.target.value)}
          />

          <div style={styles.lgpdBox}>
            <input
              type="checkbox"
              checked={form.lgpd}
              onChange={(e) => alterar('lgpd', e.target.checked)}
            />

            <span>
              Autorizo o tratamento dos meus dados pessoais para participação em processos seletivos
              e banco de talentos, conforme a Lei Geral de Proteção de Dados.
            </span>
          </div>

          <button type="submit" style={styles.button}>
            Enviar currículo
          </button>
        </form>
      </section>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f1f7ff',
    padding: '48px 20px'
  },

  card: {
    width: '100%',
    maxWidth: '760px',
    margin: '0 auto',
    background: '#fff',
    borderRadius: '24px',
    padding: '34px',
    boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
    boxSizing: 'border-box'
  },

  title: {
    color: '#0B3D91',
    marginTop: 0
  },

  subtitle: {
    color: '#64748b',
    lineHeight: '1.6'
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },

  label: {
    fontWeight: '800',
    color: '#1f2937',
    marginTop: '8px'
  },

  input: {
    width: '100%',
    height: '48px',
    border: '1px solid #dbeafe',
    borderRadius: '12px',
    padding: '0 14px',
    boxSizing: 'border-box',
    background: '#fff',
    fontSize: '14px'
  },

  fileInput: {
    width: '100%',
    border: '1px solid #dbeafe',
    borderRadius: '12px',
    padding: '14px',
    boxSizing: 'border-box',
    background: '#fff'
  },

  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px'
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },

  textarea: {
    width: '100%',
    minHeight: '120px',
    border: '1px solid #dbeafe',
    borderRadius: '12px',
    padding: '12px',
    boxSizing: 'border-box',
    resize: 'vertical'
  },

  lgpdBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginTop: '12px',
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '14px',
    padding: '14px',
    color: '#475569',
    lineHeight: '1.5'
  },

  button: {
    marginTop: '18px',
    background: '#16a34a',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '15px',
    fontWeight: '900',
    cursor: 'pointer'
  }
}

export default EnviarCurriculo