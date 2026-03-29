import "./globals.css";

export const metadata = {
  title: "Izakaya Tetris",
  description: "居酒屋テトリス風パズル",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}