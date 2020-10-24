import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import { AES } from 'crypto-ts';
declare var require: any
var CryptoTS = require("crypto-ts");

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit 
{

  loginUserData = {}
  
  private _loginUrl = "http://localhost:5000/api/auth";

  constructor(private http: HttpClient,private _router: Router) { }

  ngOnInit() 
  {
    
    
  }

  public FunDCT_encrypt(anyData:any, cDataType:string) {
    let anyEncryptedData:any;
    switch(cDataType) { 
        case 'String': { 
            anyEncryptedData = CryptoTS.AES.encrypt(anyData, 'JWT_WWA@CRYPTO').toString(CryptoTS.enc.Base64);
            break;
        }
        case 'Object': { 
            anyEncryptedData = CryptoTS.AES.encrypt(JSON.stringify(anyData), 'JWT_WWA@CRYPTO').toString(CryptoTS.enc.Base64);
            break; 
        }
        default: {
            break; 
        } 
    }
    
    return anyEncryptedData;
}

public FunDCT_decrypt(anyData:any, cDataType:string) {
    let anyEncryptedData:string;
    let oBytes:any;

    switch(cDataType) { 
        case 'String': { 
            oBytes  = CryptoTS.AES.decrypt(anyData.toString(), 'JWT_WWA@CRYPTO');
            anyEncryptedData = oBytes.toString(CryptoTS.enc.Utf8);
        break;
        }
        case 'Object': { 
            oBytes  = CryptoTS.AES.decrypt(anyData.toString(), 'JWT_WWA@CRYPTO');
            anyEncryptedData = JSON.parse(oBytes.toString(CryptoTS.enc.Utf8));
        break; 
        }
        default: {
            break; 
        } 
    }

    return anyEncryptedData;
}

  public FunDCT_encryptRequestbody(obj) {
    return Object.keys(obj).reduce((acc, curr) => {
      acc[curr] = this.FunDCT_encrypt(obj[curr], 'Object');
      return acc;
    }, {});
  }

  loginUser () 
  {
    console.log('clicked');
    console.log(this.loginUserData);
 
    //var ciphertext = CryptoTS.AES.encrypt(JSON.stringify(this.loginUserData), 'JWT_WWA@CRYPTO').toString(CryptoTS.enc.Base64);
    //var bytes  = CryptoTS.AES.decrypt(ciphertext.toString(), 'JWT_WWA@CRYPTO');
    //var decryptedData = JSON.parse(bytes.toString(CryptoTS.enc.Utf8));
    //console.log(' decryptedData ',decryptedData);

    let newData = {};
    const oLoginUserData = this.FunDCT_encryptRequestbody(this.loginUserData);
    console.log('Updated Value');
    console.log(oLoginUserData);
  

    //const oLoginUserData = this.loginUserData;
    //const oUsernew = this.FunDCT_encrypt(JSON.stringify({ oLoginUserData }), 'Object');
    //console.log(oUsernew);

    return  this.http
    //.post(this._loginUrl, this.loginUserData)
    .post(this._loginUrl, oLoginUserData)    
      .subscribe(data => {
        console.log(data);
      }, error => {
          console.log(error);
      });


  }
}
