import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { QuizService } from './quiz';
import { Quiz } from '../../models/quiz.model';
import { Question } from '../../models/question.model';

describe('QuizService', () => {
  let service: QuizService;
  let httpMock: HttpTestingController;

  const mockQuestions: Question[] = [
    new Question('Q1', [
      { text: 'A', isCorrect: true },
      { text: 'B', isCorrect: false }
    ]),
    new Question('Q2', [
      { text: 'X', isCorrect: false },
      { text: 'Y', isCorrect: true }
    ])
  ];

  const mockQuizzes: Quiz[] = [
    new Quiz('Quiz 1', mockQuestions),
    new Quiz('Quiz 2', mockQuestions)
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QuizService]
    });

    service = TestBed.inject(QuizService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize score object', () => {
      expect(service.getScore()).toBeTruthy();
    });

    it('should start with score of 0', () => {
      expect(service.getScore().getScore()).toBe(0);
    });
  });

  describe('Quiz Loading', () => {
    it('should load quizzes from JSON file', async () => {
      const promise = service.getQuizzes();
      
      const req = httpMock.expectOne('quizzes.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockQuizzes);

      const quizzes = await promise;
      expect(quizzes.length).toBe(2);
    });

    it('should load single quiz by index', async () => {
      const promise = service.getQuiz(0);
      
      const req = httpMock.expectOne('quizzes.json');
      req.flush(mockQuizzes);

      const quiz = await promise;
      expect(quiz.title).toBe('Quiz 1');
    });

    it('should handle multiple quiz requests', async () => {
      const promise1 = service.getQuiz(0);
      const promise2 = service.getQuiz(1);
      
      const req = httpMock.expectOne('quizzes.json');
      req.flush(mockQuizzes);

      const quiz1 = await promise1;
      const quiz2 = await promise2;

      expect(quiz1.title).toBe('Quiz 1');
      expect(quiz2.title).toBe('Quiz 2');
    });
  });

  describe('Score Management', () => {
    it('should increment score', async () => {
      await loadQuizzes();
      
      service.incrementScore();
      expect(service.getScore().getScore()).toBe(1);
    });

    it('should increment score multiple times', async () => {
      await loadQuizzes();

      service.incrementScore();
      service.incrementScore();
      service.incrementScore();
      expect(service.getScore().getScore()).toBe(3);
    });

    it('should reset score', async () => {
      await loadQuizzes();

      service.incrementScore();
      service.incrementScore();
      service.resetScore();

      expect(service.getScore().getScore()).toBe(0);
    });

    it('should return new Score object after reset', async () => {
      await loadQuizzes();

      const scoreBeforeReset = service.getScore();
      service.resetScore();
      const scoreAfterReset = service.getScore();

      expect(scoreBeforeReset).not.toBe(scoreAfterReset);
    });

    it('should get current score', async () => {
      await loadQuizzes();

      service.incrementScore();
      const score = service.getScore();

      expect(score.getScore()).toBe(1);
    });
  });

  describe('Quiz Management', () => {
    it('should add new quiz', async () => {
      await loadQuizzes();

      const newQuiz = new Quiz('New Quiz', mockQuestions);
      service.addQuiz(newQuiz);

      const quizzes = await service.getQuizzes();
      expect(quizzes.length).toBe(3);
    });

    it('should retrieve all quizzes', async () => {
      const promise = service.getQuizzes();
      
      const req = httpMock.expectOne('quizzes.json');
      req.flush(mockQuizzes);

      const quizzes = await promise;
      expect(quizzes).toEqual(mockQuizzes);
    });

    it('should have questions in loaded quiz', async () => {
      await loadQuizzes();

      const quiz = await service.getQuiz(0);
      expect(quiz.questions.length).toBe(2);
    });
  });

  describe('Error Handling', () => {
    it('should handle HTTP error', async () => {
      const promise = service.getQuizzes();
      
      const req = httpMock.expectOne('quizzes.json');
      req.error(new ErrorEvent('Network error'));

      try {
        await promise;
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });

    it('should handle loading error gracefully', async () => {
      const promise = service.getQuizzes();
      
      const req = httpMock.expectOne('quizzes.json');
      req.error(new ErrorEvent('404'));

      const quizzes = await promise;
      expect(quizzes).toEqual([]);
    });
  });

  describe('Quiz Retrieval Edge Cases', () => {
    it('should retrieve quiz at boundary index', async () => {
      const promise = service.getQuiz(1);
      
      const req = httpMock.expectOne('quizzes.json');
      req.flush(mockQuizzes);

      const quiz = await promise;
      expect(quiz).toBeTruthy();
    });

    it('should return undefined for out of bounds index', async () => {
      const promise = service.getQuiz(999);
      
      const req = httpMock.expectOne('quizzes.json');
      req.flush(mockQuizzes);

      const quiz = await promise;
      expect(quiz).toBeUndefined();
    });

    it('should handle empty quiz list', async () => {
      const promise = service.getQuizzes();
      
      const req = httpMock.expectOne('quizzes.json');
      req.flush([]);

      const quizzes = await promise;
      expect(quizzes.length).toBe(0);
    });
  });

  describe('Score State Management', () => {
    it('should maintain separate score instances after reset', async () => {
      await loadQuizzes();

      service.incrementScore();
      const scoreValue1 = service.getScore().getScore();
      expect(scoreValue1).toBe(1);

      service.resetScore();
      const scoreValue2 = service.getScore().getScore();
      expect(scoreValue2).toBe(0);

      service.incrementScore();
      const scoreValue3 = service.getScore().getScore();
      expect(scoreValue3).toBe(1);
    });

    it('should not affect new score after reset when incrementing', async () => {
      await loadQuizzes();

      service.incrementScore();
      service.resetScore();
      service.incrementScore();

      expect(service.getScore().getScore()).toBe(1);
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle multiple quiz loads', async () => {
      const promise1 = service.getQuizzes();
      const promise2 = service.getQuizzes();
      
      const requests = httpMock.match('quizzes.json');
      expect(requests.length).toBe(1);

      requests[0].flush(mockQuizzes);

      const quizzes1 = await promise1;
      const quizzes2 = await promise2;

      expect(quizzes1.length).toBe(2);
      expect(quizzes2.length).toBe(2);
    });

    it('should handle score updates during quiz loading', async () => {
      const quizPromise = service.getQuiz(0);
      service.incrementScore();

      const req = httpMock.expectOne('quizzes.json');
      req.flush(mockQuizzes);

      const quiz = await quizPromise;
      expect(quiz).toBeTruthy();
      expect(service.getScore().getScore()).toBe(1);
    });
  });

  async function loadQuizzes(): Promise<void> {
    const promise = service.getQuizzes();
    const req = httpMock.expectOne('quizzes.json');
    req.flush(mockQuizzes);
    await promise;
  }
});
