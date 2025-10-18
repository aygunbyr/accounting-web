import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

type ProblemDetails = {
    type?: string;
    title?: string;
    status?: number;
    detail?: string;
    errors?: Record<string, string[]>;
    traceId?: string;
} & Record<string, unknown>;

export const httpProblemInterceptor: HttpInterceptorFn = (req, next) => {
    const toast = inject(MessageService);

    return next(req).pipe(
        catchError((err: HttpErrorResponse) => {
            const isProblemJson =
                (err.headers?.get('content-type') || '').includes('application/problem+json') ||
                (typeof err.error === 'object' && (!!err.error?.title || !!err.error?.errors));

            if (isProblemJson) {
                const p = (err.error || {}) as ProblemDetails;

                // Ana başlık + detay (varsa)
                const summary = p.title || `İstek hatası`;
                const detail =
                    (typeof p.detail === 'string' && p.detail.trim().length > 0)
                        ? p.detail
                        : `Sunucu ${p.status ?? err.status} döndürdü.`;

                toast.add({ severity: 'error', summary, detail, life: 8000 });

                // ModelState / validation hataları (errors sözlüğü)
                if (p.errors && typeof p.errors === 'object') {
                    for (const [field, arr] of Object.entries(p.errors)) {
                        (arr || []).forEach(msg => {
                            toast.add({
                                severity: 'warn',
                                summary: field,
                                detail: msg,
                                life: 8000
                            });
                        });
                    }
                }

                // TraceId varsa bilgi amaçlı küçük bir not (opsiyonel)
                if (p.traceId) {
                    toast.add({
                        severity: 'info',
                        summary: 'İzleme Kodu',
                        detail: String(p.traceId),
                        life: 6000
                    });
                }
            } else {
                // Ağ kesintisi, CORS, beklenmeyen HTML/tekst vb.
                const generic =
                    err.status === 0
                        ? 'Ağ bağlantısı veya CORS sorunu.'
                        : `Beklenmeyen hata (${err.status}).`;
                toast.add({
                    severity: 'error',
                    summary: 'Hata',
                    detail: generic,
                    life: 8000
                });
            }

            return throwError(() => err);
        })
    );
};
