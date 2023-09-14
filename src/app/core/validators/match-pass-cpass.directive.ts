import {
    AbstractControl, ValidationErrors
}
from '@angular/forms';


export function MustMatchValidatorFunction(control: AbstractControl):ValidationErrors |null {
    const password = control.get('password');
    const confirmPasssword = control.get('cpassword');
    const result = password && confirmPasssword && password.value !== confirmPasssword.value ? {
        'passwordNoMatch': true
    }
    : null;
    return result;
}
