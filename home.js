document.addEventListener("DOMContentLoaded", () => {
    // Set up game buttons that aren't the quiz button
    const gameButtons = document.querySelectorAll(".game-button:not(a)")
  
    gameButtons.forEach((button) => {
      button.addEventListener("click", () => {
        alert("This game is coming soon!")
      })
    })
  })
  
  