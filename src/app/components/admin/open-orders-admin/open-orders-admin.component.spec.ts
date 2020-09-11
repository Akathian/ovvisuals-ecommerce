import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenOrdersAdminComponent } from './open-orders-admin.component';

describe('OpenOrdersAdminComponent', () => {
  let component: OpenOrdersAdminComponent;
  let fixture: ComponentFixture<OpenOrdersAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenOrdersAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenOrdersAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
