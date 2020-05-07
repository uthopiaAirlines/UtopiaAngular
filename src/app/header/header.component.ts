import { Component, OnInit } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { CustomerAuthService } from '../service/authGuard/customer-auth.service';
import { claims } from '../domain/oauthTokenClaims';

export const authconfig: AuthConfig = {
  logoutUrl: `https://ss-utopia.auth.us-east-1.amazoncognito.com/logout?client_id=2dlb0mog85rvn43g5inhnqb111&logout_uri=https://www.utopiaairlines.com`,
  issuer: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_iPhgdkopW',
  redirectUri: window.location.origin,
  clientId: '2dlb0mog85rvn43g5inhnqb111',
  responseType: 'code',
  scope: 'openid email',
  showDebugInformation: true,
  dummyClientSecret: '1v0c8kiahic5pd1td1tb9n7n3ioe3mv43igftp9vs07lv45k4nk2'
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private oauthService: OAuthService, private _router: Router) {
    this.oauthService.configure(authconfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
    this.oauthService.strictDiscoveryDocumentValidation = false;
  }

  ngOnInit(): void {
  }

  login() {
    this.oauthService.initCodeFlow();
  }

  logout() {
    this.oauthService.logOut(false);
    //this.oauthService.logOut();
    this._router.navigateByUrl('home');
  }

  get loggedIn() {
    return this.oauthService.hasValidAccessToken();
  }

  isCustomer() {
    if (this.oauthService.hasValidAccessToken()) {
      let user: claims = this.oauthService.getIdentityClaims();
      if (user["cognito:groups"][0] == "Customer") {
        return true;
      }
    }
    return false;
  }

}
