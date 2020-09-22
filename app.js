const express = require("express");
var http = require("http");
const app = express();

let board = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

let started = false;
let turn = "Yellow";
let won = false;
function bstr() {
  let str = "";
  for (var i = 0; i < board.length; i++) {
    for (var z = 0; z < board[i].length; z++) {
      //   /console.log(board[i][z]);
      str += board[i][z] + " ";
    }
    str += "<br>";
  }
  return str;
}

function resetBoard() {
  for (var i = 0; i < board.length; i++) {
    for (var z = 0; z < board[i].length; z++) {
      //   /console.log(board[i][z]);
      board[i][z] = 0;
    }
  }
}
function updateTurn() {
  if (turn == "Yellow") {
    turn = "Red";
  } else {
    turn = "Yellow";
  }
}
function updateBoard(usercol) {
  for (let k = 5; k >= 0; k--) {
    if (board[k][usercol] == 0) {
      if (turn == "Yellow") {
        board[k][usercol] = 1;
      } else {
        board[k][usercol] = 2;
      }
      return true;
    }
  }
  return false;
}
function checkCol(i, j) {
  let value = board[i][j];
  let maxi = 6;
  let maxj = 7;
  let c = 0;
  while (i < maxi && j < maxj) {
    if (board[i][j] == value) {
      c++;
    } else {
      c = 0;
    }
    if (c == 4) {
      return true;
    }
    i++; //col statys same row increases
  }
  return false;
}
function checkRow(i, j) {
  let value = board[i][j];
  let maxi = 6;
  let maxj = 7;
  let c = 0;
  while (i < maxi && j < maxj) {
    if (board[i][j] == value) {
      c++;
    } else {
      c = 0;
    }
    if (c == 4) {
      return true;
    }
    j++;
  }
  return false;
}

function checkDiag1(i, j) {
  let value = board[i][j];
  let maxi = 6;
  let maxj = 7;
  let c = 0;
  while (i < maxi && j < maxj) {
    if (board[i][j] == value) {
      c++;
    } else {
      c = 0;
    }
    if (c == 4) {
      return true;
    }
    i++;
    j++;
  }
  return false;
}

function checkDiag2(i, j) {
  let value = board[i][j];
  let maxi = 6;
  let maxj = 7;
  let c = 0;
  while (i < maxi && j > -1) {
    if (board[i][j] == value) {
      c++;
    } else {
      c = 0;
    }
    if (c == 4) {
      return true;
    }
    i++;
    j--;
  }
  return false;
}
function checkWinner() {
  let isWin = false;
  for (var i = 0; i < board.length; i++) {
    for (var z = 0; z < board[i].length; z++) {
      //   /console.log(board[i][z]);
      if (board[i][z] != 0) {
        isWin = checkCol(i, z);
        if (isWin) {
          return isWin;
        }
        isWin = checkRow(i, z);
        if (isWin) {
          return isWin;
        }
        isWin = checkDiag1(i, z);
        if (isWin) {
          return isWin;
        }
        isWin = checkDiag2(i, z);
        if (isWin) {
          return isWin;
        }
      }
    }
  }
  return isWin;
}
function domove(usercol) {
  let boardState;
  if (usercol < 0 || usercol > 6) {
    boardState = bstr();
    return `
        Invalid move by user ${turn}.
        <br>
        Pick a valid col number
        <br>
        ${boardState}
        `;
  } else {
    let checkInsert = updateBoard(usercol);
    if (!checkInsert) {
      boardState = bstr();
      return `
            Invalid move by user ${turn}.
            <br>
            Pick a valid col number
            <br>
            ${boardState}
            `;
    }
    won = checkWinner();
    if (won) {
      return `
        User <b>${turn}</b> won the game.
        <br>
        Send request to <b>/start</b> to reset the game.
        `;
    }
    updateTurn();
    boardState = bstr();
    return `${turn}'s Turn
    <br>
    send your request to ->      <b>/turn/column-number<b>
    <br>
    Note: Valid Column Numbers are [0,1,2,3,4,5,6]
    <hr>
    <br>
    ${boardState}`;
  }
}

app.set("port", process.env.PORT || 2131);

app.get("/", (req, res) => {
  res.send("Send request to /start to begin the game");
});

app.get("/start", (req, res) => {
  started = true;
  resetBoard();
  let outboard = bstr();
  turn = "Yellow";

  res.send(`Ready, ${turn}'s Turn
  <br>
  send your request to ->      <b>/turn/column-number<b>
  <br>
  Note: Valid Column Numbers are [0,1,2,3,4,5,6]
  <hr>
  <br>
  ${outboard}
  `);
});

app.get("/turn/:colnumber", (req, res) => {
  if (started) {
    let usercol = req.params.colnumber;

    res.send(domove(usercol));
  } else if (won) {
    let outboard = bstr();
    res.send(
      `Game ended ${turn} won the game. Restart by sending request to <b>/start</b>
      <hr>
      ${outboard}
      `
    );
  } else {
    res.send(`
        Please send request to <b>/start<b> to start the game. 
        `);
  }
});

http.createServer(app).listen(app.get("port"), function () {
  console.log("Express server listing on port " + app.get("port"));
});
