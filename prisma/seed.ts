import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { generateCrossword } from "../src/shared/lib/crossword-generator";
import { calculateDifficulty } from "../src/shared/lib/difficulty";

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
});

const samplePuzzles = [
  {
    title: "Hewan Indonesia",
    words: [
      { text: "HARIMAU", clue: "Kucing besar bergaris dari Sumatera" },
      { text: "GAJAH", clue: "Mamalia besar dengan belalai" },
      { text: "ORANGUTAN", clue: "Primata berambut merah dari Kalimantan" },
      { text: "KOMODO", clue: "Kadal raksasa dari Nusa Tenggara" },
      { text: "BADAK", clue: "Hewan bertanduk yang hampir punah" },
    ],
  },
  {
    title: "Kota Indonesia",
    words: [
      { text: "JAKARTA", clue: "Ibukota negara Indonesia" },
      { text: "SURABAYA", clue: "Kota pahlawan di Jawa Timur" },
      { text: "BANDUNG", clue: "Kota kembang di Jawa Barat" },
      { text: "MEDAN", clue: "Kota terbesar di Sumatera" },
      { text: "MAKASSAR", clue: "Kota terbesar di Sulawesi" },
      { text: "SEMARANG", clue: "Kota lumpia di Jawa Tengah" },
      { text: "DENPASAR", clue: "Ibukota provinsi Bali" },
      { text: "BALIKPAPAN", clue: "Kota minyak di Kalimantan Timur" },
      { text: "MANADO", clue: "Kota di ujung utara Sulawesi" },
      { text: "PADANG", clue: "Kota rendang di Sumatera Barat" },
      { text: "BANJARMASIN", clue: "Kota seribu sungai" },
      { text: "PONTIANAK", clue: "Kota khatulistiwa" },
      { text: "SAMARINDA", clue: "Ibukota Kalimantan Timur" },
      { text: "BATAM", clue: "Kota industri dekat Singapura" },
      { text: "AMBON", clue: "Ibukota provinsi Maluku" },
    ],
  },
  {
    title: "Buah Tropis",
    words: [
      { text: "MANGGA", clue: "Buah berwarna kuning oranye yang manis" },
      { text: "ANGGUR", clue: "Buah kecil yang tumbuh bergerombol" },
      { text: "RAMBUTAN", clue: "Buah merah berambut" },
      { text: "MANGGIS", clue: "Ratu buah berwarna ungu" },
      { text: "NANAS", clue: "Buah bersisik dengan mahkota daun" },
      { text: "PISANG", clue: "Buah kuning yang melengkung" },
      { text: "PEPAYA", clue: "Buah oranye dengan biji hitam" },
      { text: "ALPUKAT", clue: "Buah hijau untuk jus kental" },
      { text: "APEL", clue: "Buah merah yang renyah" },
      { text: "JERUK", clue: "Buah oranye kaya vitamin C" },
      { text: "KELAPA", clue: "Buah dengan air di dalamnya" },
      { text: "SEMANGKA", clue: "Buah besar berair warna merah" },
    ],
  },
];

async function main() {
  console.log("Deleting all existing puzzles...");
  await prisma.puzzle.deleteMany({});
  console.log("Deleted existing datas");

  console.log("Seeding database...");

  const existingUser = await prisma.user.findUnique({
    where: { username: "admin" },
  });

  let userId: string;

  if (!existingUser) {
    const adminUser = await prisma.user.create({
      data: {
        username: "admin",
        password: "admin123",
      },
    });
    console.log(`Created admin user: ${adminUser.username}`);
    userId = adminUser.id;
  } else {
    console.log("Admin user already exists");
    userId = existingUser.id;
  }

  for (const puzzleData of samplePuzzles) {
    try {
      const generated = generateCrossword(puzzleData.words);

      if (generated.unplacedWords.length > 0) {
        console.log(`Warning: Some words could not be placed in "${puzzleData.title}"`);
        continue;
      }

      const difficulty = calculateDifficulty(generated.words.length);

      const puzzle = await prisma.puzzle.create({
        data: {
          title: puzzleData.title,
          gridData: {
            grid: generated.grid,
            width: generated.width,
            height: generated.height,
          },
          published: true,
          difficulty,
          userId,
          words: {
            create: generated.words.map((word) => ({
              text: word.text,
              clue: word.clue,
              direction: word.direction,
              startX: word.startX,
              startY: word.startY,
              number: word.number,
            })),
          },
        },
      });

      console.log(`Created puzzle: ${puzzle.title}`);
    } catch (error) {
      console.error(`Error creating puzzle ${puzzleData.title}:`, error);
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
