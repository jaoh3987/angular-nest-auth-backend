import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(), //manejo de las variables de entorno
    MongooseModule.forRoot(process.env.MONGO_URI,{
      dbName:process.env.MONDO_DB_NAME
    }),//conexion a la base de datos
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
 
}
