import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../../entities/Users';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ReadNameDto } from './dto/read-name.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async join(createAuthDto: CreateAuthDto): Promise<{userId: string}> {
    const { userName: name, password } = createAuthDto;

    const existingUser = await this.usersRepository.findOne({
      where: { name },
    });
    if (existingUser) {
      throw new BadRequestException('이미 존재하는 사용자 이름입니다.');
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      name,
      password: hashedPassword,
    });

    const result: {id: string} = await this.usersRepository.save(newUser);
    const userId = result.id;
    return {userId: userId};
    
  }

  async login(createAuthDto: CreateAuthDto): Promise<{ message: string }> {
    const { userName: name, password } = createAuthDto;

    const user = await this.usersRepository.findOne({ where: { name } });
    if (!user || !user.password) {
      throw new NotFoundException({ message: '사용자를 찾을 수 없습니다.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      throw new BadRequestException('비밀번호가 틀렸습니다.');
    }

    return { message: '로그인 성공!' };
  }

  async check(
    readNameDto: ReadNameDto,
  ): Promise<{ message: string; data: object }> {
    const { userName: name } = readNameDto;

    const user = await this.usersRepository.findOne({ where: { name } });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return {
      message: '사용자 정보가 확인되었습니다.',
      data: { userId: user.id },
    };
  }

  async updatePassword(
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    const { userId, password } = updatePasswordDto;

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await this.usersRepository.save(user);

    return { message: '비밀번호가 성공적으로 변경되었습니다.' };
  }
}
