// Neon database məlumatlarını parse edək
const connectionString = "postgresql://neondb_owner:npg_gvRpDoIm8Zj9@ep-round-grass-a9xpx3us-pooler.gwc.azure.neon.tech/neondb?sslmode=require&channel_binding=require";

// Parse connection string
const url = new URL(connectionString.replace('postgresql://', 'http://'));

console.log('🔍 Neon Database Məlumatları:\n');
console.log(`Host: ${url.hostname}`);
console.log(`Database: ${url.pathname.slice(1).split('?')[0]}`);
console.log(`User: ${url.username}`);
console.log(`Password: ${url.password?.slice(0, 10)}...`);
console.log(`\nEndpoint ID: ${url.hostname.split('.')[0]}`);

const endpointId = url.hostname.split('.')[0]; // ep-round-grass-a9xpx3us-pooler

console.log('\n📋 Neon Console Link:');
console.log('https://console.neon.tech/app/projects');
console.log('\nProyekt ID pattern-ə baxın:');
console.log(`- Endpoint içində: ${endpointId}`);

console.log('\n⚠️ VACIB: Neon Console-da yoxlayın:');
console.log('1. Projects siyahısında neçə proyekt var?');
console.log('2. Hər proyektdə neçə branch var?');
console.log('3. Başqa "bronev" adlı proyekt var mı?');
console.log('4. Feb 22-dən əvvəl backup var mı?');

console.log('\n🔧 Əgər Neon-a giriş verə bilmirsinizsə:');
console.log('Mən alternative həll yolu axtarım (backup fayl, export, və s.)');
