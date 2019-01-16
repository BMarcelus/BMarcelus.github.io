var gamesData = [
  {
    name: "I Puzzle Good",
    url: "IPuzzleGood",
    description: 'A puzzle platformer where you try to puzzle good'
  },
  {
    name: "Laserbeams",
    url: "laserbeams",
    description: "An action packed thriller about dodging lasers and looking cool"
  },
  {
    name: "Swivel",
    url: "swivel",
    description: "A simple game about controlling a robotic arm"
  },
  {
    name: "<3K Runner",
    url: "3kRunner",
    description: "An Infinite runner made in less than 3kb"
  },
  {
    name: "Jimothy Piggerton",
    url: "JimothyPiggerton",
    description: "Save Piggerton from the Butcher!"
  },
]

function linkify(element, url) {
  return '<a href='+url+'>'+element+'</a>';
}

window.onload = function() {
  var $1 = document.querySelector.bind(document);
  var gamesList = $1('#games-list');
  var urlPrefix = "./";
  if(window.location.origin == "file://") {
    urlPrefix = "https://bmarcelus.github.io/";
  }
  for(var i in gamesData) {
    var gameData = gamesData[i];
    var url = gameData.url || "";
    var name = gameData.name || "";
    var description = gameData.description || "";
    var linkElement = '<a class="game-title" href="'+urlPrefix+url+'">'+name+'</a>';
    var description = '<p class="game-description">'+description+'</p>'
    var img = '<img class="game-img" src="./images/'+url+'.png" />';
    img = linkify(img, urlPrefix+url);
    var element = '<div class="game-container">'+img+linkElement+description+'</div>';
    gamesList.innerHTML += element;
  }
}