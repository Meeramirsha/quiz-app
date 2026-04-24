import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz/quiz';
import { Quiz } from '../../models/quiz.model';

@Component({
  selector: 'app-ai-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-generator.html',
})
export class AiGeneratorComponent {
  topic: string = '';
  isGenerating: boolean = false;
  generatedQuiz: Quiz | null = null;

  constructor(private quizService: QuizService, private router: Router) {}

  generateQuiz() {
    if (!this.topic) return;

    this.isGenerating = true;
    this.generatedQuiz = null;

    // Simulate AI Generation
    setTimeout(() => {
      this.generatedQuiz = this.createMockAiQuiz(this.topic);
      this.isGenerating = false;
    }, 2500);
  }

  saveAndPlay() {
    if (this.generatedQuiz) {
      this.quizService.addQuiz(this.generatedQuiz);
      this.router.navigate(['/']);
    }
  }

  private createMockAiQuiz(topic: string): Quiz {
    const questions = [];
    const questionTemplates = [
      `What is a fundamental principle of ${topic}?`,
      `Which of these is most closely associated with ${topic}?`,
      `In ${topic}, what is the primary objective of 'Analysis'?`,
      `Who is a key figure in the history of ${topic}?`,
      `Which term describes a common challenge in ${topic}?`,
      `What is the most widely used tool for ${topic}?`,
      `How has ${topic} evolved in the last decade?`,
      `What is the main benefit of implementing ${topic}?`,
      `Which of these is a subset of ${topic}?`,
      `What is the most common misconception about ${topic}?`
    ];

    for (let i = 1; i <= 20; i++) {
      const template = questionTemplates[(i - 1) % questionTemplates.length];
      questions.push({
        text: `(${i}) ${template}`,
        options: [
          { text: `Optimal ${topic} Solution`, isCorrect: true },
          { text: "General Alternative", isCorrect: false },
          { text: "Legacy Approach", isCorrect: false }
        ]
      });
    }

    return {
      title: `AI Gen: ${topic}`,
      questions: questions
    };
  }
}
