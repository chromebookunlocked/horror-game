export default class PsychologicalProfiler {
  constructor() {
    this.profile = {
      empathy: 0,
      detachment: 0,
      humor: 0,
      anxiety: 0,
      dominance: 0,
      compliance: 0
    };

    this.totalChoices = 0;
    this.choiceHistory = [];
  }

  recordChoice(trait) {
    if (this.profile.hasOwnProperty(trait)) {
      this.profile[trait]++;
      this.totalChoices++;
      this.choiceHistory.push({ trait, timestamp: Date.now() });
    }
  }

  getProfile() {
    // Normalize scores to percentages
    const normalizedProfile = {};

    Object.keys(this.profile).forEach(trait => {
      if (this.totalChoices > 0) {
        normalizedProfile[trait] = Math.round(
          (this.profile[trait] / this.totalChoices) * 100
        );
      } else {
        normalizedProfile[trait] = 0;
      }
    });

    return normalizedProfile;
  }

  getDominantTrait() {
    let maxTrait = null;
    let maxScore = -1;

    Object.entries(this.profile).forEach(([trait, score]) => {
      if (score > maxScore) {
        maxScore = score;
        maxTrait = trait;
      }
    });

    return maxTrait;
  }

  getProfileDescription() {
    const profile = this.getProfile();
    const dominant = this.getDominantTrait();

    const descriptions = {
      empathy: 'You showed deep concern for others. A protector at heart.',
      detachment: 'You observed from a distance. Distant and analytical.',
      humor: 'You deflected with jokes. A coping mechanism.',
      anxiety: 'You worried throughout. Overthinking was your way.',
      dominance: 'You asserted control. A natural leader.',
      compliance: 'You went along with the group. A follower.'
    };

    return {
      profile,
      dominantTrait: dominant,
      description: descriptions[dominant] || ''
    };
  }

  reset() {
    this.profile = {
      empathy: 0,
      detachment: 0,
      humor: 0,
      anxiety: 0,
      dominance: 0,
      compliance: 0
    };
    this.totalChoices = 0;
    this.choiceHistory = [];
  }
}
