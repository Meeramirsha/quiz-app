import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryComponent } from './history';
import { HistoryService } from '../../services/history/history';
import { History } from '../../models/history.model';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;
  let historyService: HistoryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryComponent],
      providers: [HistoryService]
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    historyService = TestBed.inject(HistoryService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load history on init', () => {
      historyService.addHistoryEntry('Test Quiz', 5, 10);
      fixture.detectChanges();
      expect(component.history.length).toBe(1);
    });

    it('should initialize with empty history when no data exists', () => {
      fixture.detectChanges();
      expect(component.history).toEqual([]);
    });
  });

  describe('History Display', () => {
    it('should display history items when history exists', () => {
      historyService.addHistoryEntry('Quiz 1', 8, 10);
      historyService.addHistoryEntry('Quiz 2', 9, 10);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const items = compiled.querySelectorAll('.history-item');
      expect(items.length).toBe(2);
    });

    it('should display quiz title', () => {
      historyService.addHistoryEntry('Important Quiz', 5, 10);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const text = compiled.textContent;
      expect(text).toContain('Important Quiz');
    });

    it('should display score information', () => {
      historyService.addHistoryEntry('Quiz', 7, 10);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const text = compiled.textContent;
      expect(text).toContain('Score: 7/10');
    });

    it('should display "No history available" when empty', () => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const text = compiled.textContent;
      expect(text).toContain('No history available');
    });

    it('should display date for each history entry', () => {
      const today = new Date();
      const history = new History('Quiz', 5, today, 10);
      historyService.addHistoryEntry(history.quizTitle, history.score, history.maxScore);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const text = compiled.textContent;
      expect(text).toContain('Date:');
    });
  });

  describe('History Sorting', () => {
    it('should display most recent quiz first', () => {
      historyService.addHistoryEntry('First Quiz', 5, 10);
      historyService.addHistoryEntry('Second Quiz', 7, 10);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const items = compiled.querySelectorAll('.history-item');
      const firstItemText = items[0].textContent;
      expect(firstItemText).toContain('Second Quiz');
    });
  });

  describe('Edge Cases', () => {
    it('should handle single history entry', () => {
      historyService.addHistoryEntry('Only Quiz', 10, 10);
      fixture.detectChanges();

      expect(component.history.length).toBe(1);
      const compiled = fixture.nativeElement;
      const items = compiled.querySelectorAll('.history-item');
      expect(items.length).toBe(1);
    });

    it('should handle many history entries', () => {
      for (let i = 0; i < 10; i++) {
        historyService.addHistoryEntry(`Quiz ${i}`, i, 10);
      }
      fixture.detectChanges();

      expect(component.history.length).toBe(10);
      const compiled = fixture.nativeElement;
      const items = compiled.querySelectorAll('.history-item');
      expect(items.length).toBe(10);
    });

    it('should handle perfect and zero scores', () => {
      historyService.addHistoryEntry('Perfect', 10, 10);
      historyService.addHistoryEntry('Failed', 0, 10);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const text = compiled.textContent;
      expect(text).toContain('10/10');
      expect(text).toContain('0/10');
    });

    it('should display long quiz titles', () => {
      const longTitle = 'A'.repeat(100);
      historyService.addHistoryEntry(longTitle, 5, 10);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const text = compiled.textContent;
      expect(text).toContain('A');
    });
  });

  describe('Integration', () => {
    it('should update history when service has new entries', () => {
      fixture.detectChanges();
      expect(component.history.length).toBe(0);

      historyService.addHistoryEntry('New Quiz', 5, 10);
      
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.history.length).toBe(1);
    });
  });
});
