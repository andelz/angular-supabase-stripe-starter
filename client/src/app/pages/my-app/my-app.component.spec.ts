import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAppComponent } from './my-app.component';

describe('MyAppComponent', () => {
  let component: MyAppComponent;
  let fixture: ComponentFixture<MyAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAppComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
