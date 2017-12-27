import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  step = 2;
  user: User;
  userInfo: User;

  constructor( private userService: UserService ) { }

  ngOnInit() {
    this.user = new User();
    this.userInfo = new User();
  }

  getFormData(e) {
    const form = JSON.parse(JSON.stringify(e.getRawValue()));// cast FormGroup object to default js object
    // sets form values to user object
    for(let key in form) {
      if(form[key] != null || key != 'confirmPassord') {
        this.user[key] = form[key];
      }
    }
   
    if(this.step == 3) {
      this.userInfo = null;
      this.userInfo = Object.create(this.user);
      this.userInfo.country = this.user.country.Country;
      this.userInfo.legal = this.user.legal.label;
      this.userInfo.shipCountry = this.user.shipCountry.Country;
    }
    this.step++;
    window.scrollTo(0, 0);
  }

  prev() {
    this.step--;
  }

  signUp() {
    this.userService.create(this.user)
    .subscribe(
        data => {
          console.log(data);
          this.step++;
        },
        error => { }
      );
  }

}
