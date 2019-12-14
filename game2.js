"use strict"
class InputManager{
    constructor(){
        this.keyboardSubscribers = [];
        this.mouseSubscribers = [];
        document.addEventListener('keydown',this.notifyKeyboardSubscribers);
        document.addEventListener('keyup',this.notifyKeyboardSubscribers);
        document.addEventListener('mousedown',this.notifyMouseSubscribers);
    }

    subscribeKeyboard(subscriber){
        this.keyboardSubscribers.push(subscriber);
    }

    subscribeMouse(subscriber){
        this.mouseSubscribers.push(subscriber);
    }

    notifyKeyboardSubscribers(event){
        this.keyboardSubscribers.forEach(subscriber =>{
            subscriber.notify(event);
        });
    }

    notifyMouseSubscribers(event){
        this.mouseSubscribers.forEach(subscriber =>{
            subscriber.notify(event);
        });
    }
}

class Subscriber{
    notify(event){
        console.log(`${event.code}, ${event.type}`);
    }
}

const inputManager = new InputManager(document);
const subscriber1 = new Subscriber();
inputManager.subscribeKeyboard(subscriber1);
