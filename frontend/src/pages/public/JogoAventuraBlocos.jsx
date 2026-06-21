import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './jogoAventuraBlocos.css'

import VilaBlocos3D from '../../components/games/vila-blocos-3d/VilaBlocos3D'

import { carregarPerfilJogador } from '../../services/jogosPerfilService'
import { registrarPontuacaoJogo } from '../../services/rankingJogosService'

/*
  PÁGINA EXCLUSIVA: AVENTURA DOS BLOCOS

  Objetivo desta versão:
  - Mantém menu próprio do jogo.
  - Mantém escolha/criação de personagem.
  - Usa a versão nova VilaBlocos3D.
  - Salva personagem, maior nível, fase atual e pontos por perfil de jogador.
  - Se houver doador logado, o perfil fica separado para aquele doador.
  - Atualiza ranking local ao concluir fase.
*/

const STORAGE_LEGADO_KEY = 'aventura_blocos_personagem'
const PROGRESS_BASE_KEY = 'aventura_blocos_progresso_lar_batista'

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

  const [perfilJogador, setPerfilJogador] = useState(null)
  const [maiorNivel, setMaiorNivel] = useState(1)
  const [faseInicialIndex, setFaseInicialIndex] = useState(0)
  const [pontosIniciais, setPontosIniciais] = useState(0)

  useEffect(() => {
    const perfil = carregarPerfilJogador()
    setPerfilJogador(perfil)

    const progresso = carregarProgressoSalvo(perfil)
    const legado = carregarLegadoSalvo()

    const salvo = progresso || legado

    if (salvo?.personagem) {
      setPersonagem(salvo.personagem)
      setNome(salvo.nome || salvo.personagem.nome || '')
      setMaiorNivel(salvo.maiorNivel || 1)
      setFaseInicialIndex(Number(salvo.faseIndex) || 0)
      setPontosIniciais(Number(salvo.pontos) || 0)
    }
  }, [])

  const personagemComNome = useMemo(() => {
    return {
      ...personagem,
      nome: nome.trim() || personagem.nome
    }
  }, [personagem, nome])

  function salvarProgressoParcial(dadosExtras = {}) {
    const perfilAtual = perfilJogador || carregarPerfilJogador()
    const progressoAnterior = carregarProgressoSalvo(perfilAtual) || {}

    const dados = {
      ...progressoAnterior,
      perfilId: perfilAtual?.id || 'visitante',
      perfilApelido: perfilAtual?.apelido || 'Visitante Solidário',
      perfilAvatarUrl: perfilAtual?.avatarUrl || '',
      nome,
      personagem: personagemComNome,
      maiorNivel,
      faseIndex: faseInicialIndex,
      pontos: pontosIniciais,
      atualizadoEm: new Date().toISOString(),
      ...dadosExtras
    }

    localStorage.setItem(obterChaveProgresso(perfilAtual), JSON.stringify(dados))

    /*
      Mantém compatibilidade com a versão antiga.
      Assim não perdemos dados que outras telas possam ler.
    */
    localStorage.setItem(STORAGE_LEGADO_KEY, JSON.stringify(dados))

    return dados
  }

  function escolherPersonagem(item) {
    setPersonagem(item)
    setNome(item.nome)

    salvarProgressoParcial({
      nome: item.nome,
      personagem: item
    })
  }

  function atualizarCampo(campo, valor) {
    const atualizado = {
      ...personagem,
      [campo]: valor
    }

    setPersonagem(atualizado)

    salvarProgressoParcial({
      personagem: atualizado
    })
  }

  function gerarAleatorio() {
    const aleatorio = {
      ...personagem,
      ...gerarPersonagemAleatorio()
    }

    setPersonagem(aleatorio)

    salvarProgressoParcial({
      personagem: aleatorio
    })
  }

  function iniciarJogo() {
    salvarProgressoParcial({
      nome,
      personagem: personagemComNome
    })

    setTela('jogo')
  }

  function aoAtualizarNivel(novoNivel) {
    if (novoNivel > maiorNivel) {
      setMaiorNivel(novoNivel)

      salvarProgressoParcial({
        maiorNivel: novoNivel
      })
    }
  }

  /*
    Recebe dados do motor VilaBlocos3D quando a fase é concluída.
    Aqui salvamos progresso e atualizamos ranking local.
  */
  function aoSalvarProgressoJogo(dados) {
    const perfilAtual = perfilJogador || carregarPerfilJogador()

    const novoMaiorNivel = Math.max(
      maiorNivel,
      Number(dados.maiorNivel || dados.nivel || 1)
    )

    const novaFaseIndex =
      dados.proximaFaseIndex !== undefined
        ? Number(dados.proximaFaseIndex)
        : Number(dados.faseIndex || faseInicialIndex)

    const novosPontos = Number(dados.pontos || pontosIniciais)

    setMaiorNivel(novoMaiorNivel)
    setFaseInicialIndex(novaFaseIndex)
    setPontosIniciais(novosPontos)

    salvarProgressoParcial({
      nome,
      personagem: personagemComNome,
      maiorNivel: novoMaiorNivel,
      faseIndex: novaFaseIndex,
      pontos: novosPontos,
      ultimaFaseConcluida: dados.nivel || 1,
      atualizadoEm: new Date().toISOString()
    })

    if (dados.status === 'vitoria') {
      registrarPontuacaoJogo({
        jogoId: 'aventura-blocos',
        jogadorId: perfilAtual?.id || 'visitante',
        doadorId: perfilAtual?.doadorId || '',
        doadorEmail: perfilAtual?.doadorEmail || '',
        apelido: perfilAtual?.apelido || personagemComNome.nome || 'Jogador Solidário',
        avatarUrl: perfilAtual?.avatarUrl || '',
        personagem: personagemComNome.nome || personagem.id || 'Personagem',
        pontos: novosPontos,
        nivel: dados.nivel || 1,
        maiorNivel: novoMaiorNivel,
        acertos: dados.acertos || 0
      })
    }
  }

  function zerarProgresso() {
    const confirmar = confirm(
      'Deseja zerar o progresso da Aventura dos Blocos para este perfil?'
    )

    if (!confirmar) return

    const perfilAtual = perfilJogador || carregarPerfilJogador()

    localStorage.removeItem(obterChaveProgresso(perfilAtual))
    localStorage.removeItem(STORAGE_LEGADO_KEY)

    setPersonagem(personagensBase[0])
    setNome('')
    setMaiorNivel(1)
    setFaseInicialIndex(0)
    setPontosIniciais(0)
    setTela('inicio')
  }

  return (
    <main className="aventura-menu-page">
      {tela === 'inicio' && (
        <TelaInicio
          personagem={personagemComNome}
          maiorNivel={maiorNivel}
          faseInicialIndex={faseInicialIndex}
          pontosIniciais={pontosIniciais}
          perfilJogador={perfilJogador}
          onEscolher={() => setTela('escolher')}
          onCriar={() => setTela('criar')}
          onJogar={iniciarJogo}
          onZerar={zerarProgresso}
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
          onAleatorio={gerarAleatorio}
          onVoltar={() => setTela('inicio')}
          onJogar={iniciarJogo}
        />
      )}

      {tela === 'jogo' && (
        <TelaJogo
          personagem={personagemComNome}
          faseInicialIndex={faseInicialIndex}
          pontosIniciais={pontosIniciais}
          onVoltar={() => setTela('inicio')}
          onNivel={aoAtualizarNivel}
          onProgresso={aoSalvarProgressoJogo}
        />
      )}
    </main>
  )
}

function TelaInicio({
  personagem,
  maiorNivel,
  faseInicialIndex,
  pontosIniciais,
  perfilJogador,
  onEscolher,
  onCriar,
  onJogar,
  onZerar
}) {
  return (
    <section className="aventura-home-screen">
      <div className="aventura-bg-world" />

      <div className="aventura-home-content">
        <div className="game-logo-cube" />

        <span className="aventura-pill">Aventura educativa</span>

        <h1>Aventura dos Blocos</h1>

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
            <strong>Perfil</strong>
            <span>
              {perfilJogador
                ? `Jogando como ${perfilJogador.apelido}`
                : 'Visitante local'}
            </span>
          </div>

          <div>
            <strong>Nível máximo</strong>
            <span>{maiorNivel}</span>
          </div>

          <div>
            <strong>Progresso</strong>
            <span>
              Fase salva: {faseInicialIndex + 1} • Pontos: {pontosIniciais}
            </span>
          </div>
        </div>

        <div className="aventura-bottom-links">
          <Link to="/jogos-diversao">← Voltar para jogos</Link>
          <button type="button" className="aventura-reset-link" onClick={onZerar}>
            Zerar progresso
          </button>
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
  onAleatorio,
  onVoltar,
  onJogar
}) {
  const opcoesAba = opcoes[aba] || []
  const campo = campoPorAba(aba)

  return (
    <section className="aventura-create-screen">
      <button type="button" className="back-square" onClick={onVoltar}>
        ←
      </button>

      <div className="create-title">
        <span>Crie seu personagem</span>
        <p>
          Escolha cada detalhe e monte seu herói para viver grandes aventuras
          e aprender brincando.
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
              À medida que você joga, conquista estrelas, sobe de nível e
              libera novos itens visuais.
            </p>
          </div>

          <button type="button" className="random-button" onClick={onAleatorio}>
            Sortear visual
          </button>
        </aside>

        <section className="create-preview">
          <div className="character-stage">
            <BonecoPixel personagem={{ ...personagem, nome }} grande />
          </div>

          <h2>{nome.trim() || personagem.nome || 'Seu personagem'}</h2>

          <div className="evolution-row">
            <EvolutionStep label="Início" nivel={1} />
            <EvolutionStep label="Aventureiro" nivel={5} />
            <EvolutionStep label="Explorador" nivel={10} />
          </div>
        </section>

        <section className="create-options">
          <div className="create-tabs">
            {Object.keys(opcoes).map((item) => (
              <button
                key={item}
                type="button"
                className={aba === item ? 'active' : ''}
                onClick={() => setAba(item)}
              >
                {nomeDaAba(item)}
              </button>
            ))}
          </div>

          <div className="item-grid">
            {opcoesAba.map((item) => {
              const bloqueado = item.nivelMinimo > maiorNivel
              const ativo = personagem[campo] === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  className={ativo ? 'item-card active' : 'item-card'}
                  disabled={bloqueado}
                  onClick={() => onCampo(campo, item.id)}
                >
                  <ItemIcon tipo={aba} id={item.id} />
                  <strong>{item.nome}</strong>
                  <span>
                    {bloqueado
                      ? `Libera no nível ${item.nivelMinimo}`
                      : 'Disponível'}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="create-actions">
            <button type="button" onClick={onVoltar}>
              Voltar
            </button>

            <button type="button" className="yellow" onClick={onJogar}>
              Jogar agora
            </button>
          </div>
        </section>
      </div>
    </section>
  )
}

function TelaJogo({
  personagem,
  faseInicialIndex,
  pontosIniciais,
  onVoltar,
  onNivel,
  onProgresso
}) {
  return (
    <section className="aventura-game-screen">
      <VilaBlocos3D
        personagemExterno={personagem}
        faseInicialIndex={faseInicialIndex}
        pontosIniciais={pontosIniciais}
        onVoltarMenu={onVoltar}
        onNivelChange={onNivel}
        onProgresso={onProgresso}
      />
    </section>
  )
}

function BonecoPixel({ personagem = {}, grande = false }) {
  return (
    <div className={grande ? 'boneco-pixel grande' : 'boneco-pixel'}>
      <div className={`boneco-cabelo ${personagem.cabelo || 'castanho'}`} />

      <div className="boneco-cabeca">
        <span className={`olho ${personagem.olhos || 'castanho'}`} />
        <span className={`olho ${personagem.olhos || 'castanho'}`} />
        <span className="boca" />
      </div>

      <div className={`boneco-corpo ${personagem.roupa || 'azul'}`} />

      <div className="boneco-bracos">
        <span />
        <span />
      </div>

      <div className="boneco-pernas">
        <span className={personagem.sapato || 'preto'} />
        <span className={personagem.sapato || 'preto'} />
      </div>

      {personagem.acessorio && personagem.acessorio !== 'nenhum' && (
        <span className={`boneco-acessorio ${personagem.acessorio}`} />
      )}
    </div>
  )
}

function MiniHead({ personagem = {} }) {
  return (
    <div className={`mini-head ${personagem.cabelo || 'castanho'}`}>
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

function nomeDaAba(aba) {
  if (aba === 'roupas') return 'Roupas'
  if (aba === 'cabelos') return 'Cabelos'
  if (aba === 'olhos') return 'Olhos'
  if (aba === 'sapatos') return 'Sapatos'

  return 'Acessórios'
}

function gerarPersonagemAleatorio() {
  const escolher = (lista) =>
    lista[Math.floor(Math.random() * lista.length)].id

  return {
    roupa: escolher(opcoesCriacao.roupas.filter((item) => item.nivelMinimo === 1)),
    cabelo: escolher(opcoesCriacao.cabelos.filter((item) => item.nivelMinimo === 1)),
    olhos: escolher(opcoesCriacao.olhos.filter((item) => item.nivelMinimo === 1)),
    sapato: escolher(opcoesCriacao.sapatos.filter((item) => item.nivelMinimo === 1)),
    acessorio: escolher(opcoesCriacao.acessorios.filter((item) => item.nivelMinimo === 1))
  }
}

function obterChaveProgresso(perfil) {
  if (perfil?.id) {
    return `${PROGRESS_BASE_KEY}_${perfil.id}`
  }

  return `${PROGRESS_BASE_KEY}_visitante`
}

function carregarProgressoSalvo(perfil) {
  try {
    const dados = localStorage.getItem(obterChaveProgresso(perfil))
    return dados ? JSON.parse(dados) : null
  } catch {
    return null
  }
}

function carregarLegadoSalvo() {
  try {
    const dados = localStorage.getItem(STORAGE_LEGADO_KEY)
    return dados ? JSON.parse(dados) : null
  } catch {
    return null
  }
}

export default JogoAventuraBlocos