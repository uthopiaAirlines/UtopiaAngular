import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';



@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private oauthServ: OAuthService, private router: Router) { }

  canActivate(): boolean {
    if (!this.oauthServ.hasValidAccessToken()) {
      this.router.navigate(['home']);
      return false;
    }
    return true;
  }
}
