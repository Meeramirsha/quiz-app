import { TestBed } from '@angular/core/testing';
import { HistoryService } from './history';
import { History } from '../../models/history.model';

describe('HistoryService', () => {
  let service: HistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    localStorage.clear();
    service = TestBed.inject(HistoryService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with empty history when localStorage is empty', () => {
      const history = service.getHistory();
      expect(history).toEqual([]);
    });
  });

  describe('Adding History Entries', () => {
    it('should add a history entry', () => {
      service.addHistoryEntry('Math Quiz', 8, 10);
      const history = service.getHistory();
      expect(history.length).toBe(1);
      expect(history[0].quizTitle).toBe('Math Quiz');
      expect(history[0].score).toBe(8);
      expect(history[0].maxScore).toBe(10);
    });

    it('should add multiple history entries', () => {
      service.addHistoryEntry('Quiz 1', 5, 10);
      service.addHistoryEntry('Quiz 2', 7, 10);
      service.addHistoryEntry('Quiz 3', 9, 10);
      const history = service.getHistory();
      expect(history.length).toBe(3);
    });

    it('should persist history entry to localStorage', () => {
      service.addHistoryEntry('Science Quiz', 6, 10);
      const stored = localStorage.getItem('quizHistory');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.length).toBe(1);
      expect(parsed[0].quizTitle).toBe('Science Quiz');
    });

    it('should create date with correct Date type', () => {
      service.addHistoryEntry('History Quiz', 10, 10);
      const history = service.getHistory();
      expect(history[0].date instanceof Date).toBe(true);
    });
  });

  describe('Retrieving History', () => {
    it('should return history sorted by most recent first', () => {
      service.addHistoryEntry('Quiz 1', 5, 10);
      
      service.addHistoryEntry('Quiz 2', 7, 10);
      
      service.addHistoryEntry('Quiz 3', 9, 10);
      
      const history = service.getHistory();
      expect(history[0].quizTitle).toBe('Quiz 3');
      expect(history[1].quizTitle).toBe('Quiz 2');
      expect(history[2].quizTitle).toBe('Quiz 1');
    });

    it('should not modify original history array', () => {
      service.addHistoryEntry('Quiz 1', 5, 10);
      const history1 = service.getHistory();
      const history2 = service.getHistory();
      expect(history1).not.toBe(history2);
    });

    it('should return empty array when no history exists', () => {
      const history = service.getHistory();
      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBe(0);
    });
  });

  describe('LocalStorage Persistence', () => {
    it('should load history from localStorage on service creation', () => {
      const historyData = [
        new History('Loaded Quiz', 8, new Date(), 10)
      ];
      localStorage.setItem('quizHistory', JSON.stringify(historyData));
      
      const newService = new HistoryService();
      const history = newService.getHistory();
      expect(history.length).toBe(1);
      expect(history[0].quizTitle).toBe('Loaded Quiz');
    });

    it('should parse date strings from localStorage', () => {
      const historyData = [
        {
          quizTitle: 'Quiz',
          score: 8,
          date: '2025-01-01T12:00:00.000Z',
          maxScore: 10
        }
      ];
      localStorage.setItem('quizHistory', JSON.stringify(historyData));
      
      const newService = new HistoryService();
      const history = newService.getHistory();
      expect(history[0].date instanceof Date).toBe(true);
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem('quizHistory', 'invalid json {');
      
      expect(() => {
        new HistoryService();
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle adding multiple entries in quick succession', () => {
      for (let i = 0; i < 5; i++) {
        service.addHistoryEntry(`Quiz ${i}`, i, 10);
      }
      const history = service.getHistory();
      expect(history.length).toBe(5);
    });

    it('should handle perfect score', () => {
      service.addHistoryEntry('Perfect Quiz', 10, 10);
      const history = service.getHistory();
      expect(history[0].score).toBe(10);
      expect(history[0].maxScore).toBe(10);
    });

    it('should handle zero score', () => {
      service.addHistoryEntry('Failed Quiz', 0, 10);
      const history = service.getHistory();
      expect(history[0].score).toBe(0);
    });

    it('should handle long quiz titles', () => {
      const longTitle = 'A'.repeat(100);
      service.addHistoryEntry(longTitle, 5, 10);
      const history = service.getHistory();
      expect(history[0].quizTitle).toBe(longTitle);
    });
  });
});
