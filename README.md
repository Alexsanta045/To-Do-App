
## Instalación y Ejecución Local

# Clonar el repositorio
git clone https://github.com/Alexsanta045/To-Do-App.git
cd To-Do-App

# Instalar dependencias
npm install

# Ejecutar en el navegador (modo desarrollo)
npm start

## Firebase y Remote Config

La aplicación usa **Firebase Remote Config** para controlar feature flags sin necesidad de publicar una nueva versión.

Las credenciales de Firebase ya están en `src/environments/environment.ts`.

## Compilar para Android

### Prerrequisitos

- Android Studio instalado con SDK de Android (API 33.0.2).
- Variable de entorno `ANDROID_HOME` o `ANDROID_SDK_ROOT` configurada.

### Pasos

```bash
# 1. Agregar plataforma Android (solo la primera vez)
ionic cordova platform add android

# 2. Compilar la app web con Angular
npm run build

# 3. Empaquetar con Cordova
cordova build android --debug
```

El APK debug se genera en:
```
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

## Generar APK / IPA

### APK Debug (Android)

```bash
npm run build
cordova build android --debug
# Archivo generado en:
# platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

## Optimizaciones de Rendimiento

### 1. `ChangeDetectionStrategy.OnPush`
Aplicado en `HomePage` y `AddTaskFormComponent`. Angular solo re-renderiza cuando cambian sus signals/inputs, reduciendo ciclos de detección de cambios innecesarios.

### 2. Signals de Angular
El estado (`filteredTasks`, `pendingCount`, `completedCount`, `selectedCategory`, `showDeleteCompleted`) usa **signals** nativos. Los signals notifican cambios de forma granular, evitando re-renders completos.

### 3. `trackBy` en listas
`trackByTask` en `@for` para que Angular reutilice los elementos DOM al actualizar la lista en lugar de recrearlos.

### 4. Lazy Loading + `PreloadAllModules`
La ruta `/home` carga su componente de forma diferida y lo precarga en segundo plano tras el arranque inicial.

### 5. `HashLocationStrategy`
Configurado con `withHashLocation()` para que el enrutamiento funcione correctamente con el protocolo `file://` de Cordova en dispositivos.

### 6. Persistencia con `localStorage`
Las tareas persisten localmente sin llamadas de red.


