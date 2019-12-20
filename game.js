"use strict";
class Vector{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}
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
    update(){
        this.lastPosition.x = this.position.x;
        this.lastPosition.y = this.position.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
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
class Player extends GameObject{
    constructor(x, y, color, layer, tag){
        super(x,y,10,10, color, layer, tag);
        this.controlDefine = null;
        this.speed = 3;
        this.pickUpTime = null;
    }
    setState(state){
        if(state == 'player'){
            this.color = 'blue';
            this.tag = 'player';
        }else if(state == 'tagger'){
            this.color = 'red';
            this.tag = 'tagger';
        }
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
    update(time){
        this.lastPosition.x = this.position.x;
        this.lastPosition.y = this.position.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}
class Pickup extends GameObject{
    constructor(x, y){
        super(x, y, 5, 5, 'yellow','pickup');
    }
}
class PickupFactory{
    produce(){
        let x_pos = Math.floor(Math.random()*400) + 100;
        let y_pos = Math.floor(Math.random()*400) + 100;
        return new Pickup(x_pos,y_pos);
    }
}
class TimeCounter extends GameObject{
    constructor(gameObject, callBackAction, timeCountDown){
        super(0,520,100,100,'white', 'timecounter');
        this.gameObject = gameObject;
        this.fullTime = timeCountDown;
        this.timeCountDown = timeCountDown;
        this.callBackAction = callBackAction;
    }
    update(time){
        this.timeCountDown -= 1
    }
    reset(){
        this.timeCountDown = this.fullTime;
    }
    timeUp(){
        if(this.timeCountDown < 0){
            return true;
        }
        else{
            return false;
        }
    }
    action(){
        this.callBackAction(this.gameObject);
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
    add(gameObj){
        this.gameObjectList.push(gameObj);
    }

    addAll(gameObjList){
        gameObjList.forEach(gameObj =>{
            this.gameObjectList.push(gameObj);
        });
    }

    addControllable(controllable){
        this.gameObjectList.push(controllable);
        document.addEventListener('keydown',function(event){
            controllable.execute(event.code, event.type);
        });
        document.addEventListener('keyup',function(event){
            controllable.execute(event.code, event.type);
        });
    }

    render(){
        let toRender = []
        let layers = {
            0:[],1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[]
        };

        this.gameObjectList.forEach(gameObj => {
            layers[this.renderDefine[gameObj.tag]].push(gameObj);
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

    update(time){
        this.gameObjectList.forEach(gameObj => {
            gameObj.update(time); 
            if(gameObj.tag == 'timecounter'){
                console.log(gameObj);
            }
        })
        for(let i=0; i < this.gameObjectList.length; i++){
            for(let j=i+1; j<this.gameObjectList.length; j++){
                if(this.isOverlap(this.gameObjectList.index(i), this.gameObjectList.index(j))){
                    this.interact(this.gameObjectList.index(i), this.gameObjectList.index(j), time)
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

    interact(gameObject1, gameObject2, time){
        let gameObjectPair = new Pair(gameObject1, gameObject2)
        if(gameObjectPair.matchTag('background', 'background')){
            //do nothing
        }
        else if(gameObjectPair.matchTag('ui', 'timecounter')){
            let timecounter = gameObjectPair.objectWithTag('timecounter');
            if(timecounter.timeUp()){
                timecounter.action();
                this.gameObjectList.pop(timecounter);
            }
        }
        else if(gameObjectPair.matchTag('player', 'tagger')){
            let playerObj = gameObjectPair.objectWithTag('player');
            this.gameObjectList.pop(playerObj);
        }
        else if(gameObjectPair.matchTag('player', 'pickup')){
            let pickupObj = gameObjectPair.objectWithTag('pickup');
            let playerObj = gameObjectPair.objectWithTag('player');
            this.gameObjectList.pop(pickupObj);
            playerObj.setState('tagger');
            const timeCounter = new TimeCounter(playerObj,gameObj=>{gameObj.setState('player')}, 300);
            this.gameObjectList.push(timeCounter);

            let x_pos = Math.floor(Math.random()*400) + 100;
            let y_pos = Math.floor(Math.random()*400) + 100;
            let newPickup = new Pickup(x_pos,y_pos);
            this.gameObjectList.push(newPickup);
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
        else if(gameObjectPair.matchTag('pickup', 'wall')){
            let pickObj = gameObjectPair.objectWithTag('pickup');
            this.gameObjectList.pop(pickObj);
            let x_pos = Math.floor(Math.random()*400) + 100;
            let y_pos = Math.floor(Math.random()*400) + 100;
            let newPickup = new Pickup(x_pos,y_pos);
            this.gameObjectList.push(newPickup);
        }
    }
}
function start(game){
    function frame(time){
        game.update(time);
        game.render();
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

const player1ControlDefine = {
    'up': 'KeyW',
    'down':'KeyS',
    'left':'KeyA',
    'right':'KeyD',
}
const player2ControlDefine = {
    'up': 'ArrowUp',
    'down':'ArrowDown',
    'left':'ArrowLeft',
    'right':'ArrowRight',
}
const renderDefine = {
    null:0,
    "timecounter":1,
    "background":2,
    "wall":3,
    "pickup":4,
    "player":5,
    "tagger":5,
    "ui":6,
}
const player3ControlDefine = {
    'up': 'Numpad8',
    'down':'Numpad2',
    'left':'Numpad4',
    'right':'Numpad6',
}


const game = new Game(document, renderDefine);
const gameWidth = 520;
const gameHeight = 520;

const background = new GameObject(0,0,gameWidth, gameHeight, "black","background");
const border1 = new GameObject(0, 0, gameWidth, 10, "green", "wall");
const border2 = new GameObject(0, gameWidth-10, gameWidth, 10, "green", "wall");
const border3 = new GameObject(0, 0, 10, gameHeight, "green", "wall");
const border4 = new GameObject(gameHeight-10, 0, 10, gameHeight, "green", "wall");
const setups = [background, border1, border2, border3, border4]

let wall1 = new GameObject(100,100,10,100,"green", "wall");
let wall2 = new GameObject(200,100,10,100,"green", "wall");
let wall3 = new GameObject(300,100,10,100,"green", "wall");
let wall4 = new GameObject(400,100,10,100,"green", "wall");
const obstacles = [wall1, wall2, wall3, wall4]

let wall5 = new GameObject(100,300,10,100,"green", "wall");
let wall6 = new GameObject(200,300,10,100,"green", "wall");
let wall7 = new GameObject(300,300,10,100,"green", "wall");
let wall8 = new GameObject(400,300,10,100,"green", "wall");
const obstacles2 = [wall5, wall6, wall7, wall8]

const uiBackground = new GameObject(0,gameHeight,gameWidth,100,"black","ui");
game.add(uiBackground);

let x_pos = Math.floor(Math.random()*400) + 100;
let y_pos = Math.floor(Math.random()*400) + 100;
const pickup = new Pickup(x_pos, y_pos);

game.add(pickup);
game.addAll(setups);
game.addAll(obstacles);
game.addAll(obstacles2);
const player = new Player(20, 20, "blue", "player");
const player2 = new Player(480, 480, "blue", "player");
const player3 = new Player(500, 10, "blue", 'player');
player.addControl(player1ControlDefine);
player2.addControl(player2ControlDefine);
player3.addControl(player3ControlDefine);
game.addControllable(player);
game.addControllable(player2);
//game.addControllable(player3);
game.add(background);
start(game);














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