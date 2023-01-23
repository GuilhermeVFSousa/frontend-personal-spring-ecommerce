import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MyshopFormService } from '../../services/myshop-form.service';
import { Pais } from '../../models/pais';
import { Estado } from '../../models/estado';
import { Cidade } from '../../models/cidade';
import { ToastrService } from 'ngx-toastr';
import { MyShopValidators } from '../../validators/my-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  paises: Pais[] = [];

  shippingAddressEstados: Estado[] = [];
  billingAddressEstados: Estado[] = [];

  shippingAddressCidades: Cidade[] = [];
  billingAddressCidades: Cidade[] = [];

  constructor(
    private myshopFormService: MyshopFormService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), MyShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), MyShopValidators.notOnlyWhitespace]),
        email: new FormControl('',[Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]) // mascara para validar e-mail
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), MyShopValidators.notOnlyWhitespace]),
        houseNumber: new FormControl('', [Validators.required, Validators.minLength(1), MyShopValidators.notOnlyWhitespace]),
        district: new FormControl('', [Validators.required, Validators.minLength(2), MyShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8), MyShopValidators.notOnlyWhitespace]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), MyShopValidators.notOnlyWhitespace]),
        houseNumber: new FormControl('', [Validators.required, Validators.minLength(1), MyShopValidators.notOnlyWhitespace]),
        district: new FormControl('', [Validators.required, Validators.minLength(2), MyShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8), MyShopValidators.notOnlyWhitespace]),
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    // populando os meses do campo option do cartão de crédito
    const startMonth: number = new Date().getMonth() + 1; // neste método, inicia no mês 0

    this.myshopFormService.getCrediCardMonths(startMonth).subscribe(
      data => {
        console.log(`Meses do Cartão de Crédito recuperados: ${JSON.stringify(data)}`);
        this.creditCardMonths = data;
      }
    );

    // populando os anos do campo option do cartão de crédito
    this.myshopFormService.getCrediCardYears().subscribe(
      data => {
        console.log(`Anos recuperados para Cartão de Crédito: ${JSON.stringify(data)}`);
        this.creditCardYears = data;
      }
    );

    // populando paises;
    this.myshopFormService.getPaises().subscribe(
      data => {
        this.paises = data;
      }
    );
  }

  // getters de acesso para exibir as mensagens de erro no HTML
  // customer form
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

   // shipping address form
   get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
   get shippingAddressHouseNumber() { return this.checkoutFormGroup.get('shippingAddress.houseNumber'); }
   get shippingAddressDistrict() { return this.checkoutFormGroup.get('shippingAddress.district'); }
   get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
   get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
   get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
   get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

    // billing address form
    get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
    get billingAddressHouseNumber() { return this.checkoutFormGroup.get('billingAddress.houseNumber'); }
    get billingAddressDistrict() { return this.checkoutFormGroup.get('billingAddress.district'); }
    get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
    get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
    get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
    get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }



  onSubmit() {



    console.log("Manipulando o botão submit");

    // validação ao enviar
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      this.toast.warning('Verifique o preenchimento dos campos');
    } else {
      console.log(this.checkoutFormGroup.get('customer')?.value);
      console.log("shippingAddress");
      console.log(this.checkoutFormGroup.get('shippingAddress')?.value);
      console.log("billingAddress");
      console.log(this.checkoutFormGroup.get('billingAddress')?.value);
    }


  }

  copyShippingAddressToBillingAddress(event: any) {

    if(event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
      .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      // bug fix para Estados e Cidades
      this.billingAddressEstados = this.shippingAddressEstados;
      this.billingAddressCidades = this.shippingAddressCidades;
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      // bug fix para Estados e Cidades
      this.billingAddressEstados = [];
      this.billingAddressCidades = [];
    }
  }

  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    // se o ano atual for igual ao ano selecionado, começará com o mês atual

    let startMonth: number;

    if(currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1; // o primeiro mês é 0
    }
    else {
      startMonth =  1;
    }

    this.myshopFormService.getCrediCardMonths(startMonth).subscribe(
      data => {

        this.creditCardMonths =  data;
        console.log(`Meses do Cartão de Crédito recuperados: ${JSON.stringify(data)}`);
      }
    );
  }

  getEstados(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const paisSigla = formGroup?.value.country.sigla;
    const paisNome = formGroup?.value.country.nomePT; // apenas para fim de registro. Usará somente a sigla

    console.log(`${formGroupName} pais sigla: ${paisSigla}`);
    console.log(`${formGroupName} pais nome: ${paisNome}`);

    this.myshopFormService.getEstados(paisSigla).subscribe(
      data => {
        if(formGroupName === 'shippingAddress') {
          this.shippingAddressEstados = data;
        }
        else {
          this.billingAddressEstados = data;
        }

        // selecionar o primeiro item por default
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }

  getCidades(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const estadoUF = formGroup?.value.state.uf;
    const estadoNome = formGroup?.value.state.nome; // apenas para fim de registro. Usará somente a sigla

    console.log(`${formGroupName} estado uf: ${estadoUF}`);
    console.log(`${formGroupName} estado nome: ${estadoNome}`);

    this.myshopFormService.getCidades(estadoUF).subscribe(
      data => {
        if(formGroupName === 'shippingAddress') {
          this.shippingAddressCidades = data;
        }
        else {
          this.billingAddressCidades = data;
        }

        // selecionar o primeiro item por default
        formGroup?.get('city')?.setValue(data[0]);
      }
    );
  }

}
