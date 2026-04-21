import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, AddTaskFormComponent, IonContent],
})
export class HomePage {
  constructor() {}
}

import { AddTaskFormComponent } from "../pages/add-task-form/add-task-form.component";imports: [
    IonHeader, IonToolbar, IonTitle,
    AddTaskFormComponent
]