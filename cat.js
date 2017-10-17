$(function(){
  /* Model layer */
  var model = {
    init: function(){
      localStorage.cats = JSON.stringify([]);
      localStorage.catNames = JSON.stringify(["Gandalf", "Saruman", "Zazzles", "Obama", "Tank"]);
      localStorage.catImages = JSON.stringify(["cat0.jpg", "cat1.jpg", "cat2.jpg", "cat3.jpg", "cat4.jpg"]);
      localStorage.imgAttributions = JSON.stringify(["https://pxhere.com/en/photo/1005544", "https://pixnio.com/fauna-animals/cats-and-kittens/cute-cat-nature-feline-pet-curious-kitten-head-kitty-fur-whiskers", "https://pixabay.com/en/cat-pets-animal-cute-sweet-2749889/", "https://pixabay.com/en/cat-animal-pet-cats-close-up-300572/", "https://www.pexels.com/photo/silver-tabby-cat-lying-on-brown-wooden-surface-126407/", ])
    },

    /* Adds one cat object to list of cats */
    add: function(obj){
      data = JSON.parse(localStorage.cats);
      data.push(obj);
      localStorage.cats = JSON.stringify(data);
    },

    /* Modifies selected cat object based on current selection in View layer */
    modify: function(id, name, url, clicks){
      data = JSON.parse(localStorage.cats);
      catToModify = data[id];
      catToModify.name = name;
      catToModify.image = url;
      catToModify.counter = clicks;
      localStorage.cats = JSON.stringify(data);
    },

    /* Returns all cats when called by ViewModel */
    getAllCats: function(){
      return JSON.parse(localStorage.cats);
    },

    /* Increases number of clicks for given cat when called by ViewModel */
    increaseCat: function(){
      cat = octopus.selectedCat.id;
      cats = this.getAllCats();
      cats[cat].counter ++;
      localStorage.cats = JSON.stringify(cats);
    }
  };

  /* ViewModel layer */
  var octopus = {
    /* Populates local storage and tells views to render themselves*/
    init: function(){
      model.init();
      this.addAllCats();
      this.selectedCat = JSON.parse(localStorage.cats)[0];
      listView.init();
      displayAreaView.init();
      adminAreaView.init();
    },

    /* Converts lists in local storage into cat objects */
    addAllCats: function(){
      var numberCats = JSON.parse(localStorage.catNames).length;
      for(i=0;i<numberCats;i++){
        model.add({
          id: i,
          name: JSON.parse(localStorage.catNames)[i],
          image: JSON.parse(localStorage.catImages)[i],
          imgAttribution: JSON.parse(localStorage.imgAttributions)[i],
          counter: 0
        });
      }
    },

    /* Fetches all cat objects from local storage */
    getCats: function(){
      return model.getAllCats();
    },

    /* Checks current cat and calls View layer to render that cat's data */
    displaySelectedCat: function(){
      var selectedCat = listView.catList[0].value;
      this.selectedCat = JSON.parse(localStorage.cats)[selectedCat];
      listView.catList[0][selectedCat].innerText = this.selectedCat.name;
      displayAreaView.render();
      adminAreaView.render();
    },

    /* Returns number of clicks for given cat */
    getClicks: function(){
      cats = this.getCats();
      currentCat = this.selectedCat.id;
      return cats[currentCat].counter;

    },

    /* Updates number of clicks in Model and calls View to re-render cat */
    increaseCat: function(){
      model.increaseCat();
      this.displaySelectedCat();
    },

    /* Persists changes from admin panel in the View layer to local storage */
    modifyCat: function(){
      catsId = this.selectedCat.id;
      newName = adminAreaView.newName.val();
      newImage = adminAreaView.newImage.val();
      newClicks = adminAreaView.newClicks.val();

      model.modify(catsId, newName, newImage, newClicks);
      this.displaySelectedCat();
    }


  };

  /* View layer */
  var listView = {
    init: function(){
      this.catList = $('#catList');
      this.catList.change(function(){
        octopus.displaySelectedCat();
      })
      listView.render();
    },

    /* Displays list of available cats */
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
      this.imgAttribution = $('#imgAttribution');
      displayAreaView.render();

      this.catDisplayArea.click(function(){
        octopus.increaseCat()});
    },

    /* Displays cat name, image, source of image and clicks */
    render: function(){
      titleStr = 'Name: ' + octopus.selectedCat.name;
      imgStr = '<img class="img-responsive" height=220 src=' + octopus.selectedCat.image + ' /img>'
      captionStr = '<figcaption class="figure-caption">' + octopus.selectedCat.imgAttribution + '</figcaption>'
      this.catTitle.html( titleStr );
      this.catDisplayArea.html( imgStr + captionStr );
      clicksCount = (octopus.getClicks());
      this.counterElement.html( 'Number of clicks on cat: ' + clicksCount );
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
        octopus.modifyCat();
        adminArea.style.visibility = "hidden";
      });

      this.cancelNew.click(function(){
        adminArea.style.visibility = "hidden";
      });

      this.displayAdmin.click(function(){
        adminArea.style.visibility = "";
      });

      adminAreaView.render();
    },

    /* Displays admin panel for modifying current cat */
    render: function() {
      this.newName.val(octopus.selectedCat.name);
      this.newImage.val(octopus.selectedCat.image);
      this.newClicks.val(octopus.selectedCat.counter);
    }
  }

  octopus.init();
}());
