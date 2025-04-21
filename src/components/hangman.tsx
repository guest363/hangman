import cn from "clsx";
import { useHangman } from "../hooks/use-hangman";
import styles from "./hangman.module.css";
import { Notification } from "./notification";
import { SetUp } from "./set-up";
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
            {gameState !== "setup" && incorrectGuesses ? <div className={styles.hangmanContainer}> <img

              src={`assets/${incorrectGuesses}.jpg`}
              alt={'hangman'}
              className={cn(styles.fade, styles.image)}
            /></div> : null}
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
              Неверные попытки: {incorrectGuesses} / 11
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
