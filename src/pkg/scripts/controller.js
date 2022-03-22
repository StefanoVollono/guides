export class Controller {
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