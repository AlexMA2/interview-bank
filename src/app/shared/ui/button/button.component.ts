import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
} from '@angular/core';

@Component({
    selector: 'app-button',
    imports: [],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
    /**
     * Label to show in the button
    */
    label = input<string | undefined>(undefined);
    /**
     * Color of the button
     */
    color = input<'primary' | 'secondary'>('primary');
    /**
     * Flag to indicate if button is disabled
    */
    disabled = input(false);
    /**
     * Emit after button is clicked
     */
    afterClick = output<void>();

    /**
     * Handle button click emit
     */
    public onAfterClick() {
        this.afterClick.emit();
    }
}
