import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomUserOrderComponent } from './custom-user-order.component';

describe('CustomUserOrderComponent', () => {
  let component: CustomUserOrderComponent;
  let fixture: ComponentFixture<CustomUserOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomUserOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomUserOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
