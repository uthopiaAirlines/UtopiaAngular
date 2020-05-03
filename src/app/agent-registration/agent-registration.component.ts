import { Component, OnInit } from '@angular/core';
import { AgentRegistrationService } from '../service/agentsRegistration/agent-registration.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { claims } from '../domain/oauthTokenClaims';
import { Agent } from '../domain/agents';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';


@Component({
  selector: 'app-agent-registration',
  templateUrl: './agent-registration.component.html',
  styleUrls: ['./agent-registration.component.css']
})
export class AgentRegistrationComponent implements OnInit {

  constructor(private agentServ: AgentRegistrationService, private oauthService: OAuthService, private dialog: MatDialog) { }
  agents: Agent[];
  usersAgents: { agent?: string }[];
  loading: boolean;
  user: claims;

  ngOnInit(): void {
    this.loading = true;
    this.user = this.oauthService.getIdentityClaims();
    this.agentServ.getAllAgents().subscribe(res => {
      this.agents = res;

      this.agentServ.getAllUsersAgents(this.user.sub).subscribe(res => {
        this.usersAgents = res;
        this.agents.forEach(agent => {
          agent.registered = false;
          this.usersAgents.forEach(registedSub => {
            if (agent.sub == registedSub.agent)
              agent.registered = true;
          });
        });
        this.loading = false;
      },
        err => {
          this.dialog.open(ErrorDialogComponent);
          this.loading = false;
        });
    },
      err => {
        this.dialog.open(ErrorDialogComponent);
        this.loading = false;
      });

  }

  register(agent) {
    this.agentServ.setSelectedAgent(agent);
    this.dialog.open(RegistrationDialog).afterClosed().subscribe(res => {
      if (this.agentServ.getStatusChange() == true) {
        this.agentServ.setStatusChange(false);
        agent.registered = true;
      }
    }, err => {
      this.dialog.closeAll();
      this.dialog.open(ErrorDialogComponent);
    });
  }

  deregister(agent) {
    this.agentServ.setSelectedAgent(agent);
    this.dialog.open(DeregistrationDialog).afterClosed().subscribe(res => {
      if (this.agentServ.getStatusChange() == true) {
        this.agentServ.setStatusChange(false);
        agent.registered = false;
      }
    }, err => {
      this.dialog.closeAll();
    });
  }

}

@Component({
  selector: 'registration-dialog',
  templateUrl: './registration-dialog.html'
})
export class RegistrationDialog implements OnInit {
  constructor(private agentServ: AgentRegistrationService, private oauthServ: OAuthService, private dialog: MatDialog) { }

  agent;
  user: claims;
  ngOnInit(): void {
    this.user = this.oauthServ.getIdentityClaims();
    this.agent = this.agentServ.getSelectedAgent();
  }

  onClick() {
    this.agentServ.registerUserWithAgent(this.user.sub, this.agent.sub).subscribe(res => {
      this.agentServ.setStatusChange(true);
      this.dialog.closeAll();
    }, err => {
      throw err;
    });
  }
}

@Component({
  selector: 'deregistration-dialog',
  templateUrl: './deregistration-dialog.html'
})
export class DeregistrationDialog implements OnInit {
  constructor(private agentServ: AgentRegistrationService, private oauthServ: OAuthService, private dialog: MatDialog) { }

  agent;
  user: claims;
  ngOnInit(): void {
    this.user = this.oauthServ.getIdentityClaims();
    this.agent = this.agentServ.getSelectedAgent();
  }

  onClick() {
    this.agentServ.deregisterUserWithAgent(this.user.sub, this.agent.sub).subscribe(res => {
      this.agentServ.setStatusChange(true);
      this.dialog.closeAll();
    }, err => {
      throw err;
    });
  }
}

