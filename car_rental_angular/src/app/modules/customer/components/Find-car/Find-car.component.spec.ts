import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindCarComponent } from './Find-car.component';

describe('SearchCarComponent', () => {
  let component: FindCarComponent;
  let fixture: ComponentFixture<FindCarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FindCarComponent]
    });
    fixture = TestBed.createComponent(FindCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
