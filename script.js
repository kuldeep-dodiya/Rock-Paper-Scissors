
const choices = document.querySelectorAll('.choice');
const result = document.querySelector('.result');
const scoreboard = document.querySelector('.scoreboard');
const toggleTheme = document.getElementById('toggle-theme');
const toggleSound = document.getElementById('toggle-sound');

const options = ['Rock', 'Paper', 'Scissors'];

let playerScore = 0;
let computerScore = 0;


const soundClick = document.getElementById('sound-click');
const soundWin = document.getElementById('sound-win');
const soundLose = document.getElementById('sound-lose');
const soundDraw = document.getElementById('sound-draw');

let soundEnabled = true;


toggleSound.checked = true;
toggleTheme.checked = false;


const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);


class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.speedY = (Math.random() - 0.5) * 0.6;
        this.color = `rgba(0, 229, 255, ${Math.random() * 0.3 + 0.1})`;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00e5ff';
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}


function initParticles() {
    particlesArray = [];
    for (let i = 0; i < 100; i++) {
        particlesArray.push(new Particle());
    }
}
initParticles();

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();


function animateScore(oldScore, newScore, element) {
    let start = oldScore;
    const end = newScore;
    const duration = 400;
    const startTime = performance.now();

    function update(time) {
        let elapsed = time - startTime;
        if (elapsed > duration) elapsed = duration;
        const current = Math.floor(start + ((end - start) * (elapsed / duration)));
        element.textContent = current;
        if (elapsed < duration) {
            requestAnimationFrame(update);
        } else {
            element.textContent = end;
        }
    }
    requestAnimationFrame(update);
}


function updateScoreboard() {

    const scores = scoreboard.textContent.match(/\d+/g);
    const oldPlayer = scores ? parseInt(scores[0]) : 0;
    const oldComputer = scores ? parseInt(scores[1]) : 0;


    scoreboard.textContent = `You: ${playerScore} | Computer: ${computerScore}`;
}


function createFlipper(choice) {
    const container = document.createElement('span');
    container.className = 'flip-container';

    const flipper = document.createElement('span');
    flipper.className = 'flipper';

    const front = document.createElement('span');
    front.className = 'front';
    front.textContent = '?';

    const back = document.createElement('span');
    back.className = 'back';
    back.textContent = choiceEmoji(choice);

    flipper.appendChild(front);
    flipper.appendChild(back);
    container.appendChild(flipper);

    return { container, flipper };
}

function choiceEmoji(choice) {
    if (choice === 'Rock') return '✊';
    if (choice === 'Paper') return '✋';
    if (choice === 'Scissors') return '✌️';
    return '?';
}

function playSound(sound) {
    if (!soundEnabled) return;
    sound.currentTime = 0;
    sound.play();
}


function confettiBurst() {
    const confettiCount = 150;
    const colors = ['#00ffb3', '#00e5ff', '#00c8e5', '#008fb3'];
    const confettiCanvas = document.createElement('canvas');
    confettiCanvas.style.position = 'fixed';
    confettiCanvas.style.top = '0';
    confettiCanvas.style.left = '0';
    confettiCanvas.style.width = '100vw';
    confettiCanvas.style.height = '100vh';
    confettiCanvas.style.pointerEvents = 'none';
    confettiCanvas.style.zIndex = 9999;
    document.body.appendChild(confettiCanvas);

    const ctxConfetti = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    class ConfettiParticle {
        constructor() {
            this.x = Math.random() * confettiCanvas.width;
            this.y = Math.random() * confettiCanvas.height - confettiCanvas.height;
            this.size = (Math.random() * 7) + 4;
            this.speed = (Math.random() * 3) + 2;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.tilt = Math.random() * 10 - 10;
            this.tiltSpeed = Math.random() * 0.1 + 0.05;
            this.opacity = 1;
        }
        update() {
            this.y += this.speed;
            this.tilt += this.tiltSpeed;
            if (this.y > confettiCanvas.height) {
                this.y = Math.random() * -confettiCanvas.height;
                this.x = Math.random() * confettiCanvas.width;
                this.opacity = 1;
            }
        }
        draw() {
            ctxConfetti.beginPath();
            ctxConfetti.lineWidth = this.size / 2;
            ctxConfetti.strokeStyle = this.color;
            ctxConfetti.globalAlpha = this.opacity;
            ctxConfetti.moveTo(this.x + this.tilt, this.y);
            ctxConfetti.lineTo(this.x, this.y + this.tilt + this.size / 2);
            ctxConfetti.stroke();
            ctxConfetti.globalAlpha = 1;
        }
    }

    let confettiParticles = [];
    for (let i = 0; i < confettiCount; i++) {
        confettiParticles.push(new ConfettiParticle());
    }

    let confettiAnimationId;
    function animateConfetti() {
        ctxConfetti.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiParticles.forEach(p => {
            p.update();
            p.draw();
        });
        confettiAnimationId = requestAnimationFrame(animateConfetti);
    }
    animateConfetti();
    s
    setTimeout(() => {
        cancelAnimationFrame(confettiAnimationId);
        document.body.removeChild(confettiCanvas);
    }, 2500);
}

function getComputerChoice() {
    return options[Math.floor(Math.random() * options.length)];
}

function getWinner(player, computer) {
    if (player === computer) return 'draw';

    if (
        (player === 'Rock' && computer === 'Scissors') ||
        (player === 'Paper' && computer === 'Rock') ||
        (player === 'Scissors' && computer === 'Paper')
    ) {
        return 'win';
    }
    return 'lose';
}

function animateScoreboardCount() {
    scoreboard.textContent = `You: ${playerScore} | Computer: ${computerScore}`;
}

function playRound(playerChoice, triggeredByKeyboard = false) {

    choices.forEach(choice => {
        if (choice.dataset.choice === playerChoice) {
            choice.classList.add('animate-click');
            setTimeout(() => choice.classList.remove('animate-click'), 400);
        }
    });

    if (soundEnabled) playSound(soundClick);


    const computerChoice = getComputerChoice();


    let oldFlipper = document.querySelector('.flip-container');
    if (oldFlipper) oldFlipper.remove();


    const { container, flipper } = createFlipper(computerChoice);
    result.innerHTML = '';
    result.appendChild(document.createTextNode('Computer chooses '));
    result.appendChild(container);


    setTimeout(() => {
        flipper.classList.add('flipped');


        setTimeout(() => {
            const outcome = getWinner(playerChoice, computerChoice);

            if (outcome === 'win') {
                playerScore++;
                result.innerHTML = `You Win! 🎉 Computer chose ${computerChoice} ${choiceEmoji(computerChoice)}`;
                result.classList.remove('lose');
                result.classList.add('win');
                animateScoreboardCount();
                if (soundEnabled) playSound(soundWin);
                confettiBurst();
            } else if (outcome === 'lose') {
                computerScore++;
                result.innerHTML = `You Lose! 😞 Computer chose ${computerChoice} ${choiceEmoji(computerChoice)}`;
                result.classList.remove('win');
                result.classList.add('lose');
                animateScoreboardCount();
                if (soundEnabled) playSound(soundLose);
            } else {
                result.innerHTML = `It's a Draw! 🤝 Both chose ${playerChoice} ${choiceEmoji(playerChoice)}`;
                result.classList.remove('win', 'lose');
                if (soundEnabled) playSound(soundDraw);
            }
            result.classList.add('show');
        }, 800);
    }, 400);
}


choices.forEach(choice => {
    choice.addEventListener('click', () => playRound(choice.dataset.choice));
});


document.addEventListener('keydown', e => {
    if (e.repeat) return;
    const key = e.key.toLowerCase();
    if (key === 'r') playRound('Rock', true);
    else if (key === 'p') playRound('Paper', true);
    else if (key === 's') playRound('Scissors', true);
});


toggleTheme.addEventListener('change', () => {
    if (toggleTheme.checked) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
});


toggleSound.addEventListener('change', () => {
    soundEnabled = toggleSound.checked;
});
