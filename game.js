"use strict";
class Vector{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

class GameObject{
    constructor(x, y, width, height, color, tag){
        this.lastPosition = new Vector(x,y);
        this.position = new Vector(x,y);
        this.velocity = new Vector(0, 0);
        this.size = new Vector(width, height);
        this.color = color; 
        this.tag = tag
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
        super(x,y,10,10, "white", "player");
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
class GameObjectManager{
    constructor(){
        this.gameObjectList = [];
    }
    addGameObject(gameObj){
        this.gameObjectList.push(gameObj);
    }

    addGameObjectList(gameObjList){
        gameObjList.forEach(gameObj =>{
            this.gameObjectList.push(gameObj);
        });
    }
    destroyGameObject(gameObj){

    }
}
class Game{
    constructor(document){
        this.context = document.getElementById('canvas').getContext('2d');
        this.gameObjectManager = new GameObjectManager();
    }

    render(){
        this.gameObjectManager.gameObjectList.forEach(gameObj => {
            this.context.fillStyle = gameObj.color;
            this.context.fillRect(gameObj.position.x, gameObj.position.y, gameObj.size.x, gameObj.size.y);
        });
    }

    update(){
        this.gameObjectManager.gameObjectList.forEach(gameObj => {
            gameObj.lastPosition.x = gameObj.position.x;
            gameObj.lastPosition.y = gameObj.position.y;
            gameObj.position.x += gameObj.velocity.x;
            gameObj.position.y += gameObj.velocity.y;
        })
        for(let i=0; i < this.gameObjectManager.gameObjectList.length; i++){
            for(let j=i+1; j<this.gameObjectManager.gameObjectList.length; j++){
                if(this.isOverlap(this.gameObjectManager.gameObjectList[i], this.gameObjectManager.gameObjectList[j])){
                    this.interact(this.gameObjectManager.gameObjectList[i], this.gameObjectManager.gameObjectList[j])
                }
            }
        }
    }

    addGameObjectList(gameObjList){
        gameObjList.forEach(gameObj =>{
            this.gameObjectManager.addGameObject(gameObj);
        });
    }

    addPlayer(player){
        this.gameObjectManager.addGameObject(player);
        document.addEventListener('keydown',function(event){
            player.execute(event.code, event.type);
        });
        document.addEventListener('keyup',function(event){
            player.execute(event.code, event.type);
        });
    }

    isOverlap(gameObject1, gameObject2){
        let leftRightOverlap = gameObject1.right > gameObject2.left && gameObject1.left < gameObject2.right;
        let topBottomOverlap = gameObject1.top < gameObject2.bottom && gameObject1.bottom > gameObject2.top;
        if (leftRightOverlap && topBottomOverlap){
            return true;
        }
        return false;
    }

    interact(gameObject1, gameObject2){
        if(gameObject1.tag == 'player' && gameObject2.tag == 'player'){
            console.log(gameObject1);
        }
        else if(gameObject1.tag == 'background' || gameObject2.tag == 'background'){
            
        }
        else{
            gameObject1.position.x = gameObject1.lastPosition.x;
            gameObject1.position.y = gameObject1.lastPosition.y;
            gameObject2.position.x = gameObject2.lastPosition.x;
            gameObject2.position.y = gameObject2.lastPosition.y;
        }
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

const background = new GameObject(0,0,canvas.width, canvas.height, "black", "background");
const border1 = new GameObject(0, 0, canvas.width, 10, "green", "wall");
const border2 = new GameObject(0, 490, canvas.width, 10, "green", "wall");
const border3 = new GameObject(0, 0, 10, canvas.height, "green", "wall");
const border4 = new GameObject(490, 0, 10, canvas.height, "green", "wall");

let wall1 = new GameObject(100,50,10,50,"blue", "wall");
let wall2 = new GameObject(200,50,10,50,"blue", "wall");
let wall3 = new GameObject(300,50,10,50,"blue", "wall");
let wall4 = new GameObject(400,50,10,50,"blue", "wall");
let wall5 = new GameObject(150,150,10,50,"blue", "wall");
let wall6 = new GameObject(250,150,10,50,"blue", "wall");
let wall7 = new GameObject(350,150,10,50,"blue", "wall");
let wall8 = new GameObject(450,150,10,50,"blue", "wall");

const gameObjList = [background, border1, border2, border3, border4, wall1, wall2, wall3, wall4, wall5, wall6, wall7, wall8];

const player = new Player(150, 100);
const player2 = new Player(250, 200);
const player3 = new Player(300,300);
player.addControl(player1ControlDefine);
player2.addControl(player2ControlDefine);
player3.addControl(player3ControlDefine);
game.addGameObjectList(gameObjList);
game.addPlayer(player);
game.addPlayer(player2);
game.addPlayer(player3);
start(game);
