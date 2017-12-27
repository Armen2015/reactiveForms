import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.css']
})
export class Step3Component implements OnInit {
  @Output() step3Data: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() prev: EventEmitter<boolean> = new EventEmitter<boolean>();
  step3: FormGroup;
  cardDateValid: boolean;
  cardNumberValid: boolean;
  cardType: string;
  cardMask = '0000 0000 0000 000';
  step3SubmitAttempt: boolean = false;
  
  constructor( private fb: FormBuilder ) { }

  ngOnInit() {
    
    this.cardDateValid = true;
    this.cardNumberValid = false;
    this.cardType = null;

    this.step3 = this.fb.group({
      cardNumber: ['', Validators.required],
      cardName:   ['', Validators.required],
      cardCvc: [
          '', 
          Validators.compose([
            Validators.required, 
            Validators.minLength(3),
            Validators.pattern('^[0-9]+$')
          ])
      ],
      cardExpDate: ['', Validators.required]
    });
  }

  nextBtn() {
    const form = this.step3;
    this.step3SubmitAttempt = true;
    if (!form.valid) {
      Object.keys(form.controls).forEach(field => { 
        const control = form.get(field);            
        control.markAsTouched({ onlySelf: true });       
      });
    } else {
        if(!this.cardDateValid || !this.cardNumberValid) return;
        this.step3Data.emit(form);
        this.step3SubmitAttempt = false;
    }
  }

  // Previous button
  prevBtn() {
    this.prev.emit();
  }

  // Sets error class to an element, when it is not valid
  setClass(form_element: string) {
    const form = this.step3;
    return {
      'input-error': this.isFieldValid(form_element)
    };
  }

  // Checks form element valid or not
  isFieldValid(form_element: string) {
    let element = this.step3.get(form_element);
    return !element.valid && element.touched || (element.untouched && this.step3SubmitAttempt);
  }

  //
  cardNumberInValidClass() {
    if(this.step3SubmitAttempt && !this.cardNumberValid) {
      return { 'input-error': true }
    }
    return { 'input-error': false }
  }

  // Validates card number
  numberChange() {
    let value = this.step3.get('cardNumber').value;
    this.cardType =  this.detectCardType(value);
    if(this.cardType !== 'amex') this.cardMask = '0000 0000 0000 0000';
    else this.cardMask = '0000 0000 0000 000';
    if(value.length === 16 || (this.cardType === 'amex' && value.length === 15)) this.cardNumberValid = true;
    else this.cardNumberValid = false;
  }

  // Watch for date changes
  dateChange(e) {
    if(e.length == 4) {
      let date = new Date();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      
      let cardDateMonth = +e.substring(0, 2);
      let cardDateYear = +('20' + e.substring(2));
   
      if(cardDateYear === year && cardDateMonth > month) this.cardDateValid = true;
      if(cardDateYear < year) this.cardDateValid = false;
      if( cardDateYear > year && cardDateYear <= (year + 10) ) this.cardDateValid = true;
    }
    else this.cardDateValid = false;
  }

  // Checks date
  checkDate(e, position, start, end) {
    let length = e.target.value.length;
    if(e.target.value[2] === '/' && position == 2) position = 3;

    if(length === position) {
      if(length == 1 && e.target.value[0] == '0') start = 1;
      if(length == 1 && e.target.value[0] == '1') { start = 0; end = 2; }
    
      if(!(e.key >= start && e.key <= end)) {
        e.preventDefault();
        return true;
      }
    }
    return false;
  }

  // Listen to keydown events
  @HostListener('keydown', ['$event']) onKeyDown(e) {
    // enable backspace 
    if(e.keyCode == 8) return;
    if(e.target.name === "form_credit_card_expiration_date") {
      if(this.checkDate(e, 0, 0, 1)) return;
      if(this.checkDate(e, 1, 0, 9)) return;
      if(this.checkDate(e, 2, 1, 2)) return;
      if(this.checkDate(e, 4, 0, 9)) return;
      return;
    }
  }

  // 
  detectCardType(number) {
    let re = {
        electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
        maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
        visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        mastercard: /^5[1-5][0-9]{14}$/,
        amex: /^3[47][0-9]{13}$/,
        discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
        //dankort: /^(5019)\d+$/,
        //interpayment: /^(636)\d+$/,
        //unionpay: /^(62|88)\d+$/,
        //diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
        //jcb: /^(?:2131|1800|35\d{3})\d{11}$/
    }

    for(let key in re) {
        if(re[key].test(number)) {
            return key
        }
    }
    return null;
  }
}
