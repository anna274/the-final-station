import InteractionObject from '../objects/interactionObjects/InteractionObject';
import { restock } from './playerStates/stats';
import eventsCenter from '../eventsCenter';

export default class ObjectInteraction {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    this.activatedObjects = [];
    this.activeObject = null;

    scene.matterCollision.addOnCollideStart({
      objectA: [this.player.sensors.objectSensor],
      callback: (eventData) => {
        const { gameObjectB } = eventData;
        if (gameObjectB instanceof InteractionObject && !gameObjectB.activated) {
          this.onObjectCollide(gameObjectB);
        }
      },
      context: this,
    });
    scene.matterCollision.addOnCollideEnd({
      objectA: [this.player.sensors.objectSensor],
      callback: (eventData) => {
        const { gameObjectB } = eventData;
        if (gameObjectB instanceof InteractionObject && gameObjectB.activated) {
          this.onObjectCollideEnd(gameObjectB);
        }
      },
      context: this,
    });

    this.interactKey = this.scene.input.keyboard.addKey('E');
    this.interactKey.on('up', this.interact, this);
    eventsCenter.on('player-died', () => {
      this.interactKey.off('up', this.interact, this);
    });
  }

  onObjectCollide(object) {
    if (this.activeObject) {
      this.activatedObjects.push(this.activeObject);
      this.activeObject.deactivate();
    }
    this.activeObject = object;
    this.activeObject.activate();
    object.setActivated(true);
  }

  onObjectCollideEnd(object) {
    if (object === this.activeObject) {
      this.activeObject.deactivate();
      this.changeActiveObject();
    } else {
      const objectIndex = this.activatedObjects.findIndex((el) => el === object);
      this.activatedObjects.splice(objectIndex, 1);
    }
    object.setActivated(false);
  }

  interact() {
    if (this.activeObject) {
      const interactionInfo = this.activeObject.interact();
      this.processInteraction(interactionInfo);
      this.changeActiveObject();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  processInteraction(info) {
    if (info.type === 'storage') {
      restock(info.items);
    }
  }

  changeActiveObject() {
    if (this.activatedObjects.length !== 0) {
      this.activeObject = this.activatedObjects.pop();
      this.activeObject.activate();
    } else {
      this.activeObject = null;
    }
  }
}
