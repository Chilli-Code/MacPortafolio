import { readFile, writeFile } from 'fs/promises';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

async function hashExistingPasswords() {
  console.log('🔐 Hasheando contraseñas existentes directamente en db.json...');

  // Leer archivo db.json original
  const rawData = await readFile('../db.json', 'utf8');
  const data = JSON.parse(rawData);

  console.log(`✅ Encontrados ${data.users.length} usuarios`);

  for (const user of data.users) {
    // Verificar si ya esta hasheada (bcrypt empieza por $2b$)
    if (!user.password.startsWith('$2b$')) {
      const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
      user.password = hashedPassword;
      console.log(`✅ Contraseña hasheada para usuario: ${user.username}`);
    } else {
      console.log(`⚠️ Usuario ${user.username} ya tiene contraseña hasheada`);
    }
  }

  // Guardar archivo modificado
  await writeFile('../db.json', JSON.stringify(data, null, 2));

  console.log('\n✅ ✅ ✅ TODAS LAS CONTRASEÑAS HASHEADAS EXITOSAMENTE!');
  console.log('\n✅ db.json actualizado correctamente');
  console.log('\n🔚 Proceso finalizado. Ya puedes volver a importar los datos.');
}

hashExistingPasswords()
  .catch(e => {
    console.error('❌ Error hasheando contraseñas:', e);
    process.exit(1);
  });
