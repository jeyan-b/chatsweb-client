import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithoutRegComponent } from './without-reg.component';

describe('WithoutRegComponent', () => {
  let component: WithoutRegComponent;
  let fixture: ComponentFixture<WithoutRegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithoutRegComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithoutRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
