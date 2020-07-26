// var back_w = 300,
// 	back_h = 550;

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

let x = 0;
var now_x = 5;
var now_y = 0;
var cnt = 0;
var now = Math.floor(Math.random() * 6);

/**
 * ループ
 */
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height); //canvasの初期化

	for (var h = 0; h < 22; h++) {
		for (var w = 0; w < 12; w++) {
			ctx.strokeRect(500 + w * 30, h * 30, 30, 30);
			if (block[h][w] == 9 || block[h][w] == 1) {
				ctx.fillRect(500 + w * 30 + 2, h * 30 + 2, 26, 26);
			}
		}
	}

	for (var h = 0; h < 4; h++) {
		for (var w = 0; w < 4; w++) {
			if (tetrimino[now][h][w] == 0) continue;
			else
				ctx.fillRect(
					500 + (now_x + w) * 30 + 2,
					(now_y + h) * 30 + 2,
					26,
					26
				);
		}
	}

	cnt++;
	if (cnt % 30 == 0) {
		now_y++;
	}

	if (collision() == true) {
		now_x = 5;
		now_y = 0;
		now = Math.floor(Math.random() * 6);
	}

	window.requestAnimationFrame(draw);
}

/**
 *  衝突判定
 */

function collision() {
	var ok = false;
	for (var h = 0; h < 4; h++) {
		for (var w = 0; w < 4; w++) {
			if (h + now_y >= 22 || w + now_x >= 12) continue;
			if (
				(block[h + now_y][w + now_x] == 1 ||
					block[h + now_y][w + now_x] == 9) &&
				tetrimino[now][h][w] == 1
			)
				ok = true;
		}
	}
	if (ok) {
		now_y--;
		stick();
		return true;
	}
	return false;
}

/**
 * 下まで落ちたものは固定する
 */

function stick() {
	for (var h = 0; h < 4; h++) {
		for (var w = 0; w < 4; w++) {
			if (h + now_y >= 21 || w + now_x >= 11) continue;
			console.log(h + now_y + " " + (w + now_x));
			if (block[h + now_y][w + now_x] == 0) {
				block[h + now_y][w + now_x] = tetrimino[now][h][w];
			}
		}
	}
	check();
}

/**
 *  一列揃ったかをチェック
 */

function check() {
	for (var h = now_y; h < now_y + 4; h++) {
		var ok = true;
		for (var w = 1; w < 12; w++) {
			console.log(h + " " + w);
			// if (block[now][h][w] == 0) {
			// 	ok = false;
			// }
		}
	}
	for (var h = now_y; h < now_y + 4; h++) {
		if (ok) {
			for (var w = 1; w < 12; w++) {
				block[now][h][w] == 0;
			}
		}
	}
}

/**
 * キー操作
 */
document.addEventListener("keydown", (event) => {
	var keyName = event.key;
	console.log(keyName);

	if (keyName == "ArrowRight") {
		if (now_x < 12) now_x++;
	} else if (keyName == "ArrowLeft") {
		if (now_x >= 1) now_x--;
	} else if (keyName == "ArrowDown") {
		if (now_y < 22) now_y++;
	} else if (keyName == "ArrowUp") {
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
	}
});
draw();
