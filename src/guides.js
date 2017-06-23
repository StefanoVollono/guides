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
      //this.guide = '<div class="vollguides__line"><div class="vollguides__line-inner"></div></div>'; // Template della guida

      // Al click su un righello -> devo invocare il metodo addNewGuide che aggiorna l'array con la nuova guida.
      // Dopo ritorno nella view e renderizzo nuovamente tutte le guide
      for (var j = 0; j < this.rules.length; j++) {
        this.rules[j].addEventListener('click', (function(e) {
          return function() {
            // agiungo la classe specifica e posizioni random per top e left
            var typeClass = (e.classList.contains('vollguides__rule--h') ? "vollguides__line--h" : "vollguides__line--v");
            var topPos = (e.classList.contains('vollguides__rule--h') ? (25 + Math.floor(Math.random() * (100 - 15)) + 15) : 15);
            var leftPos = (e.classList.contains('vollguides__rule--h') ? 15 : Math.floor((Math.random() * (100 - 15)) + 15));

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

        /* invece del click devo implementare il drag
        // quando finisco di draggare, devo aggiornare l'array con le nuove coordinate (invoco un metodo di octopus)
        var guide = $( ".vollguides__line" )[i]; // salvo localmente la guida corrente
        guide.addEventListener('click', (function(g) { 
          return function() {
            console.log(g.top);
          }

        })(guides[i]));
        */
        
      };

      

    }


  };

  // make it go!
  octopus.init();


})();
