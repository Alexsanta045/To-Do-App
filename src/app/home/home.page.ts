import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AlertController,
  IonBadge,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonChip,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  briefcaseOutline,
  cartOutline,
  checkboxOutline,
  checkmarkDoneOutline,
  ellipsisHorizontalOutline,
  heartOutline,
  pencilOutline,
  personOutline,
  trashOutline,
} from 'ionicons/icons';
import { FeatureFlagService } from '../core/feature-flag.service';
import { TaskService } from '../core/task.service';
import { Task } from '../models/task.model';
import { TaskCategory, TASK_CATEGORIES } from '../models/task-category.model';
import { AddTaskFormComponent } from '../pages/add-task-form/add-task-form.component';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle,
    IonContent, IonList,
    IonItem, IonLabel, IonCheckbox, IonNote,
    IonItemSliding, IonItemOptions, IonItemOption,
    IonChip, IonIcon, IonBadge,
    IonSegment, IonSegmentButton,
    IonFab, IonFabButton, IonButtons, IonButton],
})
export class HomePage implements OnInit {
  readonly categories = TASK_CATEGORIES;
  readonly selectedCategory = signal<TaskCategory | 'all'>('all');

  private readonly allTasks = toSignal(
    inject(TaskService).getTasks(),
    { initialValue: [] as Task[] }
  );

  readonly filteredTasks = computed(() => {
    const cat = this.selectedCategory();
    const tasks = this.allTasks();
    return cat === 'all' ? tasks : tasks.filter(t => t.category === cat);
  });

  readonly pendingCount  = computed(() => this.filteredTasks().filter(t => !t.completed).length);
  readonly completedCount = computed(() => this.filteredTasks().filter(t => t.completed).length);

  readonly showDeleteCompleted = computed(() =>
    this.featureFlags.isEnabled('show_delete_completed')
  );

  private readonly taskService     = inject(TaskService);
  private readonly featureFlags    = inject(FeatureFlagService);
  private readonly modalCtrl       = inject(ModalController);
  private readonly alertCtrl       = inject(AlertController);

  constructor() {
    addIcons({
      addOutline, trashOutline, checkboxOutline, checkmarkDoneOutline,
      personOutline, briefcaseOutline, cartOutline, heartOutline,
      ellipsisHorizontalOutline, pencilOutline,
    });
  }

  ngOnInit(): void { }

  onCategoryChange(event: Event): void {
    const value = (event as CustomEvent<{ value: TaskCategory | 'all' }>).detail.value;
    this.selectedCategory.set(value);
  }

  toggleComplete(task: Task): void {
    this.taskService.toggleComplete(task.id);
  }

  async openEditTask(task: Task, slidingItem: IonItemSliding): Promise<void> {
    await slidingItem.close();
    this.taskService.editingTask.set(task);
    try {
      const modal = await this.modalCtrl.create({ component: AddTaskFormComponent });
      await modal.present();
      const { data, role } = await modal.onWillDismiss<{
        title: string; description: string; category: TaskCategory;
      }>();
      if (role === 'confirm' && data) {
        this.taskService.updateTask(task.id, data);
      }
    } finally {
      this.taskService.editingTask.set(null);
    }
  }

  async confirmDeleteCompleted(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Borrar completadas',
      message: `¿Eliminar las ${this.completedCount()} tarea(s) completada(s)?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          cssClass: 'alert-button-danger',
          handler: () => this.taskService.deleteCompleted(),
        },
      ],
    });
    await alert.present();
  }

  async deleteTask(task: Task, slidingItem: IonItemSliding): Promise<void> {
    await slidingItem.close();
    this.taskService.deleteTask(task.id);
  }

  async openAddTask(): Promise<void> {
    this.taskService.editingTask.set(null);
    const modal = await this.modalCtrl.create({ component: AddTaskFormComponent });
    await modal.present();
    const { data, role } = await modal.onWillDismiss<{
      title: string; description: string; category: TaskCategory;
    }>();
    if (role === 'confirm' && data) {
      this.taskService.addTask(data);
    }
  }

  trackByTask(_i: number, task: Task): string {
    return task.id;
  }

  getCategoryInfo(category: TaskCategory) {
    return TASK_CATEGORIES.find(c => c.value === category);
  }
}
