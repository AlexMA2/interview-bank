import { Component, input, OnDestroy, OnInit, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, filter, map, pairwise, Subscription } from 'rxjs';

import { InputComponent } from '../input/input.component';

@Component({
    selector: 'app-search-field',
    imports: [ReactiveFormsModule, TranslateModule, InputComponent],
    templateUrl: './search-field.component.html',
    styleUrl: './search-field.component.scss',
})
export class SearchFieldComponent implements OnInit, OnDestroy {
    public readonly defaultValue = input<string | undefined>();
    public readonly search = output<string | null>();
    protected control = new FormControl('');
    private readonly debounceTime = 300;
    private sub?: Subscription;

    ngOnInit(): void {
        this.sub = this.control.valueChanges
            .pipe(
                debounceTime(this.debounceTime),
                pairwise(),
                filter(([prev, next]) => prev !== next),
                map(([_, next]) => next)
            )
            .subscribe((val) => this.search.emit(val));
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }
}
