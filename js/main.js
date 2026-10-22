/* Wallford · LP Grupo VIP · v6
   Vanilla JS, sem bibliotecas. Tudo aqui é melhoria: sem JS a página funciona
   (botões com href final, nada escondido, carrossel rola por arraste e teclado). */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     ÚNICO LUGAR PARA TROCAR O DESTINO E A UTM DOS BOTÕES.
     O HTML tem o mesmo href estático como reserva (sem JS). Se mudar aqui,
     mude também no HTML (ou deixe: este script reescreve todos os [data-cta]).
     ------------------------------------------------------------------ */
  var LINK_GRUPO = 'https://chat.whatsapp.com/JYrf16nmzNQALrfnWntqYt?s=sw&p=i&mlu=4&ilr=4';
  var UTM = {};

  var raiz = document.documentElement;
  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var temIO = 'IntersectionObserver' in window;

  /* ---------- Largura útil (sem a barra de rolagem), usada pela grade em CSS ---------- */
  function medirLargura() {
    raiz.style.setProperty('--vw', raiz.clientWidth + 'px');
  }
  medirLargura();
  window.addEventListener('resize', medirLargura);

  /* ---------- CTAs: reescreve href com a constante ---------- */
  function montarLink() {
    var partes = [];
    for (var k in UTM) {
      if (Object.prototype.hasOwnProperty.call(UTM, k)) {
        partes.push(encodeURIComponent(k) + '=' + encodeURIComponent(UTM[k]));
      }
    }
    if (!partes.length) { return LINK_GRUPO; }
    return LINK_GRUPO + (LINK_GRUPO.indexOf('?') > -1 ? '&' : '?') + partes.join('&');
  }

  var destino = montarLink();
  var ctas = document.querySelectorAll('a[data-cta]');
  Array.prototype.forEach.call(ctas, function (a) {
    a.setAttribute('href', destino);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
    a.addEventListener('click', function () {
      // Medição: dispara só se o pixel estiver instalado (id do pixel ainda a preencher).
      try {
        if (typeof window.fbq === 'function') {
          window.fbq('track', 'Lead', { content_name: a.getAttribute('data-evento') || 'cta' });
        }
      } catch (e) { /* medição nunca pode travar o clique */ }
    });
  });

  /* ---------- Revelações ao entrar na tela (uma vez) ----------
     Só o que tem [data-anima] anima. O estado inicial (.pre) é aplicado aqui, depois do
     carregamento, e apenas em elementos mais de 15% da altura da tela abaixo da dobra.
     Fotos nunca partem de invisível (CSS): só deslocam ou escalam. Trava de segurança:
     em 0,8 s tudo é revelado, sem transição. Sem JS, em movimento reduzido ou sem
     IntersectionObserver: nada é escondido. */
  var alvos = document.querySelectorAll('[data-anima]');
  if (!reduzido && temIO && alvos.length) {
    var limite = window.innerHeight * 1.15;
    var escondidos = [];
    Array.prototype.forEach.call(alvos, function (el) {
      if (el.getBoundingClientRect().top > limite) {
        el.classList.add('pre');
        escondidos.push(el);
      }
    });

    var obsRevela = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          obsRevela.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    escondidos.forEach(function (el) { obsRevela.observe(el); });

    window.setTimeout(function () {
      raiz.classList.add('sem-transicao');
      escondidos.forEach(function (el) { el.classList.add('is-in'); });
      obsRevela.disconnect();
    }, 800);
  }

  /* ---------- Carrossel "A coleção": CSS scroll-snap + JS mínimo, sem autoplay ---------- */
  var trilho = document.querySelector('[data-trilho]');
  if (trilho) {
    var slides = trilho.querySelectorAll('.slide');
    var contador = document.querySelector('[data-contador]');
    var progresso = document.querySelector('[data-progresso]');
    var setas = document.querySelectorAll('[data-seta]');

    var passo = function () {
      if (slides.length > 1) {
        return slides[1].offsetLeft - slides[0].offsetLeft;
      }
      return trilho.clientWidth;
    };

    var atualizar = function () {
      var max = trilho.scrollWidth - trilho.clientWidth;
      var pos = trilho.scrollLeft;
      var p = passo();
      var i = p > 0 ? Math.round(pos / p) : 0;
      i = Math.max(0, Math.min(slides.length - 1, i));
      if (contador) { contador.textContent = (i + 1 < 10 ? '0' : '') + (i + 1); }
      if (progresso && trilho.scrollWidth > 0) {
        progresso.style.width = (trilho.clientWidth / trilho.scrollWidth * 100) + '%';
        progresso.style.left = (pos / trilho.scrollWidth * 100) + '%';
      }
      Array.prototype.forEach.call(setas, function (s) {
        var dir = parseInt(s.getAttribute('data-seta'), 10);
        var fim = dir < 0 ? pos <= 1 : pos >= max - 1;
        s.setAttribute('aria-disabled', fim ? 'true' : 'false');
      });
    };

    Array.prototype.forEach.call(setas, function (s) {
      s.addEventListener('click', function () {
        if (s.getAttribute('aria-disabled') === 'true') { return; }
        var dir = parseInt(s.getAttribute('data-seta'), 10);
        trilho.scrollBy({ left: dir * passo(), behavior: reduzido ? 'auto' : 'smooth' });
      });
    });

    var pendente = false;
    trilho.addEventListener('scroll', function () {
      if (!pendente) {
        pendente = true;
        window.requestAnimationFrame(function () { pendente = false; atualizar(); });
      }
    }, { passive: true });
    window.addEventListener('resize', atualizar);
    atualizar();
  }

  /* ---------- Marquee: pausa fora da tela ---------- */
  var marquee = document.querySelector('.marquee');
  if (marquee && temIO) {
    new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        marquee.classList.toggle('is-fora', !e.isIntersecting);
      });
    }).observe(marquee);
  }

  /* ---------- Barra fixa mobile ----------
     Aparece quando o botão do hero sai da tela por cima. Fica escondida enquanto outro
     botão de CTA estiver visível, e no fechamento e no rodapé. */
  var barra = document.getElementById('barra-cta');
  var ctaHero = document.getElementById('cta-hero');
  var fechamento = document.getElementById('fechamento');
  var rodape = document.getElementById('rodape');

  if (barra && ctaHero && fechamento && temIO) {
    var heroSaiu = false;
    var visiveis = {};
    var fimVisivel = { fechamento: false, rodape: false };

    var algumCtaVisivel = function () {
      for (var k in visiveis) {
        if (Object.prototype.hasOwnProperty.call(visiveis, k) && visiveis[k]) { return true; }
      }
      return false;
    };
    var atualizarBarra = function () {
      barra.classList.toggle('is-visivel',
        heroSaiu && !algumCtaVisivel() && !fimVisivel.fechamento && !fimVisivel.rodape);
    };

    new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        heroSaiu = !e.isIntersecting && e.boundingClientRect.bottom < 0;
        atualizarBarra();
      });
    }).observe(ctaHero);

    var obsCtas = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        visiveis[e.target.getAttribute('data-evento')] = e.isIntersecting;
      });
      atualizarBarra();
    });
    Array.prototype.forEach.call(ctas, function (a) {
      if (!barra.contains(a)) { obsCtas.observe(a); }
    });

    var obsFim = function (chave) {
      return new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          fimVisivel[chave] = e.isIntersecting;
          atualizarBarra();
        });
      });
    };
    obsFim('fechamento').observe(fechamento);
    if (rodape) { obsFim('rodape').observe(rodape); }
  }
})();
