import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nModule, UrlModule } from '@spartacus/core';
import { ItemExistsModule } from '../../shared/item-exists.module';
import { CardModule } from '../../shared/card/card.module';
import { ToggleStatusModule } from '../../shared/detail/toggle-status-action/toggle-status.module';
import { BudgetDetailsComponent } from './budget-details.component';
import { IconModule } from '@spartacus/storefront';
import { ExplainDisableMessagesModule } from '../../shared/detail/explain-disable-messages/explain-disable-messages.module';

@NgModule({
  imports: [
    CommonModule,
    CardModule,
    RouterModule,
    UrlModule,
    I18nModule,
    ToggleStatusModule,
    ItemExistsModule,
    IconModule,
    ExplainDisableMessagesModule,
  ],
  declarations: [BudgetDetailsComponent],
})
export class BudgetDetailsModule {}
