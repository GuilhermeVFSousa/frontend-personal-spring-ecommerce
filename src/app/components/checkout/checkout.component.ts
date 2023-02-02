import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MyshopFormService } from '../../services/myshop-form.service';
import { Pais } from '../../models/pais';
import { Estado } from '../../models/estado';
import { Cidade } from '../../models/cidade';
import { ToastrService } from 'ngx-toastr';
import { MyShopValidators } from '../../validators/my-shop-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../models/order';
import { OrderItem } from '../../models/order-item';
import { Purchase } from '../../models/purchase';
import { delay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaymentInfo } from '../../models/payment-info';

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

  storage: Storage = localStorage;

  theEmailRead: string = this.storage.getItem('userEmail').slice(1, length - 1);

  // initialize Stripe API
  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";

  constructor(
    private myshopFormService: MyshopFormService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router) { }

  ngOnInit(): void {

    // setup Stripe payment form
    this.setupStripePaymentForm();

    this.reviewCartDetails();

    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), MyShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), MyShopValidators.notOnlyWhitespace]),
        email: new FormControl(theEmail,[Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]) // mascara para validar e-mail
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
        country: new FormControl('', [Validators.required,]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8), MyShopValidators.notOnlyWhitespace,Validators.pattern('[0-9]{8}')]),
      }),
      creditCard: this.formBuilder.group({
        /*
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), MyShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.minLength(16), Validators.maxLength(16), MyShopValidators.notOnlyWhitespace, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(3), MyShopValidators.notOnlyWhitespace, Validators.pattern('[0-9]{3}')]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required])
        */
      })
    });

    /*
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
    */

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

    // credit card form
    get cardType() { return this.checkoutFormGroup.get('creditCard.cardType') }
    get nameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard') }
    get cardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber') }
    get securityCode() { return this.checkoutFormGroup.get('creditCard.securityCode') }
    get expirationMonth() { return this.checkoutFormGroup.get('creditCard.expirationMonth') }
    get expirationYear() { return this.checkoutFormGroup.get('creditCard.expirationYear') }



  onSubmit() {

    console.log("Manipulando o botão submit");

    // validação ao enviar
    if (!this.checkoutFormGroup.valid) {
      this.checkoutFormGroup.markAllAsTouched();
      this.checkoutFormGroup.status;
      this.toast.warning('Verifique o preenchimento dos campos');
      alert(`VERIFICAR E ARRUMAR O VALIDATION`);
      console.log(this.checkoutFormGroup.valid);
      console.log(this.checkoutFormGroup.status);
      console.error();
      return;
    }

    // config order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItems;

    // criar orderItems a partir do cartItems
    // caminho longo -----------------
    /*let orderItems: OrderItem[] = [];
      for (let i = 0; i < cartItems.length; i++) {
      orderItems[i] = new OrderItem(cartItems[i]);
    }*/
    // caminho curto -----------------
    let orderItems: OrderItem[] = cartItems.map(
      tempCartItem => new OrderItem(tempCartItem)
    );

    // config purchase
    let purchase = new Purchase();

    // popular purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // popular purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: Estado = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Pais = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    const shippingCity: Cidade = JSON.parse(JSON.stringify(purchase.shippingAddress.city));
    purchase.shippingAddress.country = shippingCountry.nomePT;
    purchase.shippingAddress.state = shippingState.nome;
    purchase.shippingAddress.city = shippingCity.nome;

    // popular purchase -billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: Estado = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Pais = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    const billingCity: Cidade = JSON.parse(JSON.stringify(purchase.billingAddress.city));
    purchase.billingAddress.country = billingCountry.nomePT;
    purchase.billingAddress.state = billingState.nome;
    purchase.billingAddress.city = billingCity.nome;

    // popular purchase - order e orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // calcular payment info
    this.paymentInfo.amount = this.totalPrice * 100;
    this.paymentInfo.currency = "BRL";

    // se o formulário for válido então
    // - crie o payment intent
    // - confirmar card payment
    // - place order

    if(!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {
      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement
              }
            })
        }
      );
    }

  }

  resetCart() {
    // resetar os dados do carrinho
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // resetar o formulário
    this.checkoutFormGroup.reset();

    // navegar até a página de produtos
    this.router.navigateByUrl("/produtos");

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

  setupStripePaymentForm() {

    // get a handle to stripe elements
    var elements =  this.stripe.elements();

    // criar um card element ... and fide the zip-code field
    this.cardElement = elements.create('card', { hidePostalCode: true} );

    // Add uma instância do card UI componentdentro da div card-element
    this.cardElement.mount('#card-element');

    // Add event binding fro the 'change' event on the card element
    this.cardElement.on('change', (event: any) => {

      // get a handle to card-errors element
      this.displayError = document.getElementById('card-errors');

      if(event.complete) {
        this.displayError.textContent = "";
      } else if(event.error) {
        // show validation error to customer
        this.displayError.textContent = event.console.error.message;

      }


    });
  }

  reviewCartDetails() {
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    //subscribe para o totalQuantity do cart
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

}
