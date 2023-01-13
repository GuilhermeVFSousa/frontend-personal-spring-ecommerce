import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoCategoriaMenuComponent } from './produto-categoria-menu.component';

describe('ProdutoCategoriaMenuComponent', () => {
  let component: ProdutoCategoriaMenuComponent;
  let fixture: ComponentFixture<ProdutoCategoriaMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdutoCategoriaMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutoCategoriaMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
