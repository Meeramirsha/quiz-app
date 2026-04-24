import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService, QuizHistoryItem } from '../../services/history/history';
import { CustomDatePipe } from '../../pipes/custom-date/custom-date';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, CustomDatePipe],
  templateUrl: './history.html',
  // adapt to your style system; use styleUrl if you use scss/css
})
export class HistoryComponent {
  history: QuizHistoryItem[] = [];

  constructor(private historyService: HistoryService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.history = this.historyService.getAll();
  }

  clear() {
    if (confirm('Clear all history?')) {
      this.historyService.clearAll();
      this.load();
    }
  }
}
