import { GUIDE_TYPES } from './constants';

export class Model {
    constructor() {
        // il modello di base mette a disposizione 2 guide.
        this.guides = [
            { id: 1, type: GUIDE_TYPES.GUIDE_HORIZONTAL, left: 15, top: 111 },
            { id: 2, type: GUIDE_TYPES.GUIDE_VERTICAL, left: 222, top: 15 }
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
        const localGuide = { id: localId, ...guide }
        this.guides.push(localGuide);

        // Questo metodo punta alla callback passata come argomento di bindGuideListChanged
        this.onGuideListChanged(this.guides)
    }
  
    // update guide
    updateGuide(guide) {
        this.guides = this.guides.map((g) =>
            g.id === guide.id ? {id: g.id, left: guide.left, top: guide.top, type: g.type} : g,
        )

        // Questo metodo punta alla callback passata come argomento di bindGuideListChanged
        this.onGuideListChanged(this.guides)
    }
  
    // delete a guide by ID
    deleteGuide(id) {
        this.guides = this.guides.filter( guide => guide.id !== id );
        this.onGuideListChanged(this.guides);
    }
}