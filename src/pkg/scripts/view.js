import Draggabilly from 'draggabilly';
import { DomUtilities } from './utilities';
import { GUIDE_TYPES } from './constants';

export class View extends DomUtilities {
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
  
        guides.forEach( (guide) => {
            const localGuideClass = (guide.type === GUIDE_TYPES.GUIDE_HORIZONTAL ? GUIDE_TYPES.GUIDE_HORIZONTAL : GUIDE_TYPES.GUIDE_VERTICAL);
            
            const localGuide = this.createElement('div');
            localGuide.classList.add('vollguides__line', localGuideClass);
            localGuide.setAttribute('id', guide.id);
            localGuide.setAttribute('draggable', true);
            localGuide.style.left = `${guide.left}px`;
            localGuide.style.top = `${guide.top}px`;
    
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
                    type: (event.currentTarget.classList.contains('vollguides__rule--h') ? GUIDE_TYPES.GUIDE_HORIZONTAL : GUIDE_TYPES.GUIDE_VERTICAL),
                    top: (event.currentTarget.classList.contains('vollguides__rule--h') ? (25 + Math.floor(Math.random() * (200 - 15)) + 15) : 15),
                    left: (event.currentTarget.classList.contains('vollguides__rule--h') ? 15 : Math.floor((Math.random() * (200 - 15)) + 15))
                };

                handler(newGuideObj)
            })
        })
    }
  
    bindEditGuide(handler) {
        this.collection.addEventListener('mousemove', event => {
            const draggiesFiltered = this.draggies.filter((draggy) => {
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
                draggable.on('dragEnd', function() {
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