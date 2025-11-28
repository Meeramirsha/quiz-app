import { Component } from '@angular/core';
import { HistoryService, QuizHistoryItem } from '../../services/history.service';

@Component({
  selector: 'app-history',
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
