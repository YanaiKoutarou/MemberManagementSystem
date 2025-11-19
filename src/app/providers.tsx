"use client"; // クライアントコンポーネントとして扱うための宣言

import React from "react"; // React をインポート

// Providers コンポーネント
// 子コンポーネントをラップしてそのままレンダリングする
export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>; // 子要素をそのまま出力
}
