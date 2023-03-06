import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedUserGuard } from 'app/ui/logged-user-guard';
import { RunWizardComponent } from './run-wizard.component';
import { WizardCallbackComponent } from './wizard-callback.component';

const wizardRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'system/:wizard',
        component: RunWizardComponent,
        canActivate: [LoggedUserGuard]
      },
      {
        path: 'registration/:wizard',
        component: RunWizardComponent
      },
      {
        path: 'registration/:wizard/:externalPaymentToken',
        component: RunWizardComponent
      },
      {
        path: 'user/:user/:wizard',
        component: RunWizardComponent,
        canActivate: [LoggedUserGuard]
      },
      {
        path: 'menu/:menu/:wizard',
        component: RunWizardComponent
      },
      {
        path: 'run/:key',
        component: RunWizardComponent
      },
      {
        path: 'callback/:key',
        component: WizardCallbackComponent,
      },
    ],
  },
];

/**
 * * Routes for the wizards module
 */
@NgModule({
  imports: [
    RouterModule.forChild(wizardRoutes),
  ],
  exports: [
    RouterModule,
  ],
})
export class WizardsRoutingModule {
}
