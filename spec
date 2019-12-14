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
    +destroy()
    +updateAll()
    +renderAll()

GameObject
    xyPosition:     Vector
    width,height:  Vector
    velocity:       Vector

    color:         string(color)
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

    +subscribeKeyboard():
    +notifyAll():  notifies subscribers about events