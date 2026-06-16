/*
  GALERIA DE VÍDEOS EDUCATIVOS

  Este arquivo guarda os vídeos selecionados para a página de galeria.
  A página VideosEducativos.jsx lê estes dados e monta as seções automaticamente.

  Manutenção futura:
  - Para adicionar um vídeo: inclua um novo objeto dentro de "videos".
  - Para adicionar um novo tema: crie um novo objeto no array principal.
  - Os links são links públicos do YouTube fornecidos/selecionados para fins educativos.
*/

const videosEducativosData = [
  {
    id: 'violencia-contra-mulher',
    icone: '🛡️',
    categoria: 'Proteção social',
    titulo: 'Violência contra a mulher e relacionamentos abusivos',
    descricao:
      'Conteúdos educativos sobre prevenção, identificação de sinais, direitos humanos, proteção e redes de apoio.',
    videos: [
      {
        id: 'violencia-relacionamentos-abusivos',
        titulo:
          'Violência contra a mulher e relacionamentos abusivos: causas, tipos e como acabar',
        fonte: 'Canal Consciência e Ação',
        resumo:
          'Explica formas de violência, relacionamentos abusivos e caminhos de conscientização para romper ciclos de agressão.',
        url: 'https://www.youtube.com/watch?v=_uwFcAgsJIs'
      },
      {
        id: 'ufrpe-direitos-humanos',
        titulo: 'UFRPE Pelos Direitos Humanos - Violência contra a mulher',
        fonte: 'UFRPE Oficial',
        resumo:
          'Aborda a violência contra a mulher a partir da perspectiva dos direitos humanos, prevenção e responsabilidade social.',
        url: 'https://www.youtube.com/watch?v=0QAhw30jgLU'
      },
      {
        id: 'maria-da-penha-luta',
        titulo: 'Maria da Penha fala da luta pela defesa das mulheres',
        fonte: 'TV Justiça',
        resumo:
          'Depoimento e memória histórica sobre a luta que deu origem a uma das legislações mais importantes de proteção às mulheres no Brasil.',
        url: 'https://www.youtube.com/watch?v=TgV6dfzQa_4'
      }
    ]
  },
  {
    id: 'infancia-refugiada',
    icone: '🌎',
    categoria: 'Infância e direitos humanos',
    titulo: 'Infância refugiada, crianças imigrantes e proteção humanitária',
    descricao:
      'Vídeos sobre crianças refugiadas, imigração, deslocamento forçado, proteção, acolhimento e garantia de direitos.',
    videos: [
      {
        id: 'serie-infancia-refugiada',
        titulo:
          'Série Infância Refugiada: a situação das crianças imigrantes no país',
        fonte: 'MigraMundo',
        resumo:
          'Apresenta histórias e desafios enfrentados por crianças imigrantes e refugiadas em busca de segurança e recomeço.',
        url: 'https://www.youtube.com/watch?v=h-eJcsexNX0'
      },
      {
        id: 'unicef-historias-criancas',
        titulo: 'UNICEF: Algumas histórias nunca foram feitas para crianças',
        fonte: 'UNICEF Brasil',
        resumo:
          'Conteúdo de sensibilização sobre infância, vulnerabilidade, deslocamento e proteção de crianças em contextos difíceis.',
        url: 'https://www.youtube.com/watch?v=TC2HgC_ecjg'
      },
      {
        id: 'historia-de-malak',
        titulo: 'UNICEF | A história de Malak',
        fonte: 'UNICEF',
        resumo:
          'História de uma criança que simboliza os desafios, perdas, esperança e recomeços enfrentados por muitas famílias refugiadas.',
        url: 'https://www.youtube.com/watch?v=m3WzqNJw5j0'
      }
    ]
  },
  {
    id: 'acolhimento-institucional',
    icone: '🏠',
    categoria: 'Acolhimento institucional',
    titulo: 'Acolhimento institucional e formação de educadores sociais',
    descricao:
      'Conteúdos sobre práticas de cuidado, formação de educadores, acolhimento e atuação em instituições sociais.',
    videos: [
      {
        id: 'capacitacao-educadores-sociais',
        titulo: 'Capacitação de Educadores Sociais que atuam em abrigos',
        fonte: 'Lar Batista Albertine Meador',
        resumo:
          'Formação voltada para educadores sociais que atuam em abrigos, com reflexões sobre cuidado, proteção e responsabilidade institucional.',
        url: 'https://www.youtube.com/watch?v=K-fEi7a06_c'
      }
    ]
  },
  {
    id: 'adocao-abrigos',
    icone: '🤲',
    categoria: 'Adoção e abrigos',
    titulo: 'Adoção, abrigos e direitos da criança',
    descricao:
      'Reportagens e histórias sobre crianças em abrigos, acolhimento, adoção e desafios da proteção integral.',
    videos: [
      {
        id: 'recem-nascidos-abrigos-rj',
        titulo:
          'Número de crianças recém-nascidas em abrigos cresce no estado do Rio de Janeiro',
        fonte: 'Jornal Comunidade',
        resumo:
          'Reportagem sobre o aumento de recém-nascidos em abrigos e os desafios do acolhimento institucional.',
        url: 'https://www.youtube.com/watch?v=SjTzENMkw7E'
      },
      {
        id: 'vida-criancas-abrigos',
        titulo: 'A vida das crianças que vivem em abrigos',
        fonte: 'Fantástico',
        resumo:
          'Mostra histórias de crianças que vivem em abrigos e apresenta reflexões sobre acolhimento, vínculos e proteção.',
        url: 'https://www.youtube.com/watch?v=BkP3gZpgyRM'
      }
    ]
  }
]

export default videosEducativosData