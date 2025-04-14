import { useState, useEffect, useRef } from "react";
import styles from "./hangman.module.css";
import { Notification } from "./notification";
import { getRandomWord } from "../utils/get-word";

export const Hangman = () => {
  const [word, setWord] = useState("");
  const [userWord, setUserWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [incorrectLetters, setIncorrectLetters] = useState([]);
  const [gameState, setGameState] = useState("setup");
  const [guess, setGuess] = useState("");
  const inputRef = useRef(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const startGame = () => {
    const prepareWord = userWord.trim().toLowerCase();
    if (!prepareWord.match(/^[а-я]+$/)) {
      showNotification("Пожалуйста, введите слово кириллицей.", "error");
      return;
    }
    if (prepareWord.length === 0) {
      showNotification("Пожалуйста, введите слово.", "error");
      return;
    }

    setWord(prepareWord);
    setGuessedLetters([]);
    setIncorrectGuesses(0);
    setIncorrectLetters([]);
    setGameState("playing");
    setGuess("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  const startWithRandomWord = (mode: 'kid' | 'adult') => {
    setWord(getRandomWord(mode));
    setGuessedLetters([]);
    setIncorrectGuesses(0);
    setIncorrectLetters([]);
    setGameState("playing");
    setGuess("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }
  const handleGuess = () => {
    const prepareWord = guess.trim().toLowerCase();
    if (gameState !== "playing") return;
    if (!prepareWord.match(/^[а-я]$/)) {
      showNotification("Пожалуйста, введите одну букву кириллицей.", "error");
      return;
    }

    if (guessedLetters.includes(prepareWord)) {
      showNotification("Вы уже угадывали эту букву.", "warning");
      return;
    }

    setGuessedLetters([...guessedLetters, prepareWord]);

    if (!word.includes(prepareWord)) {
      setIncorrectGuesses(incorrectGuesses + 1);
      setIncorrectLetters([...incorrectLetters, prepareWord]);
    }

    setGuess("");
  };

  useEffect(() => {
    if (incorrectGuesses >= 10) {
      setGameState("lost");
    }

    if (
      word &&
      word.split("").every((letter) => guessedLetters.includes(letter))
    ) {
      setGameState("won");
    }
  }, [guessedLetters, incorrectGuesses, word]);

  const getWordDisplay = () => {
    return word
      .split("")
      .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
      .join(" ");
  };

  const renderHangman = () => {
    const hangmanParts = Array.from({ length: 11 }, (_, i) => {
      const partKey = ["", "base", "pole", "top", "rope", "head", "body", "arm1", "arm2", "leg1", "leg2"][i];
      return i <= incorrectGuesses ? <div key={partKey} className={`${styles[`hangman${partKey.charAt(0).toUpperCase() + partKey.slice(1)}`]} ${styles.fade}`}></div> : null;
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
            <div className={styles.inputContainer}>
              <input
                type="text"
                placeholder="Введите слово"
                className={styles.input}
                value={userWord}
                onChange={(e) => setUserWord(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    startGame();
                  }
                }}
              />
              <button
                className={styles.startButton}
                onClick={startGame}
              >
                Начать игру
              </button>
              <div className={styles.startGroup}>
                <button
                  className={styles.startButtonKid}
                  onClick={() => startWithRandomWord('kid')}
                >
                  Загадай слово  <br /> (Детский режим)
                </button>
                <button
                  className={styles.startButtonAdult}
                  onClick={() => startWithRandomWord('adult')}
                >
                  Загадай слово <br />(Взрослый режим)
                </button>
              </div>
            </div>
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
              <button className={styles.startButton} onClick={handleGuess} disabled={gameState !== "playing"}>
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
