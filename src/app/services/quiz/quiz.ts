// src/app/services/quiz/quiz.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { Quiz } from '../../models/quiz.model';   // adjust paths if needed
import { Score } from '../../models/score.model';

const QUIZZES_FILE_PATH = 'quizzes.json';  // or 'quizzes.json' if that's where it is

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private quizzes: Quiz[] = [];
  private score = new Score();
  private quizzesLoaded: Promise<void>;

  constructor(private http: HttpClient) {
    this.quizzesLoaded = this.loadQuizzesFromJson(QUIZZES_FILE_PATH);
  }

  private loadQuizzesFromJson(jsonPath: string): Promise<void> {
    return firstValueFrom(
      this.http.get<Quiz[]>(jsonPath).pipe(
        map((quizzes) => {
          // if Quiz is a class with constructor(title, questions)
          this.quizzes = quizzes.map(
            (quiz) => new Quiz(quiz.title, quiz.questions)
          );
        })
      )
    )
      .then(() => {
        console.log('Quizzes loaded successfully');
      })
      .catch((error) => {
        console.log('Failed to load quizzes', error);
      });
  }

  // get one quiz by index
  async getQuiz(index: number): Promise<Quiz> {
    await this.quizzesLoaded;
    return this.quizzes[index];
  }

  // get all quizzes
  async getQuizzes(): Promise<Quiz[]> {
    await this.quizzesLoaded;
    return this.quizzes;
  }

  addQuiz(newQuiz: Quiz): void {
    this.quizzes.push(newQuiz);
  }

  getScore(): Score {
    return this.score;
  }

  incrementScore(): void {
    this.score.incrementCorrect();
  }

  resetScore(): void {
    this.score = new Score();
  }
}
