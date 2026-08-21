import "dotenv/config";
import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

type CategoryId = "mouse" | "keyboard" | "headset" | "monitor" | "chair";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CATALOG: Record<CategoryId, string[]> = {
  mouse: [
    "Logitech G Pro X Superlight 2",
    "Logitech G502 X",
    "Logitech MX Master 3S",
    "Razer DeathAdder V3",
    "Razer Basilisk V3",
    "Razer Viper V3 Pro",
    "SteelSeries Rival 3",
    "SteelSeries Aerox 3",
    "Corsair Katar Pro",
    "Corsair M65 RGB Ultra",
    "HyperX Pulsefire Haste 2",
    "Glorious Model O",
    "Glorious Model D",
    "Cooler Master MM712",
    "ASUS ROG Gladius III",
  ],

  keyboard: [
    "Logitech G Pro X TKL",
    "Logitech MX Mechanical",
    "Razer BlackWidow V4",
    "Razer Huntsman V3 Pro",
    "Razer Ornata V3",
    "SteelSeries Apex Pro TKL",
    "SteelSeries Apex 7",
    "Corsair K70 RGB Pro",
    "Corsair K65 RGB Mini",
    "HyperX Alloy Origins",
    "HyperX Alloy Elite 2",
    "Keychron K2",
    "Keychron K8 Pro",
    "Keychron Q1",
    "ASUS ROG Strix Scope II",
  ],

  headset: [
    "Logitech G Pro X 2 Lightspeed",
    "Logitech G733 Lightspeed",
    "Logitech G435 Lightspeed",
    "Razer BlackShark V2 Pro",
    "Razer Barracuda X",
    "Razer Kraken V3",
    "SteelSeries Arctis Nova 7",
    "SteelSeries Arctis Nova Pro",
    "Corsair HS80 RGB",
    "Corsair Virtuoso RGB Wireless",
    "HyperX Cloud III",
    "HyperX Cloud Alpha",
    "Sony INZONE H5",
    "ASUS ROG Delta S",
    "JBL Quantum 810",
  ],

  monitor: [
    "LG UltraGear 27GP850",
    "LG UltraGear 27GR95QE",
    "Samsung Odyssey G5",
    "Samsung Odyssey G7",
    "Samsung Odyssey G9",
    "ASUS TUF Gaming VG27AQ",
    "ASUS ROG Swift PG279QM",
    "AOC 24G2",
    "AOC Q27G2S",
    "BenQ MOBIUZ EX2710Q",
    "BenQ ZOWIE XL2546K",
    "Dell G2724D",
    "Dell Alienware AW3423DWF",
    "MSI G274QPF",
    "MSI MAG 274QRF-QD",
  ],

  chair: [
    "Secretlab TITAN Evo",
    "Secretlab TITAN Evo Lite",
    "Corsair TC100 Relaxed",
    "Corsair T3 Rush",
    "Razer Iskur V2",
    "Razer Enki",
    "AndaSeat Kaiser 3",
    "AndaSeat Phantom 3",
    "Noblechairs HERO",
    "Noblechairs EPIC",
    "DXRacer Formula Series",
    "DXRacer Master Series",
    "Cougar Armor One",
    "ThunderX3 TC3",
    "Sihoo M57",
  ],
};

function randomPrice(): number {
  return Number((80 + Math.random() * 270).toFixed(2));
}

function randomStock(): number {
  return Math.floor(Math.random() * 46) + 5;
}

function createDescription(name: string, category: CategoryId): string {
  return `${name} pertenece a la categoría "${category}". Fabricado con materiales de calidad que ofrecen comodidad, durabilidad y un diseño moderno para el uso diario.`;
}

async function seed() {
  const products = Object.entries(CATALOG).flatMap(([categoryId, names]) =>
    names.map((name) => ({
      name,
      nameLower: name.toLowerCase(),
      image: `https://picsum.photos/seed/${encodeURIComponent(name)}/300/300`,
      description: createDescription(name, categoryId as CategoryId),
      price: randomPrice(),
      stock: randomStock(),
      categoryId: categoryId as CategoryId,
    })),
  );

  console.log(`🌱 Sembrando ${products.length} productos...\n`);

  for (const product of products) {
    const ref = doc(collection(db, "products"));
    await setDoc(ref, {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log(`✔ ${product.name}`);
  }

  console.log(`\n✅ ${products.length} productos creados correctamente.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Error al ejecutar el seeder:");
  console.error(error);
  process.exit(1);
});