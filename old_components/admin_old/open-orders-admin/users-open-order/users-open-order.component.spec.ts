import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersOpenOrderComponent } from './users-open-order.component';

describe('UsersOpenOrderComponent', () => {
  let component: UsersOpenOrderComponent;
  let fixture: ComponentFixture<UsersOpenOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersOpenOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersOpenOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
