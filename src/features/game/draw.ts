import { CardType, HiddenCard } from "./types";

export const CARD_ORDER: CardType[] = [
  "I",
  "J",
  "L",
  "O",
  "S",
  "T",
  "Z",
  "ANY",
  "NONE",
];

export function getAvailableCards(excludedCards: CardType[]): CardType[] {
  return CARD_ORDER.filter((card) => !excludedCards.includes(card));
}

export function shuffleArray<T>(array: T[]): T[] {
  const copied = [...array];

  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }

  return copied;
}

export function createHiddenCards(cards: CardType[]): HiddenCard[] {
  return shuffleArray(cards).map((card, index) => ({
    id: `${card}-${index}-${Math.random().toString(36).slice(2, 8)}`,
    card,
  }));
}