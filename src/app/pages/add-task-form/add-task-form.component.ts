import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonItem, IonLabel, IonInput, IonTextarea,
  IonSelect, IonSelectOption, ModalController,
} from '@ionic/angular/standalone';
import { TASK_CATEGORIES, TaskCategory } from 'src/app/models/task-category.model';
// import { TASK_CATEGORIES, TaskCategory } from '../models/task.model';

@Component({
  selector: 'app-add-task-form',
  templateUrl: './add-task-form.component.html',
  styleUrls: ['./add-task-form.component.scss'],
  imports: [ ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonContent, IonItem, IonLabel, IonInput, IonTextarea,
    IonSelect, IonSelectOption],
})
export class AddTaskFormComponent {

 readonly categories = TASK_CATEGORIES;

  private readonly fb = inject(FormBuilder);
  private readonly modalCtrl = inject(ModalController);

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    description: ['', Validators.maxLength(300)],
    category: ['personal' as TaskCategory, Validators.required],
  });

}
