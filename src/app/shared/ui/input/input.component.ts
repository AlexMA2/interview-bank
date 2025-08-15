import { Component, forwardRef, input, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-input',
    imports: [],
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true,
        },
    ],
})
export class InputComponent {
    public readonly label = input<string | undefined>();
    public readonly placeholder = input<string | undefined>();
    public readonly type = input<string>('text');

    protected value = signal('');
    protected isDisabled = signal(false);

    private onChange = (value: string) => {};
    private onTouched = () => {};

    writeValue(value: string): void {
        this.value.set(value);
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled.set(isDisabled);
    }

    onInput(event: any): void {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        this.value.set(value);
        this.onChange(value);
    }

    onBlur(): void {
        this.onTouched();
    }
}
