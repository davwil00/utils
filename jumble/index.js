function shuffle(anagram) {
    return anagram
        .filter(char => char !== " ")
        .map(value => ({value, sort: Math.random()}))
        .sort((a, b) => a.sort - b.sort)
        .map(({value}) => value);
}

function findWordMatchingPattern() {
    const pattern = document.getElementById("word-finder-pattern").value;
    const regex = RegExp(`^${pattern}$`);
    const wordList = document.getElementById("word-list");
    wordList.innerHTML = "";
    const matchedWords = dict.filter(word => regex.test(word))
    if (matchedWords.length === 0) {
        const li = document.createElement("li");
        li.innerText = "No words found";
        wordList.append(li);
    } else {
        matchedWords.forEach(word => {
            const li = document.createElement("li");
            li.innerText = word;
            wordList.append(li);
        });
    }
}

function generateJumble() {
    const anagram = document.getElementById("anagram").value.replaceAll(" ", "");
    if (!anagram) {
        return;
    }

    const shuffled = Array(anagram.length)
    const lettersToBeShuffled = anagram.split('')
    const pattern = document.getElementById("anagram-pattern").value;

    if (pattern) {
        for (let i = 0; i < anagram.length; i++) {
            if (pattern[i] !== '.') {
                shuffled[i] = pattern[i];
                lettersToBeShuffled[i] = undefined;
            }
        }
    }

    const shuffledRemaining = shuffle(lettersToBeShuffled.filter(it => it !== undefined));
    for (let i = 0; i < shuffled.length; i++) {
        if (shuffled[i] === undefined) {
            shuffled[i] = shuffledRemaining.pop()
        }
    }

    const containerElt = document.getElementById("container");
    containerElt.innerHTML = "";
    const format = document.getElementById("format").value.split("").map(it => parseInt(it));
    if (format.length > 0 && format.reduce((acc, curr) => acc + curr, 0) === shuffled.length) {
        format.forEach((length, idx) => {
            const div = createLetterContainer()
            for (let i = 0; i < length; i++) {
                const letter = shuffled[(length * idx) + i]
                appendLetter(div, letter);
            }
            containerElt.append(div);
        });
    } else {
        const div = createLetterContainer()
        shuffled.forEach(letter => appendLetter(div, letter));
        containerElt.append(div);
    }
}

function createLetterContainer() {
    const div = document.createElement("div");
    div.classList.add("letter-container");
    return div
}

function appendLetter(div, letter) {
    const span = document.createElement("span");
    span.innerText = letter;
    div.append(span);
}

function check() {
    const anagram = new Set(document.getElementById("anagram").value.toLowerCase().split(""));
    const removeElt = document.getElementById("remove");
    const lettersToCheck = new Set(removeElt.value.toLowerCase().split(""));
    if (anagram.size === lettersToCheck.size && [...anagram].every((x) => lettersToCheck.has(x))) {
        removeElt.style.color = "green";
    } else {
        removeElt.style.color = "red";
    }
}

function removeLetters() {
    const anagramElt = document.getElementById("anagram");
    const anagram = anagramElt.value.toLowerCase().split("");
    const removeElt = document.getElementById("remove");
    const lettersToRemove = removeElt.value.toLowerCase().split("");
    for (const letter of lettersToRemove) {
        const index = anagram.indexOf(letter);
        if (index >= 0) {
            anagram.splice(index, 1);
        } else {
            removeElt.style.color = "red";
            return;
        }
    }

    removeElt.style.color = "black";
    anagramElt.value = anagram.join("");
    generateJumble();
}

function clearInput(eltId) {
    if (eltId) {
        const elt = document.getElementById(eltId);
        elt.value = "";
        elt.focus()
    } else {
        Array.from(document.getElementsByTagName('input')).forEach(input => input.value = "");
    }
    document.getElementById("word-list").innerHTML = "";
    document.getElementById("container").innerHTML = "";
}