import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomOrdersComponent } from './custom-orders.component';

describe('CustomOrdersComponent', () => {
  let component: CustomOrdersComponent;
  let fixture: ComponentFixture<CustomOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
