import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccessPoliciesService } from './access-policies.service';
import { CreateAccessPolicyDto } from './dto/create-access-policy.dto';
import { UpdateAccessPolicyDto } from './dto/update-access-policy.dto';

@Controller('access-policies')
export class AccessPoliciesController {
  constructor(private readonly accessPoliciesService: AccessPoliciesService) {}

  @Post()
  create(@Body() createAccessPolicyDto: CreateAccessPolicyDto) {
    return this.accessPoliciesService.create(createAccessPolicyDto);
  }

  @Get()
  findAll() {
    return this.accessPoliciesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accessPoliciesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccessPolicyDto: UpdateAccessPolicyDto) {
    return this.accessPoliciesService.update(+id, updateAccessPolicyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accessPoliciesService.remove(+id);
  }
}
