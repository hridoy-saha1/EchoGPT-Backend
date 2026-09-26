 import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateUserSubscriptionDto {
    @IsUUID()
    @IsNotEmpty()
    subscriptionId: string;
}