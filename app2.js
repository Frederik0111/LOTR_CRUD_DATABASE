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
        <button class="update-button" data-name="${
          character.name
        }">Update</button>
        <button class="delete-button" data-name="${
          character.name
        }">Delete</button>
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

document.querySelector("#btn-create").addEventListener("click", createCharacterDialog);

function createCharacterDialog() {
  document.querySelector("#create-dialog").showModal();

  document
    .querySelector("#create-character-btn")
    .addEventListener("submit", createCharacter);
}

// create a new character
async function createCharacter(name, gender, birthPlace, age, species, eyeColour, hairColour, actor, fellowship, alive, image){
  const character = {
    name: `${name}`,
    gender: `${gender}`,
    birthPlace: `${birthPlace}`,
    age: `${age}`,
    species: `${species}`,
    eyeColour: `${eyeColour}`,
    hairColour: `${hairColour}`,
    actor: `${actor}`,
    fellowship: `${fellowship}`,
    alive: `${alive}`,
    image: `${image}`,
  };
  // make javaScript object to Json object
  const dataAsJson = JSON.stringify(character);
  // fetch reguest to POST item
  const response = await fetch(`${endpoint}/characters.json`, {
    method: "POST",
    body: dataAsJson,
  });
  if (response.ok) {
    // response with new object id/athlete
    const data = await response.json();
    // make get request to input specific element into DOM from response id
    insertNewItem(data.name, "character");
    //show response message to user
    response_message("Character created!");
  } else if (!response.ok) {
    // show error message and reload page
    response_message("Error!");
  }
}

// function saveCharacterData(event) {
//   event.preventDefault();
//   const type = event.target.id;
//   // get character input values
//   const name = event.target.name.value;
//   const gender = event.target.gender.value;
//   const birthPlace = event.target.birthPlace.value;
//   const age = event.target.age.value;
//   const species = event.target.species.value;
//   const eyeColour = event.target.eyeColour.value;
//   const hairColour = event.target.hairColour.value;
//   const actor = event.target.actor.value;
//   const fellowship = event.target.fellowship.value;
//   const alive = event.target.alive.value;
//   const image = event.target.image.value;
  
//   //check for html request and url
//   if (type === "update-form") {
//     const id = event.target.dataset.id;
//     //delete locally
//     document.querySelector(`#${id}`).remove();
//     // close dialog
//     document.querySelector("#update-dialog").close();
//     // reset form
//     document.querySelector("#update-form").reset();
//     updateMemberToDB(
//       name,
//       gender,
//       birthPlace,
//       age,
//       species,
//       eyeColour,
//       hairColour,
//       actor,
//       fellowship,
//       alive,
//       image,
//       id
//     );
//   } else if (type === "create-form") {
//     // close dialog
//     document.querySelector("#create-dialog").close();
//     // reset form
//     document.querySelector("#create-form").reset();
//     createMemberToDB(
//       name,
//       gender,
//       birthPlace,
//       age,
//       species,
//       eyeColour,
//       hairColour,
//       actor,
//       fellowship,
//       alive,
//       image
//     );
//   }
// }