import styles from "./hangman.module.css";
import { Notification } from "./notification";
import { SetUp } from "./set-up";
import { useHangman } from "../hooks/use-hangman";

export const Hangman = () => {
  const {
    word,
    guessedLetters,
    incorrectGuesses,
    incorrectLetters,
    gameState,
    guess,
    inputRef,
    notification,
    startGame,
    handleGuess,
    startWithRandomWord,
    setUserWord,
    userWord,
    setGuess,
    setGameState,
  } = useHangman();

  const getWordDisplay = () => {
    return word
      .split("")
      .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
      .join(" ");
  };

  const renderHangman = () => {
    const hangmanParts = Array.from({ length: 11 }, (_, i) => {
      const partKey = [
        "",
        "base",
        "pole",
        "top",
        "rope",
        "head",
        "body",
        "arm1",
        "arm2",
        "leg1",
        "leg2",
      ][i];
      return i <= incorrectGuesses ? (
        <div
          key={partKey}
          className={`${styles[`hangman${partKey.charAt(0).toUpperCase() + partKey.slice(1)}`]} ${styles.fade}`}
        ></div>
      ) : null;
    }).filter(Boolean);

    return <div className={styles.hangmanContainer}>{hangmanParts}</div>;
  };

  return (
    <div className={styles.container}>
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
      <div className={styles.card}>
        <div className={styles.cardContent}>
          <div className={styles.title}>Виселица</div>

          {gameState === "setup" && (
            <SetUp
              userWord={userWord}
              setUserWord={setUserWord}
              startGame={startGame}
              startWithRandomWord={startWithRandomWord}
            />
          )}

          {gameState === "lost" && (
            <div className={styles.alertDestructive}>
              Вы проиграли! Слово было: {word}
            </div>
          )}
          {gameState === "won" && (
            <div className={styles.alert}>Вы выиграли! Слово было: {word}</div>
          )}

          <div className={styles.flex}>
            {gameState !== "setup" && renderHangman()}
            <div className={styles.flexCol}>
              {gameState !== "setup" && (
                <div className={styles.incorrectLetters}>
                  Неверные буквы: {incorrectLetters.join(", ")}
                </div>
              )}
            </div>
          </div>
          <div className={styles.wordDisplay}>
            {gameState !== "setup" ? getWordDisplay() : ""}
          </div>

          {gameState !== "setup" && (
            <div className={styles.inputContainer}>
              <input
                type="text"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleGuess();
                  }
                }}
                placeholder="Угадайте букву"
                className={styles.input}
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                maxLength={1}
                disabled={gameState !== "playing"}
                ref={inputRef}
              />
              <button
                className={styles.startButton}
                onClick={handleGuess}
                disabled={gameState !== "playing"}
              >
                Проверить
              </button>
            </div>
          )}
          {gameState !== "setup" && (
            <div className={styles.incorrectAttempts}>
              Неверные попытки: {incorrectGuesses} / 10
            </div>
          )}
          {gameState !== "setup" && (
            <button
              className={styles.newGameButton}
              onClick={() => {
                setUserWord("");
                setGameState("setup");
              }}
            >
              Новая игра
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
