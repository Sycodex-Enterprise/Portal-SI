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

/* =========================================================
   ADIÇÕES – Carrossel de vídeos
   ========================================================= */
const trilho = document.querySelector('.carrossel-trilho');
if (trilho) {
    const slides = Array.from(trilho.querySelectorAll('.video-slide'));
    const btnAnterior = document.querySelector('.carrossel-btn.anterior');
    const btnProximo = document.querySelector('.carrossel-btn.proximo');
    const pontos = document.querySelector('.carrossel-pontos');

    const passo = () => slides[0].getBoundingClientRect().width + 18;
    const porTela = () => Math.max(1, Math.round(trilho.clientWidth / passo()));
    const totalPaginas = () => Math.max(1, slides.length - porTela() + 1);

    function montarPontos() {
        pontos.innerHTML = '';
        for (let i = 0; i < totalPaginas(); i++) {
            pontos.appendChild(document.createElement('span'));
        }
        atualizar();
    }

    function atualizar() {
        const atual = Math.round(trilho.scrollLeft / passo());
        pontos.querySelectorAll('span').forEach((p, i) => p.classList.toggle('ativo', i === atual));
        btnAnterior.disabled = trilho.scrollLeft <= 2;
        btnProximo.disabled = trilho.scrollLeft + trilho.clientWidth >= trilho.scrollWidth - 2;
    }

    btnAnterior.addEventListener('click', () => trilho.scrollBy({ left: -passo() }));
    btnProximo.addEventListener('click', () => trilho.scrollBy({ left: passo() }));
    trilho.addEventListener('scroll', () => requestAnimationFrame(atualizar));
    window.addEventListener('resize', montarPontos);
    montarPontos();
}
