import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({
        default:'test@test.ru'
    })
    email:string;
    @ApiProperty({
        default:'Мистер Бист'
    })
    fullName:string;
    @ApiProperty({
        default:'1234'
    })
    password:string;
}
