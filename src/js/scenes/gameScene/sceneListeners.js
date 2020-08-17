import eventsCenter from '../../eventsCenter';
import { createSoundFadeOut } from '../../objects/soundSensors/soundEffects';

const heightPerScreen = 450;

function resize() {
  this.cameras.main.setZoom(this.cameras.main.width / heightPerScreen);
}

function pause() {
  this.scene.pause();
  this.scene.launch('pause-menu');
}

function gameOver() {
  const soundFadeOut = createSoundFadeOut(this, this.music, 2500);
  soundFadeOut.play();
  this.cameras.main.fadeOut(2500);
  this.cameras.main.on('camerafadeoutcomplete', () => {
    this.scene.stop('game-bar');
    this.scene.start('final-scene');
  });
}

const addSceneListeners = (scene) => {
  resize.call(scene);
  scene.pauseKey.on('up', pause, scene);
  scene.scale.on('resize', resize, scene);

  eventsCenter.on('player-died', gameOver, scene);

  scene.events.on('resume', () => {
    scene.music.play();
    scene.soundSensors.forEach((sensor) => sensor.sound.play());
  });
  scene.events.on('pause', () => {
    scene.music.pause();
    scene.soundSensors.forEach((sensor) => sensor.sound.pause());
  });
  scene.events.on('shutdown', () => {
    scene.pauseKey.off('up', pause, scene);
    scene.scale.off('resize', resize, scene);
    eventsCenter.off('player-died', gameOver, scene);
    scene.music.stop();
    scene.soundSensors.forEach((sensor) => sensor.sound.stop());
  });
};

export default addSceneListeners;
