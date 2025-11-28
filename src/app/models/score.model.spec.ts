import { Score } from './score.model';

describe('Score Model', () => {
  let score: Score;

  beforeEach(() => {
    score = new Score();
  });

  describe('Initialization', () => {
    it('should create a Score instance', () => {
      expect(score).toBeTruthy();
    });

    it('should initialize with 0 correct answers', () => {
      expect(score.getScore()).toBe(0);
    });
  });

  describe('Happy Path', () => {
    it('should increment score by 1', () => {
      score.incrementCorrect();
      expect(score.getScore()).toBe(1);
    });

    it('should increment score multiple times', () => {
      score.incrementCorrect();
      score.incrementCorrect();
      score.incrementCorrect();
      expect(score.getScore()).toBe(3);
    });

    it('should return correct score after multiple increments', () => {
      for (let i = 0; i < 10; i++) {
        score.incrementCorrect();
      }
      expect(score.getScore()).toBe(10);
    });

    it('should correctly accumulate scores', () => {
      const incrementCount = 5;
      for (let i = 0; i < incrementCount; i++) {
        score.incrementCorrect();
        expect(score.getScore()).toBe(i + 1);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle large number of increments', () => {
      for (let i = 0; i < 1000; i++) {
        score.incrementCorrect();
      }
      expect(score.getScore()).toBe(1000);
    });

    it('should not go negative', () => {
      expect(score.getScore()).toBe(0);
    });

    it('should handle consecutive getScore calls', () => {
      score.incrementCorrect();
      expect(score.getScore()).toBe(1);
      expect(score.getScore()).toBe(1);
      expect(score.getScore()).toBe(1);
    });

    it('should maintain score accuracy over time', () => {
      const expectedScores = [1, 2, 3, 4, 5];
      expectedScores.forEach((expected) => {
        score.incrementCorrect();
        expect(score.getScore()).toBe(expected);
      });
    });
  });

  describe('Score Tracking', () => {
    it('should track each increment independently', () => {
      const scores: number[] = [];
      for (let i = 0; i < 5; i++) {
        score.incrementCorrect();
        scores.push(score.getScore());
      }
      expect(scores).toEqual([1, 2, 3, 4, 5]);
    });

    it('should not reset score after getScore call', () => {
      score.incrementCorrect();
      score.incrementCorrect();
      score.getScore();
      expect(score.getScore()).toBe(2);
    });
  });

  describe('Multiple Instances', () => {
    it('should maintain separate scores for different instances', () => {
      const score1 = new Score();
      const score2 = new Score();

      score1.incrementCorrect();
      score1.incrementCorrect();
      score2.incrementCorrect();

      expect(score1.getScore()).toBe(2);
      expect(score2.getScore()).toBe(1);
    });

    it('should not affect other instances when incrementing', () => {
      const score1 = new Score();
      const score2 = new Score();
      const score3 = new Score();

      score1.incrementCorrect();
      score3.incrementCorrect();
      score3.incrementCorrect();

      expect(score1.getScore()).toBe(1);
      expect(score2.getScore()).toBe(0);
      expect(score3.getScore()).toBe(2);
    });
  });

  describe('Type Safety', () => {
    it('should return number from getScore', () => {
      const result = score.getScore();
      expect(typeof result).toBe('number');
    });

    it('should accept no parameters in incrementCorrect', () => {
      expect(() => {
        score.incrementCorrect();
      }).not.toThrow();
    });

    it('should have incrementCorrect as a method', () => {
      expect(typeof score.incrementCorrect).toBe('function');
    });

    it('should have getScore as a method', () => {
      expect(typeof score.getScore).toBe('function');
    });
  });
});
