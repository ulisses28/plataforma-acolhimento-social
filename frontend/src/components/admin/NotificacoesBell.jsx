import { useMemo, useState } from 'react'

function NotificacoesBell({
  noticias = [],
  necessidades = [],
  doacoes = []
}) {
  const [aberto, setAberto] =
    useState(false)

  const notificacoes =
    useMemo(() => {
      const lista = []

      const noticiasRevisao =
        noticias.filter(
          (n) =>
            n.status ===
            'Em Revisão'
        )

      if (
        noticiasRevisao.length > 0
      ) {
        lista.push({
          tipo: 'noticia',
          mensagem: `${noticiasRevisao.length} notícia(s) aguardando aprovação`
        })
      }

      const necessidadesAlta =
        necessidades.filter(
          (n) =>
            n.prioridade ===
            'Alta'
        )

      if (
        necessidadesAlta.length > 0
      ) {
        lista.push({
          tipo: 'necessidade',
          mensagem: `${necessidadesAlta.length} necessidade(s) de prioridade alta`
        })
      }

      if (doacoes.length > 0) {
        lista.push({
          tipo: 'doacao',
          mensagem: `${doacoes.length} doação(ões) registradas`
        })
      }

      return lista
    }, [
      noticias,
      necessidades,
      doacoes
    ])

  return (
    <div style={styles.wrapper}>
      <button
        style={styles.bell}
        onClick={() =>
          setAberto(!aberto)
        }
      >
        🔔

        {notificacoes.length >
          0 && (
          <span
            style={styles.badge}
          >
            {
              notificacoes.length
            }
          </span>
        )}
      </button>

      {aberto && (
        <div style={styles.panel}>
          <h3
            style={styles.title}
          >
            Notificações
          </h3>

          {notificacoes.length ===
          0 ? (
            <p
              style={
                styles.empty
              }
            >
              Nenhuma
              notificação.
            </p>
          ) : (
            notificacoes.map(
              (
                item,
                index
              ) => (
                <div
                  key={index}
                  style={
                    styles.item
                  }
                >
                  {
                    item.mensagem
                  }
                </div>
              )
            )
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  wrapper: {
    position: 'relative'
  },

  bell: {
    border: 'none',
    background: '#ffffff',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '24px',
    position: 'relative',
    boxShadow:
      '0 6px 18px rgba(0,0,0,0.12)'
  },

  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: '#dc2626',
    color: '#fff',
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '900'
  },

  panel: {
    position: 'absolute',
    right: 0,
    top: '70px',
    width: '320px',
    background: '#fff',
    borderRadius: '18px',
    padding: '18px',
    zIndex: 999,
    boxShadow:
      '0 10px 30px rgba(0,0,0,0.18)'
  },

  title: {
    marginTop: 0,
    color: '#0B3D91'
  },

  item: {
    padding: '12px',
    borderRadius: '10px',
    background:
      '#f8fafc',
    marginBottom: '10px'
  },

  empty: {
    color: '#64748b'
  }
}

export default NotificacoesBell