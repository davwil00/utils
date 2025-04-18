function shuffle(anagram) {
    return anagram
        .filter(char => char !== " ")
        .map(value => ({value, sort: Math.random()}))
        .sort((a, b) => a.sort - b.sort)
        .map(({value}) => value);
}

function findWordMatchingPattern() {
    const pattern = document.getElementById("word-matcher-pattern").value;
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

function mapsAreEqual (m1, m2) {
    return m1.size === m2.size && Array.from(m1.keys()).every((key) => m1.get(key) === m2.get(key));
}

function findWordsFromAnagram() {
    const anagram = document.getElementById("word-anagram").value
    const anagramMap = makeWordMap(anagram)
    const matchingWords = dict.filter(word => {
        const wordMap = makeWordMap(word)
        return mapsAreEqual(wordMap, anagramMap) && word !== anagram
    })

    const wordList = document.getElementById("word-list");
    wordList.innerHTML = "";
    if (matchingWords.length === 0) {
        const li = document.createElement("li");
        li.innerText = "No words found";
        wordList.append(li);
    } else {
        matchingWords.forEach(word => {
            const li = document.createElement("li");
            li.innerText = word;
            wordList.append(li);
        });
    }
}

function makeWordMap(word) {
    return word.split('').reduce((acc, curr) => {
        if (curr === ' ') {
            return acc
        }
        if (acc.has(curr)) {
            acc.set(curr, acc.get(curr) + 1);
        } else {
            acc.set(curr, 1);
        }
        return acc;
    }, new Map())
}

function generateJumble() {
    const anagram = document.getElementById("anagram").value.replaceAll(" ", "");
    if (!anagram) {
        return;
    }

    const anagramLetters = anagram.split('')
    const pattern = document.getElementById("anagram-pattern").value.split('')
    let shuffled

    if (pattern) {
        if (pattern.length !== anagramLetters.length) {
            document.getElementById("anagram-pattern").style.color = "red";
            return;
        }
        document.getElementById("anagram-pattern").style.color = "";
        const fixedLetters = pattern.filter(letter => letter !== '.')
        const lettersToBeShuffled = [...anagramLetters]
        fixedLetters.forEach(letter => {
            const index = lettersToBeShuffled.indexOf(letter)
            if (index >= 0) {
                lettersToBeShuffled.splice(index, 1);
            }
        })
        const shuffledRemaining = shuffle(lettersToBeShuffled);
        shuffled = []
        pattern.forEach(char => {
            if (char === '.') {
                shuffled.push(shuffledRemaining.pop());
            } else {
                shuffled.push(char);
            }
        })

    } else {
        shuffled = shuffle(anagramLetters);
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
