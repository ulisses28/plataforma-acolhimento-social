import { useEffect, useState } from 'react'
import BackButton from '../../components/ui/BackButton'

function ConfiguracoesAdmin() {
  const [config, setConfig] = useState({
    nomeInstituicao: '',
    telefone: '',
    email: '',
    endereco: '',
    facebook: '',
    instagram: '',
    youtube: '',
    linkedin: '',
    limiteImagem: 10,
    limiteVideo: 200,
    tempoSessao: 120,
    diasTrocaSenha: 45,
    tentativasLogin: 5
  })

  useEffect(() => {
    const dados =
      JSON.parse(
        localStorage.getItem(
          'configuracoes_lar_batista'
        )
      ) || {}

    setConfig((prev) => ({
      ...prev,
      ...dados
    }))
  }, [])

  function atualizarCampo(campo, valor) {
    setConfig((prev) => ({
      ...prev,
      [campo]: valor
    }))
  }

  function salvarConfiguracoes() {
    localStorage.setItem(
      'configuracoes_lar_batista',
      JSON.stringify(config)
    )

    alert(
      'Configurações salvas com sucesso.'
    )
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <BackButton />

        <h1 style={styles.title}>
          Configurações da Plataforma
        </h1>

        <section style={styles.card}>
          <h2>Dados Institucionais</h2>

          <input
            style={styles.input}
            placeholder="Nome da instituição"
            value={config.nomeInstituicao}
            onChange={(e) =>
              atualizarCampo(
                'nomeInstituicao',
                e.target.value
              )
            }
          />

          <input
            style={styles.input}
            placeholder="Telefone"
            value={config.telefone}
            onChange={(e) =>
              atualizarCampo(
                'telefone',
                e.target.value
              )
            }
          />

          <input
            style={styles.input}
            placeholder="E-mail"
            value={config.email}
            onChange={(e) =>
              atualizarCampo(
                'email',
                e.target.value
              )
            }
          />

          <input
            style={styles.input}
            placeholder="Endereço"
            value={config.endereco}
            onChange={(e) =>
              atualizarCampo(
                'endereco',
                e.target.value
              )
            }
          />
        </section>

        <section style={styles.card}>
          <h2>Redes Sociais</h2>

          <input
            style={styles.input}
            placeholder="Facebook"
            value={config.facebook}
            onChange={(e) =>
              atualizarCampo(
                'facebook',
                e.target.value
              )
            }
          />

          <input
            style={styles.input}
            placeholder="Instagram"
            value={config.instagram}
            onChange={(e) =>
              atualizarCampo(
                'instagram',
                e.target.value
              )
            }
          />

          <input
            style={styles.input}
            placeholder="Youtube"
            value={config.youtube}
            onChange={(e) =>
              atualizarCampo(
                'youtube',
                e.target.value
              )
            }
          />

          <input
            style={styles.input}
            placeholder="LinkedIn"
            value={config.linkedin}
            onChange={(e) =>
              atualizarCampo(
                'linkedin',
                e.target.value
              )
            }
          />
        </section>

        <section style={styles.card}>
          <h2>Segurança</h2>

          <input
            type="number"
            style={styles.input}
            placeholder="Tempo de sessão"
            value={config.tempoSessao}
            onChange={(e) =>
              atualizarCampo(
                'tempoSessao',
                e.target.value
              )
            }
          />

          <input
            type="number"
            style={styles.input}
            placeholder="Dias troca senha"
            value={config.diasTrocaSenha}
            onChange={(e) =>
              atualizarCampo(
                'diasTrocaSenha',
                e.target.value
              )
            }
          />

          <input
            type="number"
            style={styles.input}
            placeholder="Tentativas login"
            value={config.tentativasLogin}
            onChange={(e) =>
              atualizarCampo(
                'tentativasLogin',
                e.target.value
              )
            }
          />
        </section>

        <section style={styles.card}>
          <h2>Uploads</h2>

          <input
            type="number"
            style={styles.input}
            placeholder="Limite imagem"
            value={config.limiteImagem}
            onChange={(e) =>
              atualizarCampo(
                'limiteImagem',
                e.target.value
              )
            }
          />

          <input
            type="number"
            style={styles.input}
            placeholder="Limite vídeo"
            value={config.limiteVideo}
            onChange={(e) =>
              atualizarCampo(
                'limiteVideo',
                e.target.value
              )
            }
          />
        </section>

        <button
          style={styles.button}
          onClick={salvarConfiguracoes}
        >
          Salvar Configurações
        </button>
      </div>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f1f5f9',
    padding: '40px'
  },

  container: {
    maxWidth: '1000px',
    margin: '0 auto'
  },

  title: {
    color: '#0B3D91'
  },

  card: {
    background: '#fff',
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow:
      '0 8px 24px rgba(0,0,0,0.08)'
  },

  input: {
    width: '100%',
    height: '50px',
    marginTop: '12px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    padding: '0 12px',
    boxSizing: 'border-box'
  },

  button: {
    background: '#0B3D91',
    color: '#fff',
    border: 'none',
    padding: '14px 22px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '900'
  }
}

export default ConfiguracoesAdmin