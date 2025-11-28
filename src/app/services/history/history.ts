import { Injectable } from '@angular/core';

export interface QuizHistoryItem {
  id: string;
  title: string;
  type: 'taken'|'created';
  score?: number;         // optional for 'taken'
  total?: number;         // optional for 'taken'
  date: string;           // ISO timestamp
}

const STORAGE_KEY = 'quiz_app_history_v1';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  constructor() {}

  private loadRaw(): QuizHistoryItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveRaw(items: QuizHistoryItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  getAll(): QuizHistoryItem[] {
    return this.loadRaw().sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getHistory(): QuizHistoryItem[] {
    return this.getAll();
  }

  add(item: Omit<QuizHistoryItem,'id'|'date'>) {
    const entries = this.loadRaw();
    const newItem: QuizHistoryItem = {
      id: Math.random().toString(36).slice(2,9),
      date: new Date().toISOString(),
      ...item
    };
    entries.push(newItem);
    this.saveRaw(entries);
    return newItem;
  }

  clearAll() {
    this.saveRaw([]);
  }
}
