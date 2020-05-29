import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment'
import { OAuthService } from 'angular-oauth2-oidc';
import { Agent } from '../../domain/agents';

const url = environment.urls.customer;
@Injectable({
  providedIn: 'root'
})
export class AgentRegistrationService {

  selectedAgent;
  statusChange = false;

  constructor(private http: HttpClient, private oauthService: OAuthService) { }

  getSelectedAgent() {
    return this.selectedAgent;
  }

  setSelectedAgent(agent) {
    this.selectedAgent = agent;
  }

  getStatusChange() {
    return this.statusChange;
  }

  setStatusChange(change) {
    this.statusChange = change;
  }

  getAllAgents() {
    const headers = new HttpHeaders().set('Authorization', this.oauthService.authorizationHeader());
    return this.http.get<Agent[]>(url + `/agents/`, { headers: headers })
  }

  getAllUsersAgents(userId) {
    const headers = new HttpHeaders().set('Authorization', this.oauthService.authorizationHeader());
    return this.http.get<[]>(url + `/users/${userId}/agents/`, { headers: headers })
  }
  registerUserWithAgent(clientId, agentId) {
    const headers = new HttpHeaders().set('Authorization', this.oauthService.authorizationHeader());
    return this.http.post(url + `/agents/${agentId}/clients/${clientId}`, null, { headers: headers })
  }

  deregisterUserWithAgent(clientId, agentId) {
    const headers = new HttpHeaders().set('Authorization', this.oauthService.authorizationHeader());
    return this.http.delete(url + `/agents/${agentId}/clients/${clientId}`, { headers: headers })
  }


}
