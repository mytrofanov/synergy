import {IsNumber, IsString} from 'class-validator';

class UserIdDto {
    @IsNumber()
    public id: number;

}

export default UserIdDto;
