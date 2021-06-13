import './styles/guides.scss';
import $ from "jquery";
import Draggabilly from 'draggabilly';

const GUIDE_TYPES = {
  GUIDE_HORIZONTAL: 'vollguides__line--h',
  GUIDE_VERTICAL: 'vollguides__line--v'
}

class Model {
  constructor() {
    // il modello di base mette a disposizione 2 guide.
    this.guides = [
      { id: 1, type: "vollguides__line--h", left: 111, top: 111 },
      { id: 2, type: "vollguides__line--v", left: 222, top: 222 },
      { id: 3, type: "vollguides__line--v", left: 333, top: 333 }
    ]
  }

  // Add new guide to model
  addGuide(guide) {
    const localId = this.guides.length > 0 ? this.guides[this.guides.length - 1].id + 1 : 1;
    const localGuide = {
      id: localId,
      ...guide,
    }
    this.guides.push(localGuide);
  }

  deleteGuide(id) {
    this.guides = this.guides.filter( (guide) => {
      return id !== guide.id
    })
  }

  // 
  updateGuide(guide) {
    // const guides = this.guides;
    this.guides.map((elem, index) => {
      if (elem.id === guide.id) {
        this.guides[index+1].left = guide.left
        this.guides[index+1].top = guide.top
      }
    });
    debugger;
  }
}

class View {
  constructor() {}
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
}

const guides = new Controller(new Model(), new View());

// guides.model.addGuide({ type:'vollguides__line--h', left: 444, top: 444 })
// guides.model.deleteGuide(2);
// guides.model.updateGuide({id: 3, type:'vollguides__line--h', left: 1111, top: 1111})
// console.log(guides.model.guides);

/*
(function() {
  "use strict";

  var model = {
    currentGuide: null,

    // todo: contiene la lista di guide create :: potrei usarla per salvarla nel localstorage o svuotarla inserendo un bottone destroy-all
    guides: [
      {
        type: 'vollguides__line--h',
        top: 100,
        left: 15
      },
      {
        type: 'vollguides__line--v',
        top: 15,
        left: 100
      }
    ]
  };

  var octopus = {
    init: function () {
      // Delego la view per renderizzare gli elementi del template
      structureView.init();
      guidesWiew.init();
    },

    // Mi ritorna tutto l'array di guide
    getGuides: function () {
      return model.guides;
    },

    // Aggiungo una nuova guida all'array
    addNewGuide: function (g) {
      model.guides.push(g);

      // renderizzo le view
      guidesWiew.render();
    },

    // Aggiorno il modello con la guida modificata
    updateGuide: function (index, obj) {
      this.getGuides().splice(index, 1, obj);

      // renderizzo le view
      guidesWiew.render();
    },

    // Aggiorno il modello con la guida eliminata
    removeGuide: function (index, obj) {
      this.getGuides().splice(index, 1, obj);

      // renderizzo le view
      guidesWiew.render();
    }

  };

  var structureView = {

    init: function () {
      this.bodyElem   = document.querySelector('body');
      this.template = `
        <div class="vollguides">
          <div class="vollguides__overlay"></div>
          <div class="vollguides__tooltip"></div>
          <div class="vollguides__rule vollguides__rule--h">
            <div class="vollguides__rule-pointer"></div>
          </div>
          <div class="vollguides__rule vollguides__rule--v">
            <div class="vollguides__rule-pointer"></div>
          </div>
          <div class="vollguides__collection"></div>
        </div>;
      `;                
      this.render();
    },

    render: function () {
      this.bodyElem.insertAdjacentHTML('beforeend', this.template);
      this.guideWrap  = document.querySelector('.vollguides'); // wrap generale

      var v_rule = document.querySelector('.vollguides__rule--v .vollguides__rule-pointer');
      var h_rule = document.querySelector('.vollguides__rule--h .vollguides__rule-pointer');
      var tooltip = document.querySelector('.vollguides__tooltip');

      // puntatori righelli
      function mousemover(e) {
        h_rule.style.left = (e.clientX)-15 + 'px';
        v_rule.style.top = (e.clientY)-15 + 'px';
        tooltip.innerHTML = e.clientX + 'px // ' + e.clientY + 'px';
        tooltip.style.top = (e.clientY)+7 + 'px';
        tooltip.style.left = (e.clientX)+7 + 'px';
      };

      document.addEventListener('mousemove', mousemover, false);

      // Destroy all
      window.addEventListener('keydown', (function(e) {
        if (e.which == 27) {
          structureView.guideWrap.remove();
        }
      }));
    }
  };


  var guidesWiew = {

    init: function () {
      this.guideCollection  = document.querySelector('.vollguides__collection'); // Contenitore delle guide
      this.rules = document.querySelectorAll('.vollguides__rule'); // righelli

      // Al click su un righello -> devo invocare il metodo addNewGuide che aggiorna l'array con la nuova guida.
      // Dopo ritorno nella view e renderizzo nuovamente tutte le guide
      for (var j = 0; j < this.rules.length; j++) {
        this.rules[j].addEventListener('dblclick', (function(e, index) {
          return function() {

            // Agiungo la classe specifica e posizioni random per top e left e salvo localemente le info realtive alla guida che sto per creare
            var newGuideObj = {
              type: (e.classList.contains('vollguides__rule--h') ? "vollguides__line--h" : "vollguides__line--v"),
              top: (e.classList.contains('vollguides__rule--h') ? (25 + Math.floor(Math.random() * (200 - 15)) + 15) : 15),
              left: (e.classList.contains('vollguides__rule--h') ? 15 : Math.floor((Math.random() * (200 - 15)) + 15))
            };

            // aggiorno l'array portandomi dietro newGuideObj
            octopus.addNewGuide(newGuideObj);
          }
        })(this.rules[j], j));
        
      }

      // Renderizzo le guide
      this.render();
    },

    render: function () {
      var draggies = [];
      var typeClass, dragAxis;

      // empty the guide list 
      this.guideCollection.innerHTML = '';

      // Salvo le guide in una variabile locale
      var guides = octopus.getGuides();

      // Renderizzo le guide in base all'array (al primo giro non ce ne sono 2 di esempio)
      for (var i = 0; i < guides.length; i++) {
        (function(index){
          guidesWiew.guideCollection.insertAdjacentHTML('beforeend', '<div class="vollguides__line"><div class="vollguides__line-inner"></div></div>');
          var last = $( ".vollguides__collection" ).find('> div').last();
          last.addClass(guides[i].type).css({top: guides[i].top, left: guides[i].left});

          // Utilizzo draggabilly per draggare le singole guide
          var draggableElems = document.querySelectorAll('.vollguides__line');
          var draggableElem = draggableElems[index];
          if(draggableElem.classList.contains('vollguides__line--h')) {
            //typeClass = 'vollguides__line--h';
            dragAxis = 'y';
          } else {
            //typeClass = 'vollguides__line--v';
            dragAxis = 'x';
          }
          var draggie = new Draggabilly( draggableElem, {
            axis: dragAxis
          });
          draggies.push(draggie);
          draggie.on('dragEnd', function(event, pointer) {
              var loc_index = index;
              var obj = {
                type: draggableElem.classList[1],
                top: this.position.y,
                left: this.position.x
              };

              // aggiorno l'array portandomi dietro newGuideObj e la index corrente
              octopus.updateGuide(loc_index, obj);
          
          });
        })(i);
      };
    }
  };

  // make it go!
  octopus.init();

})();
*/
