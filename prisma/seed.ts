import "dotenv/config";
import { prisma, Role, OrderStatus } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Menjalankan Seeder TaniCare (Admin & Multi-Seller dengan Nomor WA Berbeda)...");

  // 1. SEED USERS: ADMIN, SELLER 1, SELLER 2, BUYER (Password: 123)
  console.log("-> Seeding Users...");

  // ADMIN (Memiliki Nomor WA CS Pusat TaniCare Sendiri: 6281234567890)
  const admin = await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {
      name: "Admin TaniCare",
      password: "123",
      role: Role.ADMIN,
      phone: "6281234567890",
    },
    create: {
      email: "admin@gmail.com",
      name: "Admin TaniCare",
      password: "123",
      role: Role.ADMIN,
      phone: "6281234567890",
      address: "Kantor Pusat TaniCare, Jawa Timur",
    },
  });
  console.log(`   ✓ Admin: ${admin.email} (WA Admin: +${admin.phone})`);

  // SELLER 1 (Memiliki Nomor WA Sendiri: 6281234567891)
  const seller1 = await prisma.user.upsert({
    where: { email: "seller@gmail.com" },
    update: {
      name: "Mitra Tani Berkah",
      password: "123",
      role: Role.SELLER,
      phone: "6281234567891",
    },
    create: {
      email: "seller@gmail.com",
      name: "Mitra Tani Berkah",
      password: "123",
      role: Role.SELLER,
      phone: "6281234567891",
      address: "Jl. Pertanian Makmur No. 45, Pare, Kediri",
    },
  });
  console.log(`   ✓ Seller 1: ${seller1.email} (WA Toko 1: +${seller1.phone})`);

  // SELLER 2 (Memiliki Nomor WA BERBEDA: 6281987654321)
  const seller2 = await prisma.user.upsert({
    where: { email: "seller2@gmail.com" },
    update: {
      name: "Mitra Agro Jaya Makmur",
      password: "123",
      role: Role.SELLER,
      phone: "6281987654321",
    },
    create: {
      email: "seller2@gmail.com",
      name: "Mitra Agro Jaya Makmur",
      password: "123",
      role: Role.SELLER,
      phone: "6281987654321",
      address: "Jl. Raya Agrowisata No. 88, Batu, Malang",
    },
  });
  console.log(`   ✓ Seller 2: ${seller2.email} (WA Toko 2: +${seller2.phone})`);

  // BUYER (Pembeli)
  const buyer = await prisma.user.upsert({
    where: { email: "buyer@gmail.com" },
    update: {
      name: "Budi Santoso (Petani)",
      password: "123",
      role: Role.BUYER,
      phone: "6281234567892",
      address: "Jl. Raya Pertanian No. 15, Kediri, Jawa Timur",
    },
    create: {
      email: "buyer@gmail.com",
      name: "Budi Santoso (Petani)",
      password: "123",
      role: Role.BUYER,
      phone: "6281234567892",
      address: "Jl. Raya Pertanian No. 15, Kediri, Jawa Timur",
    },
  });
  console.log(`   ✓ Buyer: ${buyer.email} (Telp: +${buyer.phone})`);

  // 2. SEED STORES (Tiap Seller Punya Toko dan Nomor WA Berbeda)
  console.log("-> Seeding Stores untuk masing-masing Seller...");
  const store1 = await prisma.store.upsert({
    where: { sellerId: seller1.id },
    update: {
      name: "Toko Berkah Tani Mandiri",
      description: "Pusat pestisida dan herbisida pertanian terlengkap.",
      whatsappNumber: "6281234567891",
      address: "Jl. Pertanian Makmur No. 45, Pare, Kediri, Jawa Timur",
    },
    create: {
      sellerId: seller1.id,
      name: "Toko Berkah Tani Mandiri",
      description: "Pusat pestisida dan herbisida pertanian terlengkap.",
      whatsappNumber: "6281234567891",
      address: "Jl. Pertanian Makmur No. 45, Pare, Kediri, Jawa Timur",
    },
  });
  console.log(`   ✓ Toko Seller 1: ${store1.name} (WA: +${store1.whatsappNumber})`);

  const store2 = await prisma.store.upsert({
    where: { sellerId: seller2.id },
    update: {
      name: "Toko Agro Jaya Makmur",
      description: "Spesialis pupuk majemuk, pupuk buah, dan fungisida tanaman hortikultura.",
      whatsappNumber: "6281987654321",
      address: "Jl. Raya Agrowisata No. 88, Batu, Malang, Jawa Timur",
    },
    create: {
      sellerId: seller2.id,
      name: "Toko Agro Jaya Makmur",
      description: "Spesialis pupuk majemuk, pupuk buah, dan fungisida tanaman hortikultura.",
      whatsappNumber: "6281987654321",
      address: "Jl. Raya Agrowisata No. 88, Batu, Malang, Jawa Timur",
    },
  });
  console.log(`   ✓ Toko Seller 2: ${store2.name} (WA: +${store2.whatsappNumber})`);

  // 3. SEED STORE SETTINGS (Nomor WA Admin Platform CS)
  console.log("-> Seeding Store Settings (Admin WA CS)...");
  const existingSettings = await prisma.storeSettings.findFirst();
  if (existingSettings) {
    await prisma.storeSettings.update({
      where: { id: existingSettings.id },
      data: {
        storeName: "TaniCare",
        whatsappNumber: "6281234567890", // WA Admin CS Pusat
        storeDescription: "Platform sarana pertanian dan katalog produk petani Indonesia.",
        address: "Jl. Agrikultur Subur No. 88, Jawa Timur",
      },
    });
  } else {
    await prisma.storeSettings.create({
      data: {
        storeName: "TaniCare",
        whatsappNumber: "6281234567890",
        storeDescription: "Platform sarana pertanian dan katalog produk petani Indonesia.",
        address: "Jl. Agrikultur Subur No. 88, Jawa Timur",
      },
    });
  }
  console.log("   ✓ Store Settings: WA Admin CS adalah +6281234567890");

  // 4. SEED PRODUCTS (Dikelompokkan ke Seller 1 dan Seller 2)
  console.log("-> Seeding Products dengan relasi Seller yang berbeda...");
  const productsData = [
    // Produk Seller 1 (Toko Berkah Tani Mandiri - WA: 6281234567891)
    {
      sku: "HRB-ROU-001",
      name: "Roundup 486 SL (1 Liter)",
      slug: "roundup-486-sl-1-liter",
      category: "Herbisida",
      description: "Herbisida purna tumbuh sistemik dengan teknologi surfaktan paten untuk membasmi alang-alang dan gulma berdaun lebar hingga ke akarnya.",
      price: 95000,
      stock: 45,
      isFeatured: true,
      isActive: true,
      activeIngredient: "Isopropilamina Glifosat 486 g/l",
      benefits: ["Membasmi gulma tuntas hingga ke akar", "Tahan hujan 1-2 jam setelah aplikasi", "Tidak merusak struktur tanah"],
      usageInstructions: "Campurkan 100-150 ml per tangki 15 liter air. Semprotkan merata saat gulma tumbuh subur.",
      labelDosage: "1.5 - 3 Liter / Hektar",
      warnings: ["Gunakan sarung tangan & masker saat menyemprot", "Jauhkan dari jangkauan anak-anak"],
      manufacturer: "PT Bayer CropScience",
      registrationNumber: "RI. 0102011974100",
      sellerId: seller1.id, // Toko Berkah Tani
    },
    {
      sku: "HRB-GRM-002",
      name: "Gramoxone 276 SL (1 Liter)",
      slug: "gramoxone-276-sl-1-liter",
      category: "Herbisida",
      description: "Herbisida kontak purna tumbuh yang sangat cepat membakar rumput liar dan gulma membandel dalam hitungan jam.",
      price: 88000,
      stock: 35,
      isFeatured: false,
      isActive: true,
      activeIngredient: "Parakuat Diklorida 276 g/l",
      benefits: ["Reaksi sangat cepat, rumput langsung gosong", "Efektif pada segala cuaca", "Aman untuk pengolahan lahan sebelum tanam"],
      usageInstructions: "Campurkan 80-100 ml per tangki 15 liter air bersih.",
      labelDosage: "1.5 - 2 Liter / Hektar",
      warnings: ["Racun keras, hindari kontak langsung dengan kulit"],
      manufacturer: "PT Syngenta Indonesia",
      registrationNumber: "RI. 0102011974112",
      sellerId: seller1.id,
    },
    {
      sku: "FNG-ANT-001",
      name: "Antracol 70 WP (1 Kg)",
      slug: "antracol-70-wp-1-kg",
      category: "Fungisida",
      description: "Fungisida kontak berspektrum luas dengan kandungan Zinc aktif untuk mengendalikan jamur daun sekaligus menyuburkan tanaman.",
      price: 135000,
      stock: 30,
      isFeatured: true,
      isActive: true,
      activeIngredient: "Propineb 70% + Seng (Zinc)",
      benefits: ["Melindungi tanaman dari penyakit bercak daun dan antraknosa", "Memberikan efek hijau daun berkat kandungan zinc", "Tahan cuaca lembap"],
      usageInstructions: "Larutkan 2-3 sendok makan (30-40 gram) per tangki 15 liter.",
      labelDosage: "1.5 - 2 Kg / Hektar",
      warnings: ["Simpan di tempat kering dan sejuk"],
      manufacturer: "PT Bayer CropScience",
      registrationNumber: "RI. 0102011974150",
      sellerId: seller1.id,
    },
    {
      sku: "FNG-SCR-002",
      name: "Score 250 EC (250 ml)",
      slug: "score-250-ec-250-ml",
      category: "Fungisida",
      description: "Fungisida sistemik dengan ZPT (Zat Pengatur Tumbuh) untuk meningkatkan bobot gabah padi dan membasmi penyakit hawar pelepah.",
      price: 165000,
      stock: 20,
      isFeatured: false,
      isActive: true,
      activeIngredient: "Difenokonazol 250 g/l",
      benefits: ["Bulir padi lebih bernas dan bersih mengkilap", "Sistemik diserap ke seluruh jaringan tanaman", "Efektif melawan bercak ungu pada bawang merah"],
      usageInstructions: "Gunakan 10-15 ml per tangki 15 liter pada umur bunting dan berbunga.",
      labelDosage: "0.25 - 0.5 Liter / Hektar",
      warnings: ["Gunakan masker dan kacamata pelindung"],
      manufacturer: "PT Syngenta Indonesia",
      registrationNumber: "RI. 01020119931089",
      sellerId: seller1.id,
    },
    {
      sku: "INS-DCS-001",
      name: "Decis 25 EC (500 ml)",
      slug: "decis-25-ec-500-ml",
      category: "Insektisida",
      description: "Insektisida racun kontak dan lambung berefek knock-down kilat untuk membasmi ulat grayak, lalat buah, dan kutu daun.",
      price: 92000,
      stock: 50,
      isFeatured: true,
      isActive: true,
      activeIngredient: "Deltametrin 25 g/l",
      benefits: ["Hama ulat langsung jatuh sesaat setelah kontak", "Mempunyai efek penolak hama (repellent)", "Dosis ekonomis dan efisien"],
      usageInstructions: "Campurkan 15-20 ml per tangki 15 liter.",
      labelDosage: "0.5 - 1 Liter / Hektar",
      warnings: ["Jangan gunakan saat tanaman sedang mekar dikunjungi lebah"],
      manufacturer: "PT Bayer CropScience",
      registrationNumber: "RI. 0101011979387",
      sellerId: seller1.id,
    },

    // Produk Seller 2 (Toko Agro Jaya Makmur - WA: 6281987654321)
    {
      sku: "INS-CRC-002",
      name: "Curacron 500 EC (250 ml)",
      slug: "curacron-500-ec-250-ml",
      category: "Insektisida",
      description: "Insektisida berspektrum luas untuk membasmi hama thrips, ulat daun, kutu kebul pada cabai, tomat, dan sayuran.",
      price: 78000,
      stock: 40,
      isFeatured: false,
      isActive: true,
      activeIngredient: "Profenofos 500 g/l",
      benefits: ["Aroma khas yang mengusir serangga hama", "Efektif menembus jaringan daun (translaminar)", "Membunuh telur hama hingga serangga dewasa"],
      usageInstructions: "Campurkan 15-25 ml per tangki 15 liter.",
      labelDosage: "1 - 1.5 Liter / Hektar",
      warnings: ["Berbau menyengat, gunakan masker khusus pestisida"],
      manufacturer: "PT Syngenta Indonesia",
      registrationNumber: "RI. 0101011979381",
      sellerId: seller2.id, // Toko Agro Jaya Makmur (Beda Seller & Beda WA!)
    },
    {
      sku: "PPK-NPK-001",
      name: "Pupuk NPK Mutiara 16-16-16 (1 Kg)",
      slug: "pupuk-npk-mutiara-16-16-16-1-kg",
      category: "Pupuk",
      description: "Pupuk majemuk kualitas tinggi dengan formulasi seimbang 16% Nitrogen, 16% Fosfat, dan 16% Kalium yang mudah larut dalam air.",
      price: 22000,
      stock: 120,
      isFeatured: true,
      isActive: true,
      activeIngredient: "N 16% + P2O5 16% + K2O 16%",
      benefits: ["Mempercepat pertumbuhan vegetatif daun dan tunas", "Mencegah bunga dan buah rontok", "Dapat diaplikasikan tabur maupun kocor"],
      usageInstructions: "Untuk kocor: larutkan 1 kg NPK ke dalam 200 liter air. Kocor 200 ml per pohon.",
      labelDosage: "150 - 300 Kg / Hektar",
      warnings: ["Tutup rapat wadah setelah dibuka agar tidak menggumpal"],
      manufacturer: "PT Meroke Tetap Jaya",
      registrationNumber: "Kementan RI 01.01.2018.055",
      sellerId: seller2.id,
    },
    {
      sku: "PPK-MKP-002",
      name: "Pupuk MKP Pak Tani (1 Kg)",
      slug: "pupuk-mkp-pak-tani-1-kg",
      category: "Pupuk",
      description: "Pupuk mono kalium fosfat larut air 100% tanpa residu untuk memacu pembungaan, pembentukan buah lebat, dan meningkatkan rasa manis.",
      price: 48000,
      stock: 60,
      isFeatured: true,
      isActive: true,
      activeIngredient: "Fosfat (P2O5) 52% + Kalium (K2O) 34%",
      benefits: ["Merangsang pembungaan serempak pada masa generatif", "Meningkatkan daya tahan terhadap penyakit jamur", "Bebas klorin sehingga aman untuk segala jenis tanaman"],
      usageInstructions: "Semprot daun: 2-4 gram per liter air (30-60 gram per tangki).",
      labelDosage: "5 - 10 Kg / Hektar aplikasi semprot/kocor",
      warnings: ["Jangan dicampur dengan pupuk kalsium berkonsentrasi tinggi"],
      manufacturer: "PT Saprotan Utama",
      registrationNumber: "Kementan RI 01.01.2017.028",
      sellerId: seller2.id,
    },
    {
      sku: "BKT-BCN-001",
      name: "Bactocyn 150 AL (200 ml)",
      slug: "bactocyn-150-al-200-ml",
      category: "Bakterisida",
      description: "Bakterisida sistemik berbentuk larutan untuk mengendalikan penyakit layu bakteri (Ralstonia solanacearum) pada tanaman cabai dan tomat.",
      price: 65000,
      stock: 30,
      isFeatured: false,
      isActive: true,
      activeIngredient: "Oksitetrasiklin 150 g/l",
      benefits: ["Sistemik diserap tanaman untuk mencegah layu mendadak", "Efektif menghentikan perkembangbiakan koloni bakteri", "Mudah dilarutkan tanpa residu endapan"],
      usageInstructions: "Campurkan 10-20 ml per tangki 15 liter, semprot atau kocor pada perakaran.",
      labelDosage: "0.5 - 1 Liter / Hektar",
      warnings: ["Gunakan secara berkala setiap 7 hari sekali saat cuaca sering hujan"],
      manufacturer: "PT Dharma Guna Wibawa",
      registrationNumber: "RI. 01020120042079",
      sellerId: seller2.id,
    },
  ];

  for (const item of productsData) {
    await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        sku: item.sku,
        category: item.category,
        description: item.description,
        price: item.price,
        stock: item.stock,
        isFeatured: item.isFeatured,
        isActive: item.isActive,
        activeIngredient: item.activeIngredient,
        benefits: item.benefits,
        usageInstructions: item.usageInstructions,
        labelDosage: item.labelDosage,
        warnings: item.warnings,
        manufacturer: item.manufacturer,
        registrationNumber: item.registrationNumber,
        sellerId: item.sellerId,
      },
      create: item,
    });
  }
  console.log(`   ✓ 9 Produk berhasil diseed ke masing-masing Seller.`);

  console.log("=================================================");
  console.log("🎉 SEEDING SELESAI!");
  console.log("Daftar Nomor WhatsApp:");
  console.log("1. Admin Platform CS : +6281234567890 (admin@gmail.com / 123)");
  console.log("2. Seller 1 (Toko Berkah) : +6281234567891 (seller@gmail.com / 123)");
  console.log("3. Seller 2 (Toko Agro)   : +6281987654321 (seller2@gmail.com / 123)");
  console.log("4. Buyer (Petani)         : +6281234567892 (buyer@gmail.com / 123)");
  console.log("=================================================");
}

main()
  .catch((e) => {
    console.error("Gagal saat proses seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
