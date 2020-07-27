const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.strokeStyle = "#cccccc";
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

var tetrimino = [
	[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[0, 1, 1, 0],
		[0, 0, 0, 0],
	],
	[
		[0, 0, 0, 0],
		[0, 0, 1, 0],
		[0, 1, 1, 0],
		[0, 1, 0, 0],
	],
	[
		[0, 0, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 1, 0],
		[0, 0, 1, 0],
	],
	[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
	],
	[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[0, 0, 1, 0],
		[0, 0, 1, 0],
	],
	[
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
	],
];

var now_x = 5;
var now_y = -3;
var cnt = 0;
var now = Math.floor(Math.random() * 6);
var hesi = false; //猶予
var gameover = false;
var score = 0;

/**
 * ゲームオーバー画面
 */

function drawGameover() {
	ctx.font = "36px serif";
	ctx.fillStyle = "#000000";
	ctx.textAlign = "center";
	ctx.fillText("SCORE : " + score, 680, 305);
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
			ctx.strokeRect(500 + w * 30, h * 30, 30, 30);
			if (block[h][w] == 9) {
				ctx.fillStyle = "#000000";
				ctx.fillRect(500 + w * 30 + 2, h * 30 + 2, 26, 26);
			} else if (block[h][w] == 1) {
				ctx.fillStyle = "#aaaaaa";
				ctx.fillRect(500 + w * 30 + 2, h * 30 + 2, 26, 26);
			}
		}
	}

	//落ちてくるブロックの描画
	for (var h = 0; h < 4; h++) {
		for (var w = 0; w < 4; w++) {
			if (tetrimino[now][h][w] == 0) continue;
			else {
				if (now == 0) {
					ctx.fillStyle = "#F9E900";
				} else if (now == 1) {
					ctx.fillStyle = "#E84566";
				} else if (now == 2) {
					ctx.fillStyle = "#F5A500";
				} else if (now == 3) {
					ctx.fillStyle = "#F3ADCB";
				} else if (now == 4) {
					ctx.fillStyle = "#ACDDF7";
				} else if (now == 5) {
					ctx.fillStyle = "#92CB97";
				}

				if (now_y + h < 0) continue;

				ctx.fillRect(
					500 + (now_x + w) * 30 + 2,
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
	if (hesi == true && cnt >= 60) {
		hesi = false;
		stick();
		now_x = 5;
		now_y = -3;
		now = Math.floor(Math.random() * 6);
	}

	if (collision(now_x, now_y + 1) == true && now_y < 1 && hesi == true)
		gameover = true;
	if (gameover) {
		console.log("Hi");
		drawGameover();
		clearInterval(intervalId);
	}
	if (cnt % 30 == 0 && hesi == false) {
		//猶予時間じゃなくて
		now_y++;
	}

	//衝突する かつ
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
	if (now_y < 0) return false;
	for (var h = 0; h < 4; h++) {
		for (var w = 0; w < 4; w++) {
			if (h + next_y >= 22 || w + now_x > 12) {
				return true;
			}
			if (
				(block[h + next_y][w + next_x] == 1 ||
					block[h + next_y][w + next_x] == 9) &&
				tetrimino[now][h][w] == 1
			)
				ok = true;
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
	console.log("stick");
	for (var h = 0; h < 4; h++) {
		for (var w = 0; w < 4; w++) {
			if (block[h + now_y][w + now_x] == 0) {
				block[h + now_y][w + now_x] = tetrimino[now][h][w];
			}
		}
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height); //canvasの初期化

	//描画しておく
	for (var h = 0; h < 22; h++) {
		for (var w = 0; w < 12; w++) {
			ctx.strokeRect(500 + w * 30, h * 30, 30, 30);
			if (block[h][w] == 9 || block[h][w] == 1) {
				ctx.fillRect(500 + w * 30 + 2, h * 30 + 2, 26, 26);
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
	console.log("check");
	for (var h = now_y + 3; h >= now_y; h--) {
		console.log("Yes");
		var ok = true;
		for (var w = 1; w < 11; w++) {
			if (block[h][w] == 0 || block[h][w] == 9) {
				ok = false;
			}
		}
		if (ok) {
			lineCount++;
			for (var v = h - 1; v > 0; v--) {
				for (var w = 1; w < 11; w++) {
					block[v + 1][w] = block[v][w];
				}
			}
			h++;
		}
	}
	score += lineCount * lineCount * 100;
}

/**
 * キー操作
 */
document.addEventListener("keydown", (event) => {
	var keyName = event.key;
	console.log(keyName);

	if (keyName == "ArrowRight") {
		if (!collision(now_x + 1, now_y)) now_x++;
	} else if (keyName == "ArrowLeft") {
		if (!collision(now_x - 1, now_y)) now_x--;
	} else if (keyName == "ArrowDown") {
		if (!collision(now_x, now_y + 1) && hesi == false) now_y++;
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
				while (collision(now_x, now_y + 1)) now_x--;
			} else {
				while (collision(now_x, now_y + 1)) now_x++;
			}
		}
	}
});
