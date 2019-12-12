"use strict";
class Vector{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

/*
Oberserver 
input event to queue
gameobject is moving -> isoverlap 



SPEC
The Game World consists of many GameObjects, InputManager takes user input delivers input to subscriber

+start(){
    const gameworld = new GameWorld

    loop(){
        gameworld.updateAll()
        gameworld.renderAll()
    }
}

GameWorld
    GameObjects:    list

    +add()
    +updateAll()
    +renderAll()

GameObjectFactory
    +makeObject()

GameObject
    transform:  Transform
        xyPosition:     Vector
        weight,height:  Vector
        rotation:       Vector
    velocity:       Vector

    sprite:         string(color)
    tag:            string
    layer:          int
    id:             int

    +update()

Player(Subscriber, GameObject)
    inputmanager:   InputManager
    
    +update(){

    }
    +notify()

PhysicsManager
    

InputManager
    keyboardChannelSubscribers: list
    mouseChannelSubscribers:    list

    +notifyAll():  notifies subscribers about events
*/

class GameObject{
    constructor(x, y, width, height, color, layer=null, tag=null){
        this.lastPosition = new Vector(x,y);
        this.position = new Vector(x,y);
        this.velocity = new Vector(0, 0);
        this.size = new Vector(width, height);
        this.color = color; 
        this.tag = tag;
        this.layer = layer;
        this.id = null;
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
    setVelocityX(x){
        this.velocity.x = x;
    }
    setVelocityY(y){
        this.velocity.y = y;
    }
    setId(id){
        this.id = id;
    }
}

class Player extends GameObject{
    constructor(x, y, color, layer, tag){
        super(x,y,10,10, color, layer, tag);
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
                this.setVelocityY(-this.speed);
            }
            if(keycode == this.controlDown){
                this.setVelocityY(this.speed);
            }
            if(keycode == this.controlLeft){
                this.setVelocityX(-this.speed);
            }
            if(keycode == this.controlRight){
                this.setVelocityX(this.speed);
            }
        }
        if(type == 'keyup'){
            if(keycode == this.controlUp){
                this.setVelocityY(0);
            }
            if(keycode == this.controlDown){
                this.setVelocityY(0);
            }
            if(keycode == this.controlLeft){
                this.setVelocityX(0);
            }
            if(keycode == this.controlRight){
                this.setVelocityX(0);
            }
        }
    }
}
class GameObjectManager{
    constructor(){
        this.usedId = new Set();
        this.gameObjectList = [];
    }

    add(gameObj){
        let id = Math.floor(Math.random()*90000) + 10000;
        while(this.usedId.has(id)){
            id = Math.floor(Math.random()*90000) + 10000;
        }
        this.usedId.add(id);
        gameObj.setId(id);
        this.gameObjectList.push(gameObj);
    }

    addList(gameObjList){
        gameObjList.forEach(gameObj =>{
            this.gameObjectList.push(gameObj);
        });
    }

    destroy(gameObjToDestroy){
        let index = this.gameObjectList.findIndex(gameObj => gameObj.id == gameObjToDestroy.id);
        console.log(index);
        console.log(gameObjToDestroy);
        this.gameObjectList.splice(index, 1);
    }
}



class Game{
    constructor(document){
        this.context = document.getElementById('canvas').getContext('2d');
        this.gameObjectManager = new GameObjectManager();
        this.renderList = [];
    }

    render(){
        let layers = {
            0:[],
            1:[],
            2:[],
            3:[],
            4:[],
            5:[],
            6:[],
            7:[],
            8:[]
        };
        this.gameObjectManager.gameObjectList.forEach(gameObj => {
            layers[gameObj.layer].push(gameObj);
        });
        for(let i=0; i < Object.keys(layers).length; i++){
            this.renderList.push(layers[i]);
        }

        this.renderList.forEach(layers =>{
            layers.forEach(gameObj=>{
                this.context.fillStyle = gameObj.color;
                this.context.fillRect(gameObj.position.x, gameObj.position.y, gameObj.size.x, gameObj.size.y);
            });
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
            this.gameObjectManager.add(gameObj);
        });
    }

    addPlayer(player){
        this.gameObjectManager.add(player);
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
        if(gameObject1.tag == 'player' && gameObject2.tag == 'tagger'){
            this.gameObjectManager.destroy(gameObject1);
        }
        else if(gameObject1.tag == 'tagger' && gameObject2.tag == 'player'){
            this.gameObjectManager.destroy(gameObject2);
        }
        else if(gameObject1.tag == 'background' || gameObject2.tag == 'background'){
            //do nothing
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


const game = new Game(this.document);

const background = new GameObject(0,0,canvas.width, canvas.height, "black",0, "background");
const border1 = new GameObject(0, 0, canvas.width, 10, "green",1, "wall");
const border2 = new GameObject(0, 490, canvas.width, 10, "green",1, "wall");
const border3 = new GameObject(0, 0, 10, canvas.height, "green",1, "wall");
const border4 = new GameObject(490, 0, 10, canvas.height, "green",1, "wall");

let wall1 = new GameObject(100,50,10,50,"blue", 1, "wall");
let wall2 = new GameObject(200,50,10,50,"blue", 1, "wall");
let wall3 = new GameObject(300,50,10,50,"blue", 1, "wall");
let wall4 = new GameObject(400,50,10,50,"blue", 1, "wall");

const gameObjList = [background, border1, border2, border3, border4, wall1, wall2, wall3, wall4];

const player = new Player(200, 200, "white", 2, "player");
const player2 = new Player(300, 300, "red", 2, "tagger");
player.addControl(player1ControlDefine);
player2.addControl(player2ControlDefine);
game.addPlayer(player);
game.addPlayer(player2);
game.addGameObjectList(gameObjList);
start(game);
