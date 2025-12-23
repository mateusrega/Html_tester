/* ===============================
   IA 2048 — Universo Programado
   =============================== */

/* CONFIGURAÇÕES */
const AI_CONFIG = {
  intervalo: 120,          // ms entre jogadas
  cantoPreferido: "bottom-left",
  pesos: {
    espacos: 3.0,
    monotonia: 1.5,
    canto: 4.0,
    maxTile: 1.0,
    penalidadeTravado: 3.5
  }
};

let iaAtiva = false;
let iaLoop = null;

/* ---------- CONTROLE ---------- */
function ligarIA(){
  if(iaAtiva) return;
  iaAtiva = true;
  iaLoop = setInterval(passarIA, AI_CONFIG.intervalo);
}

function desligarIA(){
  iaAtiva = false;
  clearInterval(iaLoop);
}

/* ---------- LOOP PRINCIPAL ---------- */
function passarIA(){
  if(gameOver) return desligarIA();

  const direcoes = ["up","down","left","right"];
  let melhorDirecao = null;
  let melhorScore = -Infinity;

  for(const dir of direcoes){
    const sim = simulateMove(dir, board);
    if(boardsIguais(sim, board)) continue;

    const score = avaliarTabuleiro(sim);
    if(score > melhorScore){
      melhorScore = score;
      melhorDirecao = dir;
    }
  }

  if(melhorDirecao){
    move(melhorDirecao);
  }else{
    desligarIA();
  }
}

/* ---------- AVALIAÇÃO ---------- */
function avaliarTabuleiro(b){
  const vazios = contarVazios(b);
  const monotonia = calcularMonotonia(b);
  const maior = maiorTile(b);
  const canto = maiorNoCanto(b);
  const travado = estaTravado(b);

  return (
    vazios * AI_CONFIG.pesos.espacos +
    monotonia * AI_CONFIG.pesos.monotonia +
    canto * AI_CONFIG.pesos.canto +
    Math.log2(maior) * AI_CONFIG.pesos.maxTile -
    travado * AI_CONFIG.pesos.penalidadeTravado
  );
}

/* ---------- HEURÍSTICAS ---------- */
function contarVazios(b){
  return b.flat().filter(v=>v===0).length;
}

function maiorTile(b){
  return Math.max(...b.flat());
}

function maiorNoCanto(b){
  const max = maiorTile(b);
  const cantos = [
    b[0][0], b[0][3],
    b[3][0], b[3][3]
  ];
  return cantos.includes(max) ? 1 : 0;
}

function calcularMonotonia(b){
  let score = 0;
  for(let i=0;i<4;i++){
    for(let j=0;j<3;j++){
      score += Math.sign(b[i][j] - b[i][j+1]);
      score += Math.sign(b[j][i] - b[j+1][i]);
    }
  }
  return Math.abs(score);
}

function estaTravado(b){
  let vazios = contarVazios(b);
  if(vazios > 2) return 0;

  for(let i=0;i<4;i++){
    for(let j=0;j<4;j++){
      if(j<3 && b[i][j]===b[i][j+1]) return 0;
      if(i<3 && b[i][j]===b[i+1][j]) return 0;
    }
  }
  return 1;
}

/* ---------- UTIL ---------- */
function boardsIguais(a,b){
  return JSON.stringify(a) === JSON.stringify(b);
    }
