import { inject, Injectable } from '@angular/core';
import { RemoteConfig } from '@angular/fire/remote-config';
import { fetchAndActivate, getBoolean } from 'firebase/remote-config';

export type FeatureFlag = 'show_delete_completed';

@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  private readonly remoteConfig = inject(RemoteConfig);

  async initialize(): Promise<void> {
    this.remoteConfig.settings = {
      minimumFetchIntervalMillis: 3_600_000,
      fetchTimeoutMillis: 60_000,
    };
    this.remoteConfig.defaultConfig = {
      show_delete_completed: false,
    };

    try {
      await fetchAndActivate(this.remoteConfig);
    } catch (err) {
      console.warn('[FeatureFlag] Error al obtener la configuración remota, usando valores por defecto.', err);
    }
  }

  isEnabled(flag: FeatureFlag): boolean {
    return getBoolean(this.remoteConfig, flag);
  }
}
