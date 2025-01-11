import { IsUUID } from 'class-validator';

export class XTenantIdDto {
  @IsUUID()
  value: string;
}
