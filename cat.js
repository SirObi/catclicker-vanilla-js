$(function(){

  var model = {
    init: function(){
      localStorage.cats = JSON.stringify([]);
      localStorage.catNames = JSON.stringify(["Gandalf", "Saruman", "Zazzles", "Obama", "Tank"]);
      localStorage.catImages = JSON.stringify(["cat.jpg", "cat2.jpg", "cat3.jpg", "cat4.jpg", "cat5.jpg"]);
      localStorage.selectedCat = 0;
    },

    add: function(obj){
      data = JSON.parse(localStorage.cats);
      data.push(obj);
      localStorage.cats = JSON.stringify(data);
    },

    getAllCats: function(){
      return JSON.parse(localStorage.cats);
    },

    switchCurrentCat: function(cat){
      localStorage.selectedCat = cat;
    },

    increaseCat: function(){
      cat = localStorage.selectedCat;
      cats = this.getAllCats();
      cats[cat].counter ++;
      localStorage.cats = JSON.stringify(cats);
    }
  };

  var octopus = {
    init: function(){
      model.init();
      this.addAllCats();
      this.selectedCat = parseInt(localStorage.selectedCat) + 1;
      listView.init();
      displayAreaView.init();
    },

    addAllCats: function(){
      var numberCats = JSON.parse(localStorage.catNames).length;
      for(i=0;i<numberCats;i++){
        model.add({
          id: i,
          name: JSON.parse(localStorage.catNames)[i],
          image: JSON.parse(localStorage.catImages)[i],
          counter: 0
        });
      }
    },

    getCats: function(){
      return model.getAllCats();
    },

    displaySelectedCat: function(){
      var selectedCat = listView.catList[0].value;
      model.switchCurrentCat(selectedCat);
      this.selectedCat = parseInt(localStorage.selectedCat);
      displayAreaView.render();
    },

    getClicks: function(){
      cats = this.getCats();
      currentCat = this.selectedCat;
      return cats[currentCat].counter;

    },

    increaseCat: function(){
      model.increaseCat();
      this.displaySelectedCat();
    }


  };

  var listView = {
    init: function(){
      this.catList = $('#catList');
      this.catList.change(function(){
        octopus.displaySelectedCat();
      })
      listView.render();
    },

    render: function(){
      var htmlStr='';
      octopus.getCats().forEach(function(cat, i){
        htmlStr += '<option ' + 'value=' + i + '>' + cat.name + '</option>';
      });
      this.catList.html( '' );
      this.catList.html( htmlStr );
    }
  };

  var displayAreaView = {
    init: function(){
      this.catDisplayArea = $('#catDisplayArea');
      this.counterElement = $('#counterElement');
      displayAreaView.render();

      this.catDisplayArea.click(function(){
        octopus.increaseCat()});
    },

    render: function(){
      titleStr =
      htmlStr = '<img src=cat' + octopus.selectedCat + '.jpg /img>'
      this.catDisplayArea.html( htmlStr );
      clicksCount = (octopus.getClicks());
      this.counterElement.html( clicksCount );
    }
  };

  octopus.init();
}());
