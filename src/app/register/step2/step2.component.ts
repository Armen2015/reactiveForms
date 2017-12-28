import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { ValidatePass } from '../../validators/pass.validator';
import { Popup } from 'ng2-opd-popup';
import { Packages } from '../../models/packages';
import * as _ from "lodash";

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.css']
})
export class Step2Component implements OnInit {
  @Output() step2Data: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() prev: EventEmitter<boolean> = new EventEmitter<boolean>();
  step2: FormGroup;
  step2SubmitAttempt: boolean = false;
  userNameNotValid: boolean;
  sponsorUserName: string;
  sponsorFirstName: string;
  sponsorLastName: string;
  loading: boolean = false;
  showSponsor: boolean = false;
  errorSponser: boolean = false;
  isSponsorValid: boolean = false;
  btnSubm: boolean = false;
  infoSources = ['Google Search', 'Social Media', 'Friend'];
  patterns = {
    facebook: /(?:https?:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-\.]*)/,
    twitter: /(?:http:\/\/)?(?:www\.)?twitter\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/
  }
  packages = Packages;
  

  constructor(
    private fb: FormBuilder, 
    private userService: UserService,
    private popup: Popup
  ) { }

  ngOnInit() {
    this.sponsorUserName = '';
    // Form init
    this.step2 = this.fb.group({
      userName: [
        '', 
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.-]*$')
        ])
      ],
      password: ['', [ Validators.required, Validators.minLength(2), ValidatePass ]],
      confirmPassord: ['', [ Validators.required, Validators.minLength(2), ValidatePass ]],
      //pass - RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
      package:  ['', Validators.required],
      facebook: [
        '', 
        Validators.compose([
          Validators.required, 
          Validators.pattern(this.patterns.facebook)
        ])
      ],
      twitter: [
        '', 
        Validators.compose([
          Validators.required, 
          Validators.pattern(this.patterns.twitter)
        ])
      ],
      infoSource: [null, Validators.required],
      sponsorUserName:  '',
      sponsorFirstName: '',
      sponsorLastName:  ''
    });
    this.step2.get('sponsorUserName').disable();
    this.step2.get('sponsorFirstName').disable();
    this.step2.get('sponsorLastName').disable();
  }

  nextBtn() {
    let form = _.assign(this.step2);
    this.step2SubmitAttempt = true;
    if (!form.valid) {
      _.forEach(form.controls, element => {         
        element.markAsTouched({ onlySelf: true });       
      });
    } else {
      if(this.userNameNotValid) return;
      if(form.get('infoSource').value === 'Friend') {
        if(!this.isSponsorValid) {
          this.btnSubm = true;
          return;
        }
      }
      if(!this.isPassTheSame()) return;
      this.step2Data.emit(form);
      this.step2SubmitAttempt = false;
    }
  }

  // Previous button
  prevBtn() {
    this.prev.emit();
  }

  // Opens sponsor search window
  findSponsorWindowBtn(){
    // Popup window options
    this.popup.options = {
      header: "Sponsor Search",
      color: "#19B9E7", 
      widthProsentage: 65, 
      animationDuration: 1, 
      showButtons: true, 
      confirmBtnContent: "Search", 
      cancleBtnContent: "Cancel", 
      confirmBtnClass: "btn btn-next", 
      cancleBtnClass: "btn btn-next", 
      animation: "fadeInDown" // 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'bounceIn','bounceInDown' 
    };
    this.popup.show(this.popup.options);
  }

  //
  isPassTheSame() {
    let element = _.assign(this.step2.get('confirmPassord'));
    return !element.touched || (element.value == this.step2.get('password').value);
  }

  //
  findSponsorBtn(){
    this.errorSponser = false;
    if(this.sponsorUserName === '') return;
    if(!/\S/.test(this.sponsorUserName)) return;
    this.loading = true;
    this.sponsorUserName = this.sponsorUserName.trim();
    this.userService.findSponsor(this.sponsorUserName)
    .subscribe(
      data => {
        this.loading = false;
        if(!data) this.errorSponser = true;
        else {
          for(let key in data){
            if (key == 'sponsorFirstName') this.sponsorFirstName = data[key];
            if (key == 'sponsorLastName') this.sponsorLastName = data[key];
          }
          this.showSponsor = true;
        }
      },
      error => {}
    )
  }

  addSponsor(){
    this.step2.get('sponsorUserName').setValue(this.sponsorUserName);
    this.step2.get('sponsorFirstName').setValue(this.sponsorFirstName);
    this.step2.get('sponsorLastName').setValue(this.sponsorLastName);
    this.isSponsorValid = true;

    this.popup.hide();
    this.sponsorUserName = '';
    this.sponsorFirstName = '';
    this.sponsorLastName = '';
    this.showSponsor = false;
    this.errorSponser = false;
    this.btnSubm = false;
  }

  // Sets error class to an element, when it is not valid
  setClass(form_element: string) {
    if(form_element === 'userName') {
      return {
        'input-error': this.userNameNotValid || this.isFieldValid(form_element)
      };
    }
    if(form_element === 'confirmPassord') {
      return {
        'input-error': !this.isPassTheSame() || this.isFieldValid(form_element)
      };
    }
    return {
      'input-error': this.isFieldValid(form_element)
    };
  }

  // Checks form element valid or not
  isFieldValid(form_element: string) {
    let element = _.assign(this.step2.get(form_element));
    return !element.valid && element.touched || (element.untouched && this.step2SubmitAttempt);
  }

  // Perform package radio button click
  packageRadioBtnClick(value) {
    if(value === this.packages.premium) {
      this.step2.get('facebook').setValue('');
      this.step2.get('twitter').setValue('');
    }
    
    this.step2.get('package').setValue(value);
    this.packageDataChange();
  }

  //
  resetInfoSourceValues() {
    if(this.step2.get('infoSource').value != 'Friend') {
      this.step2.get('sponsorUserName').setValue('');
      this.step2.get('sponsorFirstName').setValue('');
      this.step2.get('sponsorLastName').setValue('');
    }
  }
  
  // 
  packageDataChange() {
    let packageType = this.step2.get('package').value;
    if(packageType === 'Standard Package') {
      this.updateValidators(this.step2.get('facebook'), [ 
        Validators.required,
        Validators.pattern(this.patterns.facebook)
      ]);
      this.updateValidators(this.step2.get('twitter'), [ 
        Validators.required,
        Validators.pattern(this.patterns.twitter) 
      ]);
      this.updateValidators(this.step2.get('infoSource'), []);
    }
    if(packageType === 'Premium Package') {
      this.updateValidators(this.step2.get('facebook'), []);
      this.updateValidators(this.step2.get('twitter'), []);
      this.updateValidators(this.step2.get('infoSource'), [ 
        Validators.required,
      ]);
    }
  }

  // Check if username exists
  checkUserName(element) {
    this.userService.checkUser(element.value)
    .subscribe(
      data => {
        this.userNameNotValid = <boolean>data;
      },
      error => {}
    );
  }

  // Set and update form element validators
  updateValidators(form_element, validator){
    form_element.setValidators(validator);
    form_element.updateValueAndValidity();
  }
}
