import Phaser from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';

import BootScene from './js/scenes/bootScene/BootScene';
import MainMenu from './js/scenes/mainMenu/MainMenu';
import PauseMenu from './js/scenes/pauseMenu/PauseMenu';
import GameScene from './js/scenes/gameScene/GameScene';
import FinalScene from './js/scenes/finalScene/FinalScene';
import GameBar from './js/interface/GameBar';
import OutlinePipeline from './js/objects/interactionObjects/OutlinePipeline';

const config = {
  type: Phaser.AUTO,
  physics: {
    default: 'matter',
    matter: {
      gravity: {
        x: 0,
        y: 1,
      },
      debug: {
        renderFill: false,
        showInternalEdges: false,
        showConvexHulls: false,
        showBody: false,
        showStaticBody: false,
      },
      enableSleeping: false,
    },
  },
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin, // The plugin class
        key: 'matterCollision', // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
        mapping: 'matterCollision', // Where to store in the Scene, e.g. scene.matterCollision
      },
    ],
  },
  pixelArt: true,
  scene: [BootScene, MainMenu, GameScene, GameBar, PauseMenu, FinalScene],
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  callbacks: {
    postBoot: (game) => {
      game.renderer.addPipeline('outline', new OutlinePipeline(game));
    },
  },
};

const game = new Phaser.Game(config);

export default game;
