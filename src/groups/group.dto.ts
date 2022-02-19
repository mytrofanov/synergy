import { IsString} from 'class-validator';

class CreateGroupDto {
    @IsString()
    public name: string;

    @IsString()
    public description: string;
}

export default CreateGroupDto;
