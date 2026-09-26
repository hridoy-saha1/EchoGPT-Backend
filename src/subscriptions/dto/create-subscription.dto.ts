import {
    IsString,
    IsNotEmpty,
    IsNumber,
    Min,
    IsOptional,
} from 'class-validator';

export class CreateSubscriptionDto {
    @IsString()
    @IsNotEmpty()
    planName: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsNumber()
    @Min(1)
    duration: number;

    @IsNumber()
    @Min(1)
    requestLimit: number;

    @IsString()
    @IsNotEmpty()
    description: string;
}

export class UpdateSubscriptionDto {
    @IsOptional()
    @IsString()
    planName?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    duration?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    requestLimit?: number;

    @IsOptional()
    @IsString()
    description?: string;
}