import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import localeTr from '@angular/common/locales/tr';
import { registerLocaleData } from '@angular/common';
import { providePrimeNG } from 'primeng/config';
import { tr } from 'primelocale/tr.json';
import Aura from '@primeng/themes/aura';
import { MessageService } from 'primeng/api';

import { routes } from './app.routes';

import { httpProblemInterceptor } from '../app/core/interceptors/http-problem-interceptor';

registerLocaleData(localeTr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([httpProblemInterceptor])),
    provideAnimations(),
    { provide: LOCALE_ID, useValue: 'tr' },
    providePrimeNG({
      theme: {
        preset: Aura
      },
      ripple: true,
      translation: tr
    }),
    MessageService
  ]
};
