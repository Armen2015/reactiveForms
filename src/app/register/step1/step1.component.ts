import { Component, OnInit, Input,  Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Options } from '../../models/options';
import { User } from '../../models/user';


@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.css']
})
export class Step1Component implements OnInit {

  @Output() step1Data: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  step1: FormGroup;
  isDataChecked: boolean;
  isLegalCompany: boolean;
  options: any;
  step1SubmitAttempt: boolean;

  constructor( 
    private fb: FormBuilder,
    private userService: UserService, 
  ) { }

  ngOnInit() {
    this.isDataChecked = false;
    this.isLegalCompany = false;
    this.options = Options;

    // Form init
    this.step1 = this.fb.group({
      firstName:      ['', Validators.required],
      lastName:       ['', Validators.required],
      country:        [null, Validators.required],
      city:           ['', Validators.required],
      address:        ['', Validators.required],
      address2:       '',
      postalCode:     ['', Validators.required],
      legal:          [null, Validators.required],
      companyName:    '',
      isDataChecked:  this.isDataChecked,
      shipCountry:    [null, Validators.required],
      shipCity:       ['', Validators.required],
      shipAddress:    ['', Validators.required],
      shipAddress2:   '',
      shipPostalCode: ['', Validators.required]
    });
    this.emitCheckboxClick();
  }

  // Next button
  nextBtn() {
    var form = this.step1;
    this.step1SubmitAttempt = true;
    if (!form.valid) {
      Object.keys(form.controls).forEach(field => { 
        var control = form.get(field);            
        control.markAsTouched({ onlySelf: true });       
      });
    }
    else {
      this.step1Data.emit(form);
      this.step1SubmitAttempt = false;
    } 
  }

  // Sets error class to an element, when it is not valid
  setClass(form_element: string) {
    if( this.isDataChecked && form_element.substring(0, 4) === 'ship') {
      return {
        'disabled': true
      };
    }
    return {
      'input-error': this.isFieldValid(form_element)
    };
  }

  // Checks form element valid or not
  isFieldValid(form_element: string) {
    var element = this.step1.get(form_element);
    return !element.valid && element.touched || (element.untouched && this.step1SubmitAttempt);
  }

  // Perform checkbox click
  emitCheckboxClick(){
    this.isDataChecked = !this.isDataChecked;
    this.inputsStateToggle();
    var element = this.step1.get('isDataChecked');
    element.setValue(!element.value);
  }

  // If checkbox triggered, add filled data to shiping data or disable inputs
  inputsStateToggle() {
    if(this.isDataChecked) {
      for(var key in this.step1.controls) {
        if(key.substring(0, 4) === 'ship') {
          var dataKey = key.slice(4);
          dataKey = dataKey.charAt(0).toLowerCase() + dataKey.slice(1);
          this.step1.get(key).disable();
          this.step1.get(key).setValue(this.step1.get(dataKey).value);
        }
      }
    }
    else {
      for(var key in this.step1.controls) {
        if(key.substring(0, 4) === 'ship') {
          this.step1.get(key).enable();
        }
      }
    }
  }

  // watch for data changes
  shippingDataChange(form_element){
    var form = this.step1;
    if(form_element === 'country'){
      var regex = form.get('country').value.Regex;
      form.get('postalCode').setValidators([
          Validators.required,
          Validators.pattern(regex)
      ]);
      form.get('postalCode').updateValueAndValidity();
    }
    if(form_element === 'shipCountry'){
      var regex = form.get('shipCountry').value.Regex;
      form.get('shipPostalCode').setValidators([
          Validators.required,
          Validators.pattern(regex)
      ]);
      form.get('shipPostalCode').updateValueAndValidity();
    }
    if(form_element === 'legal'){
      var value = form.get(form_element).value.label;
      if(value === 'Company'){
        this.isLegalCompany = true;
        this.updateValidators(form.get('companyName'), [ Validators.required ]);
        return;
      }
      this.updateValidators(form.get('companyName'), []);
      this.isLegalCompany = false;
      form.get('companyName').setValue('');
      return;
    }

    // If checkbox checked, watch for data changes
    if(!this.isDataChecked) return;
    var shipKey = 'ship' + form_element.charAt(0).toUpperCase() + form_element.slice(1);
    form.get(shipKey).setValue(form.get(form_element).value);
  }

  // Set and update form element validators
  updateValidators(form_element, validator){
    form_element.setValidators(validator);
    form_element.updateValueAndValidity();
  }
}
