"use strict";

const endpoint =
  "https://crudlotr-default-rtdb.europe-west1.firebasedatabase.app/";

// run initApp on load //
window.addEventListener("load", initApp);

let charactersData;

// show characters on main //
function initApp() {
  charactersData = fetch(`${endpoint}characters.json`)
    .then((response) => response.json())
    .then((data) => data.map((character) => capitalizeFirstLetter(character)));

  charactersData.then((characters) => {
    const charactersContainer = document.querySelector("#characters");
    characters.forEach((character) => {
      const characterElement = document.createElement("article");
      characterElement.innerHTML = `
        <figure>
          <img src="${character.image ? character.image : ""}" alt="${
        character.name
      }">
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
        <button class="dialog-button" data-name="${
          character.name
        }">More Info</button>
      `;
      charactersContainer.appendChild(characterElement);
    });
  });

  document
    .querySelector("#characters")
    .addEventListener("click", characterClicked);
}

function capitalizeFirstLetter(obj) {
  const capitalizedObj = {};
  for (let key in obj) {
    const value = obj[key];
    if (typeof value === "string" && value !== "true" && value !== "false") {
      capitalizedObj[key] = value.charAt(0).toUpperCase() + value.slice(1);
    } else {
      capitalizedObj[key] = value;
    }
  }
  return capitalizedObj;
}

function characterClicked(event) {
  const characterName = event.target.dataset.name;
  if (characterName) {
    showCharacterModal(characterName);
  }
}

function showCharacterModal(characterName) {
  charactersData.then((characters) => {
    const character = characters.find((c) => c.name === characterName);
    //image, name and birthPlace //
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
    document.querySelector("#dialog-actor-name").textContent = character.actor;

    let descriptionFellowship = generateFellowship(character);
    document.querySelector(
      "#dialog-character-description-fellowship"
    ).textContent = descriptionFellowship;

    let descriptionAlive = generateAlive(character);
    document.querySelector("#dialog-character-description-alive").textContent =
      descriptionAlive;

    // show dialog //
    document.querySelector("#dialog-character").showModal();
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
