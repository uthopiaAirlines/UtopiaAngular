import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { claims } from '../../domain/oauthTokenClaims';


@Injectable({
  providedIn: 'root'
})
export class CustomerAuthService implements CanActivate {

  constructor(private oauthServ: OAuthService, private router: Router) { }

  canActivate(): boolean {
    if (this.oauthServ.hasValidAccessToken()) {
      let user: claims = this.oauthServ.getIdentityClaims();
      if (user["cognito:groups"][0] == "Customer") {
        return true;
      }
    }
    this.router.navigate(['home']);
    return false;
  }
}
