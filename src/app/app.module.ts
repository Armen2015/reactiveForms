import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './services/user.service';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { MyDate } from './pipes/myDate.pipe';
import { CardNumber } from './pipes/cardNumber.pipe';
import { PopupModule } from 'ng2-opd-popup';
import { RegisterComponent } from './register/register.component';
import { Step1Component } from './register/step1/step1.component';
import { Step2Component } from './register/step2/step2.component';
import { Step3Component } from './register/step3/step3.component';
import { Step4Component } from './register/step4/step4.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MyDate,
    CardNumber,
    RegisterComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    HttpClientModule,
    HttpModule,
    PopupModule.forRoot()
  ],
  providers: [
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
