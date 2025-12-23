/* ==================================================
   IA 2048 — estilo Universo Programado
   Usa heurísticas + simulação
   ================================================== */

if (!window.move || !window.simulateMove) {
  console.error("IA não encontrou as funções do jogo.");
}

/* Flag global */
window.IA_ENABLED = true;

/* Configuração */
const IA_DELAY = 120; // ms entre jogadas
const DIRECTIONS = ["up", "down", "left", "right"];
const CANTO_PREFERIDO = [3, 0]; // canto inferior esquerdo

/* Loop principal */
const iaInterval = setInterval(() => {
  if (!window.IA_ENABLED || window.gameOver) return;

  const best = escolherMelhorJogada();
  if (best) move(best);
}, IA_DELAY);

/* ================== DECISÃO ================== */
function escolherMelhorJogada(){
  let bestDir = null;
  let bestScore = -Infinity;

  for (const dir of DIRECTIONS) {
    const sim = simulateMove(dir, board);
    if (JSON.stringify(sim) === JSON.stringify(board)) continue;

    const score = avaliarTabuleiro(sim);
    if (score > bestScore) {
      bestScore = score;
      bestDir = dir;
    }
  }
  return bestDir;
}

/* ================== HEURÍSTICAS ================== */
function avaliarTabuleiro(b){
  return (
    espacosVazios(b) * 100 +
    maiorNoCanto(b) * 1000 +
    monotonicidade(b) * 10 -
    penalidadeCaos(b) * 5
  );
}

function espacosVazios(b){
  return b.flat().filter(v => v === 0).length;
}

function maiorNoCanto(b){
  const max = Math.max(...b.flat());
  return b[CANTO_PREFERIDO[0]][CANTO_PREFERIDO[1]] === max ? 1 : 0;
}

function monotonicidade(b){
  let score = 0;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (b[i][j] >= b[i][j + 1]) score++;
      if (b[j][i] >= b[j + 1][i]) score++;
    }
  }
  return score;
}

function penalidadeCaos(b){
  let caos = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (!b[i][j]) continue;
      if (j < 3 && Math.abs(b[i][j] - b[i][j + 1]) > b[i][j]) caos++;
      if (i < 3 && Math.abs(b[i][j] - b[i + 1][j]) > b[i][j]) caos++;
    }
  }
  return caos;
}
