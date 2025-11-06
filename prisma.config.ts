// prisma.config.ts

// 1. dotenv paketini içeri aktarıyoruz
import * as dotenv from 'dotenv';

// 2. .env dosyasındaki tüm değişkenleri sistemin ortam değişkenlerine yüklüyoruz.
dotenv.config();

// 3. Prisma'nın bu dosyayı kullanması için boş bir export yapıyoruz.
export default {};