import { NgModule } from '@angular/core';
import { SendInvitationComponent } from 'app/ui/personal/invite/send-invitation.component';
import { SearchNotificationsComponent } from 'app/ui/personal/notifications/search-notifications.component';
import { PersonalRoutingModule } from 'app/ui/personal/personal-routing.module';
import { ManageSettingsComponent } from 'app/ui/personal/settings/manage-settings.component';
import { UiSharedModule } from 'app/ui/shared/ui-shared.module';

/**
 * Module for viewing notifications
 */
@NgModule({
  declarations: [SearchNotificationsComponent, ManageSettingsComponent, SendInvitationComponent],
  imports: [PersonalRoutingModule, UiSharedModule]
})
export class PersonalModule {}
