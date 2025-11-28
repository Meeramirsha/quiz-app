import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { QuizService } from '../../services/quiz/quiz';
import { Quiz } from '../../models/quiz.model';



@Component({
  selector: 'app-quiz-list',
  imports:  [CommonModule,RouterModule],
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
  

  takeQuiz(index: number):void{
    this.router.navigate(['/quiz', index]);
  }
}


