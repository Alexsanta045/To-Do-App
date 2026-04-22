import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task} from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly STORAGE_KEY = 'todo_tasks';
  private readonly tasks$ = new BehaviorSubject<Task[]>(this.loadFromStorage());

  readonly editingTask = signal<Task | null>(null);

  getTasks(): Observable<Task[]> {
    return this.tasks$.asObservable();
  }

  addTask(data: Pick<Task, 'title' | 'description' | 'category'>): void {
    const task: Task = {
      id: crypto.randomUUID(),
      title: data.title.trim(),
      description: data.description?.trim(),
      category: data.category,
      completed: false,
    };
    this.commit([...this.tasks$.value, task]);
  }

  updateTask(id: string, data: Pick<Task, 'title' | 'description' | 'category'>): void {
    this.commit(
      this.tasks$.value.map(t =>
        t.id === id
          ? { ...t, title: data.title.trim(), description: data.description?.trim(), category: data.category }
          : t
      )
    );
  }

  toggleComplete(id: string): void {
    this.commit(
      this.tasks$.value.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  deleteTask(id: string): void {
    this.commit(this.tasks$.value.filter(t => t.id !== id));
  }

  deleteCompleted(): void {
    this.commit(this.tasks$.value.filter(t => !t.completed));
  }

  private commit(tasks: Task[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn('[TaskService] Failed to persist tasks', e);
    }
    this.tasks$.next(tasks);
  }

  private loadFromStorage(): Task[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Task[]) : [];
    } catch {
      return [];
    }
  }
}
