import { AbstractControl } from '@angular/forms';
import * as _ from "lodash";

export function ValidatePass(control: AbstractControl) {
  let value = _.assign(control.value);
  if (!/\d/.test(value) 
      || !/[a-z]/.test(value) 
      || !/[A-Z]/.test(value)
      || !/[#-/:-@{-~!"^_`\[\]]/.test(value)
    ) {
    return { validPass: true };
  }
  return null;
}