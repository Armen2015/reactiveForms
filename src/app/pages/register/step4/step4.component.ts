import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../models/user';
import { Packages } from '../../../models/packages';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.css']
})
export class Step4Component  {
  @Input()  user: User;
  @Output() signup: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() prev: EventEmitter<boolean> = new EventEmitter<boolean>();
  packages = Packages;
  empty = 'Not metioned';
  
  // Previous button
  prevBtn() {
    this.prev.emit();
  }

  // Sign up button
  signUpBtn() {
    this.signup.emit();
  }
}
