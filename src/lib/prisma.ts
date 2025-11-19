import { PrismaClient } from "@prisma/client"; // PrismaClient をインポート

// NodeJS のグローバル型に prisma を追加
declare global {
  var prisma: PrismaClient; // グローバルに PrismaClient のインスタンスを保持するための宣言
}

// 既存のグローバル prisma があればそれを使い、なければ新しく PrismaClient を生成
const prisma = global.prisma || new PrismaClient();

// 開発環境の場合、ホットリロード時に prisma インスタンスを再利用する
if (process.env.NODE_ENV === "development") global.prisma = prisma;

// デフォルトで prisma をエクスポート
export default prisma;
