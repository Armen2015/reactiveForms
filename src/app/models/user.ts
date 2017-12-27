export class User {
    id: number;
    firstName: string;
    lastName: string;
    country: any;
    city: string;
    address: string;
    address2: string;
    postalCode: string;
    legal: any;
    companyName: any;
    // shipping data
    shipCountry: any;
    shipCity: string;
    shipAddress: string;
    shipAddress2: string;
    shipPostalCode: string;
    //   ----
    userName: string;
    password: string;
    package: string;
    infoSource: string;
    sponsorUserName: string;
    sponsorFirstName: string;
    sponsorLastName: string;
    
    // user card data
    cardNumber: string;
    cardName: string;
    cardCvc: number;
    cardExpDate: string;
}
