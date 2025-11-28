import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Quiz } from '../../models/quiz.model';
import { QuizService } from '../../services/quiz/quiz';

@Component({
  selector: 'app-quiz-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './quiz-list.html',
  styleUrl: './quiz-list.css',
})
export class QuizListComponent implements OnInit {
  quizzes: Quiz[] = [];

  constructor(private quizService: QuizService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    try {
      this.quizzes = await this.quizService.getQuizzes();
    } catch (err) {
      console.error('Failed to load quizzes:', err);
    }
  }

  takeQuiz(index: number): void {
    // you’ll add navigation logic here, e.g.:
    // const selectedQuiz = this.quizzes[index];
    // this.router.navigate(['/quiz', selectedQuiz.id]);
    this.router.navigate(['/quiz',index]);
  }
}
