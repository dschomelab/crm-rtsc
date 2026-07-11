import { PipeTransform, Injectable, ArgumentMetadata, ValidationPipe, ValidationError } from '@nestjs/common';

function stripEmptyStrings(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return obj;
  if (Array.isArray(obj)) return obj.map(stripEmptyStrings);
  if (typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value === '' || value === null || value === undefined) {
        continue;
      }
      result[key] = stripEmptyStrings(value);
    }
    return result;
  }
  return obj;
}

@Injectable()
export class PortugueseValidationPipe implements PipeTransform {
  private readonly validationPipe: ValidationPipe;

  constructor() {
    this.validationPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = flattenErrors(errors).map(translateError);
        return new ValidationException(messages);
      },
    });
  }

  transform(value: any, metadata: ArgumentMetadata) {
    const cleaned = stripEmptyStrings(value);
    return this.validationPipe.transform(cleaned, metadata);
  }
}

const fieldLabels: Record<string, string> = {
  name: 'Nome',
  email: 'E-mail',
  phone: 'Telefone',
  password: 'Senha',
  title: 'Título',
  description: 'Descrição',
  value: 'Valor',
  notes: 'Observações',
  address: 'Endereço',
  city: 'Cidade',
  state: 'Estado',
  zipCode: 'CEP',
  document: 'Documento',
  documentType: 'Tipo de documento',
  companyName: 'Razão Social',
  logoUrl: 'Logo',
  website: 'Website',
  customerId: 'Cliente',
  customer: 'Cliente',
  leadId: 'Lead',
  stageId: 'Estágio',
  pipelineId: 'Pipeline',
  profileId: 'Perfil de acesso',
  teamId: 'Equipe',
  managerId: 'Gerente',
  assignedTo: 'Responsável',
  source: 'Origem',
  status: 'Status',
  role: 'Função',
  type: 'Tipo',
  brand: 'Marca',
  model: 'Modelo',
  power: 'Potência',
  price: 'Preço',
  warranty: 'Garantia',
  stock: 'Estoque',
  quantity: 'Quantidade',
  unitPrice: 'Preço unitário',
  discount: 'Desconto',
  shipping: 'Frete',
  terms: 'Termos e Condições',
  validUntil: 'Validade',
  priority: 'Prioridade',
  scheduledDate: 'Agendamento',
  isActive: 'Ativo',
  percentage: 'Percentual',
  rejectedReason: 'Motivo da recusa',
};

function translateField(field: string): string {
  return fieldLabels[field] ?? field;
}

function translateError(error: ValidationError): string {
  const field = translateField(error.property);
  const constraints = error.constraints || {};

  if (constraints.isNotEmpty || constraints.isDefined) {
    return `${field} é obrigatório.`;
  }
  if (constraints.isEmail) {
    return `Informe um e-mail válido.`;
  }
  if (constraints.isString) {
    return `${field} deve ser um texto válido.`;
  }
  if (constraints.isNumber || constraints.min) {
    return `${field} deve ser um número válido.`;
  }
  if (constraints.isBoolean) {
    return `${field} deve ser verdadeiro ou falso.`;
  }
  if (constraints.isDateString) {
    return `${field} deve ser uma data válida.`;
  }
  if (constraints.isIn) {
    return `Selecione um(a) ${field.toLowerCase()} válido(a).`;
  }
  if (constraints.isUUID) {
    return `Selecione um(a) ${field.toLowerCase()}.`;
  }
  if (constraints.minLength) {
    const min = error.constraints!['minLength'].match(/\d+/)?.[0] ?? '8';
    return `${field} deve possuir pelo menos ${min} caracteres.`;
  }
  if (constraints.maxLength) {
    const max = error.constraints!['maxLength'].match(/\d+/)?.[0];
    return `${field} deve possuir no máximo ${max} caracteres.`;
  }
  if (constraints.matches) {
    return `${field} está em formato inválido.`;
  }
  if (constraints.isPositive) {
    return `${field} deve ser um valor positivo.`;
  }

  return `${field} inválido(a).`;
}

export class ValidationException extends Error {
  public messages: string[];

  constructor(messages: string[]) {
    super(messages.join('. '));
    this.messages = messages;
    this.name = 'ValidationException';
  }
}

function flattenErrors(errors: ValidationError[], parent = ''): ValidationError[] {
  const result: ValidationError[] = [];
  for (const error of errors) {
    if (error.children?.length) {
      result.push(...flattenErrors(error.children, `${parent}${error.property}.`));
    } else if (error.constraints) {
      result.push(error);
    }
  }
  return result;
}
