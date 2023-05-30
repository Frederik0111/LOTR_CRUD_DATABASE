"use strict";

const endpoint =
  "https://crudlotr-default-rtdb.europe-west1.firebasedatabase.app/";

window.addEventListener("load", fetchCharacterData);

// window.addEventListener("load", getCharacters);

// async function getCharacters() {
//   try {
//     const res = await fetch(`${endpoint}/characters.json`);
//     const data = await res.json();
//     const characters = prepareCharacterData(data);
//     console.log(characters);
//     showCharacters(characters);
//   } catch (error) {
//     console.error(error);
//   }
// }

// function prepareCharacterData(dataObject) {
//   const postArray = [];
//   for (const key in dataObject) {
//     const post = dataObject[key];
//     console.log(post);
//     postArray.push(post);
//   }
//   console.log(postArray);
//   return postArray;
// }

async function fetchCharacterData() {
  try {
    const response = await fetch(`${endpoint}/characters.json`);
    const data = await response.json();
    return data.map((character) => capitalizeFirstLetter(character));
  } catch (error) {
    console.error(error);
    return [];
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

document.addEventListener("load", initApp);


async function initApp() {
  try {
    const charactersData = await fetchCharacterData();
    showCharacters(charactersData);

    document
      .querySelector("#characters")
      .addEventListener("click", characterClicked);
  } catch (error) {
    console.error(error);
  }
}

function showCharacters(characters) {
  const charactersContainer = document.querySelector("#characters");
  characters.forEach((character) => {
    const characterElement = document.createElement("article");
    characterElement.innerHTML = `
        <figure>
          <img src="${character.image}" alt="${character.name}">
          <figcaption>${character.name}</figcaption>
        </figure>
        <ul>
          <li><strong>Gender:</strong> ${character.gender}</li>
          <li><strong>Age:</strong> ${character.age}</li>
          <li><strong>Eye colour:</strong> ${character.eyeColour}</li>
          <li><strong>Hair colour:</strong> ${character.hairColour}</li>
          <li><strong>Birthplace:</strong> ${character.birthPlace}</li>
          <li><strong>Species:</strong> ${character.species}</li>
        </ul>
        <button class="dialog-button" data-name="${character.name}">More Info</button>
    `;
    charactersContainer.appendChild(characterElement);
  });
}


function characterClicked(event) {
  const characterName = event.target.dataset.name;
  showCharacterModal(characterName);
}

function characterClicked(event) {
  const characterName = event.target.dataset.name;
  fetchCharacterData()
    .then((characters) => {
      const character = characters.find((c) => c.name === characterName);
      // image, name and birthPlace //
      document.querySelector("#dialog-image").src = character.image;
      document.querySelector("#dialog-name").textContent = character.name;
      document.querySelector("#dialog-birth-place").textContent =
        character.birthPlace;
      // description //
      document.querySelector("#dialog-gender").textContent = character.gender;
      document.querySelector("#dialog-age").textContent = character.age;
      document.querySelector("#dialog-eye-colour").textContent =
        character.eyeColour;
      document.querySelector("#dialog-hair-colour").textContent =
        character.hairColour;
      document.querySelector("#dialog-species").textContent = character.species;

      document.querySelector("#dialog-name").textContent = character.name;
      document.querySelector("#dialog-actor-name").textContent =
        character.actor;

      let descriptionFellowship = generateFellowship(character);
      document.querySelector(
        "#dialog-character-description-fellowship"
      ).textContent = descriptionFellowship;

      let descriptionAlive = generateAlive(character);
      document.querySelector(
        "#dialog-character-description-alive"
      ).textContent = descriptionAlive;

      // show dialog //
      document.querySelector("#dialog-character").showModal();
    })
    .catch((error) => {
      console.error("Error fetching character data", error);
    });
}

// generate fellowship status //
function generateFellowship(character) {
  if (character.fellowship === "true") {
    return `${character.name} is part of the Fellowship of the Ring.`;
  } else {
    return `${character.name} is not part of the Fellowship of the Ring.`;
  }
}

// generate alive status //
function generateAlive(character) {
  if (character.alive === "true") {
    return `${character.name} is alive at the end.`;
  } else {
    return `${character.name} is not alive at the end.`;
  }
}
