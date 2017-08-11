$(function(){

  var model = {
    init: function(){
      localStorage.cats = JSON.stringify([]);
      localStorage.catNames = JSON.stringify(["Gandalf", "Saruman", "Zazzles", "Obama", "Tank"]);
      localStorage.catImages = JSON.stringify(["cat0.jpg", "cat1.jpg", "cat2.jpg", "cat3.jpg", "cat4.jpg"]);
    },

    add: function(obj){
      data = JSON.parse(localStorage.cats);
      data.push(obj);
      localStorage.cats = JSON.stringify(data);
    },

    getAllCats: function(){
      return JSON.parse(localStorage.cats);
    },

    increaseCat: function(){
      cat = octopus.selectedCat.id;
      cats = this.getAllCats();
      cats[cat].counter ++;
      localStorage.cats = JSON.stringify(cats);
    }
  };

  var octopus = {
    init: function(){
      model.init();
      this.addAllCats();
      console.log(localStorage.cats)
      this.selectedCat = JSON.parse(localStorage.cats)[0];
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
      console.log('Cat selected in list ' + selectedCat)
      this.selectedCat = JSON.parse(localStorage.cats)[selectedCat];
      console.log('Cat in octopus' + this.selectedCat.name)
      displayAreaView.render();
    },

    getClicks: function(){
      cats = this.getCats();
      currentCat = this.selectedCat.id;
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
      this.catTitle = $('#catTitle');
      displayAreaView.render();

      this.catDisplayArea.click(function(){
        octopus.increaseCat()});
    },

    render: function(){
      titleStr = octopus.selectedCat.name;
      htmlStr = '<img src=' + octopus.selectedCat.image + ' /img>'
      this.catTitle.html(titleStr);
      this.catDisplayArea.html( htmlStr );
      clicksCount = (octopus.getClicks());
      this.counterElement.html( 'The number of Fabians clicked: ' + clicksCount );
    }
  };

  octopus.init();
}());
