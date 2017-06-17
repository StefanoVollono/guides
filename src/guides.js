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
      view.render();
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
                      '</div>';

      this.render();

    },

    render: function () {

      this.bodyElem.insertAdjacentHTML('beforeend', this.template);

    }

  };


  var guidesWiew = {

    init: function () {

      this.guideWrap  = document.querySelector('.vollguides');
      this.rules = document.querySelectorAll('.vollguides__rule');
      this.guide = '<div class="vollguides__line"><div class="vollguides__line-inner"></div></div>';

      this.render();

    },

    render: function () {

      // Salvo le guide in una variabile locale
      var guides = octopus.getGuides();

      // empty the cat list todo devo creare un wrap per le guide e ripulire solo quello
      //this.guideWrap.innerHTML = '';

      // Renderizzo le guide in base all'array (al primo giro non ce ne sono)
      for (var i = 0; i < guides.length; i++) {
        this.guideWrap.insertAdjacentHTML('beforeend', this.guide);
        var last = $( ".vollguides" ).find('> div').last();
        last.addClass(guides[i].type).css({top: guides[i].top, left: guides[i].left});
      }



      /*

      for (var i = 0 ; i < rules.length; i++) {
        rules[i].addEventListener('click', (function(g) {

          return function() {

            //document.querySelector('.vollguides').appendChild(guide);
            guideWrap.insertAdjacentHTML('beforeend', guide);
            var last = $( ".vollguides" ).find('> div').last();

            // attribuisco la classe in base alla guida cliccata
            if (g.classList.contains('vollguides__rule--h')) {
              last.addClass('vollguides__line--h');
            } else {
              last.addClass('vollguides__line--v');
            }

            var newGuideObj = {
              type: 'vollguides__line--h',
              top: last.offset().top,
              left: last.offset().left
            }

            // aggiorno l'array
            octopus.addNewGuide(newGuideObj);

          }

        })(rules[i]));
      }
      */




    }


  };

  // make it go!
  octopus.init();


})();
