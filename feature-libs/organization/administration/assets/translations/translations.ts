import { TranslationChunksConfig, TranslationResources } from '@spartacus/core';
import { en } from './en/index';

export const organizationTranslations: TranslationResources = {
  en,
};

// expose all translation chunk mapping for organization sub features
export const organizationTranslationChunksConfig: TranslationChunksConfig = {
  organization: [
    'budget',
    'budgetAssignedCostCenters',
    'costCenter',
    'costCenterBudgets',
    'costCenterAssignedBudgets',
    'unit',
    'unitChildren',
    'unitAssignedRoles',
    'unitApprovers',
    'unitAssignedApprovers',
    'unitCostCenters',
    'unitUsers',
    'unitUserRoles',
    'unitAssignedUsers',
    'unitAddress',

    'orgUserGroup',
    'orgUserGroupUsers',
    'orgUserGroupAssignedUsers',
    'orgUserGroupPermissions',
    'orgUserGroupAssignedPermissions',
    'orgUser',
    'orgUserApprovers',
    'orgUserAssignedApprovers',
    'orgUserPermissions',
    'orgUserAssignedPermissions',
    'orgUserUserGroups',
    'orgUserAssignedUserGroups',
    'permission',
  ],
};
