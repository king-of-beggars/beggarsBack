import { IsNotEmpty } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Board } from '../entity/board.entity';

export class BoardDetailDTO extends PickType(Board, ['boardId']) {}