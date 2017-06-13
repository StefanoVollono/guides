


function Guide(parent,eventDrag,request){
	this.parent = parent;
  var createLayout = {};

  if($('#overlay_voll').length < 1){

    // Carico: righelli + guide + overlay + tooltip
    this.createLayout = function(){
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

	// Metodo che creo la guida in base al righello cliccato
	this.newGuide = function(){
		if($('.guide_voll').length){
			$('.guide_voll').removeClass('lastGuide_voll').removeAttr('data-lastguide');
		}
		$('<div>')
			.attr({
				'class' : 'guide_voll lastGuide_voll ' + this.parent,
				'data-lastGuide' : 'true',
				'data-parent'		: this.parent
			}).appendTo('body');

		if(this.parent == 'ruleH_voll'){
			$('.lastGuide_voll.' + this.parent).css('top','30px').show();
		} else {
			$('.lastGuide_voll.' + this.parent).css('left','30px').show();
		}
	};

	// Drag
	this.dragGuide = function(){
		this.eventDrag = eventDrag;

		if(this.parent == 'ruleH_voll'){
			// provare a commentare il metodo e a portare tutto fuori.
			$('.' + this.parent + '.lastGuide_voll').css('top', this.eventDrag.pageY);
		} else {
			$('.' + this.parent + '.lastGuide_voll').css('left', this.eventDrag.pageX);
		}


	};

	// Destroy all
	this.destroyAll = function(){
		$('body').keydown(function(e){
			if (e.which == 27){
				$('.rule_voll, .guide_voll, #overlay_voll, #tooltip_voll').remove();
			}
		});
	}

}

$(document).ready(function(){

	var istanza = new Guide();
	istanza.createLayout();
	istanza.destroyAll();

	// in base alla pos x/y del mouse muovo gli indicatori sul righello / riporto le coordinate nel tooltip e lo accodo al puntatore
	$(document).mousemove(function(e){
		$('#ruleH_voll span').css('left', (e.pageX)-15);
		$('#ruleV_voll span').css('top', (e.pageY)-15);
		$('#tooltip_voll').text(e.pageX+'px / '+e.pageY+'px').css({left: (e.pageX)+7,top: (e.pageY)+7});
	});

	// Setto la variabile parent di origine e lo stato clicking
	var parent;
	var down = false;
	var clicking = false;

	// Al doppio cick creo una guida e la metto a 20px dai righelli
	$('.rule_voll').on('dblclick',function(){
		var parent = $(this).attr('id');

		var istanza1 = new Guide(parent);
		istanza1.newGuide();
	});

	// Al mouseDown mi salvo il parent dell'elemento da passare poi al metodo per selezionare l'elemento da spostare.
	$('body').on('mousedown','.guide_voll',function(){
	    clicking = true;
	    parent = $(this).attr('data-parent');

		$('.guide_voll').removeClass('lastGuide_voll').removeAttr('data-lastguide');
		$(this).addClass('lastGuide_voll').attr('data-lastguide', 'true');
	});

	// Al mouseup imposto su false il click cosi che non si verificata la condizione
	$('body').mouseup(function(){
	    clicking = false;
	})

	// Se premo e muovo il mouse contemporaneamente draggo l'elemento
	$('body').mousemove(function(eventDrag){
    if(clicking == false) return;

    parent;
    if(eventDrag.which == 1){
    var istanza2 = new Guide(parent,eventDrag);
    istanza2.dragGuide();
    //$('.ruleH_voll').css('top', eventDrag.pageY - 30 / 2);
    //$('.ruleV_voll').css('left', (eventDrag.pageY) - 30 / 2);
		}
	});

});