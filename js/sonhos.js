/* ==========================================================================
   DICIONÁRIO DE SONHOS — busca, filtro por tema e índice A–Z
   Lê a lista estática gerada pelo Jekyll (#dreamSource) e a reorganiza.
   Sem dependências. Sem JS, a lista simples continua funcionando.
   ========================================================================== */
(function () {
  'use strict';

  var source = document.getElementById('dreamSource');
  if (!source) return;

  var $ = function (id) { return document.getElementById(id); };
  var elResults = $('dreamResults'),
      elSearch  = $('dreamSearch'),
      elClear   = $('dreamClear'),
      elGroups  = $('dreamGroups'),
      elLetters = $('dreamLetters'),
      elCount   = $('dreamCount'),
      elEmpty   = $('dreamEmpty'),
      elReset   = $('dreamReset');

  /* ---------- utilidades ---------- */
  function norm(s) {
    return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  }
  function slug(s) { return norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function plural(n, um, varios) { return n + ' ' + (n === 1 ? um : varios); }

  // "Sonhar com a Cobra" -> "Cobra" (usado só para ordenar e agrupar por letra).
  // Para casos especiais, defina `tema:` no front matter do artigo.
  var PREFIXO = /^sonhar\s+(?:(?:com|que|em|de|e)\s+)?(?:(?:o|a|os|as|um|uma|uns|umas|meu|minha|meus|minhas|seu|sua)\s+)?/i;
  function deriveTema(titulo) {
    var t = titulo.replace(PREFIXO, '').trim() || titulo;
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  /* ---------- carrega os itens ---------- */
  var OUTROS = 'Outros';
  var items = Array.prototype.map.call(source.querySelectorAll('a.dream-item'), function (a) {
    var d = a.dataset;
    var titulo = d.titulo || a.textContent.trim();
    var tema = (d.tema || '').trim() || deriveTema(titulo);
    var temaN = norm(tema);
    var letra = temaN.charAt(0).toUpperCase();
    if (!/[A-Z]/.test(letra)) letra = '#';
    var grupo = (d.grupo || '').trim();
    return {
      href: a.getAttribute('href'),
      titulo: titulo,
      tituloN: norm(titulo),
      tema: tema,
      temaN: temaN,
      letra: letra,
      grupo: grupo,
      keywordsN: norm(d.keywords),
      hay: norm([titulo, tema, d.keywords, d.desc, grupo].join(' ')),
      destaque: !!d.destaque
    };
  });
  if (!items.length) return;

  var temGrupos = items.some(function (i) { return i.grupo; });
  if (temGrupos) items.forEach(function (i) { if (!i.grupo) i.grupo = OUTROS; });

  var byTema = function (a, b) { return a.temaN.localeCompare(b.temaN, 'pt'); };
  items.sort(byTema);

  /* ---------- estado (reflete na URL: ?q=cobra&tema=animais) ---------- */
  var state = { q: '', grupo: '' };
  (function readUrl() {
    try {
      var p = new URLSearchParams(location.search);
      state.q = (p.get('q') || '').slice(0, 80);
      state.grupo = p.get('tema') || '';
    } catch (e) { /* navegador antigo: ignora */ }
  })();

  function writeUrl() {
    try {
      var p = new URLSearchParams();
      if (state.q) p.set('q', state.q);
      if (state.grupo) p.set('tema', state.grupo);
      var qs = p.toString();
      history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
    } catch (e) { /* ignora */ }
  }

  /* ---------- busca ---------- */
  function tokens() { return norm(state.q).split(/\s+/).filter(Boolean); }

  function score(item, toks) {
    var s = 0;
    for (var i = 0; i < toks.length; i++) {
      var t = toks[i];
      if (item.temaN.indexOf(t) === 0) s += 4;
      else if ((' ' + item.tituloN).indexOf(' ' + t) > -1) s += 3;
      else if (item.tituloN.indexOf(t) > -1) s += 2;
      else if (item.keywordsN.indexOf(t) > -1) s += 2;
      else s += 1;
    }
    return s;
  }

  function matchesQuery(item, toks) {
    for (var i = 0; i < toks.length; i++) if (item.hay.indexOf(toks[i]) === -1) return false;
    return true;
  }

  /* ---------- renderização ---------- */
  function linkItem(item, showTag) {
    var li = el('li');
    var a = el('a', 'dream-item');
    a.href = item.href;
    a.appendChild(el('span', 'dream-item-title', item.titulo));
    if (showTag && temGrupos && item.grupo) a.appendChild(el('span', 'dream-item-tag', item.grupo));
    li.appendChild(a);
    return li;
  }

  function renderGroups(base) {
    if (!temGrupos) { elGroups.hidden = true; return; }
    var counts = {};
    base.forEach(function (i) { counts[i.grupo] = (counts[i.grupo] || 0) + 1; });
    var nomes = Object.keys(counts);
    // garante que o filtro ativo continue visível mesmo com 0 resultados
    items.forEach(function (i) { if (nomes.indexOf(i.grupo) === -1) nomes.push(i.grupo); });
    nomes.sort(function (a, b) {
      if (a === OUTROS) return 1;
      if (b === OUTROS) return -1;
      return a.localeCompare(b, 'pt');
    });

    elGroups.textContent = '';
    var mk = function (label, valor, n) {
      var b = el('button', 'dream-chip');
      b.type = 'button';
      b.setAttribute('aria-pressed', String(state.grupo === valor));
      b.appendChild(document.createTextNode(label));
      if (n != null) b.appendChild(el('span', 'dream-chip-n', String(n)));
      if (n === 0 && state.grupo !== valor) b.disabled = true;
      b.addEventListener('click', function () {
        state.grupo = (state.grupo === valor) ? '' : valor;
        update();
      });
      return b;
    };
    var total = base.length;
    elGroups.appendChild(mk('Todos', '', total));
    nomes.forEach(function (n) { elGroups.appendChild(mk(n, slug(n), counts[n] || 0)); });
    elGroups.hidden = false;
  }

  function renderLetters(presentes, ativo) {
    elLetters.textContent = '';
    if (!ativo) { elLetters.hidden = true; return; }
    var abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    if (presentes['#']) abc.push('#');
    abc.forEach(function (l) {
      if (presentes[l]) {
        var a = el('a', 'dream-letter-link', l);
        a.href = '#letra-' + (l === '#' ? 'num' : l);
        a.setAttribute('aria-label', 'Sonhos com a letra ' + l);
        a.addEventListener('click', function (e) {
          e.preventDefault();
          var alvo = document.getElementById('letra-' + (l === '#' ? 'num' : l));
          if (alvo) alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        elLetters.appendChild(a);
      } else {
        var s = el('span', 'dream-letter-link is-off', l);
        s.setAttribute('aria-hidden', 'true');
        elLetters.appendChild(s);
      }
    });
    elLetters.hidden = false;
  }

  function update() {
    var toks = tokens();
    var buscando = toks.length > 0;

    // base = resultado só da busca (alimenta os contadores dos temas)
    var base = buscando ? items.filter(function (i) { return matchesQuery(i, toks); }) : items.slice();
    var lista = state.grupo ? base.filter(function (i) { return slug(i.grupo) === state.grupo; }) : base.slice();

    if (buscando) {
      lista.forEach(function (i) { i._s = score(i, toks); });
      lista.sort(function (a, b) { return (b._s - a._s) || byTema(a, b); });
    }

    renderGroups(base);

    var frag = document.createDocumentFragment();
    var presentes = {};

    if (!lista.length) {
      elResults.textContent = '';
      elEmpty.hidden = false;
      renderLetters({}, false);
    } else {
      elEmpty.hidden = true;

      if (buscando) {
        // resultados planos, por relevância
        var ul = el('ul', 'dream-list');
        lista.forEach(function (i) { ul.appendChild(linkItem(i, true)); });
        frag.appendChild(ul);
      } else {
        // "Mais procurados" (só na visão inicial, sem filtro)
        var dest = state.grupo ? [] : lista.filter(function (i) { return i.destaque; });
        if (dest.length) {
          var sec = el('section', 'dream-featured');
          sec.appendChild(el('h2', 'dream-section-title', 'Mais procurados'));
          var pills = el('ul', 'dream-pills');
          dest.forEach(function (i) {
            var li = el('li');
            var a = el('a', 'dream-pill', i.tema);
            a.href = i.href;
            a.title = i.titulo;
            li.appendChild(a);
            pills.appendChild(li);
          });
          sec.appendChild(pills);
          frag.appendChild(sec);
        }

        // agrupado por letra
        var atual = null, ulAtual = null;
        lista.forEach(function (i) {
          if (i.letra !== atual) {
            atual = i.letra;
            presentes[atual] = true;
            var s = el('section', 'dream-letter-section');
            s.id = 'letra-' + (atual === '#' ? 'num' : atual);
            s.appendChild(el('h2', 'dream-letter', atual));
            ulAtual = el('ul', 'dream-list');
            s.appendChild(ulAtual);
            frag.appendChild(s);
          }
          ulAtual.appendChild(linkItem(i, !state.grupo));
        });
      }
      elResults.textContent = '';
      elResults.appendChild(frag);
      renderLetters(presentes, !buscando);
    }

    // contagem (lida por leitores de tela)
    if (buscando || state.grupo) {
      elCount.textContent = lista.length
        ? plural(lista.length, 'sonho encontrado', 'sonhos encontrados')
        : '';
    } else {
      elCount.textContent = plural(items.length, 'sonho no dicionário', 'sonhos no dicionário');
    }

    elClear.hidden = !state.q;
    writeUrl();
  }

  /* ---------- eventos ---------- */
  elSearch.addEventListener('input', function () {
    state.q = elSearch.value;
    update();
  });
  elSearch.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && elSearch.value) {
      e.preventDefault();
      state.q = ''; elSearch.value = ''; update();
    }
  });
  elClear.addEventListener('click', function () {
    state.q = ''; elSearch.value = ''; update(); elSearch.focus();
  });
  elReset.addEventListener('click', function () {
    state.q = ''; state.grupo = ''; elSearch.value = ''; update(); elSearch.focus();
  });
  // atalho "/" para focar na busca
  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    if (e.key === '/' && tag !== 'input' && tag !== 'textarea' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      elSearch.focus();
    }
  });

  // altura do cabeçalho fixo -> posição da barra de busca fixa e das âncoras
  function setHeaderHeight() {
    var h = document.querySelector('.main-header');
    if (h) document.documentElement.style.setProperty('--header-h', h.offsetHeight + 'px');
  }
  setHeaderHeight();
  window.addEventListener('resize', setHeaderHeight);

  // escurece a barra de busca só quando ela está "grudada" sob o cabeçalho
  var toolbar = $('dreamToolbar'), ticking = false;
  function checkStuck() {
    ticking = false;
    if (!toolbar) return;
    var h = document.querySelector('.main-header');
    var top = toolbar.getBoundingClientRect().top;
    toolbar.classList.toggle('is-stuck', window.scrollY > 0 && top <= (h ? h.offsetHeight : 0) + 1);
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(checkStuck); }
  }, { passive: true });

  elSearch.value = state.q;
  update();
})();
