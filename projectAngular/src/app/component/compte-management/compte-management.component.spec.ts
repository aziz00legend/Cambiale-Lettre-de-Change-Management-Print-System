import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompteManagementComponent } from './compte-management.component';

describe('CompteManagementComponent', () => {
  let component: CompteManagementComponent;
  let fixture: ComponentFixture<CompteManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompteManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompteManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
