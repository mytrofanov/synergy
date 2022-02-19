import {IsNumber} from 'class-validator';

class UserGroupIdDto {
    @IsNumber()
    public groupId: number;

}

export default UserGroupIdDto;
