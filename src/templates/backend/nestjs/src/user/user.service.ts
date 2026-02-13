import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { instanceToPlain, plainToInstance } from 'class-transformer';

const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.userRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async create(createUserDto: CreateUserDto) {
    const existingEmail = await this.findByEmail(createUserDto.email);
    if (existingEmail) {
      throw new ConflictException('User with this email already exists');
    }

    const existingUsername = await this.findByUsername(createUserDto.username);
    if (existingUsername) {
      throw new ConflictException('Username already taken');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, SALT_ROUNDS);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      avatarUrl: createUserDto.avatarUrl || null,
      bio: createUserDto.bio || null,
      role: createUserDto.role || 'user',
      isActive: true,
    });

    return this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (updateUserDto.email) {
      const emailUser = await this.findByEmail(updateUserDto.email);
      if (emailUser && emailUser.id !== id) {
        throw new ConflictException('Email already in use');
      }
    }

    if (updateUserDto.username) {
      const usernameUser = await this.findByUsername(updateUserDto.username);
      if (usernameUser && usernameUser.id !== id) {
        throw new ConflictException('Username already taken');
      }
    }

    const updateData: Partial<User> = {};

    if (updateUserDto.email !== undefined) updateData.email = updateUserDto.email;
    if (updateUserDto.username !== undefined) updateData.username = updateUserDto.username;
    if (updateUserDto.fullName !== undefined) updateData.fullName = updateUserDto.fullName;
    if (updateUserDto.password !== undefined) {
      updateData.password = await bcrypt.hash(updateUserDto.password, SALT_ROUNDS);
    }
    if (updateUserDto.avatarUrl !== undefined) updateData.avatarUrl = updateUserDto.avatarUrl;
    if (updateUserDto.bio !== undefined) updateData.bio = updateUserDto.bio;
    if (updateUserDto.role !== undefined) updateData.role = updateUserDto.role;
    if (updateUserDto.isActive !== undefined) updateData.isActive = updateUserDto.isActive;

    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async softDelete(id: number) {
    const user = await this.findOne(id);
    user.isActive = false;
    return this.userRepository.save(user);
  }

  async search(keyword: string) {
    return this.userRepository.find({
      where: [
        { email: Like(`%${keyword}%`), isActive: true },
        { username: Like(`%${keyword}%`), isActive: true },
        { fullName: Like(`%${keyword}%`), isActive: true },
      ],
      order: { createdAt: 'DESC' },
    });
  }
}
