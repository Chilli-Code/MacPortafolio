import { PrismaClient } from '../generated/client/index.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

async function fixPasswords() {
  console.log('🔧 Reparando contraseñas de usuarios...');

  // Actualizar jorge_dev
  const hashedJorge = await bcrypt.hash('123456', SALT_ROUNDS);
  await prisma.user.update({
    where: { username: 'jorge_dev' },
    data: { password: hashedJorge }
  });
  console.log('✅ Contraseña actualizada: jorge_dev -> 123456');

  // Actualizar admin
  const hashedAdmin = await bcrypt.hash('admin123', SALT_ROUNDS);
  await prisma.user.update({
    where: { username: 'admin' },
    data: { password: hashedAdmin }
  });
  console.log('✅ Contraseña actualizada: admin -> admin123');

  await prisma.$disconnect();
  console.log('\n✅ ✅ ✅ TODAS LAS CONTRASEÑAS REPARADAS CORRECTAMENTE!');
  console.log('\n🔑 Ahora ya puedes iniciar sesión sin problemas!');
}

fixPasswords().catch(e => {
  console.error('❌ Error:', e);
  process.exit(1);
});