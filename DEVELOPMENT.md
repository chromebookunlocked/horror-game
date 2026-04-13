# Development Guide

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Starts webpack dev server on `http://localhost:8080`

## Build for Web

```bash
npm run build
```

Creates optimized build in `dist/`

## Build for Desktop (EXE)

```bash
npm run build:exe
```

Creates Windows executable using Electron + electron-builder

## Project Structure

```
horror-game/
├── src/
│   ├── index.js                 # Entry point
│   ├── scenes/
│   │   └── GameScene.js         # Main game scene
│   └── systems/
│       ├── DialogueManager.js   # Dialogue tree handler
│       └── PsychologicalProfiler.js  # Profile tracking
├── dialogue/
│   ├── scene1.json              # Scene 1 dialogue tree
│   ├── scene2.json              # Scene 2 dialogue tree
│   └── scene3.json              # Scene 3 dialogue tree
├── public/
│   └── index.html               # HTML template
├── webpack.config.js            # Webpack config
└── package.json                 # Dependencies
```

## Key Systems

### DialogueManager
- Loads and displays dialogue entries
- Typewriter effect for text reveal
- Choice button rendering
- Auto-advance to next dialogue

### PsychologicalProfiler
- Records player choices silently
- Tracks 6 traits (empathy, detachment, humor, anxiety, dominance, compliance)
- Normalizes scores to percentages
- Identifies dominant trait

### GameScene
- Orchestrates scene flow
- Integrates DialogueManager and PsychologicalProfiler
- Handles scene transitions
- Displays ending with profile summary

## Dialogue Format

Each scene JSON has structure:
```json
{
  "scene_id": "scene_1",
  "dialogue_entries": [
    {
      "id": "1_001",
      "character": "Character Name or Narrator",
      "text": "Dialogue text",
      "stage_direction": "Optional description",
      "choices": [
        {
          "choice_id": "1_c_a",
          "text": "Choice text",
          "next_dialogue_id": "1_002a",
          "psych_track": "empathy"  // Hidden tracking
        }
      ]
    }
  ]
}
```

## Configuration

### Typewriter Speed
Edit `DialogueManager.js`:
```javascript
this.typingSpeed = 50; // milliseconds per character
```

### Screen Resolution
Edit `src/index.js`:
```javascript
width: 1280,
height: 720
```

### Choice Button Styling
Edit `DialogueManager.js` `createChoiceButton()` method

## Next Steps

1. Install dependencies: `npm install`
2. Convert corrected JSON dialogue files to match scene structure
3. Add avatar sprites for characters
4. Add audio (typing sounds, ambient, music)
5. Customize UI styling
6. Test gameplay flow
7. Build EXE for distribution

## Notes

- All dialogue is in Polish with authentic Warsaw slang
- Psychological profiling is invisible to player
- Choices have no visible "good/bad" indicators
- Game targets ~20 minute playtime
- Multiple playthroughs reveal different paths and endings

---

**Status:** Foundation complete, ready for asset integration
