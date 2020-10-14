import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GallUploadComponent } from './gall-upload.component';

describe('GallUploadComponent', () => {
  let component: GallUploadComponent;
  let fixture: ComponentFixture<GallUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GallUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GallUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
