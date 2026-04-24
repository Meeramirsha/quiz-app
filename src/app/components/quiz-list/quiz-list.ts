import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { QuizService } from '../../services/quiz/quiz';
import { Quiz } from '../../models/quiz.model';

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quiz-list.html',
})
export class QuizListComponent implements OnInit {
  quizzes: Quiz[] = [];
  filteredQuizzes: Quiz[] = [];
  selectedCategory: string = 'All';

  constructor(private quizService: QuizService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    try {
      this.quizzes = await this.quizService.getQuizzes();
      this.filterQuizzes();
    } catch (err) {
      console.error('Failed to load quizzes:', err);
    }
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.filterQuizzes();
  }

  filterQuizzes(): void {
    if (this.selectedCategory === 'All') {
      this.filteredQuizzes = this.quizzes;
    } else {
      this.filteredQuizzes = this.quizzes.filter(quiz => {
        const title = quiz.title.toLowerCase();
        const category = this.selectedCategory.toLowerCase();
        
        // Handle mapping for Science & Nature vs Science
        if (category === 'science' && title.includes('science')) return true;
        if (category === 'art & lit' && (title.includes('art') || title.includes('literature'))) return true;
        
        return title.includes(category);
      });
    }
  }

  takeQuiz(quiz: Quiz): void {
    const index = this.quizzes.indexOf(quiz);
    this.router.navigate(['/quiz', index]);
  }

  getQuizImage(title: string): string {
    const t = title.toLowerCase();
    if (t.includes('general')) return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800';
    if (t.includes('science')) return 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800';
    if (t.includes('history')) return 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=800';
    if (t.includes('geography')) return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800';
    if (t.includes('technology') || t.includes('tech')) return 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800';
    if (t.includes('art') || t.includes('lit')) return 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800';
    if (t.includes('entertainment') || t.includes('movie')) return 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&q=80&w=800';
    if (t.includes('languages')) return 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800';
    if (t.includes('sports')) return 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800';
    if (t.includes('trivia')) return 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800';
    return 'https://images.unsplash.com/photo-1606326666430-2c2a58d04975?auto=format&fit=crop&q=80&w=800';
  }
}
