const config = {
    instructions: "How to Schedule a Post",
    question: "Drag and drop the following \"how to schedule a post\" steps in the right order.",
    options: [
        "Click dropdown \"publish on\"",
        "Log in",
        "Click on \"set date and time\"",
        "Add a title",
        "Set date and time",
        "Click publish and confirm",
        "Add text and images to post",
        "Click new post"
    ],
    answers: [
        "Log in",
        "Click new post",
        "Add a title",
        "Add text and images to post",
        "Click dropdown \"publish on\"",
        "Click on \"set date and time\"",
        "Set date and time",
        "Click publish and confirm"
    ],
    correct_text: "Well Done! That's correct!",
    headerImg_on: false,
    headerImg: "https://a.storyblok.com/f/112136/130x160/731788149f/avatar_matt-owen.png",
    reveal_text_on: true,
    reveal_text: "Well Done! Click the \"Next video\" button to proceed.",
    reveal_img_on: false,
    reveal_img: "https://a.storyblok.com/f/112136/509x186/ba5c52e287/pbemo.gif"
}

const instructionContainer = document.getElementById('instructionContainer')
const image = document.getElementById('image')

if (config.headerImg_on === true) {
    image.src = config.headerImg
    instructionContainer.style.paddingTop = '0.5rem'
    instructionContainer.style.paddingBottom = '0'
} else {
    image.style.display = "none";
}

const instructions = document.getElementById('instructions')
const question = document.getElementById('question')

instructions.textContent = config.instructions
question.textContent = config.question

const container = document.getElementById('container')

let i = 0;
config.options.forEach(element => {
    const newSortable = document.createElement("p");
    newSortable.className = 'draggable';
    newSortable.draggable = 'true';
    newSortable.textContent = config.options[i];
    container.appendChild(newSortable);
    i++;
});

const containers = document.querySelectorAll('.container')
const draggables = document.querySelectorAll('.draggable')
const checkAnswer = document.getElementById('checkAnswer')

draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging')
    })

    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging')
    })
})

containers.forEach(container => {
    container.addEventListener('dragover', e => {
        e.preventDefault()
        const afterElement = getDragAfterElement(container, e.clientY)
        const draggable = document.querySelector('.dragging')
        if (afterElement == null) {
            container.appendChild(draggable)
        } else {
            container.insertBefore(draggable, afterElement)
        }
    })
})

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset) {
            return {
                offset: offset,
                element: child
            }
        } else {
            return closest
        }
    }, {
        offset: Number.NEGATIVE_INFINITY
    }).element
}

const reveal = document.getElementById('reveal')
const revealText = document.getElementById('revealText')
const revealImg = document.getElementById('revealImg')


checkAnswer.textContent = 'Check Answer'
revealText.textContent = config.reveal_text
revealImg.src = config.reveal_img

const checkAnswers = () => {

    const containerChildren = Array.from(container.children)
    const answerOrder = JSON.stringify(config.answers)
    const arrangedOrder = []

    containerChildren.forEach(element => {
        arrangedOrder.push(element.textContent)
    });

    const checkArrangedOrder = JSON.stringify(arrangedOrder)

    if (answerOrder === checkArrangedOrder) {
        checkAnswer.textContent = "Well Done! That's correct!"
        checkAnswer.classList.add('correct')
        if (config.reveal_text_on) {
            reveal.style.display = 'flex'
            revealText.style.display = 'flex'
            revealText.style.opacity = '1'
            instructionContainer.style.display = 'none'
            container.style.display = 'none'
        }

        if (config.reveal_img_on) {
            reveal.style.display = 'flex'
            revealImg.style.display = 'flex'
            revealImg.style.opacity = '1'
            instructionContainer.style.display = 'none'
            container.style.display = 'none'
        }

    } else {
        checkAnswer.textContent = "❌Sorry, not yet"
        checkAnswer.classList.remove('correct')
        setTimeout(() => {
            checkAnswer.textContent = "Check Again"
        }, 1000);
    }
}

checkAnswer.addEventListener('click', checkAnswers)