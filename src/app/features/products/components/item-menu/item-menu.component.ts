import { Component, HostListener, input, output, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-item-menu',
    imports: [RouterModule, TranslateModule],
    templateUrl: './item-menu.component.html',
    styleUrl: './item-menu.component.scss'
})
export class ItemMenuComponent {

    public id = input<string>();

    public deleteId = output<string>();

    /**
     * Represents the open/closed state of the menu.
     * This is a writeable signal that is updated when the menu is toggled or closed.
     */
    public isOpen = signal(false);

    /**
     * Toggles the open/closed state of the menu.
     * Updates the `isOpen` signal with the new value.
     */
    public toggleMenu(): void {
        this.isOpen.update(value => !value);
    }

    /**
     * Closes the menu when a click occurs outside the component's container.
     * This method uses a HostListener to listen for click events on the entire document.
     * @param {MouseEvent} event The click event.
     * @returns {void}
     */
    @HostListener('document:click', ['$event'])
    public onClickOutside(event: MouseEvent): void {
        // Check if the menu is open and the click was not inside the menu container.
        // The 'closest' method is used to check if the click target is within the component's host element.
        if (this.isOpen() && !(event.target as HTMLElement).closest('.menu-container')) {
            this.isOpen.set(false);
        }
    }

    public onDelete(): void {
        if (!this.id()) return
         this.isOpen.set(false);
        this.deleteId.emit(this.id()!);
    }
}
