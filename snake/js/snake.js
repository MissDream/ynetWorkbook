"use strict";
var box = document.getElementById('box');
var boxCTX = box.getContext("2d");
var scoreEl = document.getElementById('score');
var newGameBtn = document.getElementById('newGameBtn');
var Cvs = /** @class */ (function () {
    function Cvs(el) {
        this.maxWidth = 500;
        this.maxHeight = 500;
        this.box = document.getElementById(el);
        this.boxCTX = this.box.getContext("2d");
        this.box.width = this.maxWidth;
        this.box.height = this.maxHeight;
    }
    return Cvs;
}());
var bgCvs = new Cvs('box');
var Dir;
(function (Dir) {
    Dir[Dir["left"] = 0] = "left";
    Dir[Dir["up"] = 1] = "up";
    Dir[Dir["right"] = 2] = "right";
    Dir[Dir["down"] = 3] = "down";
})(Dir || (Dir = {}));
;
var Snack = /** @class */ (function () {
    function Snack() {
        this.dir = Dir[2]; //用来控制蛇头的方向
        this.size = 20; //蛇身的宽度
        this.headColor = "black"; //蛇身颜色
        this.headX = 0; //蛇头的x坐标
        this.headY = 0; //蛇头的y坐标
        this.foodColor = 'red'; //实物颜色
        this.foodX = 0; //食物的x坐标
        this.foodY = 0; //食物的y坐标
        this.time = 400; //蛇的速度
        this.score = 0; //计算玩家分数
        this.snakeQue = []; //用队列模拟蛇身
        this.interval = null;
    }
    Snack.prototype.newGame = function () {
        var _this = this;
        this.initData(); //初始化数据
        this.drawPoint({ x: this.headX, y: this.headY, color: this.headColor, func: 'push' }); //画蛇头
        this.setFood(); //放实物
        this.interval = setInterval(function () { _this.move(); }, this.time); //移动蛇身
    };
    Snack.prototype.initData = function () {
        this.snakeQue = [];
        bgCvs.boxCTX.clearRect(0, 0, bgCvs.maxWidth, bgCvs.maxHeight);
        clearInterval(this.interval);
        this.interval = null;
        this.score = 0;
        this.headX = 0;
        this.headY = 0;
        this.dir = Dir[2];
    };
    Snack.prototype.drawPoint = function (pointObj) {
        bgCvs.boxCTX.fillStyle = pointObj.color;
        bgCvs.boxCTX.fillRect(pointObj.x, pointObj.y, this.size, this.size);
        if (pointObj.func) {
            this.snakeQue[pointObj.func]([pointObj.x, pointObj.y]);
        }
    };
    Snack.prototype.setFood = function () {
        do {
            this.foodX = this.size * Math.floor(Math.random() * bgCvs.maxWidth / this.size);
            this.foodY = this.size * Math.floor(Math.random() * bgCvs.maxHeight / this.size);
        } while (this.foodInSnake());
        this.drawPoint({ x: this.foodX, y: this.foodY, color: this.foodColor });
    };
    Snack.prototype.foodInSnake = function () {
        for (var i = 0; i < this.snakeQue.length; i++) {
            if (this.snakeQue[i][0] == this.foodX && this.snakeQue[i][1] == this.foodY) {
                return true;
            }
        }
        return false;
    };
    Snack.prototype.move = function () {
        switch (this.dir) {
            case "up":
                this.headY = this.headY - this.size;
                break;
            case "right":
                this.headX = this.headX + this.size;
                break;
            case "down":
                this.headY = this.headY + this.size;
                break;
            case "left":
                this.headX = this.headX - this.size;
                break;
        }
        // 撞墙了
        if (this.headX < 0 || this.headX > bgCvs.maxWidth - this.size || this.headY < 0 || this.headY > bgCvs.maxHeight - this.size) {
            clearInterval(this.interval);
            alert("\u6E38\u620F\u7ED3\u675F\uFF0C\u5F53\u524D\u5F97\u5206 " + this.score + "\u5206");
            return false;
        }
        // 撞到自己了
        for (var i = 0; i < this.snakeQue.length; i++) {
            if (this.headX == this.snakeQue[i][0] && this.headY == this.snakeQue[i][1]) {
                clearInterval(this.interval);
                alert("\u6E38\u620F\u7ED3\u675F\uFF0C\u5F53\u524D\u5F97\u5206 " + this.score + "\u5206");
                return false;
            }
        }
        this.drawPoint({ x: this.headX, y: this.headY, color: this.headColor, func: 'unshift' });
        if (!this.eatFood()) {
            var snakeTail = this.snakeQue.pop();
            bgCvs.boxCTX.clearRect(snakeTail[0], snakeTail[1], this.size, this.size);
        }
    };
    Snack.prototype.eatFood = function () {
        if (this.headX == this.foodX && this.headY == this.foodY) {
            this.setFood();
            this.score++;
            scoreEl.innerHTML = this.score;
            return true;
        }
        return false;
    };
    return Snack;
}());
var snake = new Snack();
document.onkeydown = function (e) {
    snake.dir = Dir[e.keyCode - 37];
};
window.onload = function () {
    snake.newGame();
};
newGameBtn.onclick = function () {
    snake.newGame();
};
