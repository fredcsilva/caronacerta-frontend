import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotaoWizard } from './botao-wizard';

describe('BotaoWizard', () => {
  let component: BotaoWizard;
  let fixture: ComponentFixture<BotaoWizard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotaoWizard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotaoWizard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
