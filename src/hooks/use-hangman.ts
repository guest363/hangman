import { useState, useRef, useEffect } from "react";
import { getRandomWord } from "../utils/get-word";

export const useHangman = () => {
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
  const startWithRandomWord = (mode: "kid" | "adult") => {
    setWord(getRandomWord(mode));
    setGuessedLetters([]);
    setIncorrectGuesses(0);
    setIncorrectLetters([]);
    setGameState("playing");
    setGuess("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
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
    if (incorrectGuesses >= 11) {
      setGameState("lost");
    }

    if (
      word &&
      word.split("").every((letter) => guessedLetters.includes(letter))
    ) {
      setGameState("won");
    }
  }, [guessedLetters, incorrectGuesses, word]);

  return {
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
  };
};
