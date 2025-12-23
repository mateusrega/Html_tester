/* ================== IA 2048 ================== */
/* Compatível com seu jogo atual */

let iaInterval = null;

function startIA(){
  if(iaInterval) return;

  iaInterval = setInterval(()=>{
    if(gameOver){
      stopIA();
      return;
    }

    const dir = chooseBestMove();
    if(dir) move(dir);

  }, 120); // velocidade da IA (ms)
}

function stopIA(){
  clearInterval(iaInterval);
  iaInterval = null;
}

function chooseBestMove(){
  const dirs = ["up","left","right","down"];
  let bestScore = -Infinity;
  let bestDir = null;

  for(const d of dirs){
    const simulated = simulateMove(d, board);
    if(JSON.stringify(simulated) === JSON.stringify(board)) continue;

    const score = evaluateBoard(simulated);
    if(score > bestScore){
      bestScore = score;
      bestDir = d;
    }
  }
  return bestDir;
}

/* ===== Heurísticas (Universo Programado style) ===== */

function evaluateBoard(b){
  return (
    emptyCells(b) * 100 +
    maxInCorner(b) * 1000 +
    monotonicity(b) * 10
  );
}

function emptyCells(b){
  return b.flat().filter(v=>v===0).length;
}

function maxInCorner(b){
  let max = Math.max(...b.flat());
  return (
    b[3][0]===max ||
    b[3][3]===max ||
    b[0][0]===max ||
    b[0][3]===max
  ) ? 1 : 0;
}

function monotonicity(b){
  let score = 0;
  for(let i=0;i<4;i++){
    for(let j=0;j<3;j++){
      score += b[i][j] >= b[i][j+1] ? 1 : -1;
      score += b[j][i] >= b[j+1][i] ? 1 : -1;
    }
  }
  return score;
}

/* ===== Observa botão IA ===== */

setInterval(()=>{
  const ia = localStorage.getItem("iaMode");
  if(ia==="on") startIA();
  else stopIA();
}, 300);
