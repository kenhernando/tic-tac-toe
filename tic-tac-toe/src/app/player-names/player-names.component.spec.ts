import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerNamesComponent } from './player-names.component';

describe('PlayerNamesComponent', () => {
  let component: PlayerNamesComponent;
  let fixture: ComponentFixture<PlayerNamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerNamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
