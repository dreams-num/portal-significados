/* ==========================================================================
   MOTOR DO MAPA NUMEROLÓGICO CALDEU (COMPLETO)
   ========================================================================== */
const CH = {A:1,B:2,C:3,D:4,E:5,F:8,G:3,H:5,I:1,J:1,K:2,L:3,M:4,N:5,O:7,P:8,Q:1,R:2,S:3,T:4,U:6,V:6,W:6,X:5,Y:1,Z:7};
const MESTRES = [11,22,33];

function norm(t) { return (t||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z]/g,''); }
function lv(c) { return CH[c]||0; }
function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function red(n) {
  if(!n && n!==0) return {b:0,m:null,r:0,d:'0'};
  const b = n; const steps = [b]; let cur = b;
  while(cur > 9) {
    const next = [...String(cur)].reduce((a,c)=>a+parseInt(c),0);
    steps.push(next);
    if(MESTRES.includes(next)){
      const r2 = [...String(next)].reduce((a,c)=>a+parseInt(c),0);
      if(steps[steps.length-1]!==r2) steps.push(r2);
      return {b,m:next,r:r2,d:steps.join('/')};
    }
    cur = next;
  }
  return {b,m:null,r:cur,d:steps.join('/')};
}

function somarNome(nome) {
  const ls = norm(nome); if(!ls) return null;
  const total = ls.split('').reduce((a,c)=>a+lv(c),0);
  const detail = [...ls].map(c=>c+'='+lv(c)).join('+');
  return {...red(total), detail};
}

const PLAN = {1:'Sol',2:'Lua',3:'Júpiter',4:'Urano',5:'Mercúrio',6:'Vênus',7:'Netuno',8:'Saturno',9:'Marte'};
function pN(r) { return PLAN[r]||'—'; }

const PERIODOS = [
  {sg:'Áries',pl:'Marte',dm:3,dd:21,am:4,ad:19},
  {sg:'Touro',pl:'Vênus',dm:4,dd:20,am:5,ad:20},
  {sg:'Gêmeos',pl:'Mercúrio',dm:5,dd:21,am:6,ad:20},
  {sg:'Câncer',pl:'Lua',dm:6,dd:21,am:7,ad:20},
  {sg:'Leão',pl:'Sol',dm:7,dd:21,am:8,ad:20},
  {sg:'Virgem',pl:'Mercúrio',dm:8,dd:21,am:9,ad:20},
  {sg:'Libra',pl:'Vênus',dm:9,dd:21,am:10,ad:20},
  {sg:'Escorpião',pl:'Marte',dm:10,dd:21,am:11,ad:20},
  {sg:'Sagitário',pl:'Júpiter',dm:11,dd:21,am:12,ad:20},
  {sg:'Capricórnio',pl:'Saturno',dm:12,dd:21,am:1,ad:20},
  {sg:'Aquário',pl:'Saturno',dm:1,dd:21,am:2,ad:21},
  {sg:'Peixes',pl:'Júpiter',dm:2,dd:19,am:3,ad:20},
];
function getPeriodo(dia, mes) {
  for(const p of PERIODOS) {
    if(p.dm > p.am) { if((mes===p.dm && dia>=p.dd)||(mes===p.am && dia<=p.ad)) return p; }
    else { if((mes===p.dm && dia>=p.dd)||(mes>p.dm && mes<p.am)||(mes===p.am && dia<=p.ad)) return p; }
  }
  return PERIODOS[0];
}

const S1=[1,4,7], S2=[3,6,9];
function harmonia(a,b) {
  if(!a||!b) return 'n';
  if((a===4&&b===8)||(a===8&&b===4)||(a===1&&b===8)||(a===8&&b===1)) return 'bad';
  if((S1.includes(a)&&S1.includes(b))||(S2.includes(a)&&S2.includes(b))||a===b||a===5||b===5) return 'ok';
  return 'warn';
}

const PEDRAS={1:'Âmbar e Topázio',2:'Pérola e Pedra da Lua',3:'Ametista',4:'Safira Azul',5:'Esmeralda',6:'Turquesa',7:'Olho-de-gato',8:'Ametista Escura',9:'Rubi'};
const CORES={1:'Dourado e Amarelo',2:'Verde e Branco',3:'Violeta e Púrpura',4:'Azul e Cinza',5:'Cintilantes',6:'Azul Claro e Rosa',7:'Verde Pálido',8:'Preto e Azul Marinho',9:'Carmesim e Vermelho'};
const BOTANICA={1:'Louro e Alecrim',2:'Salsa e Pepino',3:'Sálvia e Hortelã',4:'Espinafre',5:'Cenoura e Manjericão',6:'Maçã e Violetas',7:'Uva e Frutas',8:'Arruda',9:'Gengibre e Alho'};
const VITALIDADE={
  1:{areas:'Coração e Visão.'},2:{areas:'Estômago e Digestão.'},3:{areas:'Sistema Nervoso e Pele.'},
  4:{areas:'Rins e Circulação.'},5:{areas:'Esgotamento e Insônia.'},6:{areas:'Garganta e Vias Aéreas.'},
  7:{areas:'Pele e Sensibilidade.'},8:{areas:'Fígado e Reumatismo.'},9:{areas:'Febres e Vitalidade física.'}
};
const DIAS_FAV={1:'Domingo e Segunda',2:'Domingo e Sexta',3:'Quinta e Terça',4:'Sábado e Domingo',5:'Quarta e Sexta',6:'Terça e Sexta',7:'Domingo e Segunda',8:'Sábado e Domingo',9:'Terça e Quinta'};
const COMP={10:{s:'A Roda da Fortuna',t:'Elevação'},11:{s:'O Aviso',t:'Intuição Elevada'},12:{s:'O Sacrifício',t:'Superação'},13:{s:'O Renascimento',t:'Transformação'},14:{s:'O Movimento',t:'Adaptação'},15:{s:'O Mago',t:'Magnetismo'},16:{s:'A Torre',t:'Reconstrução'},17:{s:'A Estrela',t:'Esperança'},18:{s:'A Lua Cheia',t:'Superação de Conflitos'},19:{s:'O Sol',t:'Sucesso e Honra'},20:{s:'O Despertar',t:'Chamado Espiritual'},21:{s:'O Universo',t:'Êxito Total'},22:{s:'O Mestre Construtor',t:'Visão Global'}};
function getC(b,r) { return COMP[b]||{s:'Vibração Planetária',t:pN(r)}; }

let D = {};

function idadeAt(dob) {
  const [y,m,d] = dob.split('-').map(Number); const h = new Date();
  let a = h.getFullYear() - y;
  if(h.getMonth()+1 < m || (h.getMonth()+1 === m && h.getDate() < d)) a--;
  return a;
}

document.addEventListener('DOMContentLoaded', function() {
  const btnCalcularMapa = document.getElementById('btnCalcularMapa');
  if(btnCalcularMapa) {
    btnCalcularMapa.addEventListener('click', function() {
      const primeiro = document.getElementById('f_primeiro').value.trim();
      const meio = document.getElementById('f_meio').value.trim();
      const sobre = document.getElementById('f_sobre').value.trim();
      const social = document.getElementById('f_social').value.trim();
      const imvInp = (document.getElementById('inp_imovel').value||'').trim();

      const dStr = document.getElementById('n_dia').value.trim();
      const mStr = document.getElementById('n_mes').value.trim();
      const yStr = document.getElementById('n_ano').value.trim();

      if(!primeiro || !sobre || !dStr || !mStr || !yStr) {
        alert('Preencha o Primeiro Nome, Sobrenome e a Data de Nascimento completa.');
        return;
      }

      const d = parseInt(dStr, 10);
      const m = parseInt(mStr, 10);
      const y = parseInt(yStr, 10);

      if(d < 1 || d > 31 || m < 1 || m > 12 || y < 1900 || y > new Date().getFullYear()) {
        alert('Por favor, insira uma data de nascimento válida.');
        return;
      }

      const dob = `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const partes = [primeiro, meio, sobre].filter(Boolean);
      const nomeCompleto = partes.join(' ');
      const nomeSocial = social || nomeCompleto;

      function brutas(n) { return norm(n).split('').reduce((a,c)=>a+lv(c),0); }
      const rPrimeiro = somarNome(primeiro);
      const rMeio = meio ? somarNome(meio) : null;
      const rSobre = somarNome(sobre);
      const tnnBruto = partes.reduce((a,p)=>a+brutas(p),0);
      const tnn = red(tnnBruto);
      const socialBruto = nomeSocial.trim().split(/\s+/).reduce((a,p)=>a+brutas(p),0);
      const tnnSocial = red(socialBruto);
      const rDia = red(d);
      const periodo = getPeriodo(d, m);
      const anoAtual = new Date().getFullYear();
      const idade = idadeAt(dob);
      const rIdade = red(idade);
      const rAno = red([...String(anoAtual)].reduce((a,c)=>a+parseInt(c),0));

      const rBase = rDia.r;
      const serie = []; for(let n=rBase; n<=31; n+=9) serie.push(n);

      const anosRes = []; let aa = anoAtual;
      while(anosRes.length < 4 && aa < anoAtual+40) {
        if(red([...String(aa)].reduce((a,c)=>a+parseInt(c),0)).r === rBase) anosRes.push(aa);
        aa++;
      }

      D = {nomeCompleto, nomeSocial, primeiro, meio, sobre, social, dob, dia:d, mes:m, ano:y, idade, rPrimeiro, rMeio, rSobre, tnn, tnnSocial, socialBruto, rDia, periodo, rIdade, rAno, anoAtual, serie, anosRes, imvInp};

      const hoje = new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'});
      document.getElementById('mh-eyebrow').textContent = `Nascimento: ${String(d).padStart(2,'0')}/${String(m).padStart(2,'0')}/${y} · Gerado em ${hoje}`;
      document.getElementById('mh-nome').textContent = nomeCompleto.toUpperCase();
      document.getElementById('mh-data').textContent = 'Numerologia Caldeia Aplicada aos Ciclos e Sincronicidades';

      const cPilar = getC(rDia.b, rDia.r);
      document.getElementById('pilar-destino').innerHTML = `
        <div style="background:#0d0b14;border:1px solid #444;border-top:3px solid #d4af37;border-radius:6px;padding:15px;text-align:center;">
          <div style="font-size:0.8rem;color:#d4af37;font-weight:bold;margin-bottom:5px;">NÚMERO DE NASCIMENTO</div>
          <div style="font-size:1.8rem;color:#f3e5ab;font-weight:bold;">${rDia.d}</div>
          <div style="font-size:0.85rem;color:#c0c0c0;margin-top:5px;">${pN(rDia.r)} · ${cPilar.s}</div>
        </div>
        <div style="background:#0d0b14;border:1px solid #444;border-top:3px solid #d4af37;border-radius:6px;padding:15px;text-align:center;">
          <div style="font-size:0.8rem;color:#d4af37;font-weight:bold;margin-bottom:5px;">PLANETA REGENTE</div>
          <div style="font-size:1.2rem;color:#f3e5ab;font-weight:bold;margin-top:5px;">${pN(rDia.r)}</div>
          <div style="font-size:0.85rem;color:#c0c0c0;margin-top:5px;">${cPilar.t}</div>
        </div>
        <div style="background:#0d0b14;border:1px solid #444;border-top:3px solid #d4af37;border-radius:6px;padding:15px;text-align:center;">
          <div style="font-size:0.8rem;color:#d4af37;font-weight:bold;margin-bottom:5px;">SIGNO / PERÍODO</div>
          <div style="font-size:1.2rem;color:#f3e5ab;font-weight:bold;margin-top:5px;">${periodo.sg}</div>
          <div style="font-size:0.85rem;color:#c0c0c0;margin-top:5px;">Regência: ${periodo.pl}</div>
        </div>`;

      document.getElementById('div-alertas').innerHTML = `
        <div style="background:#12101a;border-left:4px solid #d4af37;padding:12px 15px;border-radius:6px;margin:15px 0;color:#e0e0e0;font-size:0.95rem;">
          <strong style="color:#d4af37;display:block;margin-bottom:4px;">✨ CONEXÃO COM SONHOS E ANGEL NUMBERS</strong>
          Seu Número de Nascimento principal é <strong>${rDia.r}</strong>, regido por <strong>${pN(rDia.r)}</strong>. Quando visualiza sequências numéricas repetidas ligadas a este número, o universo envia sincronicidades para alinhar sua intuição.
        </div>`;

      const rows = [];
      rows.push([primeiro+' (Primeiro Nome)', rPrimeiro]);
      if(meio && rMeio) rows.push([meio+' (Nome do Meio)', rMeio]);
      rows.push([sobre+' (Sobrenome)', rSobre]);
      
      document.getElementById('nome-tbody').innerHTML = 
        rows.map(([n,r])=>`<tr>
          <td style="padding:10px;font-weight:bold;">${esc(n)}</td>
          <td style="padding:10px;font-size:0.85rem;color:#c0c0c0;">${esc(r.detail||'')}</td>
          <td style="padding:10px;text-align:center;font-weight:bold;">${r.b}</td>
          <td style="padding:10px;text-align:center;font-weight:bold;color:#d4af37;">${r.d}</td>
        </tr>`).join('') +
        `<tr style="background:#1a1626;font-weight:bold;">
          <td style="padding:10px;">Nome Completo: ${esc(nomeCompleto)}</td>
          <td style="padding:10px;"></td>
          <td style="padding:10px;text-align:center;">${tnn.b}</td>
          <td style="padding:10px;text-align:center;color:#d4af37;font-size:1.1rem;">${tnn.d}</td>
        </tr>` +
        (nomeSocial !== nomeCompleto ? `<tr style="background:#1a1626;font-weight:bold;">
          <td style="padding:10px;">Assinatura / Social: ${esc(nomeSocial)}</td>
          <td style="padding:10px;"></td>
          <td style="padding:10px;text-align:center;">${socialBruto}</td>
          <td style="padding:10px;text-align:center;color:#d4af37;font-size:1.1rem;">${tnnSocial.d}</td>
        </tr>` : '');

      const h = harmonia(tnnSocial.r, rDia.r);
      const hText = h==='ok' ? 'Sua assinatura flui em perfeita harmonia com sua data de nascimento.' : h==='bad' ? 'Há um contraste vibracional interessante, indicando grandes aprendizados.' : 'Sua energia flui de maneira equilibrada e flexível.';
      document.getElementById('div-harmonia').innerHTML = `<div style="background:#0d0b14;border-left:3px solid ${h==='ok'?'#2d8a4e':h==='bad'?'#c94f4f':'#d4802a'};padding:10px 15px;border-radius:6px;color:#e0e0e0;">${hText}</div>`;

      document.getElementById('ano-grid').innerHTML = `
        <div style="background:#0d0b14;border:1px solid #444;border-radius:6px;padding:15px;">
          <div style="color:#d4af37;font-size:0.85rem;font-weight:bold;margin-bottom:5px;">⊙ CICLO DA IDADE (${idade} ANOS)</div>
          <div style="font-size:1.8rem;color:#f3e5ab;font-weight:bold;">${rIdade.d}</div>
          <div style="font-size:0.85rem;color:#c0c0c0;margin-top:3px;">${pN(rIdade.r)}</div>
          <div style="font-size:0.8rem;color:#aaa;margin-top:8px;">Governa seu ritmo interno e lições emocionais atuais.</div>
        </div>
        <div style="background:#0d0b14;border:1px solid #444;border-radius:6px;padding:15px;">
          <div style="color:#d4af37;font-size:0.85rem;font-weight:bold;margin-bottom:5px;">☿ ANO UNIVERSAL (${anoAtual})</div>
          <div style="font-size:1.8rem;color:#f3e5ab;font-weight:bold;">${rAno.d}</div>
          <div style="font-size:0.85rem;color:#c0c0c0;margin-top:3px;">${pN(rAno.r)}</div>
          <div style="font-size:0.8rem;color:#aaa;margin-top:8px;">Energia coletiva que transita ao seu redor.</div>
        </div>`;

      document.getElementById('anos-futuros').innerHTML = `
        <div style="background:#0d0b14;border:1px solid #444;border-radius:6px;padding:15px;">
          <div style="color:#d4af37;font-size:0.85rem;font-weight:bold;margin-bottom:8px;">ANOS DE FORTE RESSONÂNCIA PESSOAL</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;">${anosRes.map(a=>`<span style="background:#1a1626;border:1px solid #d4af37;padding:4px 10px;border-radius:4px;color:#f3e5ab;font-weight:bold;">${a}</span>`).join('')}</div>
          <div style="font-size:0.8rem;color:#aaa;">Dias favoráveis do mês: ${serie.join(', ')} · Dias de pico: ${DIAS_FAV[rDia.r]||'—'}</div>
        </div>`;

      const imovelSec = document.getElementById('imovel-sec');
      if(!imvInp) {
        imovelSec.innerHTML = '<div style="color:#aaa;font-size:0.9rem;">Nenhum número de imóvel informado.</div>';
      } else {
        let somaImv = 0;
        for(let i=0; i<imvInp.length; i++) {
          const ch = imvInp[i].toUpperCase();
          if(/[A-Z]/.test(ch)) somaImv += CH[ch]||0;
          else if(/[0-9]/.test(ch)) somaImv += parseInt(ch);
        }
        const resImv = red(somaImv);
        const cvImv = getC(resImv.b, resImv.r);
        imovelSec.innerHTML = `<div style="background:#0d0b14;border:1px solid #444;border-radius:6px;padding:15px;color:#e0e0e0;">Imóvel <strong>${esc(imvInp)}</strong> reduz para <strong>${resImv.d}</strong> (${cvImv.s} — regido por ${pN(resImv.r)}).</div>`;
      }

      const vit = VITALIDADE[rDia.r]||VITALIDADE[1];
      document.getElementById('guia-grid').innerHTML = `
        <div style="background:#0d0b14;border:1px solid #444;border-radius:6px;padding:12px;">
          <div style="color:#d4af37;font-size:0.8rem;font-weight:bold;margin-bottom:4px;">⚕ BEM-ESTAR</div>
          <div style="font-size:0.85rem;color:#e0e0e0;">${vit.areas}</div>
        </div>
        <div style="background:#0d0b14;border:1px solid #444;border-radius:6px;padding:12px;">
          <div style="color:#d4af37;font-size:0.8rem;font-weight:bold;margin-bottom:4px;">💎 CRISTAL</div>
          <div style="font-size:0.85rem;color:#e0e0e0;">${PEDRAS[rDia.r]||'—'}</div>
        </div>
        <div style="background:#0d0b14;border:1px solid #444;border-radius:6px;padding:12px;">
          <div style="color:#d4af37;font-size:0.8rem;font-weight:bold;margin-bottom:4px;">🎨 CORES</div>
          <div style="font-size:0.85rem;color:#e0e0e0;">${CORES[rDia.r]||'—'}</div>
        </div>
        <div style="background:#0d0b14;border:1px solid #444;border-radius:6px;padding:12px;">
          <div style="color:#d4af37;font-size:0.8rem;font-weight:bold;margin-bottom:4px;">🌿 BOTÂNICA</div>
          <div style="font-size:0.85rem;color:#e0e0e0;">${BOTANICA[rDia.r]||'—'}</div>
        </div>`;

      const diasSemaforo = {};
      for(let dM=1; dM<=31; dM++) {
        const rdM = red(dM).r;
        let cor = 'background:#1a1626;color:#888;';
        if((S1.includes(rDia.r)&&S1.includes(rdM)) || (S2.includes(rDia.r)&&S2.includes(rdM)) || rdM===rDia.r) {
          cor = 'background:#14532D;color:#BBF7D0;';
        } else if(rdM===8 || rdM===4) {
          cor = 'background:#7F1D1D;color:#FECACA;';
        }
        diasSemaforo[dM] = cor;
      }
      let calHtml = '';
      for(let dM=1; dM<=31; dM++) {
        calHtml += `<div style="height:32px;display:flex;align-items:center;justify-content:center;border-radius:4px;font-weight:bold;font-size:0.85rem;${diasSemaforo[dM]}">${dM}</div>`;
      }
      document.getElementById('cal-grid').innerHTML = calHtml;
      document.getElementById('cal-legend').innerHTML = `
        <span><span style="width:10px;height:10px;background:#14532D;border-radius:50%;display:inline-block;margin-right:4px;"></span>Favoráveis</span>
        <span><span style="width:10px;height:10px;background:#7F1D1D;border-radius:50%;display:inline-block;margin-right:4px;"></span>Cautela</span>
        <span><span style="width:10px;height:10px;background:#1a1626;border-radius:50%;display:inline-block;margin-right:4px;"></span>Neutros</span>`;

      document.getElementById('auto-interp-grid').innerHTML = `
        <div style="background:#12101a;border:1px solid #444;border-radius:6px;padding:15px;color:#e0e0e0;">
          <div style="color:#d4af37;font-weight:bold;margin-bottom:6px;font-size:0.9rem;">🌟 A ESSÊNCIA (NÚMERO ${rDia.d} - ${pN(rDia.r)})</div>
          <div style="font-size:0.9rem;line-height:1.5;">Você possui uma marca vibracional profunda ligada a <strong>${pN(rDia.r)}</strong>. Na tradição caldeia, seus sonhos, intuições e sincronicidades diárias servem como bússola para o autoconhecimento.</div>
        </div>
        <div style="background:#12101a;border:1px solid #444;border-radius:6px;padding:15px;color:#e0e0e0;">
          <div style="color:#d4af37;font-weight:bold;margin-bottom:6px;font-size:0.9rem;">🧭 O MOMENTO ATUAL (CICLO ${rIdade.d} - ${pN(rIdade.r)})</div>
          <div style="font-size:0.9rem;line-height:1.5;">Neste ciclo da sua idade, a energia convida ao amadurecimento e reorganização de metas, abrindo espaço para novas oportunidades alinhadas com sua vocação.</div>
        </div>`;

      const mapaSec = document.getElementById('mapa-section');
      mapaSec.style.display = 'block';
      mapaSec.scrollIntoView({behavior:'smooth', block:'start'});
    });
  }

  const btnImprimirMapa = document.getElementById('btnImprimirMapa');
  if(btnImprimirMapa) {
    btnImprimirMapa.addEventListener('click', function() {
      const mapaSec = document.getElementById('mapa-section');
      if(!mapaSec || mapaSec.style.display === 'none') {
        alert('Gere a análise primeiro.');
        return;
      }
      window.print();
    });
  }
});
