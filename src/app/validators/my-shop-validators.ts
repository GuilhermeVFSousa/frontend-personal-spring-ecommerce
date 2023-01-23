import { FormControl, ValidationErrors } from '@angular/forms';
export class MyShopValidators {

  // validação de espaços em branco
  static notOnlyWhitespace(control: FormControl): ValidationErrors{

    // se a vaidação falhar, retornará o erro, se passar, retornará null
    if((control.value != null) && (control.value.trim().length === 0)) {
      return {
        'notOnlyWhitespace': true
      };
    }
    else {
      return null;
    }
  }
}
