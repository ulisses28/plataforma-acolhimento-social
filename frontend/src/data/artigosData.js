/*
  BASE DE ARTIGOS INSTITUCIONAIS

  Este arquivo concentra os artigos fixos exibidos no site.
  A vantagem de deixar os artigos aqui é facilitar manutenção futura:
  - Para adicionar artigo: inserir um novo objeto no array.
  - Para mudar título/texto: editar o objeto correspondente.
  - Para mudar a rota: alterar o campo "slug".

  Observação:
  Estes textos são institucionais e educativos. Antes de publicar dados numéricos
  específicos, revise as fontes oficiais indicadas no campo "fontes".
*/

const artigosData = [
  {
    slug: 'caridade-transforma-vidas',
    categoria: 'Caridade',
    tema: 'solidariedade',
    icone: '❤',
    titulo: 'O poder da caridade: pequenos gestos que transformam vidas',
    subtitulo:
      'A caridade vai além da doação material. Ela nasce do cuidado, da empatia e da decisão de olhar para o próximo com responsabilidade.',
    resumo:
      'Entenda como pequenas atitudes de apoio podem gerar esperança, fortalecer vínculos e transformar realidades sociais.',
    autor: 'Lar Batista Albertine Meador',
    leitura: '4 min de leitura',
    data: 'Artigo institucional',
    paragrafos: [
      'A caridade é uma prática que ultrapassa a simples entrega de alimentos, roupas ou recursos financeiros. Ela representa uma forma concreta de reconhecer a dignidade do outro e participar da construção de uma comunidade mais humana.',
      'Quando uma pessoa ajuda uma instituição social, ela contribui para que crianças, adolescentes e famílias em situação de vulnerabilidade recebam cuidado, proteção e oportunidades. Pequenos gestos, quando somados, podem gerar grandes mudanças.',
      'No contexto do acolhimento social, a caridade também fortalece uma rede de apoio. Essa rede envolve voluntários, doadores, parceiros, profissionais e a comunidade. Cada colaboração ajuda a manter projetos vivos e a ampliar o alcance das ações sociais.',
      'Ajudar não exige sempre grandes recursos. Muitas vezes, doar tempo, divulgar uma campanha, participar de uma ação ou contribuir com itens básicos já representa um impacto importante na vida de quem precisa.'
    ],
    destaque:
      'A solidariedade se torna transformação quando o cuidado deixa de ser apenas intenção e passa a ser atitude.',
    fontes: [
      {
        nome: 'UNICEF Brasil',
        descricao: 'Referência sobre proteção, infância e direitos de crianças e adolescentes.',
        url: 'https://www.unicef.org/brazil/'
      }
    ]
  },
  {
    slug: 'mente-humana-e-empatia',
    categoria: 'Psicologia',
    tema: 'mente',
    icone: '🧠',
    titulo: 'A mente humana e a força da empatia',
    subtitulo:
      'A empatia ajuda a criar relações mais saudáveis, ambientes mais acolhedores e atitudes mais conscientes diante do sofrimento do outro.',
    resumo:
      'Uma reflexão sobre como emoções, pensamentos e vínculos humanos influenciam o cuidado social.',
    autor: 'Lar Batista Albertine Meador',
    leitura: '5 min de leitura',
    data: 'Artigo institucional',
    paragrafos: [
      'A mente humana é formada por experiências, emoções, memórias e relações. Por isso, o ambiente em que uma pessoa vive influencia diretamente sua forma de perceber o mundo, lidar com desafios e construir vínculos.',
      'A empatia é a capacidade de tentar compreender a realidade do outro sem reduzir sua dor ou sua história. Em ações sociais, ela é essencial, porque permite que o cuidado seja realizado com respeito e sensibilidade.',
      'Crianças e adolescentes em situação de vulnerabilidade precisam de ambientes seguros, estáveis e afetivos. O acolhimento, quando feito com responsabilidade, ajuda a reconstruir confiança e fortalecer o desenvolvimento emocional.',
      'A empatia também transforma quem ajuda. Ao participar de ações solidárias, o voluntário passa a enxergar problemas sociais com mais profundidade e desenvolve uma postura mais humana diante das diferenças.'
    ],
    destaque:
      'Cuidar também é compreender que cada pessoa carrega uma história e precisa ser vista com dignidade.',
    fontes: [
      {
        nome: 'OPAS/OMS - Saúde Mental',
        descricao: 'Informações gerais sobre saúde mental, bem-estar e cuidado humano.',
        url: 'https://www.paho.org/pt/topicos/saude-mental'
      }
    ]
  },
  {
    slug: 'psicologia-da-solidariedade',
    categoria: 'Comportamento humano',
    tema: 'solidariedade',
    icone: '🤝',
    titulo: 'Psicologia da solidariedade: por que ajudar faz bem para todos',
    subtitulo:
      'A solidariedade fortalece comunidades e também produz efeitos positivos em quem pratica o bem.',
    resumo:
      'Como atitudes solidárias promovem pertencimento, propósito, bem-estar e transformação coletiva.',
    autor: 'Lar Batista Albertine Meador',
    leitura: '4 min de leitura',
    data: 'Artigo institucional',
    paragrafos: [
      'A solidariedade é uma atitude social que aproxima pessoas e fortalece comunidades. Ela nasce quando alguém reconhece uma necessidade e decide agir para contribuir com a solução.',
      'Do ponto de vista humano, ajudar pode trazer senso de propósito, pertencimento e responsabilidade social. Ao participar de uma causa, a pessoa percebe que sua ação tem valor e que ela faz parte de algo maior.',
      'Instituições sociais dependem dessa união de esforços. Doadores, voluntários, empresas parceiras e profissionais atuam juntos para oferecer suporte a quem mais precisa.',
      'A solidariedade não resolve todos os problemas sozinha, mas cria caminhos. Ela aproxima a sociedade das instituições, estimula a participação cidadã e mostra que o cuidado coletivo é uma responsabilidade de todos.'
    ],
    destaque:
      'Ajudar o próximo é uma forma de construir uma sociedade mais empática, participativa e consciente.',
    fontes: [
      {
        nome: 'Voluntários das Nações Unidas',
        descricao: 'Conteúdos sobre voluntariado, participação social e desenvolvimento humano.',
        url: 'https://www.unv.org/'
      }
    ]
  },
  {
    slug: 'violencia-domestica-identificar-buscar-apoio',
    categoria: 'Proteção social',
    tema: 'protecao',
    icone: '🛡️',
    titulo: 'Violência doméstica: como identificar sinais e buscar apoio',
    subtitulo:
      'Informação, proteção e rede de apoio são fundamentais para enfrentar situações de violência no ambiente familiar.',
    resumo:
      'Um conteúdo educativo e cuidadoso sobre sinais de alerta, canais de apoio e importância da denúncia responsável.',
    autor: 'Lar Batista Albertine Meador',
    leitura: '5 min de leitura',
    data: 'Artigo informativo',
    paragrafos: [
      'A violência doméstica é um problema social que pode atingir mulheres, crianças, adolescentes, idosos e outras pessoas em situação de vulnerabilidade. Ela pode envolver agressões físicas, ameaças, controle emocional, humilhações, abandono ou restrição de direitos.',
      'Identificar sinais de violência exige atenção e responsabilidade. Mudanças bruscas de comportamento, medo constante, isolamento, tristeza frequente e dificuldade de pedir ajuda podem indicar que algo não está bem.',
      'É importante evitar julgamentos e oferecer acolhimento. Muitas vítimas enfrentam medo, dependência emocional, dependência financeira ou falta de apoio. Por isso, a escuta respeitosa e a orientação correta são essenciais.',
      'Em situações de risco, é necessário buscar ajuda em canais oficiais, serviços de proteção, assistência social, unidades de saúde ou órgãos competentes. A denúncia pode salvar vidas e interromper ciclos de violência.'
    ],
    destaque:
      'Falar sobre violência doméstica é uma forma de proteger vidas e fortalecer redes de cuidado.',
    fontes: [
      {
        nome: 'Ministério dos Direitos Humanos e da Cidadania',
        descricao: 'Canais oficiais de denúncia e proteção de direitos humanos.',
        url: 'https://www.gov.br/mdh/pt-br'
      },
      {
        nome: 'Central de Atendimento à Mulher - Ligue 180',
        descricao: 'Canal nacional de orientação e denúncia para situações de violência contra a mulher.',
        url: 'https://www.gov.br/mdh/pt-br/ligue180'
      }
    ]
  },
  {
    slug: 'criancas-tecnologia-comportamento-aprendizagem',
    categoria: 'Tecnologia e infância',
    tema: 'tecnologia',
    icone: '💻',
    titulo: 'Crianças e tecnologia: impactos no comportamento e na aprendizagem',
    subtitulo:
      'A tecnologia pode apoiar a educação, mas também exige acompanhamento, limites e uso consciente.',
    resumo:
      'Uma análise sobre telas, internet, aprendizagem, comportamento e a importância da mediação familiar e escolar.',
    autor: 'Lar Batista Albertine Meador',
    leitura: '5 min de leitura',
    data: 'Artigo educativo',
    paragrafos: [
      'A presença da tecnologia na vida das crianças é cada vez mais comum. Celulares, tablets, computadores, jogos e redes sociais fazem parte da rotina de muitas famílias e escolas.',
      'Quando usada com equilíbrio, a tecnologia pode ampliar o acesso à informação, estimular a criatividade e apoiar processos de aprendizagem. Recursos digitais podem ser úteis para estudar, pesquisar, criar e se comunicar.',
      'Por outro lado, o uso excessivo ou sem acompanhamento pode afetar a atenção, o sono, a convivência familiar, o desempenho escolar e o desenvolvimento emocional. Por isso, o papel dos adultos é orientar, acompanhar e estabelecer limites saudáveis.',
      'A educação digital não significa apenas ensinar a usar aparelhos. Significa ensinar responsabilidade, segurança, respeito, pensamento crítico e consciência sobre os impactos do mundo online.'
    ],
    destaque:
      'Tecnologia pode ser ferramenta de aprendizagem, desde que venha acompanhada de cuidado, orientação e equilíbrio.',
    fontes: [
      {
        nome: 'UNICEF Brasil',
        descricao: 'Referências sobre infância, proteção e segurança no ambiente digital.',
        url: 'https://www.unicef.org/brazil/'
      },
      {
        nome: 'SaferNet Brasil',
        descricao: 'Orientações sobre segurança digital, cidadania online e proteção de crianças e adolescentes.',
        url: 'https://new.safernet.org.br/'
      }
    ]
  },
  {
    slug: 'infancia-vulnerabilidade-brasil-dados',
    categoria: 'Dados sociais',
    tema: 'infancia',
    icone: '📊',
    titulo: 'Infância em vulnerabilidade no Brasil: o que os dados mostram',
    subtitulo:
      'Indicadores sociais ajudam a compreender os desafios enfrentados por crianças e adolescentes em diferentes realidades.',
    resumo:
      'Uma leitura sobre vulnerabilidade social, pobreza, moradia, educação e acesso a oportunidades na infância brasileira.',
    autor: 'Lar Batista Albertine Meador',
    leitura: '6 min de leitura',
    data: 'Artigo com base em indicadores',
    paragrafos: [
      'Falar sobre infância em vulnerabilidade exige responsabilidade. Nem toda criança em situação difícil está abandonada, mas muitas vivem contextos marcados por pobreza, insegurança alimentar, moradia precária, ausência de proteção adequada ou falta de acesso a oportunidades.',
      'Dados oficiais ajudam a compreender esse cenário. Indicadores sobre renda, educação, saneamento, acesso à internet, composição familiar e condições de moradia permitem identificar desigualdades e orientar políticas públicas.',
      'Instituições de acolhimento e organizações sociais atuam justamente onde essas vulnerabilidades se tornam mais graves. Elas oferecem cuidado, proteção, acompanhamento e apoio para crianças e adolescentes que precisam de suporte.',
      'Ao analisar dados sociais, é importante evitar generalizações. Cada criança possui uma história. Os números ajudam a enxergar o tamanho do problema, mas o acolhimento precisa considerar a realidade humana por trás de cada caso.'
    ],
    destaque:
      'Dados mostram o problema; o acolhimento mostra que cada número representa uma vida.',
    fontes: [
      {
        nome: 'IBGE',
        descricao: 'Indicadores oficiais sobre população, renda, domicílios, educação e condições de vida.',
        url: 'https://www.ibge.gov.br/'
      },
      {
        nome: 'IBGE Sidra',
        descricao: 'Sistema de tabelas estatísticas do IBGE para consulta de dados oficiais.',
        url: 'https://sidra.ibge.gov.br/'
      },
      {
        nome: 'IPEA',
        descricao: 'Estudos e indicadores sobre políticas públicas, desigualdade e vulnerabilidade social.',
        url: 'https://www.ipea.gov.br/'
      }
    ]
  },
  {
    slug: 'globalizacao-tecnologia-ia-impactos',
    categoria: 'IA e sociedade',
    tema: 'ia',
    icone: '🌐',
    titulo: 'Globalização, tecnologia e IA: impactos nas relações humanas',
    subtitulo:
      'A inteligência artificial e a globalização digital estão transformando trabalho, educação, comunicação e comportamento social.',
    resumo:
      'Uma reflexão sobre oportunidades, riscos e responsabilidades diante da expansão tecnológica e da inteligência artificial.',
    autor: 'Lar Batista Albertine Meador',
    leitura: '6 min de leitura',
    data: 'Artigo reflexivo',
    paragrafos: [
      'A globalização aproximou pessoas, mercados, culturas e informações. Com a expansão da internet, essa conexão se tornou ainda mais rápida, influenciando a forma como estudamos, trabalhamos, consumimos e nos relacionamos.',
      'A inteligência artificial intensificou esse processo. Ferramentas digitais passaram a produzir textos, imagens, análises, recomendações e decisões automatizadas. Isso cria oportunidades, mas também exige cuidado com privacidade, desigualdade, dependência tecnológica e uso ético.',
      'Na educação, a IA pode apoiar pesquisas, personalizar estudos e facilitar o acesso ao conhecimento. Porém, também pode gerar acomodação, desinformação ou uso indevido quando não há orientação adequada.',
      'O desafio não é rejeitar a tecnologia, mas utilizá-la com consciência. A tecnologia deve servir à dignidade humana, à inclusão, ao aprendizado e à construção de relações mais justas.'
    ],
    destaque:
      'A inovação tecnológica precisa caminhar junto com ética, educação e responsabilidade social.',
    fontes: [
      {
        nome: 'UNESCO - Ética da Inteligência Artificial',
        descricao: 'Referência internacional sobre princípios éticos para desenvolvimento e uso da IA.',
        url: 'https://www.unesco.org/en/artificial-intelligence/recommendation-ethics'
      }
    ]
  }
]

export default artigosData