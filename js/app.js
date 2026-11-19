// 1. CATÁLOGO DAS 7 DISCIPLINAS E GERAÇÃO DOS CARDS
const disciplinas = [
  {
    nome: 'Inteligência Artificial',
    autores: 'Giancarllo e Pedro Rosa',
    url: 'materiaIA/index.html',
    imagem: 'img/foto-IA.jpg'
  },
  {
    nome: 'Robótica',
    autores: 'Nykolas e Nicolas',
    url: 'materiaROB/index.html',
    imagem: 'img/foto-rob.jpg'
  },
  {
    nome: 'Análise e Projetos de Sistemas',
    autores: 'Vinícius',
    url: 'materiaAPS2/aps.html',
    imagem: 'img/foto-APS2.png'
  },
  {
    nome: 'Cibersegurança',
    autores: 'Heloyse e Lidiane',
    url: 'materiaCY/index.html',
    imagem: 'img/foto-ciber.jpg'
  },
  {
    nome: 'Administração de Redes',
    autores: 'Otavio',
    url: 'materiaADR/index.html',
    imagem: 'img/foto-redes.jpg'
  },
  {
    nome: 'Governança de TI',
    autores: 'Matheus e Gustavo',
    url: 'materiaGOV/index.html',
    imagem: 'img/foto-gov.jpg'
  },
  {
    nome: 'Jogos Digitais',
    autores: 'Olavo e Henry',
    url: 'disciplina-7.html',
    imagem: 'img/foto-JOGOS.jpg'
  }
];

const grade = document.querySelector('#grade');

if (grade) {
  disciplinas.forEach((disciplina) => {
    const cartao = document.createElement('article');
    cartao.className = 'card';

    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'card-img-wrapper';

    const img = document.createElement('img');
    img.className = 'card-img';
    img.src = disciplina.imagem;
    img.alt = `Ilustração da disciplina de ${disciplina.nome}`;
    imgWrapper.appendChild(img);

    const corpo = document.createElement('div');
    corpo.className = 'card-corpo';

    const titulo = document.createElement('h2');
    titulo.textContent = disciplina.nome;

    const autores = document.createElement('p');
    autores.className = 'card-autores';
    autores.textContent = `Feito por: ${disciplina.autores}`;

    const link = document.createElement('a');
    link.href = disciplina.url;
    link.className = 'botao';
    link.textContent = `Acessar ${disciplina.nome}`;

    corpo.appendChild(titulo);
    corpo.appendChild(autores);
    corpo.appendChild(link);

    cartao.appendChild(imgWrapper);
    cartao.appendChild(corpo);
    grade.appendChild(cartao);
  });
}

// 2. CONTROLE DE TEMA (CLARO / ESCURO)
if (localStorage.getItem('tema') === 'claro') {
  document.body.classList.add('tema-claro');
}

const btnTema = document.querySelector('#btn-tema');
if (btnTema) {
  btnTema.addEventListener('click', () => {
    document.body.classList.toggle('tema-claro');

    if (document.body.classList.contains('tema-claro')) {
      localStorage.setItem('tema', 'claro');
    } else {
      localStorage.setItem('tema', 'escuro');
    }
  });
}

// 3. CRUD DE FEEDBACK DOS VISITANTES (SUPABASE / POSTGRESQL)
const SUPABASE_URL = 'https://hpzymvqetuijwiiycykq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_D4sUryxtC17olEvXjiCCgw_Uu3nTr8Q';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const formFeedback = document.querySelector('#form-feedback');
const inputNome = document.querySelector('#input-nome');
const inputMensagem = document.querySelector('#input-mensagem');
const contadorCaracteres = document.querySelector('#contador-caracteres');
const btnEnviar = document.querySelector('#btn-enviar-feedback');
const btnCancelar = document.querySelector('#btn-cancelar-edicao');
const listaFeedbacks = document.querySelector('#lista-feedbacks');

if (formFeedback) {
  let idEditando = null;

  // Recupera a lista de IDs dos comentários criados por ESTE navegador
  function obterMeusIds() {
    return JSON.parse(localStorage.getItem('meus_feedbacks_ids')) || [];
  }

  function salvarMeuId(id) {
    const ids = obterMeusIds();
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem('meus_feedbacks_ids', JSON.stringify(ids));
    }
  }

  function removerMeuId(id) {
    const ids = obterMeusIds().filter((item) => item !== id);
    localStorage.setItem('meus_feedbacks_ids', JSON.stringify(ids));
  }

  function atualizarContador() {
    contadorCaracteres.textContent = `${inputMensagem.value.length} / 200 caracteres`;
  }
  inputMensagem.addEventListener('input', atualizarContador);

  // READ: Busca os comentários no PostgreSQL
  async function renderizarFeedbacks() {
    const { data: feedbacks, error } = await db
      .from('feedbacks')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) {
      console.error('Erro ao carregar comentários:', error);
      return;
    }

    listaFeedbacks.innerHTML = '';

    if (feedbacks.length === 0) {
      const aviso = document.createElement('p');
      aviso.className = 'feedback-vazio';
      aviso.textContent = 'Nenhum comentário ainda. Seja o primeiro a opinar!';
      listaFeedbacks.appendChild(aviso);
      return;
    }

    const meusIds = obterMeusIds();

    feedbacks.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'feedback-item';

      const topo = document.createElement('div');
      topo.className = 'feedback-topo';

      const autor = document.createElement('span');
      autor.className = 'feedback-autor';
      autor.textContent = item.nome;

      const dataFormatada = new Date(item.criado_em).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const data = document.createElement('span');
      data.className = 'feedback-data';
      data.textContent = item.editado ? `${dataFormatada} (editado)` : dataFormatada;

      topo.appendChild(autor);
      topo.appendChild(data);

      const texto = document.createElement('p');
      texto.className = 'feedback-texto';
      texto.textContent = item.mensagem;

      card.appendChild(topo);
      card.appendChild(texto);

      // Só mostra os botões se o comentário foi criado neste navegador
      if (meusIds.includes(item.id)) {
        const acoes = document.createElement('div');
        acoes.className = 'feedback-acoes';

        // UPDATE
        const btnEditar = document.createElement('button');
        btnEditar.type = 'button';
        btnEditar.className = 'btn-acao editar';
        btnEditar.textContent = 'Editar';
        btnEditar.addEventListener('click', () => {
          inputNome.value = item.nome === 'Visitante' ? '' : item.nome;
          inputMensagem.value = item.mensagem;
          idEditando = item.id;
          btnEnviar.textContent = 'Salvar Alteração';
          btnCancelar.hidden = false;
          atualizarContador();
          inputMensagem.focus();
        });

        // DELETE
        const btnExcluir = document.createElement('button');
        btnExcluir.type = 'button';
        btnExcluir.className = 'btn-acao excluir';
        btnExcluir.textContent = 'Excluir';
        btnExcluir.addEventListener('click', async () => {
          const { error } = await db.from('feedbacks').delete().eq('id', item.id);
          if (!error) {
            removerMeuId(item.id);
            cancelarEdicao();
            renderizarFeedbacks();
          }
        });

        acoes.appendChild(btnEditar);
        acoes.appendChild(btnExcluir);
        card.appendChild(acoes);
      }

      listaFeedbacks.appendChild(card);
    });
  }

  function cancelarEdicao() {
    idEditando = null;
    formFeedback.reset();
    btnEnviar.textContent = 'Enviar Comentário';
    btnCancelar.hidden = true;
    atualizarContador();
  }

  btnCancelar.addEventListener('click', cancelarEdicao);

  // CREATE e UPDATE
  formFeedback.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const nomeDigitado = inputNome.value.trim() || 'Visitante';
    const mensagemDigitada = inputMensagem.value.trim();

    if (!mensagemDigitada) return;

    if (idEditando !== null) {
      await db
        .from('feedbacks')
        .update({ nome: nomeDigitado, mensagem: mensagemDigitada, editado: true })
        .eq('id', idEditando);
    } else {
      // O .select() retorna o registro recém-criado para pegarmos o ID gerado
      const { data, error } = await db
        .from('feedbacks')
        .insert([{ nome: nomeDigitado, mensagem: mensagemDigitada }])
        .select();

      if (!error && data && data.length > 0) {
        salvarMeuId(data[0].id);
      }
    }

    cancelarEdicao();
    renderizarFeedbacks();
  });

  renderizarFeedbacks();
}