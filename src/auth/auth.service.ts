import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './entities/user.entity';
import * as bcryptjs from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';

import { RegisterUserDto, CreateUserDto,UpdateAuthDto,LoginDto } from './dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel:Model<User>,
    private jwtService: JwtService
  ){}

  async create(createUserDto: CreateUserDto):Promise<User>{
     
     try{

        const {password,...userData} = createUserDto;
        
        const newUser=new this.userModel({
          password:bcryptjs.hashSync(password,10),
          ...userData
        });

         await newUser.save();

        const {password:_,...user}=newUser.toJSON();// el gion bajo es para que no choque con el de create user

        return user;

     }catch(error){
        //console.log("miauy ",error.code);

        if (error.code===11000){
           throw new BadRequestException(`${createUserDto.email} ya existe`);
        }
        throw new InternalServerErrorException('Algo Paso');
     }
     
  }

  async register(registerUserDto:RegisterUserDto):Promise<LoginResponse>{

    //try{
      const user = await this.create({...registerUserDto});

      return {
        user,
        token:this.getJwtToken({id:user._id})
      }

    // }catch(error){
    //  //console.log("miauy ",error.code);
    //   throw new InternalServerErrorException('Algo Paso');
    //  }

  }

  async login(loginDto:LoginDto):Promise<LoginResponse>{

     const {email, password}= loginDto;

     const user= await this.userModel.findOne({email});

     if(!user){
      throw new UnauthorizedException('Credenciales no validas');
     }

     if(!bcryptjs.compareSync(password,user.password)){
      throw new UnauthorizedException('Credenciales no validas');
     }

      const {password:_, ...rest}=user.toJSON();

      return {
        user:rest,
        token:this.getJwtToken({id:user.id})
      }

  }

  findAll():Promise<User[]> {
    return this.userModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  async findUserById(id:string){
    const user= await this.userModel.findById(id);
    const {password,...rest}=user.toJSON();
    return rest;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwtToken(payload:JwtPayload){
    const token=this.jwtService.sign(payload);
    return token;
  }
}
