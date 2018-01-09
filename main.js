var gamesData = [
  {
    name: "I Puzzle Good",
    url: "IPuzzleGood",
  },
  {
    name: "Laserbeams",
    url: "laserbeams",
  },
]

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
    var element = '<li><a href="'+urlPrefix+url+'">'+name+'</a></li>';
    gamesList.innerHTML += element;
  }
}