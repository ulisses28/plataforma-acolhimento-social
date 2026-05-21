import React, { useEffect, useRef, useState } from 'react'
import BackButton from '../../components/ui/BackButton'

import {
  listarVagas,
  salvarVaga,
  atualizarVaga,
  arquivarVaga,
  excluirVaga,
  lerArquivoBase64
} from '../../services/vagasService'

import {
  salvarNoticia
} from '../../services/noticiasService'

function VagasAdmin() {
  const editorRef = useRef(null)

  const formInicial = {
    titulo: '',
    tipo: 'Vaga',
    local: '',
    resumo: '',
    descricao: '',
    requisitos: '',
    escolaridade: '',
    experiencia: '',
    imagem: '',
    publicarNoticias: true
  }

  const [vagas, setVagas] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [editandoId, setEditandoId] = useState(null)

  const [form, setForm] = useState(formInicial)

  useEffect(() => {
    carregarVagas()
  }, [])

  useEffect(() => {
    if (mostrarFormulario && editorRef.current) {
      editorRef.current.innerHTML =
        form.descricao || ''
    }
  }, [mostrarFormulario, editandoId])

  function carregarVagas() {
    setVagas(listarVagas())
  }

  function alterarCampo(campo, valor) {
    setForm((atual) => ({
      ...atual,
      [campo]: valor
    }))
  }

  async function selecionarImagem(e) {
    const arquivo = e.target.files?.[0]

    if (!arquivo) return

    const base64 =
      await lerArquivoBase64(arquivo)

    alterarCampo('imagem', base64)
  }

  function limparFormulario() {
    setForm(formInicial)

    setEditandoId(null)

    setMostrarFormulario(false)

    if (editorRef.current) {
      editorRef.current.innerHTML = ''
    }
  }

  function atualizarDescricao() {
    if (editorRef.current) {
      alterarCampo(
        'descricao',
        editorRef.current.innerHTML
      )
    }
  }

  function aplicarComando(comando) {
    document.execCommand(comando)
    atualizarDescricao()
  }

  function aplicarCor(cor) {
    document.execCommand(
      'foreColor',
      false,
      cor
    )

    atualizarDescricao()
  }

  function aplicarTitulo() {
    document.execCommand(
      'formatBlock',
      false,
      'h2'
    )

    atualizarDescricao()
  }

  function salvar(e) {
    e.preventDefault()

    if (!form.titulo.trim()) {
      return alert(
        'Informe o título da vaga.'
      )
    }

    if (!form.local.trim()) {
      return alert(
        'Informe o local da vaga.'
      )
    }

    const dados = {
      ...form,
      descricao:
        editorRef.current?.innerHTML || ''
    }

    if (editandoId) {
      atualizarVaga({
        ...dados,
        id: editandoId
      })

      alert('Vaga atualizada!')
    } else {
      const vagaCriada =
        salvarVaga(dados)

      /*
      ========================================
      PUBLICAR EM ÚLTIMAS NOTÍCIAS
      ========================================
      */

      if (dados.publicarNoticias) {
        salvarNoticia({
          titulo: dados.titulo,

          categoria:
            dados.tipo === 'Voluntário'
              ? 'Voluntariado'
              : 'Oportunidade',

          areaPublicacao:
            'Últimas Notícias',

          resumo:
            dados.resumo ||
            'Nova oportunidade disponível.',

          conteudo:
            dados.descricao ||
            dados.resumo,

          midias: [],

          youtubeUrl: '',

          status: 'Publicado',

          midia: dados.imagem || '',

          tipoMidia: 'image/jpeg',

          vagaRelacionada:
            vagaCriada.id
        })
      }

      alert('Vaga publicada!')
    }

    limparFormulario()

    carregarVagas()
  }

  function editar(vaga) {
    setForm({
      titulo: vaga.titulo || '',
      tipo: vaga.tipo || 'Vaga',
      local: vaga.local || '',
      resumo: vaga.resumo || '',
      descricao: vaga.descricao || '',
      requisitos: vaga.requisitos || '',
      escolaridade:
        vaga.escolaridade || '',
      experiencia:
        vaga.experiencia || '',
      imagem: vaga.imagem || '',
      publicarNoticias:
        vaga.publicarNoticias || false
    })

    setEditandoId(vaga.id)

    setMostrarFormulario(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  function arquivar(id) {
    if (
      !confirm(
        'Deseja arquivar esta vaga?'
      )
    )
      return

    arquivarVaga(id)

    carregarVagas()
  }

  function remover(id) {
    if (
      !confirm(
        'Deseja excluir esta vaga?'
      )
    )
      return

    excluirVaga(id)

    carregarVagas()
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <BackButton />

        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>
              Gestão de Vagas
            </h1>

            <p style={styles.subtitle}>
              Cadastre vagas, voluntariado e
              oportunidades sociais da
              instituição.
            </p>
          </div>

          <button
            style={styles.addButton}
            onClick={() => {
              limparFormulario()
              setMostrarFormulario(true)
            }}
          >
            + Nova vaga
          </button>
        </header>

        {mostrarFormulario && (
          <form
            style={styles.formCard}
            onSubmit={salvar}
          >
            <h2 style={styles.sectionTitle}>
              {editandoId
                ? 'Editar vaga'
                : 'Nova vaga'}
            </h2>

            <label style={styles.label}>
              Título da vaga *
            </label>

            <input
              style={styles.input}
              value={form.titulo}
              onChange={(e) =>
                alterarCampo(
                  'titulo',
                  e.target.value
                )
              }
              placeholder="Ex: Auxiliar Administrativo"
            />

            <div style={styles.twoColumns}>
              <div>
                <label style={styles.label}>
                  Tipo
                </label>

                <select
                  style={styles.input}
                  value={form.tipo}
                  onChange={(e) =>
                    alterarCampo(
                      'tipo',
                      e.target.value
                    )
                  }
                >
                  <option>Vaga</option>

                  <option>
                    Voluntário
                  </option>
                </select>
              </div>

              <div>
                <label style={styles.label}>
                  Local *
                </label>

                <input
                  style={styles.input}
                  value={form.local}
                  onChange={(e) =>
                    alterarCampo(
                      'local',
                      e.target.value
                    )
                  }
                  placeholder="Serra - ES"
                />
              </div>
            </div>

            <label style={styles.label}>
              Resumo
            </label>

            <textarea
              style={styles.textarea}
              value={form.resumo}
              onChange={(e) =>
                alterarCampo(
                  'resumo',
                  e.target.value
                )
              }
              placeholder="Texto curto da vaga."
            />

            <label style={styles.label}>
              Descrição da vaga
            </label>

            <div style={styles.editorBox}>
              <div style={styles.toolbar}>
                <button
                  type="button"
                  style={styles.toolButton}
                  onClick={() =>
                    aplicarComando(
                      'bold'
                    )
                  }
                >
                  B
                </button>

                <button
                  type="button"
                  style={styles.toolButton}
                  onClick={() =>
                    aplicarComando(
                      'italic'
                    )
                  }
                >
                  I
                </button>

                <button
                  type="button"
                  style={styles.toolButton}
                  onClick={() =>
                    aplicarComando(
                      'underline'
                    )
                  }
                >
                  U
                </button>

                <button
                  type="button"
                  style={styles.toolButton}
                  onClick={() =>
                    aplicarComando(
                      'insertUnorderedList'
                    )
                  }
                >
                  • Lista
                </button>

                <button
                  type="button"
                  style={styles.toolButton}
                  onClick={() =>
                    aplicarCor(
                      '#0B3D91'
                    )
                  }
                >
                  Azul
                </button>

                <button
                  type="button"
                  style={styles.toolButton}
                  onClick={() =>
                    aplicarCor(
                      '#16a34a'
                    )
                  }
                >
                  Verde
                </button>

                <button
                  type="button"
                  style={styles.toolButton}
                  onClick={
                    aplicarTitulo
                  }
                >
                  Título
                </button>
              </div>

              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                style={styles.editor}
                onInput={
                  atualizarDescricao
                }
              />
            </div>

            <div style={styles.twoColumns}>
              <div>
                <label style={styles.label}>
                  Escolaridade
                </label>

                <input
                  style={styles.input}
                  value={
                    form.escolaridade
                  }
                  onChange={(e) =>
                    alterarCampo(
                      'escolaridade',
                      e.target.value
                    )
                  }
                  placeholder="Ex: Ensino médio"
                />
              </div>

              <div>
                <label style={styles.label}>
                  Experiência
                </label>

                <input
                  style={styles.input}
                  value={
                    form.experiencia
                  }
                  onChange={(e) =>
                    alterarCampo(
                      'experiencia',
                      e.target.value
                    )
                  }
                  placeholder="Ex: 1 ano"
                />
              </div>
            </div>

            <label style={styles.label}>
              Requisitos
            </label>

            <textarea
              style={styles.textarea}
              value={form.requisitos}
              onChange={(e) =>
                alterarCampo(
                  'requisitos',
                  e.target.value
                )
              }
              placeholder="Ex: Excel, organização, atendimento..."
            />

            <label style={styles.label}>
              Imagem da vaga
            </label>

            <input
              style={styles.input}
              type="file"
              accept="image/*"
              onChange={
                selecionarImagem
              }
            />

            {form.imagem && (
              <img
                src={form.imagem}
                alt="Preview"
                style={
                  styles.previewImage
                }
              />
            )}

            <div style={styles.checkboxBox}>
              <input
                type="checkbox"
                checked={
                  form.publicarNoticias
                }
                onChange={(e) =>
                  alterarCampo(
                    'publicarNoticias',
                    e.target.checked
                  )
                }
              />

              <span>
                Publicar também em
                Últimas Notícias
              </span>
            </div>

            <div style={styles.actions}>
              <button
                type="submit"
                style={styles.saveButton}
              >
                {editandoId
                  ? 'Atualizar vaga'
                  : 'Publicar vaga'}
              </button>

              <button
                type="button"
                style={
                  styles.cancelButton
                }
                onClick={
                  limparFormulario
                }
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <section style={styles.listCard}>
          <h2 style={styles.sectionTitle}>
            Vagas cadastradas
          </h2>

          {vagas.length === 0 ? (
            <p style={styles.emptyText}>
              Nenhuma vaga cadastrada.
            </p>
          ) : (
            <div style={styles.grid}>
              {vagas.map((vaga) => (
                <article
                  key={vaga.id}
                  style={styles.card}
                >
                  {vaga.imagem && (
                    <img
                      src={vaga.imagem}
                      alt={vaga.titulo}
                      style={
                        styles.cardImage
                      }
                    />
                  )}

                  <span
                    style={{
                      ...styles.badge,
                      background:
                        vaga.status ===
                        'Arquivada'
                          ? '#dc2626'
                          : '#16a34a'
                    }}
                  >
                    {vaga.status}
                  </span>

                  <h3 style={styles.cardTitle}>
                    {vaga.titulo}
                  </h3>

                  <p style={styles.cardMeta}>
                    {vaga.tipo} •{' '}
                    {vaga.local}
                  </p>

                  <p style={styles.cardText}>
                    {vaga.resumo}
                  </p>

                  <div
                    style={
                      styles.cardActions
                    }
                  >
                    <button
                      style={
                        styles.editButton
                      }
                      onClick={() =>
                        editar(vaga)
                      }
                    >
                      ✏️ Editar
                    </button>

                    <button
                      style={
                        styles.archiveButton
                      }
                      onClick={() =>
                        arquivar(
                          vaga.id
                        )
                      }
                    >
                      📦 Arquivar
                    </button>

                    <button
                      style={
                        styles.deleteButton
                      }
                      onClick={() =>
                        remover(
                          vaga.id
                        )
                      }
                    >
                      🗑 Excluir
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f1f7ff',
    padding: '40px 20px'
  },

  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '24px'
  },

  title: {
    color: '#0B3D91',
    fontSize: '2.5rem',
    margin: 0
  },

  subtitle: {
    color: '#475569',
    lineHeight: '1.6'
  },

  addButton: {
    background: '#ffc928',
    color: '#002855',
    border: 'none',
    borderRadius: '14px',
    padding: '14px 20px',
    fontWeight: '900',
    cursor: 'pointer'
  },

  formCard: {
    background: '#fff',
    borderRadius: '22px',
    padding: '28px',
    marginBottom: '24px',
    boxShadow:
      '0 8px 24px rgba(0,0,0,0.08)'
  },

  listCard: {
    background: '#fff',
    borderRadius: '22px',
    padding: '28px',
    boxShadow:
      '0 8px 24px rgba(0,0,0,0.08)'
  },

  sectionTitle: {
    color: '#0B3D91',
    marginTop: 0
  },

  label: {
    display: 'block',
    marginTop: '14px',
    marginBottom: '6px',
    color: '#334155',
    fontWeight: '800'
  },

  input: {
    width: '100%',
    minHeight: '46px',
    borderRadius: '10px',
    border: '1px solid #bfdbfe',
    background: '#f8fbff',
    padding: '0 12px',
    boxSizing: 'border-box'
  },

  textarea: {
    width: '100%',
    minHeight: '90px',
    borderRadius: '10px',
    border: '1px solid #bfdbfe',
    background: '#f8fbff',
    padding: '12px',
    boxSizing: 'border-box'
  },

  twoColumns: {
    display: 'grid',
    gridTemplateColumns:
      '1fr 1fr',
    gap: '14px'
  },

  editorBox: {
    border: '1px solid #bfdbfe',
    borderRadius: '14px',
    overflow: 'hidden',
    background: '#fff'
  },

  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    padding: '10px',
    borderBottom:
      '1px solid #dbeafe',
    background: '#eef6ff'
  },

  toolButton: {
    border: '1px solid #bfdbfe',
    background: '#fff',
    color: '#0B3D91',
    borderRadius: '6px',
    padding: '6px 10px',
    fontWeight: '800',
    cursor: 'pointer'
  },

  editor: {
    minHeight: '260px',
    padding: '18px',
    outline: 'none',
    fontSize: '16px',
    lineHeight: '1.7',
    color: '#1e293b'
  },

  checkboxBox: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginTop: '20px',
    color: '#334155',
    fontWeight: '700'
  },

  previewImage: {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'cover',
    borderRadius: '16px',
    marginTop: '14px'
  },

  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
    flexWrap: 'wrap'
  },

  saveButton: {
    background: '#16a34a',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '13px 18px',
    fontWeight: '900',
    cursor: 'pointer'
  },

  cancelButton: {
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '13px 18px',
    fontWeight: '900',
    cursor: 'pointer'
  },

  emptyText: {
    color: '#64748b'
  },

  grid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '18px'
  },

  card: {
    background: '#f8fbff',
    border: '1px solid #dbeafe',
    borderRadius: '18px',
    padding: '18px'
  },

  cardImage: {
    width: '100%',
    height: '190px',
    objectFit: 'cover',
    borderRadius: '14px',
    marginBottom: '12px'
  },

  badge: {
    color: '#fff',
    padding: '6px 10px',
    borderRadius: '999px',
    fontWeight: '900',
    fontSize: '12px'
  },

  cardTitle: {
    color: '#0B3D91'
  },

  cardMeta: {
    color: '#64748b'
  },

  cardText: {
    color: '#334155',
    lineHeight: '1.6'
  },

  cardActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '14px',
    flexWrap: 'wrap'
  },

  editButton: {
    background: '#16a34a',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 14px',
    fontWeight: '900',
    cursor: 'pointer'
  },

  archiveButton: {
    background: '#f59e0b',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 14px',
    fontWeight: '900',
    cursor: 'pointer'
  },

  deleteButton: {
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 14px',
    fontWeight: '900',
    cursor: 'pointer'
  }
}

export default VagasAdmin