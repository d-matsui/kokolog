# ココログ (Kokoro Log)

あなたの心に寄り添う、認知行動療法（CBT）7コラム法実践アプリ

[![CI/CD](https://github.com/d-matsui/kokolog/actions/workflows/test.yml/badge.svg)](https://github.com/d-matsui/kokolog/actions/workflows/test.yml)
[![Test Coverage](https://img.shields.io/badge/coverage-97.89%25-brightgreen)](https://github.com/d-matsui/kokolog)
[![Code Style: Biome](https://img.shields.io/badge/code_style-biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)

## 📱 アプリについて

「紙での実践は大変で続かない」という課題を解決するため、認知行動療法の7コラム法をスマートフォンで手軽に実践できるアプリです。日々の心の動きを記録し、自己理解を深めるパートナーとして設計されています。

### 主な機能

- **📝 クイックメモ**: 思いついた自動思考をすぐにメモ
- **📋 7コラム法フォーム**: 状況・気分・思考・根拠・反証・バランス思考・事後気分の入力
- **😊 多次元感情記録**: 複数の感情を5段階評価で直感的に記録
- **⭐ 大切な気づき**: 効果的な考えをブックマークして保存
- **📊 気分グラフ**: 感情の変化を視覚化して成長を実感
- **🔍 記録管理**: 過去の記録の検索・編集・削除

## 🚀 利用者向け

### アプリの使い方

1. **Expo Go**をスマートフォンにインストール
2. [リリースページ](https://github.com/d-matsui/kokolog/releases)から最新版をダウンロード
3. QRコードをスキャンしてアプリを起動

### 基本操作

- **ホーム画面**: クイックメモで思考を素早く記録
- **フォーム画面**: 7コラム法の詳細な記録
- **一覧画面**: 過去の記録を閲覧・編集
- **グラフ画面**: 気分の変化を視覚的に確認
- **気づき画面**: ブックマークした重要な考えを確認

## 🛠️ 開発者向け

### 技術スタック

- **React Native** (Expo SDK 53) + **TypeScript**
- **AsyncStorage** (データ永続化) + **React Context** (状態管理)
- **Biome** (リンティング) + **Jest** (テスト) + **GitHub Actions** (CI/CD)

### 開発環境セットアップ

**必要な環境**: Node.js 18以上、Expo CLI

```bash
# 1. リポジトリをクローン
git clone https://github.com/d-matsui/kokolog.git
cd kokolog

# 2. 依存関係をインストール
npm install

# 3. 開発サーバーを起動
npm start

# 4. アプリを実行
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Web ブラウザ
```

### 開発コマンド

```bash
# 開発・実行
npm start          # 開発サーバー起動
npm run ios/android/web # 各プラットフォームで実行

# テスト・品質管理
npm test           # テスト実行
npm run lint       # リンティング
npm run type-check # 型チェック

# バージョン管理（セマンティックバージョニング）
npm run version    # 自動バージョン決定・CHANGELOG更新
```

### 品質基準

- **テストカバレッジ**: 95%以上を維持（現在: 97.89%）
- **コードスタイル**: Biomeによる自動フォーマット・リンティング
- **型安全性**: TypeScript strict モード

### プロジェクト構造

```
src/
├── components/     # UIコンポーネント (FormInput, MoodInput等)
├── context/        # React Context (LogContext)
├── screens/        # 画面コンポーネント (Form, Graph, List等)
├── constants/      # 定数 (emotions.ts)
├── types/          # TypeScript型定義
└── __tests__/      # テスト
```

### 貢献方法

#### Issue駆動開発（推奨）
1. **Issue作成**: バグ報告や機能要望を記載
2. **Claude連携**: `@claude` メンションで自動実装を依頼
3. **レビュー**: 生成されたPRをレビュー

#### 従来の方法
- **プルリクエスト**: 直接的なコード改善
- **テスト**: 新機能のテスト作成

#### 開発ガイドライン
- コミットは [Conventional Commits](https://www.conventionalcommits.org/) 形式
- PR前に `npm run lint` と `npm test` を実行
- 新機能には必ずテストを含める

---

## 📄 ライセンス・開発者

- **ライセンス**: [MIT License](LICENSE)
- **開発者**: [@d-matsui](https://github.com/d-matsui)

**このアプリが、認知行動療法の実践をより身近で継続的なものにし、多くの人の心の健康をサポートできることを願っています。**