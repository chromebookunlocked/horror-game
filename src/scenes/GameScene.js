import Phaser from 'phaser';
import DialogueManager from '../systems/DialogueManager';
import PsychologicalProfiler from '../systems/PsychologicalProfiler';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Load dialogue data
    this.load.json('scene1', 'dialogue/scene1.json');
    this.load.json('scene2', 'dialogue/scene2.json');
    this.load.json('scene3', 'dialogue/scene3.json');
  }

  create() {
    // Initialize systems
    this.dialogueManager = new DialogueManager(this);
    this.profiler = new PsychologicalProfiler();

    // Initialize scene
    this.currentScene = 1;
    this.loadScene(1);
  }

  loadScene(sceneNumber) {
    const sceneKey = `scene${sceneNumber}`;
    const sceneData = this.cache.json.get(sceneKey);
    
    if (!sceneData) {
      console.error(`Scene ${sceneNumber} not found`);
      return;
    }

    this.dialogueManager.loadScene(sceneData);
    this.dialogueManager.startDialogue();
  }

  handleChoice(choiceData) {
    // Track psychological profile
    if (choiceData.psych_track) {
      this.profiler.recordChoice(choiceData.psych_track);
    }

    // Continue dialogue
    this.dialogueManager.continueToDialogue(choiceData.next_dialogue_id);
  }

  endScene() {
    // Transition to next scene or end game
    if (this.currentScene < 3) {
      this.currentScene++;
      this.loadScene(this.currentScene);
    } else {
      this.showEndingCredits();
    }
  }

  showEndingCredits() {
    // Show final credits with psychological profile summary
    const profile = this.profiler.getProfile();
    console.log('Final Psychological Profile:', profile);
    
    // Display credits...
    this.add.text(640, 360, 'CHAPTER 1 ENDS', {
      fontSize: '48px',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
  }
}
