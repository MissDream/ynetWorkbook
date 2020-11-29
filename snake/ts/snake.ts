let box:any = document.getElementById('box');
let boxCTX:any = box.getContext("2d");
let scoreEl:any = document.getElementById('score');
let newGameBtn:any = document.getElementById('newGameBtn');
class Cvs {
    private box:any;
    boxCTX:any;
    maxWidth:number = 500;
    maxHeight:number = 500;
    constructor(el:string) {
        
        this.box = document.getElementById(el);
        this.boxCTX = this.box.getContext("2d");
        this.box.width = this.maxWidth;
        this.box.height = this.maxHeight;
    }
}
let bgCvs = new Cvs('box');

enum Dir {left, up, right, down};
interface pointInfo{
    x: number, 
    y: number, 
    color: string, 
    func?: string
}
interface snakeQueType{
    [index: number]: Array<any>,
    [index: string]: any
}
class Snack {
    dir:string = Dir[2]; //用来控制蛇头的方向
    size:number = 20; //蛇身的宽度
    headColor:string = "black";  //蛇身颜色
    headX:number = 0; //蛇头的x坐标
    headY:number = 0; //蛇头的y坐标
    foodColor:string = 'red';  //实物颜色
    foodX:number = 0; //食物的x坐标
    foodY:number = 0; //食物的y坐标
    time:number = 400; //蛇的速度
    score:number = 0; //计算玩家分数
    snakeQue:snakeQueType = [] //用队列模拟蛇身
    interval:any|null = null;
    constructor(){}
    newGame(): void{
        this.initData();  //初始化数据
        this.drawPoint({x:this.headX, y: this.headY, color: this.headColor, func: 'push'});  //画蛇头
        this.setFood();   //放实物
        this.interval = setInterval(()=>{ this.move() }, this.time)   //移动蛇身
    }
    initData(): void{
        this.snakeQue = [];
        bgCvs.boxCTX.clearRect(0, 0, bgCvs.maxWidth, bgCvs.maxHeight);
        clearInterval(this.interval);
        this.interval = null;
        this.score = 0;
        this.headX = 0;
        this.headY = 0;
        this.dir = Dir[2];
    }
    drawPoint(pointObj: pointInfo): void{
        bgCvs.boxCTX.fillStyle = pointObj.color;
        bgCvs.boxCTX.fillRect(pointObj.x, pointObj.y, this.size, this.size);
        if(pointObj.func){
            this.snakeQue[pointObj.func]([pointObj.x, pointObj.y]);
        }
    }
    setFood(): void{
        do {
            this.foodX = this.size * Math.floor(Math.random() * bgCvs.maxWidth / this.size);
            this.foodY = this.size * Math.floor(Math.random() * bgCvs.maxHeight / this.size);
        } while (this.foodInSnake());
        this.drawPoint({x: this.foodX, y: this.foodY, color: this.foodColor});
    }
    foodInSnake():boolean{
        for (let i:number = 0; i < this.snakeQue.length; i++) {
            if(this.snakeQue[i][0] == this.foodX && this.snakeQue[i][1] == this.foodY){
                return true;
            }
        }
        return false;
    }
    move(): void|boolean{
        switch(this.dir){
            case "up": this.headY = this.headY - this.size; break;
            case "right": this.headX = this.headX + this.size; break;
            case "down": this.headY = this.headY + this.size; break;
            case "left": this.headX = this.headX - this.size; break;
        }
        // 撞墙了
        if(this.headX < 0 || this.headX > bgCvs.maxWidth - this.size || this.headY < 0 || this.headY > bgCvs.maxHeight - this.size){
            clearInterval(this.interval);
            alert(`游戏结束，当前得分 ${this.score}分`);
            return false;
        }
        // 撞到自己了
        for (let i = 0; i < this.snakeQue.length; i++) {
            if(this.headX == this.snakeQue[i][0] && this.headY == this.snakeQue[i][1]){
                clearInterval(this.interval);
                alert(`游戏结束，当前得分 ${this.score}分`);
                return false
            }
        }
        this.drawPoint({x: this.headX, y: this.headY, color: this.headColor, func: 'unshift'});
        if(!this.eatFood()){
            let snakeTail = this.snakeQue.pop();
            bgCvs.boxCTX.clearRect(snakeTail[0], snakeTail[1], this.size, this.size);  
        }
    }
    eatFood(): boolean{
        if(this.headX == this.foodX && this.headY == this.foodY){
            this.setFood();
            this.score ++;
            scoreEl.innerHTML = this.score;
            return true
        }
        return false;
    }
    
}
let snake = new Snack();
document.onkeydown = function(e:any){
    snake.dir = Dir[e.keyCode-37];
}
window.onload = function(): void{
    snake.newGame();
}
newGameBtn.onclick = ()=>{
    snake.newGame();
}




