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

/* =====================================================================
   ADIÇÕES DA PÁGINA DE ANÁLISE E PROJETO DE SISTEMAS
   (o código-base acima não foi alterado; tudo abaixo é acréscimo)
   ===================================================================== */

// Avisa o CSS que o JavaScript está ativo (sem JS, as referências aparecem todas abertas)
document.documentElement.classList.add('js');

// ---------- Carrossel da ementa ----------
const carrossel = document.querySelector('#carrossel-ementa');
const btnAnterior = document.querySelector('#ementa-anterior');
const btnProximo = document.querySelector('#ementa-proximo');
const pontos = document.querySelectorAll('.carrossel-pontos span');

function larguraDoPasso() {
    const primeiroCartao = carrossel.querySelector('.unidade');
    const espaco = parseFloat(getComputedStyle(carrossel).columnGap) || 16;
    return primeiroCartao.offsetWidth + espaco;
}

function atualizarPontos() {
    const indice = Math.round(carrossel.scrollLeft / larguraDoPasso());
    for (let i = 0; i < pontos.length; i++) {
        if (i === indice) {
            pontos[i].classList.add('ativo');
        } else {
            pontos[i].classList.remove('ativo');
        }
    }
}

if (carrossel && btnAnterior && btnProximo) {
    btnAnterior.addEventListener('click', () => {
        carrossel.scrollBy({ left: -larguraDoPasso() });
    });
    btnProximo.addEventListener('click', () => {
        carrossel.scrollBy({ left: larguraDoPasso() });
    });
    carrossel.addEventListener('scroll', atualizarPontos);
    atualizarPontos();
}

// ---------- Abas das referências ----------
const abas = document.querySelectorAll('.abas [role="tab"]');

function abrirAba(abaEscolhida) {
    for (const aba of abas) {
        const ativa = aba === abaEscolhida;
        aba.setAttribute('aria-selected', ativa ? 'true' : 'false');
        aba.tabIndex = ativa ? 0 : -1;
        document.getElementById(aba.getAttribute('aria-controls')).hidden = !ativa;
    }
}

abas.forEach((aba, indice) => {
    aba.addEventListener('click', () => abrirAba(aba));
    // setas do teclado trocam de aba
    aba.addEventListener('keydown', (evento) => {
        let novo = null;
        if (evento.key === 'ArrowRight') novo = abas[(indice + 1) % abas.length];
        if (evento.key === 'ArrowLeft') novo = abas[(indice - 1 + abas.length) % abas.length];
        if (novo) {
            evento.preventDefault();
            abrirAba(novo);
            novo.focus();
        }
    });
});

// Começa mostrando só a primeira aba
if (abas.length > 0) {
    abrirAba(abas[0]);
}
