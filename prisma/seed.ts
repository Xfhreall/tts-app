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
      { text: "BALI", clue: "Pulau dewata yang terkenal" },
      { text: "YOGYAKARTA", clue: "Kota pelajar dan budaya" },
    ],
  },
  {
    title: "Makanan Nusantara",
    words: [
      { text: "RENDANG", clue: "Masakan Padang dari daging sapi" },
      { text: "SATAY", clue: "Daging tusuk yang dibakar" },
      { text: "NASI", clue: "Makanan pokok orang Indonesia" },
      { text: "BAKSO", clue: "Bola daging yang populer" },
      { text: "GADO", clue: "Sayuran dengan saus kacang" },
      { text: "TEMPE", clue: "Makanan dari kedelai fermentasi" },
      { text: "SOTO", clue: "Sup tradisional Indonesia" },
    ],
  },
];

async function main() {
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
