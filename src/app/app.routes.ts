import { Routes } from '@angular/router';
import { QuizListComponent } from './components/quiz-list/quiz-list';
import { QuizComponent } from './components/quiz/quiz';
import { CreateQuizComponent } from './pages/create-quiz/create-quiz';
import { HistoryComponent } from './pages/history/history';

export const routes: Routes = [
  { path: '', component: QuizListComponent },
  { path: 'quiz/:index', component: QuizComponent },
  { path: 'quiz-list', component: QuizListComponent },
  { path: 'create-quiz', component: CreateQuizComponent },
  { path: 'history', component: HistoryComponent },
];
