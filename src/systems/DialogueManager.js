export default class DialogueManager {
  constructor(scene) {
    this.scene = scene;
    this.currentDialogueData = null;
    this.currentDialogueId = null;
    this.dialogueBox = null;
    this.choiceButtons = [];
    this.isTyping = false;
    this.typingSpeed = 50; // milliseconds per character
  }

  loadScene(sceneData) {
    this.sceneData = sceneData;
  }

  startDialogue(dialogueId = null) {
    // Start from first dialogue or specified ID
    const startId = dialogueId || this.sceneData.dialogue_entries[0].id;
    this.showDialogue(startId);
  }

  showDialogue(dialogueId) {
    // Find dialogue entry
    const entry = this.sceneData.dialogue_entries.find(d => d.id === dialogueId);
    if (!entry) {
      console.error(`Dialogue ${dialogueId} not found`);
      return;
    }

    this.currentDialogueId = dialogueId;
    this.currentDialogueData = entry;

    // Clear previous dialogue box
    if (this.dialogueBox) this.dialogueBox.destroy();
    this.clearChoices();

    // Create dialogue box with character name and text
    this.createDialogueBox(entry);

    // If there are choices, show them
    if (entry.choices && entry.choices.length > 0) {
      this.showChoices(entry.choices);
    } else {
      // Auto-advance after delay or on click
      this.scene.time.delayedCall(3000, () => {
        const nextId = this.getNextDialogueId();
        if (nextId) {
          this.showDialogue(nextId);
        } else {
          this.scene.endScene();
        }
      });
    }
  }

  createDialogueBox(entry) {
    const width = 1200;
    const height = 200;
    const x = 640;
    const y = 600;

    // Background
    const dialogueBox = this.scene.add.rectangle(x, y, width, height, 0x000000, 0.9);
    dialogueBox.setStrokeStyle(2, 0xffffff);

    // Character name
    if (entry.character !== 'Narrator') {
      const nameText = this.scene.add.text(x - width/2 + 20, y - height/2 + 15, entry.character, {
        fontSize: '20px',
        fill: '#ffff00',
        fontStyle: 'bold'
      });
    }

    // Dialogue text with typewriter effect
    const dialogueText = this.scene.add.text(x - width/2 + 20, y - height/2 + 50, '', {
      fontSize: '16px',
      fill: '#ffffff',
      wordWrap: { width: width - 40 },
      align: 'left'
    });

    // Typewriter effect
    this.typewriteText(dialogueText, entry.text);

    this.dialogueBox = dialogueBox;
    this.dialogueText = dialogueText;
  }

  typewriteText(textObj, text) {
    this.isTyping = true;
    let charIndex = 0;

    const typeInterval = this.scene.time.addTimer({
      delay: this.typingSpeed,
      callback: () => {
        if (charIndex < text.length) {
          textObj.text += text[charIndex];
          charIndex++;
        } else {
          typeInterval.remove();
          this.isTyping = false;
        }
      },
      loop: true
    });
  }

  showChoices(choices) {
    const choiceX = 640;
    let choiceY = 480;

    choices.forEach((choice, index) => {
      const button = this.createChoiceButton(
        choiceX,
        choiceY + index * 50,
        choice.text,
        choice
      );
      this.choiceButtons.push(button);
    });
  }

  createChoiceButton(x, y, text, choiceData) {
    const button = this.scene.add.rectangle(x, y, 800, 40, 0x1a1a1a);
    button.setStrokeStyle(1, 0xaaaaaa);
    button.setInteractive();

    const buttonText = this.scene.add.text(x - 380, y - 8, `> ${text}`, {
      fontSize: '14px',
      fill: '#ffffff'
    });

    button.on('pointerover', () => {
      button.setFillStyle(0x333333);
      buttonText.setFill('#ffff00');
    });

    button.on('pointerout', () => {
      button.setFillStyle(0x1a1a1a);
      buttonText.setFill('#ffffff');
    });

    button.on('pointerdown', () => {
      this.scene.handleChoice(choiceData);
    });

    return button;
  }

  clearChoices() {
    this.choiceButtons.forEach(btn => btn.destroy());
    this.choiceButtons = [];
  }

  continueToDialogue(nextId) {
    this.showDialogue(nextId);
  }

  getNextDialogueId() {
    // Find the next non-choice dialogue entry
    const currentIndex = this.sceneData.dialogue_entries.findIndex(
      d => d.id === this.currentDialogueId
    );

    if (currentIndex < this.sceneData.dialogue_entries.length - 1) {
      return this.sceneData.dialogue_entries[currentIndex + 1].id;
    }

    return null;
  }
}
