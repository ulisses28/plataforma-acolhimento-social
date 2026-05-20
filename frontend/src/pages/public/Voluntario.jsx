import React from 'react'
import { Link } from 'react-router-dom'
import { registrarInteracao } from '../../services/analyticsService'

function Voluntario() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Seja um Voluntário</h1>
          <p style={styles.subtitle}>
            Contribua com seu tempo, suas habilidades ou com doações para fortalecer o cuidado às crianças, adolescentes e jovens acolhidas.
          </p>
        </header>

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Áreas de atuação</h2>
          <ul style={styles.list}>
            <li>Apoio nas rotinas diárias dos acolhidos: companhia, escuta e interação.</li>
            <li>Atividades recreativas, educativas e oficinas.</li>
            <li>Apoio em eventos comemorativos e datas especiais.</li>
            <li>Organização de doações e campanhas solidárias.</li>
          </ul>
        </section>

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Bazar solidário</h2>
          <p style={styles.text}>
            O bazar tem grande participação dos voluntários e ajuda a transformar doações em recursos para a instituição.
          </p>
          <ul style={styles.list}>
            <li>Organização de peças, roupas, calçados e objetos.</li>
            <li>Separação e triagem das doações recebidas.</li>
            <li>Atendimento ao público nos dias de bazar.</li>
            <li>Apoio na divulgação e montagem do espaço.</li>
            <li>Apoio administrativo e organização dos ambientes quando necessário.</li>
          </ul>
          <p style={styles.note}>
            O voluntário atua como apoio e não substitui profissionais contratados.
          </p>
        </section>

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Requisitos</h2>
          <ul style={styles.list}>
            <li>Ter no mínimo 18 anos.</li>
            <li>Ter responsabilidade e compromisso com os horários combinados.</li>
            <li>Respeitar as normas internas e o sigilo das informações dos acolhidos.</li>
            <li>Ter postura ética, empatia e sensibilidade.</li>
            <li>Participar de uma conversa ou orientação inicial.</li>
          </ul>
        </section>

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Horários disponíveis</h2>
          <p style={styles.text}>
            Os horários são combinados conforme a disponibilidade do voluntário e a necessidade da instituição.
          </p>
          <ul style={styles.list}>
            <li>Manhã, tarde ou noite.</li>
            <li>Durante a semana ou finais de semana.</li>
            <li>Atividades fixas ou ações pontuais, como o bazar.</li>
          </ul>
        </section>

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Como funciona o contato</h2>
          <ul style={styles.list}>
            <li>Entre em contato pelo WhatsApp, telefone ou redes sociais.</li>
            <li>Informe seu interesse, inclusive se deseja participar do bazar.</li>
            <li>Aguarde o retorno para agendamento de uma conversa.</li>
            <li>Participe da orientação inicial antes de iniciar as atividades.</li>
          </ul>

          <a
            href="https://wa.me/5527998391810"
            target="_blank"
            rel="noreferrer"
            style={styles.whatsappButton}
          >
            Falar com Cristina Rocha
          </a>
        </section>

        <section style={styles.donationCard}>
          <div>
            <h2 style={styles.donationTitle}>Deseja ajudar com uma doação?</h2>
            <p style={styles.donationText}>
              Você também pode contribuir com alimentos, roupas, calçados, materiais de higiene, itens para o bazar ou doações financeiras.
            </p>
            <p style={styles.donationText}>
              Ao clicar em “Doar agora”, você poderá escolher doar como doador identificado ou de forma anônima, usando Pix ou TED.
            </p>
          </div>

          <Link to="/doar-agora" style={styles.donationButton}>
            Doar agora
            </Link>
        </section>
      </div>
    </main>
  )
}

const styles = {
  page: {
    background: '#F1F5F9',
    padding: '40px 20px'
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '30px'
  },
  title: {
    color: '#0B3D91',
    margin: 0,
    fontSize: '2.2rem'
  },
  subtitle: {
    color: '#4b5563',
    marginTop: '10px',
    lineHeight: '1.6'
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '16px',
    marginBottom: '20px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.08)'
  },
  sectionTitle: {
    color: '#0B3D91',
    marginTop: 0
  },
  text: {
    color: '#374151',
    lineHeight: '1.7'
  },
  list: {
    color: '#374151',
    lineHeight: '1.8',
    paddingLeft: '20px'
  },
  note: {
    backgroundColor: '#f8fbff',
    borderLeft: '4px solid #0B3D91',
    padding: '12px',
    borderRadius: '8px',
    color: '#374151',
    lineHeight: '1.6'
  },
  whatsappButton: {
    display: 'inline-block',
    marginTop: '12px',
    backgroundColor: '#16a34a',
    color: '#ffffff',
    padding: '12px 18px',
    borderRadius: '999px',
    textDecoration: 'none',
    fontWeight: '700'
  },
  donationCard: {
    background: 'linear-gradient(135deg, #0B3D91, #1d4ed8)',
    padding: '28px',
    borderRadius: '20px',
    color: '#ffffff',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    alignItems: 'center',
    flexWrap: 'wrap',
    boxShadow: '0 6px 22px rgba(0,0,0,0.15)'
  },
  donationTitle: {
    margin: 0,
    fontSize: '1.6rem'
  },
  donationText: {
    lineHeight: '1.7',
    marginBottom: 0
  },
  donationButton: {
    backgroundColor: '#ffffff',
    color: '#0B3D91',
    padding: '14px 22px',
    borderRadius: '999px',
    textDecoration: 'none',
    fontWeight: '800',
    whiteSpace: 'nowrap'
  }
}

export default Voluntario