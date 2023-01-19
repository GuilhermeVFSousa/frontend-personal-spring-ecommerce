import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MyshopFormService } from '../../services/myshop-form.service';

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

  constructor(
    private myshopFormService: MyshopFormService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        houseNumber: [''],
        district: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        houseNumber: [''],
        district: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
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
    this.myshopFormService.getCrediCardMonths().subscribe(
      data => {
        console.log(`Meses do Cartão de Crédito recuperados: ${JSON.stringify(data)}`);
        this.creditCardMonths = data;
      }
    )

    // populando os anos do campo option do cartão de crédito
    this.myshopFormService.getCrediCardYears().subscribe(
      data => {
        console.log(`Anos recuperados para Cartão de Crédito: ${JSON.stringify(data)}`);
        this.creditCardYears = data;
      }
    )
  }

  onSubmit() {

  }

  copyShippingAddressToBillingAddress(event: any) {

    if(event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
      .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }

}
