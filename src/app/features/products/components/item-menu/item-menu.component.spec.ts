import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { ItemMenuComponent } from './item-menu.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
    template: `<app-item-menu [id]="idSignal()" (deleteId)="deleteSpy($event)"></app-item-menu>`,
    standalone: false
})
class HostComponent {
    idSignal = signal('123'); // writable in host
    received: string | null = null;
    deleteSpy(id: string) {
        this.received = id;
    }
}

describe('ItemMenuComponent', () => {
    let host: HostComponent;
    let fixture: ComponentFixture<HostComponent>;
    let translateServiceSpy: jasmine.SpyObj<TranslateService>;

    beforeEach(async () => {
        translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant', 'get']);

        await TestBed.configureTestingModule({
            imports: [ItemMenuComponent, TranslateModule.forRoot(), RouterModule],
            declarations: [HostComponent],
            providers: [{ provide: TranslateService, useValue: translateServiceSpy }]
        }).compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(host).toBeTruthy();
    });

    it('should toggle menu open/closed', () => {
        const menu = fixture.debugElement.children[0].componentInstance as ItemMenuComponent;
        expect(menu.isOpen()).toBeFalse();
        menu.toggleMenu();
        expect(menu.isOpen()).toBeTrue();
        menu.toggleMenu();
        expect(menu.isOpen()).toBeFalse();
    });

    it('should emit deleteId and close menu', () => {
        const menu = fixture.debugElement.children[0].componentInstance as ItemMenuComponent;
        menu.isOpen.update(() => true);
        menu.onDelete();
        fixture.detectChanges()
        expect(host.received).toBe('123');
        expect(menu.isOpen()).toBeFalse();
    });

    it('should close menu on click outside', () => {
        const menu = fixture.debugElement.children[0].componentInstance as ItemMenuComponent;
        menu.isOpen.update(() => true);
        spyOn(HTMLElement.prototype, 'closest').and.returnValue(null); // outside click
        menu.onClickOutside(new MouseEvent('click'));
        expect(menu.isOpen()).toBeFalse();
    });
});
