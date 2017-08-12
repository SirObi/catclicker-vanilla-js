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

    modify: function(id, name, url, clicks){
      console.log('Passed into function ' + name + url + clicks);
      data = JSON.parse(localStorage.cats);
      catToModify = data[id];
      console.log('cat to modify')
      console.log(catToModify);
      catToModify.name = name;
      console.log('data')
      console.log(data);
      catToModify.image = url;
      catToModify.counter = clicks;
      console.log('cat to modify')
      console.log(catToModify);
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
      adminAreaView.init();
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
      this.selectedCat = JSON.parse(localStorage.cats)[selectedCat];
      console.log(this.selectedCat.name);
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
    },

    modifyCat: function(){
      catsId = this.selectedCat.id;
      newName = adminAreaView.newName.val();
      newImage = adminAreaView.newImage.val();
      newClicks = adminAreaView.newClicks.val();

      model.modify(catsId, newName, newImage, newClicks);
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

  var adminAreaView = {
    init: function() {
      this.adminArea = $('#adminArea');
      this.newName = $('#newName');
      this.newImage = $('#newImage');
      this.newClicks = $('#newClicks');
      this.submitNew = $('#submitNew');
      this.cancelNew = $('#cancelNew');
      this.displayAdmin = $('#displayAdmin');

      this.submitNew.click(function(){
        console.log('obi');
        octopus.modifyCat();
      });

      this.cancelNew.click(function(){
        adminArea.style.visibility = "hidden";
      });

      this.displayAdmin.click(function(){
        adminArea.style.visibility = "";
      });

      adminAreaView.render();
    },

    render: function() {
      this.newName.val(octopus.selectedCat.name);
      this.newImage.val(octopus.selectedCat.image);
      this.newClicks.val(octopus.selectedCat.counter);
    }
  }

  octopus.init();
}());
