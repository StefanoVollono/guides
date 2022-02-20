import './styles/guides.scss';
import Draggabilly from 'draggabilly';

const GUIDE_TYPES = {
  GUIDE_HORIZONTAL: 'vollguides__line--h',
  GUIDE_VERTICAL: 'vollguides__line--v'
}

class DomUtilities {
  constructor() {}

  // Create an element with an optional CSS class
  createElement(tag, className) {
    const element = document.createElement(tag)
    if (className) element.classList.add(className)
    return element
  }

  // Retrieve an element from the DOM
  getElement(selector) {
    const element = document.querySelector(selector)
    return element
  }
}

class Model {
  constructor() {
    // il modello di base mette a disposizione 2 guide.
    this.guides = [
      { id: 1, type: "vollguides__line--h", left: 15, top: 111 },
      { id: 2, type: "vollguides__line--v", left: 222, top: 15 }
    ]
  }

  // Metodo che accetta come callback, la referenza bindata di Controller.onGuideListChanged
  // (il metodo del controller che richiama la view per renderizzare la lista)
  bindGuideListChanged(callback) {
    this.onGuideListChanged = callback;
  }

  // Add new guide to model
  addGuide(guide) {
    const localId = this.guides.length > 0 ? this.guides[this.guides.length - 1].id + 1 : 1;
    const localGuide = {
      id: localId,
      ...guide,
    }
    this.guides.push(localGuide);

    // Questo metodo punta alla callback passata come argomento di bindGuideListChanged
    this.onGuideListChanged(this.guides)
  }

  // update guide
  updateGuide(guide) {
    this.guides.map((elem, index) => {
      if (elem.id === guide.id) {

        this.guides[guide.id - 1].left = guide.left
        this.guides[guide.id - 1].top = guide.top
      }
    });

    // Questo metodo punta alla callback passata come argomento di bindGuideListChanged
    this.onGuideListChanged(this.guides)
  }

  // delete a guide by ID
  deleteGuide(id) {
    this.guides = this.guides.filter(function(guide, index, arr){ 
      return guide.id !== id;
    });
    this.onGuideListChanged(this.guides);
  }
}

class View extends DomUtilities {
  constructor() {
    super();

    this.draggies = [];
    this._temporaryGuide;

    this.app = this.getElement('body');
    this.wrapper = this.createElement('div', 'vollguides');
    this.overlay = this.createElement('div', 'vollguides__overlay');
    this.tooltip = this.createElement('div', 'vollguides__tooltip');
    this.collection = this.createElement('div', 'vollguides__collection');

    // By design, you are not able to place a single element in more than one location in the DOM. 
    // If you desire, you can create a duplicate of a node by using cloneNode(). You can then insert that duplicate into the DOM at a different location.
    this.rulePointerH = this.createElement('div', 'vollguides__rule-pointer');
    this.rulePointerV = this.rulePointerH.cloneNode(true);

    // rules
    this.rulesH = this.createElement('div');
    this.rulesH.classList.add('vollguides__rule', 'vollguides__rule--h');
    this.rulesH.append(this.rulePointerH);

    this.rulesV = this.createElement('div');
    this.rulesV.classList.add('vollguides__rule', 'vollguides__rule--v');
    this.rulesV.append(this.rulePointerV);

    // build template
    this.wrapper.append(this.overlay, this.tooltip, this.rulesH, this.rulesV, this.collection);
    this.app.append(this.wrapper);

    // rule and tooltip selectors
    this.v_rule = this.getElement('.vollguides__rule--v .vollguides__rule-pointer');
    this.h_rule = this.getElement('.vollguides__rule--h .vollguides__rule-pointer');
    this.tooltip = this.getElement('.vollguides__tooltip');

    // mousemove event listner for rule and tooltip
    document.addEventListener('mousemove', (event) => {
      this.h_rule.style.left =  `${(parseInt(event.pageX)) - 15}px`;
      this.v_rule.style.top =   `${(parseInt(event.pageY)) - 15}px`;
      this.tooltip.innerHTML =  `${(parseInt(event.pageX))}px - ${(parseInt(event.pageY))}px`;
      this.tooltip.style.top =  `${(parseInt(event.pageY)) + 7}px`;
      this.tooltip.style.left = `${(parseInt(event.pageX)) + 7}px`;
    }, false);

    // Destroy all
    document.addEventListener('keydown', ((e)=> {
      if (e.code === 'Escape') {
        this.wrapper.remove();
      }
    }));
  }

  displayGuides(guides) {

    // Delete all nodes
    while (this.collection.firstChild) {
      this.collection.removeChild(this.collection.firstChild)
    }
    
    // Delete all draggies
    this.draggies = [];

    guides.forEach( (guide, index) => {
      const guideLine = this.createElement('div', 'vollguides__line-inner');
      const localGuideClass = (guide.type === GUIDE_TYPES.GUIDE_HORIZONTAL ? GUIDE_TYPES.GUIDE_HORIZONTAL : GUIDE_TYPES.GUIDE_VERTICAL);
      
      const localGuide = this.createElement('div');
      localGuide.classList.add('vollguides__line', localGuideClass);
      localGuide.setAttribute('id', guide.id);
      localGuide.setAttribute('draggable', true);
      localGuide.style.left = `${guide.left}px`;
      localGuide.style.top = `${guide.top}px`;

      // localGuide.append(guideLine);
      this.collection.append(localGuide);

      const draggie = new Draggabilly( localGuide, {
        axis: localGuide.classList.contains(GUIDE_TYPES.GUIDE_HORIZONTAL) ? 'y' : 'x',
        grid: [1,1]
      });

      this.draggies.push( draggie );
      
    });
  }

  bindAddGuide(handler) { // -> Controller.handleAddGuide
    [this.rulesH, this.rulesV].forEach( item => {
      item.addEventListener('dblclick', event => {
        event.preventDefault();

        const newGuideObj = {
          type: (event.currentTarget.classList.contains('vollguides__rule--h') ? "vollguides__line--h" : "vollguides__line--v"),
          top: (event.currentTarget.classList.contains('vollguides__rule--h') ? (25 + Math.floor(Math.random() * (200 - 15)) + 15) : 15),
          left: (event.currentTarget.classList.contains('vollguides__rule--h') ? 15 : Math.floor((Math.random() * (200 - 15)) + 15))
        };

        handler(newGuideObj)
      })
    })
  }

  bindEditGuide(handler) {
    this.collection.addEventListener('mousemove', event => {
      const draggiesFiltered = this.draggies.filter((draggy)=>{
        return parseInt(draggy.element.id) === parseInt(event.target.id)
      });
      const draggable = draggiesFiltered[0];
      
      if (draggable) {
        // On drag move event
        draggable.on( 'dragMove', (event) => {
          this.h_rule.style.left =  `${(parseInt(event.clientX)) - 15}px`;
          this.v_rule.style.top =   `${(parseInt(event.clientY)) - 15}px`;
          this.tooltip.innerHTML =  `${(parseInt(event.clientX))}px - ${(parseInt(event.clientY))}px`;
          this.tooltip.style.top =  `${(parseInt(event.clientY)) + 7}px`;
          this.tooltip.style.left = `${(parseInt(event.clientX)) + 7}px`;
        })
        
        // On drag end
        draggable.on('dragEnd', function(event, pointer) {
          this._temporaryGuide = {
            id: parseInt(this.element.id),
            type: this.element.classList[1],
            top: this.position.y,
            left: this.position.x
          };

          handler(this._temporaryGuide);
          this._temporaryGuide = null;
        });
      }
    })
  }

  bindDeleteGuide(handler) {
    [this.collection].forEach(guide => {
      guide.addEventListener('dblclick', (e) => {
        e.preventDefault();
        const localId = e.target.getAttribute('id');
        handler(parseInt(localId))
      });
    });
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.onGuideListChanged(this.model.guides);

    this.view.bindAddGuide(this.handleAddGuide);
    this.view.bindEditGuide(this.handleEditGuide);
    this.view.bindDeleteGuide(this.handleDeleteGuide);

    // Cosi facendo sto legando (bind) il metodo del controller (onGuideListChanged) al modello, passando in callback la sua referenza
    this.model.bindGuideListChanged(this.onGuideListChanged)
  }

  onGuideListChanged = (guides) => {
    this.view.displayGuides(guides)
  }

  handleAddGuide = (guide) => {
    this.model.addGuide(guide)
  }

  handleEditGuide = (guide) => {
    this.model.updateGuide(guide)
  }

  handleDeleteGuide = (guide) => {
    this.model.deleteGuide(guide)
  }
}

const wrap = document.querySelector('.vollguides');
wrap ? wrap.remove() : new Controller(new Model(), new View());