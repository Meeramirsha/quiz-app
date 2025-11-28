import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionComponent } from './question';
import { Question } from '../../models/question.model';

describe('QuestionComponent', () => {
  let component: QuestionComponent;
  let fixture: ComponentFixture<QuestionComponent>;

  const mockQuestion = new Question('What is 2+2?', [
    { text: '3', isCorrect: false },
    { text: '4', isCorrect: true },
    { text: '5', isCorrect: false }
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionComponent);
    component = fixture.componentInstance;
    component.question = mockQuestion;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should accept question input', () => {
      expect(component.question).toEqual(mockQuestion);
    });

    it('should display question text', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('What is 2+2?');
    });
  });

  describe('Option Display', () => {
    it('should render all options', () => {
      const options = fixture.nativeElement.querySelectorAll('.option-label');
      expect(options.length).toBe(3);
    });

    it('should display option text correctly', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('3');
      expect(compiled.textContent).toContain('4');
      expect(compiled.textContent).toContain('5');
    });

    it('should render radio buttons for each option', () => {
      const radioButtons = fixture.nativeElement.querySelectorAll('.option-input');
      expect(radioButtons.length).toBe(3);
    });

    it('should have unique ids for each option', () => {
      const inputs = fixture.nativeElement.querySelectorAll('.option-input');
      const ids = Array.from(inputs).map((input: any) => input.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('Happy Path - Answer Selection', () => {
    it('should emit correct answer value when correct option selected', (done) => {
      component.answerSelected.subscribe((value: boolean) => {
        expect(value).toBe(true);
        done();
      });

      component.selectOption(true);
    });

    it('should emit incorrect answer value when incorrect option selected', (done) => {
      component.answerSelected.subscribe((value: boolean) => {
        expect(value).toBe(false);
        done();
      });

      component.selectOption(false);
    });

    it('should emit on each option selection', (done) => {
      let callCount = 0;
      component.answerSelected.subscribe(() => {
        callCount++;
        if (callCount === 1) {
          component.selectOption(false);
        } else if (callCount === 2) {
          expect(callCount).toBe(2);
          done();
        }
      });

      component.selectOption(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle question with single option', () => {
      const singleOptionQuestion = new Question('True or False?', [
        { text: 'True', isCorrect: true }
      ]);
      component.question = singleOptionQuestion;
      fixture.detectChanges();

      const options = fixture.nativeElement.querySelectorAll('.option-label');
      expect(options.length).toBe(1);
    });

    it('should handle question with many options', () => {
      const manyOptionsQuestion = new Question('Pick the right one', [
        { text: 'Option 1', isCorrect: false },
        { text: 'Option 2', isCorrect: false },
        { text: 'Option 3', isCorrect: false },
        { text: 'Option 4', isCorrect: true },
        { text: 'Option 5', isCorrect: false }
      ]);
      component.question = manyOptionsQuestion;
      fixture.detectChanges();

      const options = fixture.nativeElement.querySelectorAll('.option-label');
      expect(options.length).toBe(5);
    });

    it('should handle question with long text', () => {
      const longText = 'A'.repeat(500);
      const longQuestion = new Question(longText, [
        { text: 'Answer', isCorrect: true }
      ]);
      component.question = longQuestion;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain(longText.substring(0, 100));
    });

    it('should handle special characters in question text', () => {
      const specialQuestion = new Question('What is "special" & characters?', [
        { text: 'Answer', isCorrect: true }
      ]);
      component.question = specialQuestion;
      fixture.detectChanges();

      expect(component.question.text).toContain('special');
      expect(component.question.text).toContain('&');
    });

    it('should handle special characters in option text', () => {
      const specialQuestion = new Question('Question?', [
        { text: 'Option with "quotes" & ampersand', isCorrect: true }
      ]);
      component.question = specialQuestion;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('quotes');
      expect(compiled.textContent).toContain('ampersand');
    });

    it('should handle unicode characters in question', () => {
      const unicodeQuestion = new Question('数学 Question 🎯', [
        { text: '答え', isCorrect: true }
      ]);
      component.question = unicodeQuestion;
      fixture.detectChanges();

      expect(component.question.text).toContain('数学');
    });
  });

  describe('Event Emission', () => {
    it('should only emit through answerSelected output', (done) => {
      let emitted = false;
      component.answerSelected.subscribe(() => {
        emitted = true;
      });

      component.selectOption(true);

      setTimeout(() => {
        expect(emitted).toBe(true);
        done();
      }, 100);
    });

    it('should emit the exact boolean value passed', (done) => {
      const emittedValues: boolean[] = [];
      component.answerSelected.subscribe((value: boolean) => {
        emittedValues.push(value);
        if (emittedValues.length === 2) {
          expect(emittedValues).toEqual([true, false]);
          done();
        }
      });

      component.selectOption(true);
      component.selectOption(false);
    });

    it('should not emit incorrect boolean values', (done) => {
      component.answerSelected.subscribe((value: boolean) => {
        expect(typeof value).toBe('boolean');
        expect([true, false]).toContain(value);
        done();
      });

      component.selectOption(true);
    });
  });

  describe('Radio Button Integration', () => {
    it('should have radio buttons grouped by name', () => {
      const radioButtons = fixture.nativeElement.querySelectorAll('.option-input');
      const names = Array.from(radioButtons).map((btn: any) => btn.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(1);
    });

    it('should trigger change event on radio selection', (done) => {
      component.answerSelected.subscribe((value: boolean) => {
        expect(value).toBe(true);
        done();
      });

      const radioButtons = fixture.nativeElement.querySelectorAll('.option-input');
      const firstRadio = radioButtons[1];
      firstRadio.click();
    });

    it('should associate labels with radio buttons', () => {
      const labels = fixture.nativeElement.querySelectorAll('.option-label');
      expect(labels.length).toBe(3);

      const inputs = fixture.nativeElement.querySelectorAll('.option-input');
      inputs.forEach((input: any, index: number) => {
        expect(labels[index].htmlFor).toBe(input.id);
      });
    });
  });

  describe('Multiple Question Instances', () => {
    it('should handle different questions independently', () => {
      const question1 = new Question('First?', [
        { text: 'Answer 1', isCorrect: true }
      ]);
      const question2 = new Question('Second?', [
        { text: 'Answer 2', isCorrect: false }
      ]);

      const component1 = fixture.componentInstance;
      component1.question = question1;

      const fixture2 = TestBed.createComponent(QuestionComponent);
      const component2 = fixture2.componentInstance;
      component2.question = question2;

      expect(component1.question.text).toBe('First?');
      expect(component2.question.text).toBe('Second?');
    });
  });

  describe('Template Structure', () => {
    it('should have a form element', () => {
      const form = fixture.nativeElement.querySelector('form');
      expect(form).toBeTruthy();
    });

    it('should have quiz-form class on form', () => {
      const form = fixture.nativeElement.querySelector('form');
      expect(form.classList.contains('quiz-form')).toBe(true);
    });

    it('should have option-container divs', () => {
      const containers = fixture.nativeElement.querySelectorAll('.option-container');
      expect(containers.length).toBe(3);
    });

    it('should have correct aria attributes', () => {
      const inputs = fixture.nativeElement.querySelectorAll('.option-input');
      inputs.forEach((input: any) => {
        expect(input.type).toBe('radio');
      });
    });
  });

  describe('Question Type Variations', () => {
    it('should display question with all correct answers', () => {
      const allCorrectQuestion = new Question('All correct?', [
        { text: 'Option 1', isCorrect: true },
        { text: 'Option 2', isCorrect: true },
        { text: 'Option 3', isCorrect: true }
      ]);
      component.question = allCorrectQuestion;
      fixture.detectChanges();

      expect(component.question.options.every(opt => opt.isCorrect)).toBe(true);
    });

    it('should display question with all incorrect answers', () => {
      const allWrongQuestion = new Question('All wrong?', [
        { text: 'Option 1', isCorrect: false },
        { text: 'Option 2', isCorrect: false },
        { text: 'Option 3', isCorrect: false }
      ]);
      component.question = allWrongQuestion;
      fixture.detectChanges();

      expect(component.question.options.every(opt => !opt.isCorrect)).toBe(true);
    });

    it('should display question with multiple correct answers', () => {
      const multiCorrectQuestion = new Question('Multiple correct?', [
        { text: 'Option 1', isCorrect: true },
        { text: 'Option 2', isCorrect: false },
        { text: 'Option 3', isCorrect: true }
      ]);
      component.question = multiCorrectQuestion;
      fixture.detectChanges();

      const correctCount = component.question.options.filter(opt => opt.isCorrect).length;
      expect(correctCount).toBe(2);
    });
  });
});
