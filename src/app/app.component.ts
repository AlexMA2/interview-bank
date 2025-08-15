import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BaseUrlInterceptor } from '@core/interceptors/base-url.interceptor';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from '@shared/ui/header/header.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, HeaderComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: BaseUrlInterceptor,
            multi: true,
        },
    ],
})
export class AppComponent {
    title = 'interview-bank';

    private translate = inject(TranslateService);

    constructor() {
        this.translate.addLangs(['es']);
        this.translate.setFallbackLang('es');
        this.translate.use('es');
    }
}
