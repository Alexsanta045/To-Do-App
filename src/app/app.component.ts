import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { FeatureFlagService } from './core/feature-flag.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private readonly featureFlagService = inject(FeatureFlagService);

  async ngOnInit(): Promise<void> {
    await this.featureFlagService.initialize();
  }
}
