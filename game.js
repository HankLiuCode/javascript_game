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
    constructor(x, y, width, height, color, tag = null){
        this.lastPosition = new Vector(x,y);
        this.position = new Vector(x,y);
        this.velocity = new Vector(0, 0);
        this.size = new Vector(width, height);
        this.color = color; 
        this.tag = tag;
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
        this.controlDefine = null;
        this.speed = 3;
    }
    addControl(controlDefine){
        this.controlDefine = controlDefine;
    }
    movement(keycode, type){
        if(type == 'keydown'){
            if(keycode == this.controlDefine['up']){
                this.setVelocityY(-this.speed);
            }
            if(keycode == this.controlDefine['down']){
                this.setVelocityY(this.speed);
            }
            if(keycode == this.controlDefine['left']){
                this.setVelocityX(-this.speed);
            }
            if(keycode == this.controlDefine['right']){
                this.setVelocityX(this.speed);
            }
        }
        if(type == 'keyup'){
            if(keycode == this.controlDefine['up']){
                this.setVelocityY(0);
            }
            if(keycode == this.controlDefine['down']){
                this.setVelocityY(0);
            }
            if(keycode == this.controlDefine['left']){
                this.setVelocityX(0);
            }
            if(keycode == this.controlDefine['right']){
                this.setVelocityX(0);
            }
        }
    }

    execute(keycode, type){
        this.movement(keycode, type);
    }
}
class GameObjectList{
    constructor(){
        this.length = 0
        this.usedId = new Set();
        this.list = [];
    }

    push(gameObj){
        let id = Math.floor(Math.random()*90000) + 10000;
        while(this.usedId.has(id)){
            id = Math.floor(Math.random()*90000) + 10000;
        }
        this.usedId.add(id);
        gameObj.setId(id);
        this.list.push(gameObj);
        this.length += 1;
    }

    pushAll(gameObjList){
        gameObjList.forEach(gameObj =>{
            this.list.push(gameObj);
            this.length += 1;
        });
    }

    pop(gameObjToDestroy){
        let index = this.list.findIndex(gameObj => gameObj.id == gameObjToDestroy.id);
        console.log(index);
        console.log(gameObjToDestroy);
        this.list.splice(index, 1);
        this.length -= 1;
    }

    forEach(callbackFunc){
        this.list.forEach(gameObj =>{
            callbackFunc(gameObj);
        })
    }
    index(i){
        return this.list[i]
    }
}

class Game{
    constructor(document, renderDefine){
        this.context = document.getElementById('canvas').getContext('2d');
        this.gameObjectList = new GameObjectList();
        this.renderDefine = renderDefine;
    }

    addAll(gameObjList){
        gameObjList.forEach(gameObj =>{
            this.gameObjectList.push(gameObj);
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

    render(){
        let toRender = []
        let layers = {
            0:[],1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[]
        };
        this.gameObjectList.forEach(gameObj => {
            if (this.renderDefine[gameObj.tag]==undefined){
                console.log(gameObj);
            }
            layers[0].push(gameObj);
        });
        for(let i=0; i < Object.keys(layers).length; i++){
            toRender.push(layers[i]);
        }
        toRender.forEach(layers =>{
            layers.forEach(gameObj=>{
                this.context.fillStyle = gameObj.color;
                this.context.fillRect(gameObj.position.x, gameObj.position.y, gameObj.size.x, gameObj.size.y);
            });
        });
    }

    update(){
        this.gameObjectList.forEach(gameObj => {
            gameObj.lastPosition.x = gameObj.position.x;
            gameObj.lastPosition.y = gameObj.position.y;
            gameObj.position.x += gameObj.velocity.x;
            gameObj.position.y += gameObj.velocity.y;
        })
        for(let i=0; i < this.gameObjectList.length; i++){
            for(let j=i+1; j<this.gameObjectList.length; j++){
                if(this.isOverlap(this.gameObjectList.index(i), this.gameObjectList.index(j))){
                    this.interact(this.gameObjectList.index(i), this.gameObjectList.index(j))
                }
            }
        }
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
        let gameObjectPair = new Pair(gameObject1, gameObject2)
        if(gameObjectPair.matchTag('background', 'background')){
            //do nothing
        }
        else if(gameObjectPair.matchTag('player', 'tagger')){
            let playerObj = gameObjectPair.objectWithTag('player');
            this.gameObjectList.pop(playerObj);
        }
        else if(gameObjectPair.matchTag('player', 'pickup')){
            let pickupObj = gameObjectPair.objectWithTag('pickup');
            let playerObj = gameObjectPair.objectWithTag('player');
            this.gameObjectList.pop(pickupObj);
            playerObj.color ='red';
            playerObj.tag = 'tagger';
        }
        else if(gameObjectPair.matchTag('player', 'wall')){
            let playerObj = gameObjectPair.objectWithTag('player');
            playerObj.position.x = playerObj.lastPosition.x;
            playerObj.position.y = playerObj.lastPosition.y;
        }
        else if(gameObjectPair.matchTag('tagger', 'wall')){
            let playerObj = gameObjectPair.objectWithTag('tagger');
            playerObj.position.x = playerObj.lastPosition.x;
            playerObj.position.y = playerObj.lastPosition.y;
        }
    }
}
class Pair{
    constructor(gameObject1, gameObject2){
        this.gameObject1 = gameObject1;
        this.gameObject2 = gameObject2;
    }
    matchTag(tag1, tag2){
        if(this.gameObject1.tag==tag1 && this.gameObject2.tag == tag2){
           return true;
        }
        if(this.gameObject2.tag==tag1 && this.gameObject1.tag == tag2){
            return true;
        }
        return false;
    }
    objectWithTag(tag){
        if(this.gameObject1.tag==tag && this.gameObject2.tag==tag){
            return [this.gameObject1, this.gameObject2]
        }
        if(this.gameObject1.tag==tag){
            return this.gameObject1;
        }
        if(this.gameObject2.tag==tag){
            return this.gameObject2;
        }
        return null;
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
const renderDefine = {
    null:0,
    "background":1,
    "wall":2,
    "pickup":3,
    "player":4,
    "tagger":4,
}
const game = new Game(this.document, renderDefine);

const background = new GameObject(0,0,canvas.width, canvas.height, "black","background");
const border1 = new GameObject(0, 0, canvas.width, 10, "green", "wall");
const border2 = new GameObject(0, 490, canvas.width, 10, "green", "wall");
const border3 = new GameObject(0, 0, 10, canvas.height, "green", "wall");
const border4 = new GameObject(490, 0, 10, canvas.height, "green", "wall");

let wall1 = new GameObject(100,50,10,50,"blue", "wall");
let wall2 = new GameObject(200,50,10,50,"blue", "wall");
let wall3 = new GameObject(300,50,10,50,"blue", "wall");
let wall4 = new GameObject(400,50,10,50,"blue", "wall");

let pickup = new GameObject(350,350,5,5,"yellow", "pickup");
const setups = [background, border1, border2, border3, border4]
const obstacles = [wall1, wall2, wall3, wall4]
const pickups = [pickup];
game.addAll(setups);
game.addAll(obstacles);
game.addAll(pickups);


const player = new Player(200, 200, "white", "player");
const player2 = new Player(300, 300, "white", "player");
player.addControl(player1ControlDefine);
player2.addControl(player2ControlDefine);
game.addPlayer(player);
game.addPlayer(player2);
start(game);
