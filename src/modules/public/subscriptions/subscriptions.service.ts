import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { APIResponse } from 'src/typings/api.response';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<APIResponse<Subscription>> {
    const subscription = await this.subscriptionRepository.save(
      createSubscriptionDto,
    );

    return {
      data: subscription,
      message: 'Subscription created successfully',
    };
  }

  findAll() {
    return `This action returns all subscriptions`;
  }

  findOne(id: string) {
    return `This action returns a #${id} subscription`;
  }

  update(id: string, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  remove(id: string) {
    return `This action removes a #${id} subscription`;
  }
}
