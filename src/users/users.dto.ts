import {IsNumber, IsString} from 'class-validator';

class CreateUserDto {
    @IsNumber()
    public id: number;

    @IsString()
    public nickname: string;

    @IsNumber()
    public groupId: number;
}

export default CreateUserDto;
