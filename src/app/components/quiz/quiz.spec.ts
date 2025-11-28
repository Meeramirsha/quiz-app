import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizComponent } from './quiz';
import { QuizService } from '../../services/quiz/quiz';
import { HistoryService } from '../../services/history/history';
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz } from '../../models/quiz.model';
import { Question } from '../../models/question.model';
import { of } from 'rxjs';

describe('QuizComponent', () => {
  let component: QuizComponent;
  let fixture: ComponentFixture<QuizComponent>;
  let quizService: jasmine.SpyObj<QuizService>;
  let historyService: jasmine.SpyObj<HistoryService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: any;

  const mockQuestions: Question[] = [
    new Question('What is 2+2?', [
      { text: '3', isCorrect: false },
      { text: '4', isCorrect: true },
      { text: '5', isCorrect: false }
    ]),
    new Question('What is the capital of France?', [
      { text: 'London', isCorrect: false },
      { text: 'Paris', isCorrect: true },
      { text: 'Berlin', isCorrect: false }
    ]),
    new Question('What is 5*3?', [
      { text: '15', isCorrect: true },
      { text: '16', isCorrect: false },
      { text: '14', isCorrect: false }
    ])
  ];

  const mockQuiz = new Quiz('Test Quiz', mockQuestions);

  beforeEach(async () => {
    const quizServiceSpy = jasmine.createSpyObj('QuizService', [
      'getQuiz',
      'getScore',
      'incrementScore',
      'resetScore'
    ]);
    const historyServiceSpy = jasmine.createSpyObj('HistoryService', [
      'addHistoryEntry'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    activatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('0')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [QuizComponent],
      providers: [
        { provide: QuizService, useValue: quizServiceSpy },
        { provide: HistoryService, useValue: historyServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    }).compileComponents();

    quizService = TestBed.inject(QuizService) as jasmine.SpyObj<QuizService>;
    historyService = TestBed.inject(HistoryService) as jasmine.SpyObj<HistoryService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    quizService.getQuiz.and.returnValue(Promise.resolve(mockQuiz));
    quizService.getScore.and.returnValue({
      getScore: () => 0,
      incrementCorrect: () => {},
      correctAnswers: 0
    } as any);

    fixture = TestBed.createComponent(QuizComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load quiz on init', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      expect(quizService.getQuiz).toHaveBeenCalledWith(0);
    });

    it('should reset score on init', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      expect(quizService.resetScore).toHaveBeenCalled();
    });

    it('should set currentQuizIndex to 0 initially', () => {
      expect(component.currentQuizIndex).toBe(0);
    });
  });

  describe('Score Tracking', () => {
    beforeEach(async () => {
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should not increment score on first incorrect answer', () => {
      component.handleAnswer(false, 0);

      expect(quizService.incrementScore).not.toHaveBeenCalled();
    });

    it('should increment score on correct answer', () => {
      component.handleAnswer(true, 0);

      expect(quizService.incrementScore).toHaveBeenCalled();
    });

    it('should not increment score twice for same question', () => {
      component.handleAnswer(true, 0);
      component.handleAnswer(true, 0);

      expect(quizService.incrementScore).toHaveBeenCalledTimes(1);
    });

    it('should track answered questions', () => {
      component.handleAnswer(true, 0);
      component.handleAnswer(false, 1);

      expect(component.answeredQuestions.has(0)).toBe(true);
      expect(component.answeredQuestions.has(1)).toBe(true);
    });

    it('should ignore answer if question already answered', () => {
      component.handleAnswer(true, 0);
      const countBefore = quizService.incrementScore.calls.count();

      component.handleAnswer(false, 0);
      const countAfter = quizService.incrementScore.calls.count();

      expect(countBefore).toBe(countAfter);
    });
  });

  describe('Quiz Completion', () => {
    beforeEach(async () => {
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should not be complete when no questions answered', () => {
      expect(component.isQuizComplete()).toBe(false);
    });

    it('should not be complete when only some questions answered', () => {
      component.handleAnswer(true, 0);
      expect(component.isQuizComplete()).toBe(false);
    });

    it('should be complete when all questions answered', () => {
      component.handleAnswer(true, 0);
      component.handleAnswer(true, 1);
      component.handleAnswer(true, 2);

      expect(component.isQuizComplete()).toBe(true);
    });

    it('should return false if quiz is null', () => {
      component.quiz = null;
      expect(component.isQuizComplete()).toBe(false);
    });
  });

  describe('Score Calculation', () => {
    beforeEach(async () => {
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should return correct score from quiz service', () => {
      const scoreStub = { getScore: () => 5, correctAnswers: 5 };
      quizService.getScore.and.returnValue(scoreStub as any);

      expect(component.getScore()).toBe(5);
    });

    it('should return max score equal to number of questions', () => {
      component.quiz = mockQuiz;
      expect(component.getMaxScore()).toBe(3);
    });

    it('should return 0 for max score if quiz is null', () => {
      component.quiz = null;
      expect(component.getMaxScore()).toBe(0);
    });

    it('should calculate score percentage correctly', () => {
      component.quiz = mockQuiz;
      const scoreStub = { getScore: () => 2, correctAnswers: 2 };
      quizService.getScore.and.returnValue(scoreStub as any);

      const percentage = component.getScorePercentage();
      expect(percentage).toBeCloseTo(66.67, 1);
    });

    it('should return 0 percentage for 0 score', () => {
      component.quiz = mockQuiz;
      const scoreStub = { getScore: () => 0, correctAnswers: 0 };
      quizService.getScore.and.returnValue(scoreStub as any);

      expect(component.getScorePercentage()).toBe(0);
    });

    it('should return 100 percentage for perfect score', () => {
      component.quiz = mockQuiz;
      const scoreStub = { getScore: () => 3, correctAnswers: 3 };
      quizService.getScore.and.returnValue(scoreStub as any);

      expect(component.getScorePercentage()).toBe(100);
    });

    it('should handle division by zero for score percentage', () => {
      component.quiz = null;
      expect(component.getScorePercentage()).toBe(0);
    });
  });

  describe('History Integration', () => {
    beforeEach(async () => {
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should add history entry on quiz completion', () => {
      component.quiz = mockQuiz;
      const scoreStub = { getScore: () => 2, correctAnswers: 2 };
      quizService.getScore.and.returnValue(scoreStub as any);

      component.addToHistory();

      expect(historyService.addHistoryEntry).toHaveBeenCalledWith(
        'Test Quiz',
        2,
        3
      );
    });

    it('should not add history if quiz is null', () => {
      component.quiz = null;
      component.addToHistory();

      expect(historyService.addHistoryEntry).not.toHaveBeenCalled();
    });

    it('should add history with zero score', () => {
      component.quiz = mockQuiz;
      const scoreStub = { getScore: () => 0, correctAnswers: 0 };
      quizService.getScore.and.returnValue(scoreStub as any);

      component.addToHistory();

      expect(historyService.addHistoryEntry).toHaveBeenCalledWith(
        'Test Quiz',
        0,
        3
      );
    });
  });

  describe('Navigation', () => {
    beforeEach(async () => {
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should go to main menu without saving history if quiz incomplete', () => {
      component.quiz = mockQuiz;
      component.answeredQuestions.add(0);

      component.goToMainMenu();

      expect(historyService.addHistoryEntry).not.toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should add to history and navigate when quiz complete', () => {
      component.quiz = mockQuiz;
      const scoreStub = { getScore: () => 3, correctAnswers: 3 };
      quizService.getScore.and.returnValue(scoreStub as any);

      component.answeredQuestions.add(0);
      component.answeredQuestions.add(1);
      component.answeredQuestions.add(2);

      component.goToMainMenu();

      expect(historyService.addHistoryEntry).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should navigate to home on component destroy', () => {
      component.ngOnDestroy();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('Error Handling', () => {
    it('should handle quiz loading error', async () => {
      quizService.getQuiz.and.returnValue(Promise.reject(new Error('Load failed')));

      fixture.detectChanges();
      await fixture.whenStable();

      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
