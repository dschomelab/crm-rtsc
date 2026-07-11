import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './database/prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { PipelinesModule } from './pipelines/pipelines.module';
import { LeadsModule } from './leads/leads.module';
import { TagsModule } from './tags/tags.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { CustomersModule } from './customers/customers.module';
import { ProposalsModule } from './proposals/proposals.module';
import { SolarModule } from './solar/solar.module';
import { ServiceOrdersModule } from './service-orders/service-orders.module';
import { CommunicationsModule } from './communications/communications.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { CommissionsModule } from './commissions/commissions.module';
import { AiSuggestionsModule } from './ai-suggestions/ai-suggestions.module';
import { CompaniesModule } from './companies/companies.module';
import { ContactsModule } from './contacts/contacts.module';
import { EquipmentsModule } from './equipments/equipments.module';
import { ChecklistModule } from './checklist/checklist.module';
import { CostsModule } from './costs/costs.module';
import { TeamsModule } from './teams/teams.module';
import { AccessProfilesModule } from './access-profiles/access-profiles.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { AdminUsersModule } from './admin-users/admin-users.module';
import { AdminSettingsModule } from './admin-settings/admin-settings.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    HealthModule,
    PrismaModule,
    UsersModule,
    PipelinesModule,
    LeadsModule,
    TagsModule,
    AttachmentsModule,
    CustomersModule,
    ProposalsModule,
    SolarModule,
    ServiceOrdersModule,
    CommunicationsModule,
    CampaignsModule,
    CommissionsModule,
    AiSuggestionsModule,
    CompaniesModule,
    ContactsModule,
    EquipmentsModule,
    ChecklistModule,
    CostsModule,
    TeamsModule,
    AccessProfilesModule,
    AuditLogsModule,
    AdminUsersModule,
    AdminSettingsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
