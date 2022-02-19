import {IsNumber} from 'class-validator';

class IdGroupDto {
    @IsNumber()
    public id: number;
}

export default IdGroupDto;
