const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = canvas_wrapper.offsetWidth * 0.9;
canvas.height = canvas_wrapper.offsetHeight * 0.9;
ctx.strokeStyle = "#cccccc";

//表示するブロック

var block = [
	[9, 9, 9, 0, 0, 0, 0, 0, 0, 9, 9, 9],
	[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
	[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
	[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
	[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
	[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
	[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
	[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
	[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
	[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
	[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
	[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
	[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
	[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
	[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
	[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
	[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
	[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
	[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
	[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
	[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
	[9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
];

//テトリミノ

var tetrimino = [
	[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[0, 1, 1, 0],
		[0, 0, 0, 0],
	],
	[
		[0, 0, 0, 0],
		[2, 2, 0, 0],
		[0, 2, 2, 0],
		[0, 0, 0, 0],
	],
	[
		[0, 0, 0, 0],
		[0, 3, 3, 0],
		[3, 3, 0, 0],
		[0, 0, 0, 0],
	],
	[
		[0, 0, 0, 0],
		[0, 0, 4, 0],
		[4, 4, 4, 0],
		[0, 0, 0, 0],
	],
	[
		[0, 0, 0, 0],
		[5, 0, 0, 0],
		[5, 5, 5, 0],
		[0, 0, 0, 0],
	],
	[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[6, 6, 6, 6],
		[0, 0, 0, 0],
	],

	[
		[0, 0, 0, 0],
		[0, 7, 0, 0],
		[7, 7, 7, 0],
		[0, 0, 0, 0],
	],
];

/**
 * ミノをシャッフル (Fisher-Yates shuffle)
 */

function shuffle() {
	var length = 7;
	for (var i = length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var tmp = tetrimino[i];
		tetrimino[i] = tetrimino[j];
		tetrimino[j] = tmp;
	}
}

var now_x = 5;
var now_y = -2;
var cnt = 0;
var now = 0;
var hesi = false; //猶予
var gameover = false;
var score = 0;
var flickCount = 0;
var flickLoop;
var speed = 30;
var pos = 50;
var eraseCount = 0;
shuffle();

/**
 * ゲームオーバー画面
 */

function drawGameover() {
	ctx.font = "36px serif";
	ctx.fillStyle = "#000000";
	ctx.textAlign = "center";
	ctx.fillText("SCORE : " + score, pos + 170, 305);
	setTimeout(confirmButton, 1000);
}

function confirmButton() {
	var reloadbutton = window.confirm("もう一度しますか？");
	if (reloadbutton) document.location.reload();
}

/**
 * ループ
 */

function loop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height); //canvasの初期化

	//枠線の描画
	for (var h = 0; h < 22; h++) {
		for (var w = 0; w < 12; w++) {
			ctx.strokeRect(pos + w * 30, h * 30, 30, 30);
			if (block[h][w] == 9) {
				ctx.fillStyle = "#000000";
				ctx.fillRect(pos + w * 30 + 2, h * 30 + 2, 26, 26);
			} else if (block[h][w] == 1) {
				ctx.fillStyle = "#aaaaaa";
				ctx.fillRect(pos + w * 30 + 2, h * 30 + 2, 26, 26);
			}
		}
	}

	//落ちてくるブロックの描画
	for (var h = 0; h < 4; h++) {
		for (var w = 0; w < 4; w++) {
			if (tetrimino[now][h][w] == 0) continue;
			else {
				var col = tetrimino[now][h][w];
				if (col == 1) {
					ctx.fillStyle = "#F9E900";
				} else if (col == 2) {
					ctx.fillStyle = "#E84566";
				} else if (col == 3) {
					ctx.fillStyle = "#F5A500";
				} else if (col == 4) {
					ctx.fillStyle = "#F3ADCB";
				} else if (col == 5) {
					ctx.fillStyle = "#ACDDF7";
				} else if (col == 6) {
					ctx.fillStyle = "#92CB97";
				} else if (col == 7) {
					ctx.fillStyle = "#F08A37";
				}

				if (now_y + h < 0) continue;

				ctx.fillRect(
					pos + (now_x + w) * 30 + 2,
					(now_y + h) * 30 + 2,
					26,
					26
				);
			}
		}
	}

	//猶予時間中で、衝突が無くなったら
	if (hesi == true && collision(now_x, now_y + 1) == false) {
		hesi = false;
	}

	//猶予時間中で、秒数がたったら
	if (hesi == true && cnt >= speed * 2) {
		hesi = false;
		stick();
		now_x = 5;
		now_y = -2;
		now++;
		if (now >= 7) {
			now = 0;
			shuffle();
		}
	}

	if (collision(now_x, now_y + 1) == true && now_y < 0 && hesi == true) {
		gameover = true;
	}

	if (gameover) {
		drawGameover();
		clearInterval(intervalId);
	}
	if (cnt % speed == 0 && hesi == false) {
		now_y++;
	}

	if (collision(now_x, now_y + 1) == true && hesi == false) {
		hesi = true;
		cnt = 0;
	}
	cnt++;
}

var intervalId = setInterval(loop, 20);

/**
 *  衝突判定
 */

function collision(next_x, next_y) {
	var ok = false;
	for (var h = 0; h < 4; h++) {
		for (var w = 0; w < 4; w++) {
			if (next_y + h < 0 || next_y + h >= 22) continue;
			if (tetrimino[now][h][w] == 0) continue;
			if (block[h + next_y][w + next_x] != 0) ok = true;
		}
	}
	if (ok) {
		return true; //ぶつかる
	}
	return false; //ぶつからない
}

/**
 * 下まで落ちたものは固定する
 */

function stick() {
	for (var h = 0; h < 4; h++) {
		for (var w = 0; w < 4; w++) {
			if (block[h + now_y][w + now_x] == 0 && tetrimino[now][h][w] != 0) {
				block[h + now_y][w + now_x] = 1;
			}
		}
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height); //canvasの初期化

	for (var h = 0; h < 22; h++) {
		for (var w = 0; w < 12; w++) {
			ctx.strokeRect(pos + w * 30, h * 30, 30, 30);
			if (block[h][w] == 9) {
				ctx.fillStyle = "#000000";
				ctx.fillRect(pos + w * 30 + 2, h * 30 + 2, 26, 26);
			} else if (block[h][w] != 0) {
				ctx.fillStyle = "#aaaaaa";
				ctx.fillRect(pos + w * 30 + 2, h * 30 + 2, 26, 26);
			}
		}
	}
	check();
}

/**
 *  一列揃ったかをチェック
 */

function check() {
	var lineCount = 0;
	var erase = false;
	for (var h = now_y + 3; h >= now_y; h--) {
		var ok = true;
		for (var w = 1; w < 11; w++) {
			if (block[h][w] == 0 || block[h][w] == 9) {
				ok = false;
			}
		}
		if (ok) {
			erase = true;
			lineCount++;
			for (var v = h - 1; v > 0; v--) {
				for (var w = 1; w < 11; w++) {
					block[v + 1][w] = block[v][w];
				}
			}
			h++;
		}
	}
	if (erase) eraseCount++;
	if (eraseCount >= 1) {
		speed = 27;
	} else if (eraseCount >= 5) {
		speed = 24;
	} else if (eraseCount >= 9) {
		speed = 20;
	} else if (eraseCount >= 13) {
		speed = 17;
	} else if (eraseCount >= 17) {
		speed = 15;
	} else if (eraseCount >= 21) {
		speed = 13;
	} else if (eraseCount >= 23) {
		speed = 11;
	} else if (eraseCount >= 25) {
		speed = 9;
	} else if (eraseCount >= 27) {
		speed = 7;
	}
	score += lineCount * lineCount * 100;

	if (erase) {
		flickCount = 0;
		flickLoop = setInterval(drawFlick, 100);
		clearInterval(intervalId);
	}
}

function drawFlick() {
	if (flickCount % 3 == 1) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (var h = 0; h < 22; h++) {
			for (var w = 0; w < 12; w++) {
				ctx.strokeRect(pos + w * 30, h * 30, 30, 30);
				if (block[h][w] == 9) {
					ctx.fillStyle = "#000000";
					ctx.fillRect(pos + w * 30 + 2, h * 30 + 2, 26, 26);
				} else if (block[h][w] != 0) {
					ctx.fillStyle = "#aaaaaa";
					ctx.fillRect(pos + w * 30 + 2, h * 30 + 2, 26, 26);
				}
			}
		}
	}
	if (flickCount % 6 == 1) {
		ctx.clearRect(0, 0, canvas.width, canvas.height); //canvasの初期化
		for (var h = 0; h < 22; h++) {
			for (var w = 0; w < 12; w++) {
				ctx.strokeRect(pos + w * 30, h * 30, 30, 30);
				if (block[h][w] == 9) {
					ctx.fillStyle = "#aaaaaa";
					ctx.fillRect(pos + w * 30 + 2, h * 30 + 2, 26, 26);
				} else if (block[h][w] != 0) {
					ctx.fillStyle = "#aaaaaa";
					ctx.fillRect(pos + w * 30 + 2, h * 30 + 2, 26, 26);
				}
			}
		}
	}
	flickCount++;
	if (flickCount >= 13) {
		clearInterval(flickLoop);
		intervalId = setInterval(loop, 20);
	}
}

/**
 * キー操作
 */
document.addEventListener("keydown", (event) => {
	var keyName = event.key;
	if (keyName == "ArrowRight") {
		if (!collision(now_x + 1, now_y)) now_x++;
	} else if (keyName == "ArrowLeft") {
		if (!collision(now_x - 1, now_y)) now_x--;
	} else if (keyName == "ArrowDown") {
		if (!collision(now_x, now_y + 2) && hesi == false) now_y++;
	} else if (keyName == "ArrowUp") {
		if (hesi == false) {
			var t = [
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0],
			];
			for (var w = 0; w < 4; w++) {
				for (var h = 0; h < 4; h++) {
					t[h][w] = tetrimino[now][w][-h + 3];
				}
			}
			for (var w = 0; w < 4; w++) {
				for (var h = 0; h < 4; h++) {
					tetrimino[now][h][w] = t[h][w];
				}
			}
			if (now_x >= 6) {
				while (collision(now_x, now_y)) {
					now_x--;
				}
			} else {
				while (collision(now_x, now_y)) {
					now_x++;
				}
			}
		}
	}
});
