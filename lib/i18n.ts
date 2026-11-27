export const supportedLocales = ['en', 'de', 'es', 'fr', 'pt', 'ja'] as const

export type AppLocale = (typeof supportedLocales)[number]

export const localeOptions: { value: AppLocale; label: string; nativeLabel: string }[] = [
  { value: 'en', label: 'English', nativeLabel: 'English' },
  { value: 'de', label: 'German', nativeLabel: 'Deutsch' },
  { value: 'es', label: 'Spanish', nativeLabel: 'Español' },
  { value: 'fr', label: 'French', nativeLabel: 'Français' },
  { value: 'pt', label: 'Portuguese', nativeLabel: 'Português' },
  { value: 'ja', label: 'Japanese', nativeLabel: '日本語' },
]

export const copy = {
  en: {
    nav: ['Dashboard', 'Music', 'Shop', 'NFT Vault', 'Wallet', 'Whitepaper', 'Profile', 'Miner OS', 'Ecosystem', 'CloudChain', 'Governance', 'Team Hub', 'Student Lab'],
    cloudminerOs: 'CloudMiner OS',
    dashboardTitle: 'Your mining command center',
    dashboardDescription: 'Dashboard for your wallet-connected participation cycle and SHM on Base.',
    teamTitle: 'Your crew workspace',
    teamDescription: 'Coordinate verified participation with your team and keep progress visible.',
    studentTitle: 'Learn the chain, one block at a time',
    studentDescription: 'Understand wallets, blocks, and responsible participation before you scale.',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    more: 'More',
    install: 'Install app',
  },
  de: {
    nav: ['Dashboard', 'Musik', 'Shop', 'NFT-Tresor', 'Wallet', 'Whitepaper', 'Profil', 'Miner OS', 'Ökosystem', 'CloudChain', 'Governance', 'Team-Hub', 'Lernbereich'],
    cloudminerOs: 'CloudMiner OS',
    dashboardTitle: 'Dein Mining-Dashboard',
    dashboardDescription: 'Rig, Teilnahmepunkte und SHM auf Base übersichtlich an einem Ort.',
    teamTitle: 'Dein Team-Arbeitsbereich',
    teamDescription: 'Koordiniere die Teilnahme im Team und behalte Fortschritte im Blick.',
    studentTitle: 'Lerne die Blockchain Schritt für Schritt',
    studentDescription: 'Verstehe Wallets, Blöcke und verantwortungsvolle Teilnahme.',
    openMenu: 'Menü öffnen',
    closeMenu: 'Menü schließen',
    more: 'Mehr',
    install: 'App installieren',
  },
  es: {
    nav: ['Panel', 'Música', 'Tienda', 'Bóveda NFT', 'Billetera', 'Documento técnico', 'Perfil', 'Miner OS', 'Ecosistema', 'CloudChain', 'Gobernanza', 'Equipo', 'Aula'],
    cloudminerOs: 'CloudMiner OS',
    dashboardTitle: 'Tu centro de minería',
    dashboardDescription: 'Tu equipo, puntos de participación y SHM en Base, en un solo lugar.',
    teamTitle: 'Espacio de tu equipo',
    teamDescription: 'Coordina la participación del equipo y consulta el progreso.',
    studentTitle: 'Aprende blockchain bloque a bloque',
    studentDescription: 'Comprende las billeteras, los bloques y la participación responsable.',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    more: 'Más',
    install: 'Instalar aplicación',
  },
  fr: {
    nav: ['Tableau de bord', 'Musique', 'Boutique', 'Coffre NFT', 'Portefeuille', 'Livre blanc', 'Profil', 'Miner OS', 'Écosystème', 'CloudChain', 'Gouvernance', 'Équipe', 'Espace étudiant'],
    cloudminerOs: 'CloudMiner OS',
    dashboardTitle: 'Votre tableau de minage',
    dashboardDescription: 'Votre rig, vos points de participation et le SHM sur Base au même endroit.',
    teamTitle: 'Espace de votre équipe',
    teamDescription: 'Coordonnez la participation de l’équipe et suivez sa progression.',
    studentTitle: 'Apprenez la blockchain bloc par bloc',
    studentDescription: 'Comprenez les portefeuilles, les blocs et la participation responsable.',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    more: 'Plus',
    install: 'Installer l’application',
  },
  pt: {
    nav: ['Painel', 'Música', 'Loja', 'Cofre NFT', 'Carteira', 'Documento técnico', 'Perfil', 'Miner OS', 'Ecossistema', 'CloudChain', 'Governança', 'Equipe', 'Laboratório'],
    cloudminerOs: 'CloudMiner OS',
    dashboardTitle: 'Seu painel de mineração',
    dashboardDescription: 'Seu equipamento, pontos de participação e SHM na Base em um só lugar.',
    teamTitle: 'Espaço da sua equipe',
    teamDescription: 'Coordene a participação da equipe e acompanhe o progresso.',
    studentTitle: 'Aprenda blockchain bloco a bloco',
    studentDescription: 'Entenda carteiras, blocos e participação responsável.',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    more: 'Mais',
    install: 'Instalar aplicativo',
  },
  ja: {
    nav: ['ダッシュボード', '音楽', 'ショップ', 'NFT保管庫', 'ウォレット', 'ホワイトペーパー', 'プロフィール', 'Miner OS', 'エコシステム', 'CloudChain', 'ガバナンス', 'チーム', '学習ラボ'],
    cloudminerOs: 'CloudMiner OS',
    dashboardTitle: 'マイニングダッシュボード',
    dashboardDescription: 'リグ、参加ポイント、Base上のSHMを一か所で確認できます。',
    teamTitle: 'チームワークスペース',
    teamDescription: 'チームの参加状況と進捗をまとめて確認できます。',
    studentTitle: 'ブロックごとに学ぶブロックチェーン',
    studentDescription: 'ウォレット、ブロック、安全な参加方法を学びましょう。',
    openMenu: 'メニューを開く',
    closeMenu: 'メニューを閉じる',
    more: 'その他',
    install: 'アプリをインストール',
  },
} as const

export function detectLocale(language?: string): AppLocale {
  const candidate = language?.toLowerCase().split('-')[0]
  return supportedLocales.find((locale) => locale === candidate) ?? 'en'
}
