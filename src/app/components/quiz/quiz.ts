import { Component, OnDestroy, OnInit } from '@angular/core';
import { QuestionComponent } from '../question/question';
import { CommonModule } from '@angular/common';
import { Quiz } from '../../models/quiz.model';
import { QuizService } from '../../services/quiz/quiz';
import { ActivatedRoute, Router } from '@angular/router';
import { HistoryService } from '../../services/history/history';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [QuestionComponent, CommonModule],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css'
})
export class QuizComponent implements OnInit, OnDestroy {
  quiz: Quiz | null = null;
  currentQuizIndex = 0;
  answeredQuestions = new Set<number>();

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router,
    private historyService: HistoryService
  ) {}

  async ngOnInit(): Promise<void> {
    this.quizService.resetScore();
    await this.loadQuiz();
    // Initialization logic here
  }

  ngOnDestroy(): void {
    // Cleanup logic here
    this.router.navigate(['/']);
  }
  private async loadQuiz(): Promise<void>{
    const quizIndex = Number(this.route.snapshot.paramMap.get('index'));
    try{
      this.quiz=await this.quizService.getQuiz(quizIndex);
    }catch(error){
      console.error('Failed to load quiz:',error);
      this.router.navigate(['/']);
    }
}
handleAnswer(isCorrect: boolean, questionIndex: number): void {
  if (this.answeredQuestions.has(questionIndex)) return;
  this.answeredQuestions.add(questionIndex);
  if (!isCorrect) return;
  this.quizService.incrementScore();
}

isQuizComplete(): boolean {
  if (!this.quiz) return false;
  if (this.answeredQuestions.size >= this.quiz.questions.length) {
    return true;
  }
  return false;
}

getScore(): number {
  return this.quizService.getScore().getScore();
}
getMaxScore(): number {
  return this.quiz ? this.quiz.questions.length : 0;
}

getScorePercentage(): number {
  const score = this.getScore();
  const maxScore = this.getMaxScore();
  const result = maxScore ? (score / maxScore) * 100 : 0;
  console.log(result);
  return result;
}

addToHistory(): void {
  if (!this.quiz) return;
  const score = this.getScore();
  const maxScore = this.getMaxScore();
  this.historyService.addHistoryEntry(this.quiz.title, score, maxScore);
}

goToMainMenu(): void {
  if (this.isQuizComplete()) {
    this.addToHistory();
  }
  this.router.navigate(['/']);
}


}
