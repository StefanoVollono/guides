// Styles
import './styles/guides.scss';

// Scripts
import { Model } from './scripts/model';
import { View } from './scripts/view';
import { Controller } from './scripts/controller';


const wrap = document.querySelector('.vollguides');
wrap ? wrap.remove() : new Controller(new Model(), new View());