import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('test123456', 12);
  
  try {
    // Delete existing test user if any
    await prisma.usuarioRol.deleteMany({
      where: { usuario: { email: 'test@vicentinos.com' } }
    });
    await prisma.usuario.deleteMany({
      where: { email: 'test@vicentinos.com' }
    });
    
    // Create new test user
    const usuario = await prisma.usuario.create({
      data: {
        email: 'test@vicentinos.com',
        passwordHash,
        activo: true,
      }
    });
    
    // Assign SOCIO role
    await prisma.usuarioRol.create({
      data: {
        usuarioId: usuario.id,
        rol: 'SOCIO'
      }
    });
    
    console.log('Test user created successfully');
    console.log('Email: test@vicentinos.com');
    console.log('Password: test123456');
    console.log('Role: SOCIO');
  } finally {
    await prisma.$disconnect();
  }
}

main();
