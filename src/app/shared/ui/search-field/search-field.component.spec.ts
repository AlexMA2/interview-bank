import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SearchFieldComponent } from './search-field.component';
import { InputComponent } from '../input/input.component';

describe('SearchFieldComponent', () => {
    let fixture: ComponentFixture<SearchFieldComponent>;
    let component: SearchFieldComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SearchFieldComponent, InputComponent, ReactiveFormsModule, TranslateModule.forRoot()],
        }).compileComponents();
        fixture = TestBed.createComponent(SearchFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize control with defaultValue', () => {
        expect(component['control'].value).toBe(component.defaultValue() ?? null);
    });

    it('should emit new value after debounce', fakeAsync(() => {
        const spy = spyOn(component.searchValue, 'emit');
        component['control'].setValue('test');
        tick(component['debounceTime']);
        expect(spy).toHaveBeenCalledWith('test');
    }));

    it('should not emit if value did not change', fakeAsync(() => {
        const spy = spyOn(component.searchValue, 'emit');
        const val = component['control'].value;
        component['control'].setValue(val);
        tick(component['debounceTime']);
        expect(spy).not.toHaveBeenCalled();
    }));

    it('should emit null when cleared', fakeAsync(() => {
        const spy = spyOn(component.searchValue, 'emit');

        component['control'].setValue('not null');
        tick(component['debounceTime']);

        component['control'].setValue(null);
        tick(component['debounceTime']);

        expect(spy).toHaveBeenCalledWith(null);
    }));

    it('should unsubscribe on destroy', () => {
        component.ngOnDestroy();
        expect(component['sub']?.closed).toBeTrue();
    });
});
