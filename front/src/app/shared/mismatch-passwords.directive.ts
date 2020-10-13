import { Directive } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

/** A user's password can't mismatch the user's confirm password */
export const mismatchPasswordsValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('password');
  const confirm_password = control.get('confirm_password');

  return (password && confirm_password && (password.value === confirm_password.value)) ? null : { mismatchPasswords: true };
};

@Directive({
  selector: '[appMismatchPasswords]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MismatchPasswordsValidatorDirective, multi: true }]
})
export class MismatchPasswordsValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors {
    return mismatchPasswordsValidator(control);
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/