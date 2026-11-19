function inicializarTema() {
    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo === 'claro') {
        document.body.classList.add('tema-claro');
    }

    const btnTema = document.getElementById('btn-tema');
    if (btnTema) {
        const novoBtn = btnTema.cloneNode(true);
        btnTema.parentNode.replaceChild(novoBtn, btnTema);

        novoBtn.addEventListener('click', (evento) => {
            evento.preventDefault();
            document.body.classList.toggle('tema-claro');

            if (document.body.classList.contains('tema-claro')) {
                localStorage.setItem('tema', 'claro');
            } else {
                localStorage.setItem('tema', 'escuro');
            }
        });
    }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarTema);
} else {
    inicializarTema();
}