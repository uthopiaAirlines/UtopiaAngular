import { Component, OnInit } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc'

export const authconfig: AuthConfig = {
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

  constructor(private oauthService: OAuthService) {
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
    this.oauthService.logOut();
  }

  get loggedIn() {
    return this.oauthService.hasValidAccessToken();
  }

}
