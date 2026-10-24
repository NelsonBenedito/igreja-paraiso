/* eslint-disable @typescript-eslint/no-unused-vars -- ES5: `catch` exige o parâmetro mesmo sem uso */
/*
  Projeção da programação — Igreja Paraíso

  Ciclo: boas-vindas → páginas da agenda → boas-vindas…
  Os avisos vêm de CONFIG.fonte: a rota /api/projecao-agenda do site, que lê os
  eventos publicados no ChurchManager (contrato em src/lib/projecao/agenda.ts).
  avisos.json, nesta pasta, é um exemplo do mesmo formato (?fonte=/projecao-agenda/avisos.json).
  A fonte é consultada a cada minuto; mudanças entram na próxima troca de cena,
  sem cortar animação. Se a rede cair, a última agenda boa continua na tela.

  Parâmetros de URL (para links diferentes no Holyrics):
    ?cena=boas-vindas   só a tela de boas-vindas
    ?cena=agenda        só a agenda
    ?fonte=<url>        outra origem de dados
    ?tempo=<segundos>   tempo de cada página da agenda

  Escrito em ES5 (var, function, XMLHttpRequest) de propósito: o navegador
  embutido do Holyrics pode ser antigo.
*/
(function () {
  'use strict';

  var CONFIG = {
    fonte: '/api/projecao-agenda',
    tempoBoasVindas: 12000,
    tempoPagina: 16000,
    intervaloAtualizacao: 60000,
    maxAvisos: 12,
    maxPorPagina: 3,
    fonteBase: 92,       // px do título de cada aviso na escala 1
    escalaMaxima: 1,
    escalaMinima: 0.62,
    alturaUtil: 740,     // altura disponível para a lista, em px do palco
    totalPontos: 84,
    chaveCache: 'projecao-agenda:v1'
  };

  var MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho',
    'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  var DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  // America/Sao_Paulo não tem horário de verão desde 2019: UTC−3 fixo.
  // Evita depender de Intl com fuso, que navegadores embutidos às vezes não têm.
  var FUSO_MS = -3 * 3600000;
  var DIA_MS = 86400000;

  var palco = document.getElementById('palco');
  var lista = document.getElementById('lista');
  var medidor = document.getElementById('medidor');
  var paginasEl = document.getElementById('paginas');
  var rotuloEl = document.getElementById('rotulo');
  var bv = document.getElementById('boasVindas');
  var bvTitulo = document.getElementById('bvTitulo');
  var bvCursiva = document.getElementById('bvCursiva');
  var camadaPontos = document.getElementById('pontos');

  var params = lerParametros();
  var modo = params.cena === 'boas-vindas' || params.cena === 'agenda' ? params.cena : 'ciclo';
  var fonte = params.fonte || CONFIG.fonte;
  if (params.tempo && +params.tempo > 3) CONFIG.tempoPagina = +params.tempo * 1000;

  var pontos = [];
  var dadosBrutos = null;
  var pendente = null;
  var assinaturaBruta = '';
  var paginas = [];
  var escalaLista = 1;
  var versao = 0;
  var chavePreparada = '';
  var boasVindasMontada = '';
  var passo = -1;
  var timer = null;
  var cenaAtual = null;
  var exibido = '';
  var livreAte = 0;

  // ---------- Utilidades ----------

  function lerParametros() {
    var r = {};
    var q = window.location.search.replace(/^\?/, '').split('&');
    for (var i = 0; i < q.length; i++) {
      if (!q[i]) continue;
      var kv = q[i].split('=');
      try { r[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || '').replace(/\+/g, ' ')); } catch (e) { /* ignora */ }
    }
    return r;
  }

  function el(tag, classe) {
    var e = document.createElement(tag);
    if (classe) e.className = classe;
    return e;
  }

  function dois(n) { return n < 10 ? '0' + n : '' + n; }

  function aleatorio(min, max) { return min + Math.random() * (max - min); }

  function texto(v) { return v === null || v === undefined ? '' : String(v).replace(/\s+/g, ' ').replace(/^\s|\s$/g, ''); }

  // ---------- Palco ----------

  function ajustarPalco() {
    var k = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    palco.style.transform = 'scale(' + k + ')';
  }

  function posicaoNoPalco(e) {
    var x = 0, y = 0, w = e.offsetWidth, h = e.offsetHeight;
    while (e && e !== palco) {
      x += e.offsetLeft;
      y += e.offsetTop;
      e = e.offsetParent;
    }
    return { x: x + w / 2, y: y + h / 2 };
  }

  // ---------- Datas ----------

  function partes(valor) {
    var s = texto(valor);
    if (!s) return null;
    var semHora = false, t;
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (m) {
      semHora = true;
      t = Date.UTC(+m[1], +m[2] - 1, +m[3]) - FUSO_MS;
    } else {
      if (!/(Z|[+\-]\d{2}:?\d{2})$/.test(s)) s += '-03:00';
      t = Date.parse(s);
    }
    if (isNaN(t)) return null;
    var d = new Date(t + FUSO_MS);
    return {
      instante: t,
      ano: d.getUTCFullYear(),
      mes: d.getUTCMonth(),
      dia: d.getUTCDate(),
      sem: d.getUTCDay(),
      h: d.getUTCHours(),
      min: d.getUTCMinutes(),
      semHora: semHora,
      chave: d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate()
    };
  }

  function hoje() { return partes(new Date().toISOString()); }

  function hora(p) {
    if (p.semHora) return '';
    return p.h + (p.min ? ':' + dois(p.min) : '') + 'h';
  }

  function textoData(ini, fim) {
    if (!fim || fim.chave === ini.chave) return dois(ini.dia) + ' de ' + MESES[ini.mes];
    if (fim.ano === ini.ano && fim.mes === ini.mes) {
      var n = fim.dia - ini.dia + 1;
      if (n <= 3) {
        var dias = [];
        for (var i = 0; i < n; i++) dias.push(dois(ini.dia + i));
        return dias.slice(0, -1).join(', ') + ' e ' + dias[dias.length - 1] + ' de ' + MESES[ini.mes];
      }
      return dois(ini.dia) + ' a ' + dois(fim.dia) + ' de ' + MESES[ini.mes];
    }
    return dois(ini.dia) + ' de ' + MESES[ini.mes] + ' a ' + dois(fim.dia) + ' de ' + MESES[fim.mes];
  }

  // Segunda linha: "segunda às 18:30h", "hoje às 20h", "Noite de sopas · 19:30h", "sexta a domingo"
  function partesDetalhe(a, h0, amanha) {
    var multi = a.fim && a.fim.chave !== a.ini.chave;
    var hr = hora(a.ini);
    if (a.subtitulo) return [{ t: a.subtitulo + (hr && !multi ? ' · ' + hr : '') }];
    if (multi) return [{ t: DIAS[a.ini.sem] + ' a ' + DIAS[a.fim.sem] }];
    var resto = hr ? ' às ' + hr : '';
    if (a.ini.chave === h0.chave) return [{ t: 'hoje', destaque: true }, { t: resto }];
    if (a.ini.chave === amanha) return [{ t: 'amanhã' + resto }];
    return [{ t: DIAS[a.ini.sem] + resto }];
  }

  // ---------- Dados ----------

  // Aceita o formato do documento (avisos.json) e nomes comuns de API,
  // para que trocar a fonte pela API seja só apontar CONFIG.fonte.
  function normalizar(json) {
    var bruto = [];
    if (Object.prototype.toString.call(json) === '[object Array]') bruto = json;
    else if (json) bruto = json.avisos || json.eventos || json.events || json.items || json.data || [];

    var avisos = [];
    for (var i = 0; i < bruto.length; i++) {
      var a = bruto[i] || {};
      var titulo = texto(a.titulo || a.title || a.nome || a.name);
      var ini = partes(a.inicio || a.startsAt || a.startAt || a.startDate || a.data || a.date);
      if (!titulo || !ini) continue;
      var fim = partes(a.fim || a.endsAt || a.endAt || a.endDate);
      if (fim && fim.instante < ini.instante) fim = null;
      avisos.push({
        titulo: titulo,
        subtitulo: texto(a.subtitulo || a.subtitle || a.destaque),
        observacao: texto(a.observacao || a.nota || a.note).replace(/^\(|\)$/g, ''),
        ini: ini,
        fim: fim
      });
    }
    avisos.sort(function (x, y) { return x.ini.instante - y.ini.instante; });

    var bvj = (json && json.boasVindas) || {};
    var linhas = bvj.linhas && bvj.linhas.length ? bvj.linhas : ['Seja muito', 'bem-vindo'];
    var limpas = [];
    for (var j = 0; j < linhas.length && j < 3; j++) if (texto(linhas[j])) limpas.push(texto(linhas[j]));

    return {
      rotulo: texto(json && json.rotulo) || 'programação',
      boasVindas: {
        linhas: limpas.length ? limpas : ['Seja muito', 'bem-vindo'],
        cursiva: texto(bvj.cursiva) || 'bem-vindo'
      },
      avisos: avisos
    };
  }

  function vigentes(avisos) {
    var h0 = hoje();
    var agora = h0.instante;
    var amanha = partes(new Date(agora + DIA_MS).toISOString()).chave;
    var r = [];
    for (var i = 0; i < avisos.length && r.length < CONFIG.maxAvisos; i++) {
      var a = avisos[i];
      var ainda;
      if (a.fim) ainda = a.fim.chave >= h0.chave;
      else if (a.ini.semHora) ainda = a.ini.chave >= h0.chave;
      else ainda = agora < a.ini.instante + 3 * 3600000;
      if (!ainda) continue;
      var emAndamento = a.ini.chave <= h0.chave && (a.fim ? a.fim.chave : a.ini.chave) >= h0.chave;
      r.push({
        titulo: a.titulo,
        observacao: a.observacao,
        data: textoData(a.ini, a.fim),
        detalhe: partesDetalhe(a, h0, amanha),
        hoje: emAndamento
      });
    }
    return r;
  }

  function carregar() {
    var xhr = new XMLHttpRequest();
    var url = fonte + (fonte.indexOf('?') < 0 ? '?' : '&') + '_=' + new Date().getTime();
    xhr.open('GET', url, true);
    xhr.timeout = 15000;
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status < 200 || xhr.status >= 300) return;
      var json;
      try { json = JSON.parse(xhr.responseText); } catch (e) { return; }
      receber(json, true);
    };
    try { xhr.send(); } catch (e) { /* sem rede: mantém o que já está na tela */ }
  }

  function receber(json, salvar) {
    var assinatura;
    try { assinatura = JSON.stringify(json); } catch (e) { return; }
    if (assinatura === assinaturaBruta) return;
    assinaturaBruta = assinatura;
    pendente = normalizar(json);
    if (salvar) {
      try { window.localStorage.setItem(CONFIG.chaveCache, assinatura); } catch (e) { /* ignora */ }
    }
    if (!dadosBrutos) avancar(); // primeira carga: começa já
  }

  function lerCache() {
    try {
      var s = window.localStorage.getItem(CONFIG.chaveCache);
      if (s) receber(JSON.parse(s), false);
    } catch (e) { /* ignora */ }
  }

  // ---------- Montagem da agenda ----------

  function criarItem(a, indice) {
    var li = el('li', 'aviso' + (a.hoje ? ' hoje' : ''));

    var data = el('div', 'aviso-data');
    data.appendChild(document.createTextNode(a.data));

    var trilho = el('div', 'aviso-trilho');

    var corpo = el('div', 'aviso-corpo');
    var tit = el('div', 'aviso-titulo');
    tit.appendChild(document.createTextNode(a.titulo));
    var det = el('div', 'aviso-detalhe');
    for (var i = 0; i < a.detalhe.length; i++) {
      var parte = a.detalhe[i];
      if (parte.destaque) {
        var s = el('span', 'destaque');
        s.appendChild(document.createTextNode(parte.t));
        det.appendChild(s);
      } else {
        det.appendChild(document.createTextNode(parte.t));
      }
    }
    corpo.appendChild(tit);
    corpo.appendChild(det);
    if (a.observacao) {
      var nota = el('div', 'aviso-nota');
      nota.appendChild(document.createTextNode(a.observacao));
      corpo.appendChild(nota);
    }

    li.appendChild(data);
    li.appendChild(trilho);
    li.appendChild(corpo);
    li.setAttribute('data-i', indice);
    return li;
  }

  function preencher(alvo, itens, escala) {
    alvo.innerHTML = '';
    alvo.style.fontSize = (CONFIG.fonteBase * escala) + 'px';
    for (var i = 0; i < itens.length; i++) alvo.appendChild(criarItem(itens[i], i));
  }

  // Maior escala em que o grupo cabe na altura útil; 0 se não couber nem na mínima.
  function escalaQueCabe(grupo) {
    for (var s = CONFIG.escalaMaxima; s >= CONFIG.escalaMinima - 0.001; s -= 0.04) {
      preencher(medidor, grupo, s);
      if (medidor.offsetHeight <= CONFIG.alturaUtil) return s;
    }
    return 0;
  }

  function dividir(itens, n) {
    var grupos = [], base = Math.floor(itens.length / n), sobra = itens.length % n, k = 0;
    for (var i = 0; i < n; i++) {
      var tam = base + (i < sobra ? 1 : 0);
      grupos.push(itens.slice(k, k + tam));
      k += tam;
    }
    return grupos;
  }

  // Menor número de páginas em que tudo cabe; todas as páginas usam a mesma escala.
  function paginar(itens) {
    if (!itens.length) return { grupos: [], escala: 1 };
    for (var n = 1; n <= itens.length; n++) {
      if (Math.ceil(itens.length / n) > CONFIG.maxPorPagina) continue;
      var grupos = dividir(itens, n), menor = CONFIG.escalaMaxima, cabe = true;
      for (var g = 0; g < grupos.length; g++) {
        var s = escalaQueCabe(grupos[g]);
        if (!s) { cabe = false; break; }
        if (s < menor) menor = s;
      }
      if (cabe) return { grupos: grupos, escala: menor };
    }
    return { grupos: dividir(itens, itens.length), escala: CONFIG.escalaMinima };
  }

  function preparar() {
    var itens = vigentes(dadosBrutos.avisos);
    var chave = JSON.stringify(itens) + '|' + dadosBrutos.rotulo;
    if (chave === chavePreparada) return;
    chavePreparada = chave;
    var r = paginar(itens);
    paginas = r.grupos;
    escalaLista = r.escala;
    medidor.innerHTML = '';
    rotuloEl.innerHTML = '';
    rotuloEl.appendChild(document.createTextNode(dadosBrutos.rotulo));
    versao++;
  }

  // ---------- Boas-vindas ----------

  function chaveBoasVindas(cfg) { return cfg.linhas.join('|') + '|' + cfg.cursiva; }

  function montarBoasVindas(cfg) {
    var chave = chaveBoasVindas(cfg);
    if (chave === boasVindasMontada) return;
    boasVindasMontada = chave;

    bvTitulo.innerHTML = '';
    var txts = [];
    for (var i = 0; i < cfg.linhas.length; i++) {
      var linha = el('span', 'bv-linha');
      var t = el('span', 'bv-txt');
      t.appendChild(document.createTextNode(cfg.linhas[i]));
      linha.appendChild(t);
      bvTitulo.appendChild(linha);
      txts.push(t);
    }
    bvCursiva.innerHTML = '';
    var tinta = el('span', 'bv-tinta');
    tinta.appendChild(document.createTextNode(cfg.cursiva));
    var brilho = el('span', 'bv-brilho');
    brilho.appendChild(document.createTextNode(cfg.cursiva));
    bvCursiva.appendChild(tinta);
    bvCursiva.appendChild(brilho);

    // Ajusta o tamanho para frases maiores ou com mais linhas
    var base = 230;
    bvTitulo.style.fontSize = base + 'px';
    var largura = 0;
    for (var j = 0; j < txts.length; j++) largura = Math.max(largura, txts[j].offsetWidth);
    var f = base * Math.min(1, 1480 / (largura || 1), 600 / (txts.length * base * 0.9));
    bvTitulo.style.fontSize = Math.round(f) + 'px';
    bvCursiva.style.fontSize = Math.round(f * 0.96) + 'px';
  }

  function entrarBoasVindas() {
    bv.className = 'boas-vindas zerar';
    void bv.offsetWidth;
    bv.className = 'boas-vindas';
    void bv.offsetWidth;
    bv.className = 'boas-vindas visivel';
  }

  function sairBoasVindas() {
    if (bv.className.indexOf('visivel') >= 0) bv.className = 'boas-vindas saindo';
  }

  // ---------- Pontos ----------

  function criarPontos() {
    for (var i = 0; i < CONFIG.totalPontos; i++) {
      var p = el('div', 'ponto');
      var corpo = el('i', 'p-corpo');
      var brilho = el('b', 'p-brilho');
      corpo.appendChild(brilho);
      p.appendChild(corpo);
      camadaPontos.appendChild(p);
      var x = aleatorio(0, 1920), y = aleatorio(0, 1080);
      p.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      pontos.push({ el: p, corpo: corpo, brilho: brilho, x: x, y: y, livre: true, escuro: Math.random() < 0.4 });
    }
  }

  function mover(p, x, y, escala, opacidade, duracao, atraso, curva) {
    var c = curva || 'cubic-bezier(0.65, 0, 0.35, 1)';
    var d = duracao + 'ms ' + c + ' ' + atraso + 'ms';
    p.el.style.transition = 'transform ' + d;
    p.corpo.style.transition = 'transform ' + d + ', opacity ' + d + ', background-color 1.4s ease';
    p.el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
    p.corpo.style.transform = 'scale(' + escala.toFixed(3) + ')';
    p.corpo.style.opacity = opacidade.toFixed(3);
    p.x = x;
    p.y = y;
  }

  function classePonto(p, tipo, hojeMarcado) {
    p.el.className = 'ponto' + (p.escuro ? ' escuro' : '') + (tipo ? ' ' + tipo : '') + (hojeMarcado ? ' hoje' : '');
  }

  // Na agenda os pontos livres ficam discretos, mais densos à direita (área vazia).
  function destinoLivre(cena) {
    if (cena === 'agenda') {
      var direita = Math.random() < 0.6;
      return {
        x: direita ? aleatorio(1250, 1900) : aleatorio(20, 1900),
        y: aleatorio(20, 1060),
        escala: aleatorio(0.12, 0.34),
        opacidade: direita ? aleatorio(0.12, 0.42) : aleatorio(0.06, 0.18)
      };
    }
    return {
      x: aleatorio(0, 1920),
      y: aleatorio(0, 1080),
      escala: aleatorio(0.14, 0.55),
      opacidade: aleatorio(0.25, 0.85)
    };
  }

  function espalhar(cena) {
    var lista = pontos.slice().sort(function () { return Math.random() - 0.5; });
    for (var i = 0; i < lista.length; i++) {
      var p = lista[i], d = destinoLivre(cena);
      p.livre = true;
      p.brilho.style.animationDelay = '0s';
      classePonto(p, '', false);
      mover(p, d.x, d.y, d.escala, d.opacidade, aleatorio(1800, 2800), aleatorio(0, 500));
    }
  }

  // Leva os pontos para o trilho da agenda: um marcador por aviso e a linha pontilhada entre eles.
  function formarTrilho() {
    var itens = lista.getElementsByTagName('li');
    if (!itens.length) { espalhar('agenda'); return; }

    var marcadores = [];
    for (var i = 0; i < itens.length; i++) {
      var tr = itens[i].getElementsByClassName('aviso-trilho')[0];
      var pos = posicaoNoPalco(tr);
      pos.hoje = itens[i].className.indexOf('hoje') >= 0;
      marcadores.push(pos);
    }

    var x = marcadores[0].x;
    var passoLinha = Math.max(16, 21 * escalaLista);
    var folga = 26 * escalaLista;
    var cauda = 3;
    var inicio = marcadores[0].y - cauda * passoLinha;
    var fim = marcadores[marcadores.length - 1].y + (cauda + (marcadores.length === 1 ? 4 : 0)) * passoLinha;

    var alvos = [];
    for (var m = 0; m < marcadores.length; m++) {
      alvos.push({ tipo: 'marcador', x: x, y: marcadores[m].y, hoje: marcadores[m].hoje, escala: 0.82 * Math.min(1.1, escalaLista + 0.1), opacidade: 1 });
    }
    for (var y = inicio; y <= fim; y += passoLinha) {
      var perto = false;
      for (var k = 0; k < marcadores.length; k++) if (Math.abs(marcadores[k].y - y) < folga) perto = true;
      if (perto) continue;
      var opac = 0.95;
      if (y < marcadores[0].y) opac = 0.25 + 0.6 * (1 - (marcadores[0].y - y) / (cauda * passoLinha + 1));
      if (y > marcadores[marcadores.length - 1].y) opac = 0.2 + 0.65 * (1 - (y - marcadores[marcadores.length - 1].y) / (fim - marcadores[marcadores.length - 1].y + 1));
      alvos.push({ tipo: 'no-trilho', x: x, y: y, escala: 0.3, opacidade: opac });
    }
    alvos.sort(function (a, b) { return a.y - b.y; });

    // Os pontos mais próximos do trilho chegam primeiro, de cima para baixo.
    var disponiveis = pontos.slice().sort(function (a, b) { return Math.abs(a.x - x) - Math.abs(b.x - x); });
    var usados = Math.min(alvos.length, disponiveis.length);
    for (var n = 0; n < usados; n++) {
      var p = disponiveis[n], a = alvos[n];
      p.livre = false;
      classePonto(p, a.tipo, a.hoje);
      p.brilho.style.animationDelay = (n * 0.09).toFixed(2) + 's';
      mover(p, a.x, a.y, a.escala, a.opacidade, 1700, 120 + n * 22);
    }
    for (var r = usados; r < disponiveis.length; r++) {
      var q = disponiveis[r], d = destinoLivre('agenda');
      q.livre = true;
      classePonto(q, '', false);
      mover(q, d.x, d.y, d.escala, d.opacidade, aleatorio(2000, 3000), aleatorio(0, 400));
    }
  }

  // Movimento contínuo e lento dos pontos livres, para a tela nunca ficar parada.
  function vagar() {
    if (new Date().getTime() < livreAte) return;
    var cena = cenaAtual || 'boas-vindas';
    for (var i = 0; i < pontos.length; i++) {
      var p = pontos[i];
      if (!p.livre || Math.random() > 0.35) continue;
      var amplitude = cena === 'agenda' ? 90 : 160;
      var nx = Math.max(10, Math.min(1910, p.x + aleatorio(-amplitude, amplitude)));
      var ny = Math.max(10, Math.min(1070, p.y + aleatorio(-amplitude, amplitude)));
      var d = destinoLivre(cena);
      mover(p, nx, ny, d.escala, d.opacidade, aleatorio(5000, 8000), 0, 'ease-in-out');
    }
  }

  // ---------- Cenas ----------

  function marcarPaginas(atual) {
    paginasEl.innerHTML = '';
    if (paginas.length < 2) { paginasEl.className = 'agenda-paginas'; return; }
    for (var i = 0; i < paginas.length; i++) paginasEl.appendChild(el('i', i === atual ? 'atual' : ''));
    paginasEl.className = 'agenda-paginas ativa';
  }

  function sairItens() {
    var itens = lista.getElementsByTagName('li');
    for (var i = 0; i < itens.length; i++) {
      itens[i].className += ' saiu';
      var filhos = itens[i].children;
      for (var j = 0; j < filhos.length; j++) filhos[j].style.transitionDelay = (i * 0.06) + 's';
    }
  }

  function entrarItens(atrasoBase) {
    var itens = lista.getElementsByTagName('li');
    for (var i = 0; i < itens.length; i++) {
      var filhos = itens[i].children;
      for (var j = 0; j < filhos.length; j++) {
        filhos[j].style.transitionDelay = (atrasoBase / 1000 + i * 0.16 + (j === 2 ? 0.08 : 0)).toFixed(2) + 's';
      }
    }
    void lista.offsetWidth;
    for (var k = 0; k < itens.length; k++) itens[k].className += ' entrou';
  }

  // Animações agendadas da cena atual; trocar de cena cancela as pendentes
  // (sem isso, a entrada das boas-vindas podia aparecer por cima da agenda).
  var timersCena = [];

  function emCena(fn, ms) { timersCena.push(setTimeout(fn, ms)); }

  function cancelarCena() {
    for (var i = 0; i < timersCena.length; i++) clearTimeout(timersCena[i]);
    timersCena = [];
  }

  function irBoasVindas() {
    cancelarCena();
    var vindoDaAgenda = cenaAtual === 'agenda';
    cenaAtual = 'boas-vindas';
    livreAte = new Date().getTime() + 3500;
    if (vindoDaAgenda) sairItens();
    palco.className = 'palco cena-boas-vindas';
    marcarPaginas(-1);
    emCena(function () { espalhar('boas-vindas'); }, vindoDaAgenda ? 250 : 0);
    emCena(entrarBoasVindas, vindoDaAgenda ? 700 : 150);
  }

  function irAgenda(indice) {
    cancelarCena();
    var vindoDasBoasVindas = cenaAtual !== 'agenda';
    cenaAtual = 'agenda';
    livreAte = new Date().getTime() + 4000;
    if (vindoDasBoasVindas) {
      sairBoasVindas();
      palco.className = 'palco cena-agenda';
    } else {
      sairItens();
    }
    emCena(function () {
      preencher(lista, paginas[indice], escalaLista);
      var sobra = CONFIG.alturaUtil - lista.offsetHeight;
      lista.style.top = Math.round(236 + Math.max(0, sobra) * 0.3) + 'px';
      marcarPaginas(indice);
      formarTrilho();
      entrarItens(vindoDasBoasVindas ? 700 : 450);
    }, vindoDasBoasVindas ? 450 : 650);
  }

  function sequencia() {
    var s = [];
    if (modo !== 'agenda') s.push(-1);
    if (modo !== 'boas-vindas') for (var i = 0; i < paginas.length; i++) s.push(i);
    if (!s.length) s.push(-1);
    return s;
  }

  function avancar() {
    clearTimeout(timer);
    var inicioDeVolta = passo < 0 || passo + 1 >= sequencia().length;
    if (pendente) {
      dadosBrutos = pendente;
      pendente = null;
      inicioDeVolta = true;
    }
    if (!dadosBrutos) {
      // Ainda sem dados: mostra as boas-vindas padrão e espera a primeira carga.
      montarBoasVindas({ linhas: ['Seja muito', 'bem-vindo'], cursiva: 'bem-vindo' });
      if (cenaAtual !== 'boas-vindas') irBoasVindas();
      timer = setTimeout(avancar, CONFIG.tempoBoasVindas);
      return;
    }
    if (inicioDeVolta) {
      var antes = versao;
      preparar();
      if (versao !== antes) passo = -1;
    }

    var seq = sequencia();
    passo = (passo + 1) % seq.length;
    var alvo = seq[passo];
    var chave = alvo + ':' + versao;

    if (alvo === -1) {
      if (cenaAtual !== 'boas-vindas') {
        montarBoasVindas(dadosBrutos.boasVindas);
        irBoasVindas();
      } else if (chaveBoasVindas(dadosBrutos.boasVindas) !== boasVindasMontada) {
        // Texto mudou com a tela já no ar: sai, troca e entra de novo.
        cancelarCena();
        sairBoasVindas();
        emCena(function () {
          montarBoasVindas(dadosBrutos.boasVindas);
          entrarBoasVindas();
        }, 900);
      }
      timer = setTimeout(avancar, CONFIG.tempoBoasVindas);
    } else {
      if (exibido !== chave || cenaAtual !== 'agenda') irAgenda(alvo);
      timer = setTimeout(avancar, CONFIG.tempoPagina);
    }
    exibido = chave;
  }

  // ---------- Início ----------

  function quandoFontesProntas(cb) {
    var feito = false;
    function seguir() { if (!feito) { feito = true; cb(); } }
    if (document.fonts && document.fonts.load) {
      var specs = ['300 66px Poppins', '500 46px Poppins', '700 66px Poppins', '800 230px Poppins', '220px Sacramento'];
      var faltam = specs.length;
      for (var i = 0; i < specs.length; i++) {
        document.fonts.load(specs[i]).then(function () { if (--faltam === 0) seguir(); }, seguir);
      }
    }
    setTimeout(seguir, 3000);
  }

  function iniciar() {
    ajustarPalco();
    window.addEventListener('resize', ajustarPalco);
    criarPontos();
    espalhar('boas-vindas');
    setInterval(vagar, 3500);

    quandoFontesProntas(function () {
      lerCache();
      if (!dadosBrutos && !pendente) avancar();
      carregar();
      setInterval(carregar, CONFIG.intervaloAtualizacao);
    });
  }

  // Para testes e para a futura integração: window.Projecao.aplicar({ avisos: [...] })
  window.Projecao = {
    aplicar: function (json) { receber(json, false); passo = -1; exibido = ''; avancar(); },
    avancar: avancar
  };

  iniciar();
})();
