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

    // Aggiorno la guida modificata
    updateGuide: function (index, obj) {
      var pippo = this.getGuides()[index];
    }

  };

  var structureView = {

    init: function () {

      this.bodyElem   = document.querySelector('body');
      this.template = '<div class="vollguides">' +
                        '<div class="vollguides__overlay"></div>' +
                        '<div class="vollguides__tooltip"></div>' +
                        '<div class="vollguides__rule vollguides__rule--h">' +
                          '<div class="vollguides__rule-pointer"></div>' +
                        '</div>' +
                        '<div class="vollguides__rule vollguides__rule--v">' +
                          '<div class="vollguides__rule-pointer"></div>' +
                        '</div>' +
                        '<div class="vollguides__collection"></div>' +
                      '</div>';

      this.render();

    },

    render: function () {

      this.bodyElem.insertAdjacentHTML('beforeend', this.template);

    }

  };


  var guidesWiew = {

    init: function () {

      this.guideWrap  = document.querySelector('.vollguides'); // wrap generale
      this.guideCollection  = document.querySelector('.vollguides__collection'); // Contenitore delle guide
      this.rules = document.querySelectorAll('.vollguides__rule'); // righelli

      // Al click su un righello -> devo invocare il metodo addNewGuide che aggiorna l'array con la nuova guida.
      // Dopo ritorno nella view e renderizzo nuovamente tutte le guide
      for (var j = 0; j < this.rules.length; j++) {
        this.rules[j].addEventListener('click', (function(e) {
          return function() {
            // agiungo la classe specifica e posizioni random per top e left
            var typeClass = (e.classList.contains('vollguides__rule--h') ? "vollguides__line--h" : "vollguides__line--v");
            var topPos = (e.classList.contains('vollguides__rule--h') ? (25 + Math.floor(Math.random() * (200 - 15)) + 15) : 15);
            var leftPos = (e.classList.contains('vollguides__rule--h') ? 15 : Math.floor((Math.random() * (200 - 15)) + 15));

            // Salvo localemente le info realtive alla guida che sto per creare
            var newGuideObj = {
              type: typeClass,
              top: topPos,
              left: leftPos
            };

            // aggiorno l'array portandomi dietro newGuideObj
            octopus.addNewGuide(newGuideObj);
          }
        })(this.rules[j]));
        
      }

      // Renderizzo le guide
      this.render();

    },

    render: function () {

      // empty the guide list 
      this.guideCollection.innerHTML = '';

      // Salvo le guide in una variabile locale
      var guides = octopus.getGuides();

      // Renderizzo le guide in base all'array (al primo giro non ce ne sono 2 di esempio)
      for (var i = 0; i < guides.length; i++) {
        this.guideCollection.insertAdjacentHTML('beforeend', '<div class="vollguides__line"><div class="vollguides__line-inner"></div></div>');
        var last = $( ".vollguides__collection" ).find('> div').last();
        last.addClass(guides[i].type).css({top: guides[i].top, left: guides[i].left});
      };

      var draggableElems = document.querySelectorAll('.vollguides__line');
      var draggies = [];
      var typeClass;
      var dragAxis;
      for ( var l=0, len = draggableElems.length; l < len; l++ ) {
        var draggableElem = draggableElems[l];
        if(draggableElem.classList.contains('vollguides__line--h')) {
          typeClass = 'vollguides__line--h';
          dragAxis = 'y';
        } else {
          typeClass = 'vollguides__line--v';
          dragAxis = 'x';
        }
        var draggie = new Draggabilly( draggableElem, {
          axis: dragAxis
        });
        draggies.push(draggie);
        draggie.on( 'dragEnd', (function(g, event, pointer ) {
          return function() {
            var newGuideObj = {
              //type: typeClass,
              //top: pointer.screenY,
              //left: pointer.screenX
            };

            // aggiorno l'array portandomi dietro newGuideObj e la index corrente
            octopus.updateGuide(g , newGuideObj);
          }
        })(draggableElems[l]));
      }

    }


  };

  // make it go!
  octopus.init();


})();
