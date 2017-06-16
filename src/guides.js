(function() {
  "use strict";

  var model = {

    currentGuide: null,

    // contiene la lista di guide create :: potrei usarla per salvarla nel localstorage e poterla riprendere al refresh della pagina
    guides: [
      {
        type: 'h',
        top: 123
      },
      {
        type: 'v',
        top: 123
      }
    ]

  };

  var octopus = {

    init: function () {

      // Delego la view per renderizzare gli elementi del template
      view.init();
    },

    // Mi ritorna tutto l'array di guide
    getGuides: function () {
      return model.guides;
    }

  };

  var view = {

    // Salvo il body e invoco il render
    init: function () {
      this.bodyElem   = document.querySelector('body');

      this.render()
    },

    render: function () {

      var template =  '<div class="vollguides">' +
                        '<div class="vollguides__overlay"></div>' +
                        '<div class="vollguides__tooltip"></div>' +
                        '<div class="vollguides__rule vollguides__rule--h">' +
                          '<div class="vollguides__rule-pointer"></div>' +
                        '</div>' +
                        '<div class="vollguides__rule vollguides__rule--v">' +
                          '<div class="vollguides__rule-pointer"></div>' +
                        '</div>' +
                      '</div>';


      // Appendo il template al body del sito
      this.bodyElem.innerHTML = template;


      // Doppio click su una guida invoco octopus per aggiornare l'array delle guide
      var guideWrap  = document.querySelector('.vollguides');
      var rules = document.querySelectorAll('.vollguides__rule');
      var guide = '<div class="vollguides__line"><div class="vollguides__line-inner"></div></div>';

      for (var i = 0 ; i < rules.length; i++) {
        rules[i].addEventListener('click', (function(g) {

          return function() {

            //document.querySelector('.vollguides').appendChild(guide);
            guideWrap.insertAdjacentHTML('beforeend', guide);

            // attribuisco la classe in base alla guida cliccata
            if (g.classList.contains('vollguides__rule--h')) {
              $( ".vollguides" ).find('> div').last().addClass('vollguides__line--h');
              //document.querySelector('.vollguides').querySelectorAll(".vollguides>div").lastChild.classList.add('vollguides__line--h');
            } else {
              $( ".vollguides" ).find('> div').last().addClass('vollguides__line--v');
              //document.querySelector('.vollguides').querySelectorAll(".vollguides>div").lastChild.classList.add('vollguides__line--v');
            }

            // aggiorno l'array
            
          }

        })(rules[i]));
      }




    }


  };

  // make it go!
  octopus.init();


})();





  /*
  function Guide(parent, eventDrag, request) {
    this.parent = parent;
    var createLayout = {};

    if ($('#overlay_voll').length < 1) {

      // Carico: righelli + guide + overlay + tooltip
      this.createLayout = function () {
        $('\n\
        <div class="rule_voll" id="ruleH_voll">\n\
          <span></span>\n\
        </div>\n\
        <div class="rule_voll" id="ruleV_voll">\n\
          <span></span>\n\
        </div>\n\
        <div id="overlay_voll"></div>\n\
        <div id="tooltip_voll"></div>\n\
      ').appendTo('body');
      };


    }

    // Metodo che crea la guida in base al righello cliccato
    this.newGuide = function () {
      if ($('.guide_voll').length) {
        $('.guide_voll').removeClass('lastGuide_voll').removeAttr('data-lastguide');
      }
      $('<div>')
        .attr({
          'class': 'guide_voll lastGuide_voll ' + this.parent,
          'data-lastGuide': 'true',
          'data-parent': this.parent
        }).appendTo('body');

      if (this.parent == 'ruleH_voll') {
        $('.lastGuide_voll.' + this.parent).css('top', '30px').show();
      } else {
        $('.lastGuide_voll.' + this.parent).css('left', '30px').show();
      }
    };

    // Drag
    this.dragGuide = function () {
      this.eventDrag = eventDrag;

      if (this.parent == 'ruleH_voll') {
        // provare a commentare il metodo e a portare tutto fuori.
        $('.' + this.parent + '.lastGuide_voll').css('top', this.eventDrag.pageY);
      } else {
        $('.' + this.parent + '.lastGuide_voll').css('left', this.eventDrag.pageX);
      }


    };

    // Destroy all
    this.destroyAll = function () {
      $('body').keydown(function (e) {
        if (e.which == 27) {
          $('.rule_voll, .guide_voll, #overlay_voll, #tooltip_voll').remove();
        }
      });
    }

  }

  $(document).ready(function () {

    var istanza = new Guide();
    istanza.createLayout();
    istanza.destroyAll();

    // in base alla pos x/y del mouse muovo gli indicatori sul righello / riporto le coordinate nel tooltip e lo accodo al puntatore
    $(document).mousemove(function (e) {
      $('#ruleH_voll span').css('left', (e.pageX) - 15);
      $('#ruleV_voll span').css('top', (e.pageY) - 15);
      $('#tooltip_voll').text(e.pageX + 'px / ' + e.pageY + 'px').css({left: (e.pageX) + 7, top: (e.pageY) + 7});
    });

    // Setto la variabile parent di origine e lo stato clicking
    var parent;
    var down = false;
    var clicking = false;

    // Al doppio cick creo una guida e la metto a 20px dai righelli
    $('.rule_voll').on('dblclick', function () {
      var parent = $(this).attr('id');

      var istanza1 = new Guide(parent);
      istanza1.newGuide();
    });

    // Al mouseDown mi salvo il parent dell'elemento da passare poi al metodo per selezionare l'elemento da spostare.
    $('body').on('mousedown', '.guide_voll', function () {
      clicking = true;
      parent = $(this).attr('data-parent');

      $('.guide_voll').removeClass('lastGuide_voll').removeAttr('data-lastguide');
      $(this).addClass('lastGuide_voll').attr('data-lastguide', 'true');
    });

    // Al mouseup imposto su false il click cosi che non si verificata la condizione
    $('body').mouseup(function () {
      clicking = false;
    })

    // Se premo e muovo il mouse contemporaneamente draggo l'elemento
    $('body').mousemove(function (eventDrag) {
      if (clicking == false) return;

      parent;
      if (eventDrag.which == 1) {
        var istanza2 = new Guide(parent, eventDrag);
        istanza2.dragGuide();
        //$('.ruleH_voll').css('top', eventDrag.pageY - 30 / 2);
        //$('.ruleV_voll').css('left', (eventDrag.pageY) - 30 / 2);
      }
    });

  });

  */

