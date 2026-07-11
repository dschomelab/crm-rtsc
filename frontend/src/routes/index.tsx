import {
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
  Outlet,
} from '@tanstack/react-router';
import { AppLayout } from '@/components/layout/app-layout';
import { DashboardPage } from '@/pages/dashboard';
import { LoginPage } from '@/pages/login';
import { NotFoundPage } from '@/pages/not-found';
import { LeadsPage } from '@/pages/leads';
import { ClientesPage } from '@/pages/clientes';
import { PipelinePage } from '@/pages/pipeline';
import { PropostasPage } from '@/pages/propostas';
import { AgendaPage } from '@/pages/agenda';
import { SolarPage } from '@/pages/solar';
import { ServiceOrdersPage } from '@/pages/service-orders';
import { CommunicationsPage } from '@/pages/communications';
import { CampaignsPage } from '@/pages/campaigns';
import { CommissionsPage } from '@/pages/commissions';
import { AiSuggestionsPage } from '@/pages/ai-suggestions';
import { CompaniesPage } from '@/pages/companies';
import { ContactsPage } from '@/pages/contacts';
import { ProfilePage } from '@/pages/profile';
import { EquipmentPage } from '@/pages/equipment';
import { AdminPage } from '@/pages/admin';
import { AdminUsersPage } from '@/pages/admin/users';
import { AdminProfilesPage } from '@/pages/admin/profiles';
import { AdminTeamsPage } from '@/pages/admin/teams';
import { AdminSettingsPage } from '@/pages/admin/settings';
import { AdminAuditPage } from '@/pages/admin/audit';
import { LoadingScreen } from '@/components/shared/loading-screen';
import { getAccessToken, setTokens } from '@/services/api';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'layout',
  component: AppLayout,
});

const protectedRoute = createRoute({
  getParentRoute: () => layoutRoute,
  id: 'protected',
  beforeLoad: () => {
    const stored = localStorage.getItem('accessToken');
    if (stored) {
      const refreshStored = localStorage.getItem('refreshToken');
      if (refreshStored) setTokens(stored, refreshStored);
    }
    const token = getAccessToken() ?? localStorage.getItem('accessToken');
    if (!token) throw redirect({ to: '/login' });
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const indexRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/',
  component: DashboardPage,
});

const leadsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/leads',
  component: LeadsPage,
});

const clientesRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/clientes',
  component: ClientesPage,
});

const pipelineRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/pipeline',
  component: PipelinePage,
});

const propostasRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/propostas',
  component: PropostasPage,
});

const agendaRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/agenda',
  component: AgendaPage,
});

const solarRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/solar',
  component: SolarPage,
});

const serviceOrdersRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/service-orders',
  component: ServiceOrdersPage,
});

const communicationsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/communications',
  component: CommunicationsPage,
});

const campaignsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/campaigns',
  component: CampaignsPage,
});

const commissionsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/commissions',
  component: CommissionsPage,
});

const aiSuggestionsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/ai-suggestions',
  component: AiSuggestionsPage,
});

const companiesRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/companies',
  component: CompaniesPage,
});

const contactsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/contacts',
  component: ContactsPage,
});

const equipmentRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/equipment',
  component: EquipmentPage,
});

const profileRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/profile',
  component: ProfilePage,
});

const adminRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/admin',
  component: AdminPage,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/admin/users',
  component: AdminUsersPage,
});

const adminProfilesRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/admin/profiles',
  component: AdminProfilesPage,
});

const adminTeamsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/admin/teams',
  component: AdminTeamsPage,
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/admin/settings',
  component: AdminSettingsPage,
});

const adminAuditRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/admin/audit',
  component: AdminAuditPage,
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$',
  component: NotFoundPage,
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    protectedRoute.addChildren([
      indexRoute,
      leadsRoute,
      clientesRoute,
      pipelineRoute,
      propostasRoute,
      agendaRoute,
      solarRoute,
      serviceOrdersRoute,
      communicationsRoute,
      campaignsRoute,
      commissionsRoute,
      aiSuggestionsRoute,
      companiesRoute,
      contactsRoute,
      equipmentRoute,
      profileRoute,
      adminRoute,
      adminUsersRoute,
      adminProfilesRoute,
      adminTeamsRoute,
      adminSettingsRoute,
      adminAuditRoute,
    ]),
  ]),
  loginRoute,
  notFoundRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPendingComponent: LoadingScreen,
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
