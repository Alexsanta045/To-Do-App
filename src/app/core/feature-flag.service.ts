import { inject, Injectable, signal } from '@angular/core';
import { RemoteConfig } from '@angular/fire/remote-config';
import { fetchAndActivate, getBoolean } from 'firebase/remote-config';
import { environment } from 'src/environments/environment';

export type FeatureFlag = 'show_delete_completed';

const DEFAULTS: Record<FeatureFlag, boolean> = {
  show_delete_completed: true,
};

@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  private readonly remoteConfig = inject(RemoteConfig);

  private readonly flags = signal<Record<FeatureFlag, boolean>>({ ...DEFAULTS });

  async initialize(): Promise<void> {
    this.remoteConfig.settings = {
      minimumFetchIntervalMillis: environment.production ? 3_600_000 : 0,
      fetchTimeoutMillis: 60_000,
    };
    this.remoteConfig.defaultConfig = { ...DEFAULTS };

    try {
      await fetchAndActivate(this.remoteConfig);
    } catch (err) {
      console.warn('[FeatureFlag] Error al obtener la configuración remota, usando valores por defecto.', err);
    }

    // Actualiza el signal con los valores reales (locales o de Firebase)
    this.flags.set({
      show_delete_completed: getBoolean(this.remoteConfig, 'show_delete_completed'),
    });
  }

  isEnabled(flag: FeatureFlag): boolean {
    return this.flags()[flag];
  }
}

