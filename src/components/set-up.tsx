import styles from "./hangman.module.css";
import type { useHangman } from "../hooks/use-hangman";

export const SetUp = ({
  userWord,
  setUserWord,
  startGame,
  startWithRandomWord,
}: Pick<
  ReturnType<typeof useHangman>,
  "userWord" | "setUserWord" | "startGame" | "startWithRandomWord"
>) => {
  return (
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
      <button className={styles.startButton} onClick={startGame}>
        Начать игру
      </button>
      <br/><br/><br/>
      <h2>Или можно сгенерировать случайное слово:</h2>
      <div className={styles.startGroup}>
        <button
          className={styles.startButtonKid}
          onClick={() => startWithRandomWord("kid")}
        >
          Детский режим
        </button>
        <button
          className={styles.startButtonAdult}
          onClick={() => startWithRandomWord("adult")}
        >
          Взрослый режим
        </button>
      </div>
    </div>
  );
};
