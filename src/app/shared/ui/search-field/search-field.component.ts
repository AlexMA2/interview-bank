import { Component, input, OnDestroy, OnInit, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, filter, map, pairwise, startWith, Subscription } from 'rxjs';

import { InputComponent } from '../input/input.component';

@Component({
    selector: 'app-search-field',
    imports: [ReactiveFormsModule, TranslateModule, InputComponent],
    templateUrl: './search-field.component.html',
    styleUrl: './search-field.component.scss',
})
export class SearchFieldComponent implements OnInit, OnDestroy {
    /**
     * The default value of the search field. Its optional
     */
    public readonly defaultValue = input<string | undefined>();
    /**
     * Search value event. Null if the search field is empty
     */
    public readonly searchValue = output<string | null>();
    /**
     * The form control for the search field
     */
    protected control = new FormControl<string | null>(this.defaultValue() ?? null);
    /**
     * The debounce time for the search
     */
    private readonly debounceTime = 300;
    /**
     * The subscription method to unsubscribe and avoid memory leaks
     */
    private sub?: Subscription;

    ngOnInit(): void {
        this.controlValueChanges();
    }

    /**
     * Subscribe to the value changes of the search field.
     * Add a devounce time, set the first value to the default value, compare the value to check change
     * and emit the new value
     */
    private controlValueChanges(): void {
        this.sub = this.control.valueChanges
            .pipe(
                debounceTime(this.debounceTime),
                startWith(this.defaultValue() ?? null),
                pairwise(),
                filter(([prev, next]) => prev !== next),
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                map(([_, next]) => next)
            )
            .subscribe((val) => this.searchValue.emit(val));
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }
}
