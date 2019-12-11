"use strict";
class Vector{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

class GameObject{
    constructor(x, y, width, height, color){
        this.lastPosition = new Vector(x,y);
        this.position = new Vector(x,y);
        this.velocity = new Vector(0, 0);
        this.size = new Vector(width, height);
        this.color = color;
    }
    get left(){
        return this.position.x;
    }
    get right(){
        return this.position.x + this.size.x;
    }
    get top(){
        return this.position.y;
    }
    get bottom(){
        return this.position.y + this.size.y;
    }
    setVelocity(x,y){
        this.velocity.x = x;
        this.velocity.y = y;
    }
}

class Player extends GameObject{
    constructor(x, y){
        super(x,y,10,10, "white");
        this.controlUp = null;
        this.controlDown = null;
        this.controlLeft = null;
        this.controlRight = null;
        this.speed = 3;
    }
    addControl(controlDefine){
        this.controlUp = controlDefine['up'];
        this.controlDown = controlDefine['down'];
        this.controlLeft = controlDefine['left'];
        this.controlRight = controlDefine['right'];
    }
    execute(keycode, type){
        if(type == 'keydown'){
            if(keycode == this.controlUp){
                this.setVelocity(0,-this.speed);
            }
            if(keycode == this.controlDown){
                this.setVelocity(0,this.speed);
            }
            if(keycode == this.controlLeft){
                this.setVelocity(-this.speed,0);
            }
            if(keycode == this.controlRight){
                this.setVelocity(this.speed,0);
            }
        }
        if(type == 'keyup'){
            if(keycode == this.controlUp){
                this.setVelocity(0,0);
            }
            if(keycode == this.controlDown){
                this.setVelocity(0,0);
            }
            if(keycode == this.controlLeft){
                this.setVelocity(0,0);
            }
            if(keycode == this.controlRight){
                this.setVelocity(0,0);
            }
        }
    }
}


function isOverlap(gameObject1, gameObject2){
    let leftRightOverlap = gameObject1.right > gameObject2.left && gameObject1.left < gameObject2.right;
    let topBottomOverlap = gameObject1.top < gameObject2.bottom && gameObject1.bottom > gameObject2.top;
    if (leftRightOverlap && topBottomOverlap){
        return true;
    }
    return false;
}

class Game{
    constructor(document){
        this.context = document.getElementById('canvas').getContext('2d');
        this.backgroundList = [];
        this.gameObjectList = [];
    }

    render(){
        this.backgroundList.forEach(gameObj => {
            this.context.fillStyle = gameObj.color;
            this.context.fillRect(gameObj.position.x, gameObj.position.y, gameObj.size.x, gameObj.size.y);
        });
        this.gameObjectList.forEach(gameObj => {
            this.context.fillStyle = gameObj.color;
            this.context.fillRect(gameObj.position.x, gameObj.position.y, gameObj.size.x, gameObj.size.y);
        });
    }

    update(){
        this.gameObjectList.forEach(gameObj => {
            gameObj.lastPosition.x = gameObj.position.x
            gameObj.lastPosition.y = gameObj.position.y
            gameObj.position.x += gameObj.velocity.x;
            gameObj.position.y += gameObj.velocity.y;
        })
        this.gameObjectList.forEach(gameObj =>{
            
        })
    }

    addGameObject(gameObj){
        this.gameObjectList.push(gameObj);
    }

    addBackground(background){
        this.backgroundList.push(background);
    }

    addGameObjectList(gameObjList){
        gameObjList.forEach(gameObj =>{
            this.gameObjectList.push(gameObj);
        });
    }

    addBackgroundList(backgroundList){
        backgroundList.forEach(background =>{
            this.backgroundList.push(background);
        });
    }

    addPlayer(player){
        this.gameObjectList.push(player);
        document.addEventListener('keydown',function(event){
            player.execute(event.code, event.type);
        });
        document.addEventListener('keyup',function(event){
            player.execute(event.code, event.type);
        });
    }
}

function start(game){
    function frame(time){
        game.update();
        game.render();
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

const player1ControlDefine = {
    'up': 'ArrowUp',
    'down':'ArrowDown',
    'left':'ArrowLeft',
    'right':'ArrowRight',
}
const player2ControlDefine = {
    'up': 'KeyW',
    'down':'KeyS',
    'left':'KeyA',
    'right':'KeyD',
}
const player3ControlDefine = {
    'up': 'Numpad8',
    'down':'Numpad2',
    'left':'Numpad4',
    'right':'Numpad6',
}

const game = new Game(this.document);

const player = new Player(100, 100);
const player2 = new Player(200, 200);
const player3 = new Player(300,300);
player.addControl(player1ControlDefine);
player2.addControl(player2ControlDefine);
player3.addControl(player3ControlDefine);

const background = new GameObject(0,0,canvas.width, canvas.height, "black");
const wall1 = new GameObject(0, 0, canvas.width, 10, "green");
const wall2 = new GameObject(0, 490, canvas.width, 10, "green");
const wall3 = new GameObject(0, 0, 10, canvas.height, "green");
const wall4 = new GameObject(490, 0, 10, canvas.height, "green");
let gameobj = new GameObject(80,40,30,10,"red");
let gameobj2 = new GameObject(100,30,40,60,"blue");
const gameObjList = [player, player2, player3, wall1, wall2, wall3, wall4, gameobj, gameobj2];

game.addPlayer(player);
game.addPlayer(player2);
game.addPlayer(player3);
game.addBackground(background);
game.addGameObjectList(gameObjList);
start(game);
