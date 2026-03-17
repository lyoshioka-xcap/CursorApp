import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pagesの仕様に合わせて、画像の最適化を無効化します
  images: {
    unoptimized: true,
  },
  // リポジトリ名が URL のパスになるため、basePath を設定します（もしルートドメインで動かすなら不要ですが、通常は必要です）
  basePath: process.env.NODE_ENV === 'production' ? '/CursorApp' : '',
};

export default nextConfig;
