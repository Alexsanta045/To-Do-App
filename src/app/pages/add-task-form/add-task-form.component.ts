import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonInput, IonTextarea,
  IonSelect, IonSelectOption, ModalController,
} from '@ionic/angular/standalone';
import { TASK_CATEGORIES, TaskCategory } from 'src/app/models/task-category.model';
import { TaskService } from 'src/app/core/task.service';

@Component({
  selector: 'app-add-task-form',
  templateUrl: './add-task-form.component.html',
  styleUrls: ['./add-task-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonContent, IonInput, IonTextarea,
    IonSelect, IonSelectOption],
})
export class AddTaskFormComponent implements OnInit {

  isEditing = false;

  readonly categories = TASK_CATEGORIES;

  private readonly fb = inject(FormBuilder);
  private readonly modalCtrl = inject(ModalController);
  private readonly taskService = inject(TaskService);

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    description: ['', Validators.maxLength(300)],
    category: ['personal' as TaskCategory, Validators.required],
  });

  ngOnInit(): void {
    const task = this.taskService.editingTask();
    if (task) {
      this.isEditing = true;
      this.form.patchValue({
        title: task.title,
        description: task.description ?? '',
        category: task.category,
      });
    }
  }

  cancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  submit(): void {
    if (this.form.invalid) return;
    this.modalCtrl.dismiss(this.form.value, 'confirm');
  }

}
