import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './jogoAventuraBlocos.css'

import VilaBlocos3D from '../../components/games/vila-blocos-3d/VilaBlocos3D'

const STORAGE_KEY = 'aventura_blocos_personagem'

const personagensBase = [
  {
    id: 'lucas',
    nome: 'Lucas',
    genero: 'menino',
    cabelo: 'castanho',
    roupa: 'azul',
    olhos: 'castanho',
    sapato: 'preto',
    acessorio: 'nenhum',
    nivelMinimo: 1
  },
  {
    id: 'pedro',
    nome: 'Pedro',
    genero: 'menino',
    cabelo: 'preto',
    roupa: 'verde',
    olhos: 'castanho',
    sapato: 'marrom',
    acessorio: 'nenhum',
    nivelMinimo: 1
  },
  {
    id: 'rafael',
    nome: 'Rafael',
    genero: 'menino',
    cabelo: 'loiro',
    roupa: 'vermelho',
    olhos: 'azul',
    sapato: 'preto',
    acessorio: 'nenhum',
    nivelMinimo: 1
  },
  {
    id: 'sofia',
    nome: 'Sofia',
    genero: 'menina',
    cabelo: 'castanho-longo',
    roupa: 'rosa',
    olhos: 'castanho',
    sapato: 'rosa',
    acessorio: 'laco',
    nivelMinimo: 1
  },
  {
    id: 'laura',
    nome: 'Laura',
    genero: 'menina',
    cabelo: 'castanho-roxo',
    roupa: 'roxo',
    olhos: 'verde',
    sapato: 'branco',
    acessorio: 'laco',
    nivelMinimo: 1
  },
  {
    id: 'alice',
    nome: 'Alice',
    genero: 'menina',
    cabelo: 'ruivo',
    roupa: 'turquesa',
    olhos: 'azul',
    sapato: 'preto',
    acessorio: 'nenhum',
    nivelMinimo: 1
  }
]

const opcoesCriacao = {
  roupas: [
    { id: 'azul', nome: 'Azul', nivelMinimo: 1 },
    { id: 'verde', nome: 'Verde', nivelMinimo: 1 },
    { id: 'vermelho', nome: 'Vermelho', nivelMinimo: 1 },
    { id: 'rosa', nome: 'Rosa', nivelMinimo: 1 },
    { id: 'roxo', nome: 'Roxo', nivelMinimo: 1 },
    { id: 'turquesa', nome: 'Turquesa', nivelMinimo: 1 },
    { id: 'laranja', nome: 'Laranja', nivelMinimo: 10 },
    { id: 'preto', nome: 'Preto', nivelMinimo: 20 }
  ],
  cabelos: [
    { id: 'castanho', nome: 'Castanho', nivelMinimo: 1 },
    { id: 'preto', nome: 'Preto', nivelMinimo: 1 },
    { id: 'loiro', nome: 'Loiro', nivelMinimo: 1 },
    { id: 'ruivo', nome: 'Ruivo', nivelMinimo: 1 },
    { id: 'castanho-longo', nome: 'Longo', nivelMinimo: 1 },
    { id: 'castanho-roxo', nome: 'Laço', nivelMinimo: 1 },
    { id: 'cacheado', nome: 'Cacheado', nivelMinimo: 15 },
    { id: 'adulto', nome: 'Adulto', nivelMinimo: 40 }
  ],
  olhos: [
    { id: 'castanho', nome: 'Castanho', nivelMinimo: 1 },
    { id: 'azul', nome: 'Azul', nivelMinimo: 1 },
    { id: 'verde', nome: 'Verde', nivelMinimo: 1 },
    { id: 'preto', nome: 'Preto', nivelMinimo: 1 }
  ],
  sapatos: [
    { id: 'preto', nome: 'Preto', nivelMinimo: 1 },
    { id: 'azul', nome: 'Azul', nivelMinimo: 1 },
    { id: 'vermelho', nome: 'Vermelho', nivelMinimo: 1 },
    { id: 'marrom', nome: 'Marrom', nivelMinimo: 1 },
    { id: 'rosa', nome: 'Rosa', nivelMinimo: 1 },
    { id: 'dourado', nome: 'Dourado', nivelMinimo: 25 }
  ],
  acessorios: [
    { id: 'nenhum', nome: 'Nenhum', nivelMinimo: 1 },
    { id: 'oculos', nome: 'Óculos nerd', nivelMinimo: 5 },
    { id: 'bone', nome: 'Boné', nivelMinimo: 8 },
    { id: 'fone', nome: 'Fone', nivelMinimo: 12 },
    { id: 'coroa', nome: 'Coroa', nivelMinimo: 30 }
  ]
}

function JogoAventuraBlocos() {
  const [tela, setTela] = useState('inicio')
  const [personagem, setPersonagem] = useState(personagensBase[0])
  const [nome, setNome] = useState('')
  const [abaCriacao, setAbaCriacao] = useState('roupas')
  const [maiorNivel, setMaiorNivel] = useState(1)

  useEffect(() => {
    const salvo = carregarPersonagemSalvo()

    if (salvo) {
      setPersonagem(salvo.personagem)
      setNome(salvo.nome || '')
      setMaiorNivel(salvo.maiorNivel || 1)
    }
  }, [])

  const personagemComNome = useMemo(() => {
    return {
      ...personagem,
      nome: nome.trim() || personagem.nome
    }
  }, [personagem, nome])

  function salvarPersonagemAtual(personagemAtual = personagem, nomeAtual = nome) {
    const dados = {
      nome: nomeAtual,
      personagem: personagemAtual,
      maiorNivel,
      atualizadoEm: new Date().toISOString()
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados))
  }

  function escolherPersonagem(item) {
    setPersonagem(item)
    setNome(item.nome)
    salvarPersonagemAtual(item, item.nome)
  }

  function atualizarCampo(campo, valor) {
    const atualizado = {
      ...personagem,
      [campo]: valor
    }

    setPersonagem(atualizado)
    salvarPersonagemAtual(atualizado, nome)
  }

  function iniciarJogo() {
    salvarPersonagemAtual(personagemComNome, nome)
    setTela('jogo')
  }

  function aoAtualizarNivel(novoNivel) {
    if (novoNivel > maiorNivel) {
      setMaiorNivel(novoNivel)

      const dados = {
        nome,
        personagem,
        maiorNivel: novoNivel,
        atualizadoEm: new Date().toISOString()
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(dados))
    }
  }

  return (
    <main className="aventura-menu-page">
      {tela === 'inicio' && (
        <TelaInicio
          personagem={personagemComNome}
          maiorNivel={maiorNivel}
          onEscolher={() => setTela('escolher')}
          onCriar={() => setTela('criar')}
          onJogar={iniciarJogo}
        />
      )}

      {tela === 'escolher' && (
        <TelaEscolherPersonagem
          personagens={personagensBase}
          personagemSelecionado={personagem}
          onEscolher={escolherPersonagem}
          onVoltar={() => setTela('inicio')}
          onCriar={() => setTela('criar')}
          onContinuar={() => setTela('inicio')}
        />
      )}

      {tela === 'criar' && (
        <TelaCriarPersonagem
          nome={nome}
          setNome={setNome}
          personagem={personagem}
          opcoes={opcoesCriacao}
          aba={abaCriacao}
          setAba={setAbaCriacao}
          maiorNivel={maiorNivel}
          onCampo={atualizarCampo}
          onVoltar={() => setTela('inicio')}
          onJogar={iniciarJogo}
        />
      )}

      {tela === 'jogo' && (
        <TelaJogo
          personagem={personagemComNome}
          onVoltar={() => setTela('inicio')}
          onNivel={aoAtualizarNivel}
        />
      )}
    </main>
  )
}

function TelaInicio({ personagem, maiorNivel, onEscolher, onCriar, onJogar }) {
  return (
    <section className="aventura-home-screen">
      <div className="aventura-bg-world" />

      <div className="aventura-home-content">
        <div className="game-logo-cube" />

        <span className="aventura-pill">Aventura educativa</span>

        <h1>
          Aventura dos Blocos
        </h1>

        <p>
          Uma aventura divertida para aprender brincando
          <strong> com níveis infinitos!</strong>
        </p>

        <div className="aventura-home-panel">
          <div className="aventura-home-preview">
            <div className="floating-island">
              <BonecoPixel personagem={personagem} grande />
              <span className="preview-block">A</span>
              <span className="preview-flower" />
            </div>
          </div>

          <div className="aventura-home-actions">
            <button type="button" onClick={onEscolher}>
              <MiniHead personagem={personagem} />
              <span>Escolha seu personagem</span>
              <strong>›</strong>
            </button>

            <button type="button" className="purple" onClick={onCriar}>
              <span className="mini-face" />
              <span>Criar personagem</span>
              <strong>›</strong>
            </button>

            <button type="button" className="play" onClick={onJogar}>
              <span className="play-icon">▶</span>
              <span>Jogar</span>
              <strong>›</strong>
            </button>
          </div>
        </div>

        <div className="aventura-unlocks">
          <div>
            <strong>Explore fases incríveis</strong>
            <span>Sol, frio, neve e chuva aparecem conforme você avança.</span>
          </div>

          <div>
            <strong>Nível máximo</strong>
            <span>{maiorNivel}</span>
          </div>

          <div>
            <strong>Desbloqueios</strong>
            <span>Roupas, cabelos, sapatos e acessórios.</span>
          </div>
        </div>

        <div className="aventura-bottom-links">
          <Link to="/tutorial">← Voltar para jogos</Link>
          
        </div>
      </div>
    </section>
  )
}

function TelaEscolherPersonagem({
  personagens,
  personagemSelecionado,
  onEscolher,
  onVoltar,
  onCriar,
  onContinuar
}) {
  return (
    <section className="aventura-select-screen">
      <button type="button" className="back-square" onClick={onVoltar}>
        ←
      </button>

      <div className="aventura-screen-title">
        <div className="game-logo-cube small" />

        <h1>
          Escolha seu
          <strong> personagem</strong>
        </h1>

        <p>Selecione um herói para começar a aventura.</p>
      </div>

      <div className="character-grid-big">
        {personagens.map((item) => (
          <article
            key={item.id}
            className={
              personagemSelecionado.id === item.id
                ? 'character-choice active'
                : 'character-choice'
            }
          >
            <div className="character-stage">
              <BonecoPixel personagem={item} grande />
            </div>

            <h2>{item.nome}</h2>

            <button type="button" onClick={() => onEscolher(item)}>
              Escolher
            </button>
          </article>
        ))}
      </div>

      <div className="select-tip">
        <span>⭐</span>

        <div>
          <strong>Dica do explorador</strong>
          <p>
            Cada personagem pode ser personalizado depois com roupas,
            cabelos, olhos, sapatos e acessórios.
          </p>
        </div>
      </div>

      <div className="screen-actions">
        <button type="button" onClick={onVoltar}>
          ← Voltar
        </button>

        <button type="button" className="purple" onClick={onCriar}>
          Criar personagem
        </button>

        <button type="button" className="yellow" onClick={onContinuar}>
          Continuar ›
        </button>
      </div>
    </section>
  )
}

function TelaCriarPersonagem({
  nome,
  setNome,
  personagem,
  opcoes,
  aba,
  setAba,
  maiorNivel,
  onCampo,
  onVoltar,
  onJogar
}) {
  const opcoesAba = opcoes[aba] || []

  return (
    <section className="aventura-create-screen">
      <button type="button" className="back-square" onClick={onVoltar}>
        ←
      </button>

      <div className="create-title">
        <span>Crie seu personagem</span>
        <p>
          Escolha cada detalhe e monte seu herói para viver grandes aventuras
          e aprender brincando!
        </p>
      </div>

      <div className="create-layout">
        <aside className="create-left">
          <label>
            Nome ou apelido
            <input
              value={nome}
              maxLength={12}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite aqui..."
            />
            <small>Máx. 12 caracteres</small>
          </label>

          <div className="unlock-box">
            <strong>Avance e desbloqueie!</strong>
            <p>
              À medida que você joga, conquista estrelas, sobe de nível e novos
              itens ficam disponíveis.
            </p>
          </div>

          <div className="evolution-box">
            <strong>Cresça e evolua!</strong>

            <div>
              <EvolutionStep label="Criança" nivel="1" />
              <span>→</span>
              <EvolutionStep label="Adolescente" nivel="25" />
              <span>→</span>
              <EvolutionStep label="Adulto" nivel="60" />
            </div>
          </div>
        </aside>

        <div className="create-preview">
          <div className="create-world">
            <BonecoPixel personagem={personagem} gigante />
          </div>

          <div className="preview-tools">
            <button type="button">Girar</button>
            <button type="button">Zoom</button>
            <button type="button">Fundo</button>
          </div>
        </div>
      </div>

      <div className="create-tabs">
        <button
          type="button"
          className={aba === 'roupas' ? 'active' : ''}
          onClick={() => setAba('roupas')}
        >
          👕 Roupas
        </button>

        <button
          type="button"
          className={aba === 'cabelos' ? 'active' : ''}
          onClick={() => setAba('cabelos')}
        >
          💇 Cabelos
        </button>

        <button
          type="button"
          className={aba === 'olhos' ? 'active' : ''}
          onClick={() => setAba('olhos')}
        >
          👁️ Olhos
        </button>

        <button
          type="button"
          className={aba === 'sapatos' ? 'active' : ''}
          onClick={() => setAba('sapatos')}
        >
          👟 Sapatos
        </button>

        <button
          type="button"
          className={aba === 'acessorios' ? 'active' : ''}
          onClick={() => setAba('acessorios')}
        >
          👓 Acessórios
        </button>
      </div>

      <div className="item-grid">
        {opcoesAba.map((item) => {
          const bloqueado = maiorNivel < item.nivelMinimo
          const campo = campoPorAba(aba)
          const ativo = personagem[campo] === item.id

          return (
            <button
              key={item.id}
              type="button"
              className={ativo ? 'active' : ''}
              disabled={bloqueado}
              onClick={() => onCampo(campo, item.id)}
            >
              <ItemIcon tipo={aba} id={item.id} />
              <strong>{item.nome}</strong>

              {bloqueado ? (
                <span>Nv. {item.nivelMinimo}</span>
              ) : ativo ? (
                <span>✓</span>
              ) : null}
            </button>
          )
        })}
      </div>

      <div className="screen-actions create-actions">
        <button type="button" onClick={onVoltar}>
          ← Voltar
        </button>

        <button
          type="button"
          onClick={() => {
            const aleatorio = gerarPersonagemAleatorio()
            onCampo('roupa', aleatorio.roupa)
            onCampo('cabelo', aleatorio.cabelo)
            onCampo('olhos', aleatorio.olhos)
            onCampo('sapato', aleatorio.sapato)
            onCampo('acessorio', aleatorio.acessorio)
          }}
        >
          🎲 Aleatório
        </button>

        <button type="button" className="yellow" onClick={onJogar}>
          ▶ Play
        </button>
      </div>
    </section>
  )
}

function TelaJogo({ personagem, onVoltar, onNivel }) {
  return (
    <section className="aventura-only-game">
      <VilaBlocos3D
        personagemExterno={personagem}
        onVoltarMenu={onVoltar}
        onNivelChange={onNivel}
      />
    </section>
  )
}

function BonecoPixel({ personagem, grande = false, gigante = false }) {
  return (
    <div
      className={[
        'pixel-boneco',
        personagem.roupa,
        personagem.cabelo,
        personagem.olhos,
        personagem.sapato,
        personagem.acessorio,
        grande ? 'grande' : '',
        gigante ? 'gigante' : ''
      ].join(' ')}
    >
      <div className="p-cabelo" />
      <div className="p-cabeca">
        <span className="p-olho esquerdo" />
        <span className="p-olho direito" />
        <span className="p-boca" />
        {personagem.acessorio === 'oculos' && <span className="p-oculos" />}
      </div>

      <div className="p-corpo">
        <span className="p-braco esquerdo" />
        <span className="p-tronco" />
        <span className="p-braco direito" />
      </div>

      <div className="p-pernas">
        <span />
        <span />
      </div>
    </div>
  )
}

function MiniHead({ personagem }) {
  return (
    <div className={`mini-head ${personagem.cabelo}`}>
      <span />
    </div>
  )
}

function EvolutionStep({ label, nivel }) {
  return (
    <div className="evolution-step">
      <MiniHead personagem={{ cabelo: 'castanho' }} />
      <span>{label}</span>
      <small>Nível {nivel}</small>
    </div>
  )
}

function ItemIcon({ tipo, id }) {
  return (
    <div className={`item-icon ${tipo} ${id}`}>
      {tipo === 'roupas' && '👕'}
      {tipo === 'cabelos' && '💇'}
      {tipo === 'olhos' && '👁️'}
      {tipo === 'sapatos' && '👟'}
      {tipo === 'acessorios' && (id === 'nenhum' ? '—' : '✨')}
    </div>
  )
}

function campoPorAba(aba) {
  if (aba === 'roupas') return 'roupa'
  if (aba === 'cabelos') return 'cabelo'
  if (aba === 'olhos') return 'olhos'
  if (aba === 'sapatos') return 'sapato'
  return 'acessorio'
}

function gerarPersonagemAleatorio() {
  const escolher = (lista) => lista[Math.floor(Math.random() * lista.length)].id

  return {
    roupa: escolher(opcoesCriacao.roupas.filter((item) => item.nivelMinimo === 1)),
    cabelo: escolher(opcoesCriacao.cabelos.filter((item) => item.nivelMinimo === 1)),
    olhos: escolher(opcoesCriacao.olhos.filter((item) => item.nivelMinimo === 1)),
    sapato: escolher(opcoesCriacao.sapatos.filter((item) => item.nivelMinimo === 1)),
    acessorio: escolher(opcoesCriacao.acessorios.filter((item) => item.nivelMinimo === 1))
  }
}

function carregarPersonagemSalvo() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

export default JogoAventuraBlocos