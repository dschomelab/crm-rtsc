import { PrismaClient, UserRole, PipelineStageType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin123!', 10);

  const company = await prisma.company.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'CRM RTSC',
      slug: 'crm-rtsc',
      email: 'contato@crmrtsc.com',
      website: 'https://crmrtsc.com',
    },
  });

  console.log(`Default company created: ${company.name}`);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@crm.com' },
    update: {},
    create: {
      email: 'admin@crm.com',
      password: adminPassword,
      name: 'Admin',
      role: UserRole.ADMIN,
      companyId: 'default',
    },
  });

  console.log(`Admin user created: ${admin.email}`);

  const directSalesPipeline = await prisma.pipeline.upsert({
    where: { id: 'direct-sales' },
    update: {},
    create: {
      id: 'direct-sales',
      name: 'Vendas Diretas',
      description: 'Pipeline principal de vendas diretas',
      companyId: 'default',
      stages: {
        create: [
          {
            id: 'ds-initial',
            name: 'Inicial',
            description: 'Primeiro contato com o lead',
            order: 0,
            type: PipelineStageType.INITIAL,
            probability: 10,
          },
          {
            id: 'ds-qualification',
            name: 'Qualificação',
            description: 'Qualificação do lead',
            order: 1,
            type: PipelineStageType.QUALIFICATION,
            probability: 25,
          },
          {
            id: 'ds-proposal',
            name: 'Proposta',
            description: 'Envio de proposta comercial',
            order: 2,
            type: PipelineStageType.PROPOSAL,
            probability: 50,
          },
          {
            id: 'ds-negotiation',
            name: 'Negociação',
            description: 'Negociação final',
            order: 3,
            type: PipelineStageType.NEGOTIATION,
            probability: 75,
          },
          {
            id: 'ds-closed-won',
            name: 'Ganho',
            description: 'Negócio fechado com sucesso',
            order: 4,
            type: PipelineStageType.CLOSED_WON,
            probability: 100,
          },
          {
            id: 'ds-closed-lost',
            name: 'Perdido',
            description: 'Negócio perdido',
            order: 5,
            type: PipelineStageType.CLOSED_LOST,
            probability: 0,
          },
        ],
      },
    },
  });

  console.log(`Pipeline created: ${directSalesPipeline.name}`);

  // Sample equipment catalog
  const sampleEquipment = [
    { name: 'Inversor Solar Huawei 5kW', type: 'INVERSOR', brand: 'Huawei', model: 'SUN2000-5KTL-L1', power: 5, price: 4500, warranty: 60, stock: 10 },
    { name: 'Painel Solar Jinko 550W', type: 'PAINEL', brand: 'Jinko', model: 'JKM550M-72HL4-V', power: 0.55, price: 890, warranty: 300, stock: 50 },
    { name: 'Estrutura Telhado Cerâmico', type: 'ESTRUTURA', brand: 'Sulbrasil', model: 'TR-2000', price: 120, warranty: 120, stock: 200 },
    { name: 'Cabo Solar 4mm²', type: 'CABO', brand: 'Cobrecom', model: 'CS-4MM', price: 3.5, stock: 1000 },
    { name: 'Inversor Solar Growatt 10kW', type: 'INVERSOR', brand: 'Growatt', model: 'MIN 10000TL-X', power: 10, price: 8200, warranty: 60, stock: 5 },
    { name: 'Painel Solar Canadian 670W', type: 'PAINEL', brand: 'Canadian Solar', model: 'CS7L-670MS', power: 0.67, price: 1100, warranty: 300, stock: 30 },
  ];

  for (const eq of sampleEquipment) {
    await prisma.equipment.create({ data: { ...eq, companyId: 'default' } });
  }

  console.log(`Equipment created: ${sampleEquipment.length}`);

  // Default access profiles
  const adminProfile = await prisma.accessProfile.upsert({
    where: { id: 'profile-admin' },
    update: {},
    create: {
      id: 'profile-admin',
      name: 'Administrador',
      description: 'Acesso total ao sistema',
      isActive: true,
      companyId: 'default',
      permissions: { all: true },
    },
  });

  const managerProfile = await prisma.accessProfile.upsert({
    where: { id: 'profile-manager' },
    update: {},
    create: {
      id: 'profile-manager',
      name: 'Gerente',
      description: 'Acesso gerencial',
      isActive: true,
      companyId: 'default',
      permissions: { all: false, leads: true, proposals: true, customers: true, reports: true },
    },
  });

  await prisma.accessProfile.upsert({
    where: { id: 'profile-user' },
    update: {},
    create: {
      id: 'profile-user',
      name: 'Usuário',
      description: 'Acesso básico',
      isActive: true,
      companyId: 'default',
      permissions: { all: false, leads: true, customers: true },
    },
  });

  console.log('Access profiles created');

  // Assign admin profile to admin user
  await prisma.user.update({ where: { id: admin.id }, data: { profileId: adminProfile.id } });

  // Create default team
  await prisma.team.upsert({
    where: { id: 'team-comercial' },
    update: {},
    create: {
      id: 'team-comercial',
      name: 'Comercial',
      description: 'Equipe de vendas',
      managerId: admin.id,
      companyId: 'default',
      members: { connect: [{ id: admin.id }] },
    },
  });

  console.log('Default team created');

  // Company settings
  await prisma.companySettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'CRM RTSC',
      email: 'contato@crmrtsc.com',
      phone: '(11) 3000-0000',
      website: 'https://crmrtsc.com',
      document: '00.000.000/0001-00',
    },
  });

  console.log('Company settings created');

  const posSalesPipeline = await prisma.pipeline.upsert({
    where: { id: 'pos-sales' },
    update: {},
    create: {
      id: 'pos-sales',
      name: 'Pós-Vendas',
      description: 'Pipeline de pós-vendas e suporte',
      companyId: 'default',
      stages: {
        create: [
          {
            id: 'ps-initial',
            name: 'Onboarding',
            description: 'Processo de integração do cliente',
            order: 0,
            type: PipelineStageType.INITIAL,
            probability: 10,
          },
          {
            id: 'ps-qualification',
            name: 'Acompanhamento',
            description: 'Acompanhamento pós-venda',
            order: 1,
            type: PipelineStageType.QUALIFICATION,
            probability: 30,
          },
          {
            id: 'ps-proposal',
            name: 'Renovação',
            description: 'Proposta de renovação',
            order: 2,
            type: PipelineStageType.PROPOSAL,
            probability: 60,
          },
          {
            id: 'ps-closed-won',
            name: 'Renovado',
            description: 'Contrato renovado com sucesso',
            order: 3,
            type: PipelineStageType.CLOSED_WON,
            probability: 100,
          },
          {
            id: 'ps-closed-lost',
            name: 'Cancelado',
            description: 'Cliente cancelou o contrato',
            order: 4,
            type: PipelineStageType.CLOSED_LOST,
            probability: 0,
          },
        ],
      },
    },
  });

  console.log(`Pipeline created: ${posSalesPipeline.name}`);



  // Sample leads for Direct Sales pipeline
  const sampleLeads = [
    { name: 'João Silva', email: 'joao@email.com', phone: '(11) 99999-0001', source: 'Site', stageId: 'ds-initial', value: 15000 },
    { name: 'Maria Santos', email: 'maria@email.com', phone: '(11) 99999-0002', source: 'Indicação', stageId: 'ds-initial', value: 22000 },
    { name: 'Pedro Oliveira', email: 'pedro@email.com', phone: '(11) 99999-0003', source: 'Instagram', stageId: 'ds-qualification', value: 18000 },
    { name: 'Ana Costa', email: 'ana@email.com', phone: '(11) 99999-0004', source: 'Google Ads', stageId: 'ds-qualification', value: 30000 },
    { name: 'Carlos Souza', email: 'carlos@email.com', phone: '(11) 99999-0005', source: 'Site', stageId: 'ds-proposal', value: 25000 },
    { name: 'Juliana Lima', email: 'juliana@email.com', phone: '(11) 99999-0006', source: 'Indicação', stageId: 'ds-negotiation', value: 45000 },
    { name: 'Roberto Almeida', email: 'roberto@email.com', phone: '(11) 99999-0007', source: 'Facebook', stageId: 'ds-negotiation', value: 35000 },
  ];

  for (const lead of sampleLeads) {
    const created = await prisma.lead.create({
      data: {
        ...lead,
        pipelineId: 'direct-sales',
        assignedTo: admin.id,
        notes: 'Lead criado via seed',
        companyId: 'default',
      },
    });

    await prisma.activity.create({
      data: {
        type: 'LEAD_CREATED',
        description: 'Lead criado via seed inicial',
        leadId: created.id,
        userId: admin.id,
      },
    });
  }

  console.log(`Sample leads created: ${sampleLeads.length}`);
  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
