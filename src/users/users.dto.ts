import {IsString} from 'class-validator';

class CreateUserDto {

    @IsString()
    public nickname: string;

}

export default CreateUserDto;
