export function insertFailedCard<T extends { date: string }>(board: T[], card: T): Array<T & { isFailed?: boolean }> {
    const revealedCard = { ...card, isFailed: true };
    const correctPosition = board.findIndex((boardCard) => Number(boardCard.date) > Number(card.date));
    const revealedBoard: Array<T & { isFailed?: boolean }> = [...board];
    revealedBoard.splice(correctPosition === -1 ? revealedBoard.length : correctPosition, 0, revealedCard);
    return revealedBoard;
}
