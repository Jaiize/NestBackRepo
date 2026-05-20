import { SetMetadata } from '@nestjs/common';


export const publicDoor = 'isPublic';

export const Public = () => SetMetadata(publicDoor, true);
