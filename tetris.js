var back_w = 300,
	back_h = 550;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
for (var h = 0; h < 22; h++) {
	for (var w = 0; w < 12; w++) {
		ctx.strokeStyle = "#cccccc";
		ctx.strokeRect(500 + w * 30, h * 30, 30, 30);
	}
}
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
for (var h = 0; h < 22; h++) {
	for (var w = 0; w < 12; w++) {
		if (block[h][w] == 0) continue;
		else ctx.fillRect(500 + w * 30 + 2, h * 30 + 2, 26, 26);
	}
}

var tetrimino = [
	[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[0, 1, 1, 0],
		[0, 0, 0, 0],
	],
	[
		[0, 0, 0, 0],
		[0, 0, 2, 0],
		[0, 2, 2, 0],
		[0, 2, 0, 0],
	],
	[
		[0, 0, 0, 0],
		[0, 3, 0, 0],
		[0, 3, 3, 0],
		[0, 0, 3, 0],
	],
	[
		[0, 0, 0, 0],
		[0, 4, 4, 0],
		[0, 4, 0, 0],
		[0, 4, 0, 0],
	],
	[
		[0, 0, 0, 0],
		[0, 5, 5, 0],
		[0, 0, 5, 0],
		[0, 0, 5, 0],
	],
	[
		[0, 6, 0, 0],
		[0, 6, 0, 0],
		[0, 6, 0, 0],
		[0, 6, 0, 0],
	],
];

let x = 0;
var now_x = 0;
var now_y = 0;
var cnt = 0;
var now = Math.floor(Math.random() * 6);

/**
 * ループ
 */
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (var h = 0; h < 22; h++) {
		for (var w = 0; w < 12; w++) {
			ctx.strokeRect(500 + w * 30, h * 30, 30, 30);
			if (block[h][w] != 0) {
				ctx.fillRect(500 + w * 30 + 2, h * 30 + 2, 26, 26);
			}
		}
	}

	for (var h = 0; h < 4; h++) {
		for (var w = 0; w < 4; w++) {
			if (tetrimino[now][h][w] == 0) continue;
			else
				ctx.fillRect(
					500 + (now_x + w + 5) * 30 + 2,
					(now_y + h) * 30 + 2,
					26,
					26
				);
		}
	}
	cnt++;
	if (cnt % 10 == 0) {
		now_y++;
	}
	if (now_y >= 18) {
		stick();
		now_x = 0;
		now_y = 0;
		now = Math.floor(Math.random() * 6);
	}
	window.requestAnimationFrame(draw);
}

/**
 * 下まで落ちたものは固定する
 */

function stick() {
	for (var h = now_y; h < now_y + 4; h++) {
		for (var w = now_x; w < now_x + 4; w++) {
			if (block[h][w] == 0)
				block[h][w + 5] = tetrimino[now][w - now_x][h - now_y];
		}
	}
}

/**
 *  衝突判定
 */

/**
 *  一列揃ったかをチェック
 */
draw();
