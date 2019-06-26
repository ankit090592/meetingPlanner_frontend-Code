import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPlannerComponent } from './user-planner.component';

describe('UserPlannerComponent', () => {
  let component: UserPlannerComponent;
  let fixture: ComponentFixture<UserPlannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPlannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});