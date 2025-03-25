document.addEventListener("DOMContentLoaded", () => {
    // Game state
    let remainingGuesses = 5
    let part2Active = false
    let currentQuestionData = null
    let score = 0
  
    // DOM elements
    const homeScreen = document.getElementById("home-screen")
    const quizScreen = document.getElementById("quiz-screen")
    const homeButton = document.getElementById("home-button")
    const gameButtons = document.querySelectorAll(".game-button")
    const howToPlayPopup = document.getElementById("how-to-play")
    const closeHowToPlayBtn = document.getElementById("close-how-to-play")
    const howToPlayBtn = document.getElementById("how-to-play-btn")
  
    // Event listeners for navigation
    homeButton.addEventListener("click", showHomeScreen)
  
    // Set up game buttons
    gameButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const gameType = button.getAttribute("data-game")
        if (gameType === "quiz") {
          showHowToPlay()
        } else {
          // For other game types, show a "coming soon" message
          showPopup("This game is coming soon!", null)
        }
      })
    })
  
    // How to play popup handlers
    closeHowToPlayBtn.addEventListener("click", () => {
      howToPlayPopup.classList.add("hidden")
    })
  
    howToPlayBtn.addEventListener("click", () => {
      howToPlayPopup.classList.add("hidden")
      startGame()
    })
  
    // Function to show home screen
    function showHomeScreen() {
      quizScreen.classList.add("hidden")
      homeScreen.classList.remove("hidden")
      resetGame()
    }
  
    // Function to show how to play popup
    function showHowToPlay() {
      howToPlayPopup.classList.remove("hidden")
    }
  
    // Function to start the game
    function startGame() {
      homeScreen.classList.add("hidden")
      quizScreen.classList.remove("hidden")
  
      // Reset game state
      resetGame()
  
      // Load questions
      fetch("questions.json")
        .then((response) => response.json())
        .then((data) => {
          currentQuestionData = data[0]
          startQuiz(currentQuestionData)
        })
        .catch((error) => {
          console.error("Error loading questions:", error)
          showPopup("Error loading questions. Please try again.", showHomeScreen)
        })
    }
  
    // Function to reset game state
    function resetGame() {
      remainingGuesses = 5
      part2Active = false
      score = 0
      document.getElementById("guesses-left").textContent = remainingGuesses
      document.getElementById("score-display").textContent = score
      document.getElementById("part2-container").classList.add("hidden")
    }
  
    // Function to start the quiz
    function startQuiz(questionData) {
      const quizContainer = document.getElementById("quiz-container")
      quizContainer.innerHTML = `<h3>${questionData.question_part1}</h3>`
  
      const optionsContainer = document.createElement("div")
      optionsContainer.classList.add("options")
  
      // Create a 3x3 grid (9 slots)
      for (let i = 0; i < 9; i++) {
        const button = document.createElement("button")
  
        // If we have an option for this position, use it
        if (i < questionData.options.length) {
          button.textContent = questionData.options[i]
          button.onclick = () => handleElimination(questionData.options[i], questionData, button)
          button.classList.add("active-option")
        } else {
          // Otherwise, create an empty placeholder
          button.disabled = true
          button.classList.add("placeholder-option")
        }
  
        optionsContainer.appendChild(button)
      }
  
      quizContainer.appendChild(optionsContainer)
    }
  
    // Function to handle elimination
    function handleElimination(selected, questionData, button) {
      if (part2Active || remainingGuesses <= 0 || button.classList.contains("eliminated")) return
  
      remainingGuesses--
      document.getElementById("guesses-left").textContent = remainingGuesses
  
      if (questionData.incorrect_answers.includes(selected)) {
        button.classList.add("eliminated")
  
        // Add 100 points for correct elimination
        score += 100
        document.getElementById("score-display").textContent = score
  
        // Add a small delay for visual feedback
        setTimeout(() => {
          // Check if all incorrect answers have been eliminated
          const allIncorrectEliminated = questionData.incorrect_answers.every((answer) => {
            const buttons = document.querySelectorAll(".options button.active-option")
            for (const btn of buttons) {
              if (btn.textContent === answer && !btn.classList.contains("eliminated")) {
                return false
              }
            }
            return true
          })
  
          if (allIncorrectEliminated) {
            showPopup("Great job! You've eliminated all incorrect answers!", () => {
              startPart2(questionData)
            })
          }
  
          // If no more guesses, move to part 2
          if (remainingGuesses === 0) {
            startPart2(questionData)
          }
        }, 300)
      } else {
        button.classList.add("incorrect")
        // Shake animation effect
        setTimeout(() => {
          button.classList.remove("incorrect")
  
          // If no more guesses, move to part 2
          if (remainingGuesses === 0) {
            startPart2(questionData)
          }
        }, 500)
      }
    }
  
    // Function to start part 2
    function startPart2(questionData) {
      part2Active = true
      const part2Container = document.getElementById("part2-container")
      part2Container.classList.remove("hidden")
      document.getElementById("question-part2").textContent = questionData.question_part2
  
      // Only non-eliminated options are clickable in part 2
      document.querySelectorAll(".options button").forEach((button) => {
        if (!button.classList.contains("eliminated")) {
          button.onclick = () => checkFinalAnswer(button.textContent, questionData.correct_answer_part2, button)
        }
      })
  
      showPopup("Now for Part 2! From the remaining answers, select the correct one.", null)
    }
  
    // Function to check final answer
    function checkFinalAnswer(selected, correctAnswer, button) {
      if (selected === correctAnswer) {
        button.style.backgroundColor = "gold"
        button.style.color = "#333"
        button.style.fontWeight = "bold"
  
        // Add 500 points for correct final answer
        score += 500
        document.getElementById("score-display").textContent = score
  
        // Add a small delay for visual feedback
        setTimeout(() => {
          showPopup(`Congratulations! You completed the quiz with ${score} points!`, showHomeScreen)
        }, 800)
      } else {
        button.classList.add("incorrect")
        setTimeout(() => {
          button.classList.remove("incorrect")
        }, 500)
      }
    }
  
    // Function to show popup
    function showPopup(message, callback) {
      const popup = document.getElementById("popup")
      const popupMessage = document.getElementById("popup-message")
      const popupBtn = document.getElementById("popup-btn")
  
      popupMessage.textContent = message
      popup.classList.remove("hidden")
  
      popupBtn.onclick = () => {
        popup.classList.add("hidden")
        if (callback) callback()
      }
    }
  })
  
  