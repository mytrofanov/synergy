import {IsNumber, IsString} from 'class-validator';

class CreateGroupDto {
    @IsNumber()
    public id: number;

    @IsString()
    public name: string;

    @IsString()
    public description: string;
}

export default CreateGroupDto;
