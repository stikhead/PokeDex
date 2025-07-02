const pokeImage = document.getElementById('poke-icon')
var searchBox = document.querySelector(".searchmenu input");
const searchBtn = document.querySelector(".search button");
var pokeElement = document.querySelector("#list");
let pokeInput = document.querySelector("#input");
let pokemonNames = [];
var checkbtn = 0;
var flag = 0;
let apiurl2;
var pokemonNameFetched;

async function fetchPokemonList() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
    const data = await response.json();
    pokemonNames = data.results.map(pokemon => pokemon.name);
    pokemonNames = pokemonNames.sort();
    
    (pokeInput.addEventListener("click", function (event) {
        flag = 1;
        loadData(pokemonNames, pokeElement);
    }));
    loadData(pokemonNames,pokeElement);
}
function loadData(data, elements) {
    var newchecker = 0;
    if (data && flag===1 && checkbtn===0) {
        elements.innerHTML = "";
        let innerElement = "";
        data.forEach((item) => {
            innerElement += `
            <li>${item}</li>`;
        });
        elements.addEventListener("click", function (event) {
            newchecker = 1;
            pokeInput.value = event.target.textContent;
            elements.innerHTML = ""; 
        });
        if (newchecker === 0) {
            elements.innerHTML = innerElement;
        }
        
    }
    else if (flag === 0 || checkbtn===1) {
        elements.innerHTML = "";
    }
}
function filterData(data) {
    var dragon=data.filter((x) => x.includes(pokeInput.value))
    return dragon;
}

fetchPokemonList();

pokeInput.addEventListener("input", () => {
    checkbtn = 0;
    const filteredData = filterData(pokemonNames);
    loadData(filteredData,pokeElement);
});


async function Pokecheck(apiurl1) {
    const response = await fetch(apiurl1);
    var data = await response.json();

    console.log(data);
    apiurl2 = data.species.url;
    pokeImage.src = data.sprites.other.dream_world.front_default;
    if (pokeImage.src === "https://stikhead.github.io/PokeDex/null") {
        pokeImage.src=data.sprites.front_default
    }
    const ability = data.abilities.map(typeInfo => typeInfo.ability.name).join(', ');
    const poketype= data.types.map(typeInfo => typeInfo.type.name).join(', ');
    const hpstat= data.stats.find(statInfo => statInfo.stat.name === 'hp').base_stat;
    const atackstat = data.stats.find(statInfo => statInfo.stat.name === 'attack').base_stat;
    const defensestat = data.stats.find(statInfo => statInfo.stat.name === 'defense').base_stat;
    const speedstat = data.stats.find(statInfo => statInfo.stat.name === 'speed').base_stat;


    document.querySelector(".poke-type").innerHTML ="Type: "+ poketype;
    document.querySelector(".abilities").innerHTML ="Abilities: "+ ability;
    document.querySelector(".height").innerHTML = "Height: "+(data.height) / 10 + "m";
    document.querySelector(".weight").innerHTML = "Weight: "+(data.weight) / 10 + "Kg";
    document.querySelector(".exp").innerHTML ="Base Experience: "+ data.base_experience;
    
    document.querySelector(".health").innerHTML = "HealthStats: "+hpstat;
    document.querySelector(".attack").innerHTML ="AttackStats: "+ atackstat;
    document.querySelector(".defense").innerHTML = "DefenseStats: "+defensestat;
    document.querySelector(".speed").innerHTML = "SpeedStats: "+speedstat;



    PokeNextUrlCheck(apiurl2);
}
async function PokeNextUrlCheck(apiurl2) {
    const response = await fetch(apiurl2);
    var data = await response.json();

    const text= data.flavor_text_entries.find(statInfo => statInfo.language.name === 'en').flavor_text;
    const formattedText = text.replace("\n", "<br>");
    const newText = formattedText.replace("\f", " ");

    document.querySelector(".changetext").innerHTML = pokemonNameFetched+": "+ newText;
    document.querySelector(".color").innerHTML ="Color: "+ data.color.name;
    document.querySelector(".shape").innerHTML ="Shape: "+ data.shape.name;
    document.querySelector(".legend").innerHTML ="Is_legendary: "+ data.is_legendary;
    document.querySelector(".mythical").innerHTML ="Is_mythical: "+ data.is_mythical;
    document.querySelector(".baby").innerHTML ="Is_baby: "+ data.is_baby;
    
    document.querySelector(".happy").innerHTML ="Base Friendship: "+ data.base_happiness;
    document.querySelector(".growth").innerHTML ="Growth Rate: "+ data.growth_rate.name;
}
searchBtn.addEventListener("click", () => {
    checkbtn = 1;
    loadData(pokemonNames, pokeElement);
    pokemonNameFetched = searchBox.value;
    const apiurl1 = "https://pokeapi.co/api/v2/pokemon/" + pokemonNameFetched;
    Pokecheck(apiurl1);
    
})
