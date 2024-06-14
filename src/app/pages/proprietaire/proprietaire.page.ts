import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-proprietaire',
  templateUrl: './proprietaire.page.html',
  styleUrls: ['./proprietaire.page.scss'],
})



export class ProprietairePage {

  buttonLabel: string = 'Oui';
  showInput: boolean = false;

  loyerMensuel: number = 0;
  resultat: number = 0;


  options1 = [
    { label: 'Batiment / risque locatif', showInputs: false },
    { label: 'Ensemble contenu', showInputs: false },
    { label: 'Frais et pertes divers', showInputs: false, showSubCheckboxes: false, subOptions: [
      { label: 'Recours des voisins et des tiers', showInputs: false },
      { label: 'Privation de jouissance', showInputs: false },
      { label: 'Frais de déclai et démolition', showInputs: false },
      { label: 'Honoraire', showInputs: false }
    ] },
    { label: 'Toutes explosions', showInputs: false }
  ];

  options2 =[
    { label: 'Dommages aux appareils électriques', showInputs: false },
    { label: 'Dégats des eaux', showInputs: false },
    { label: 'Bris de glaces', showInputs: false },
    { label: 'Vol avec effraction du contenu en général (mobilier et matériel)', showInputs: false },
    { label: 'Déteriorations mobilieres et immobilières conséqutives à un vol ou une tentative de vol', showInputs: false },


  ];

  options3 =[
    { label: 'Dommages corporels', showInputs: false },
    { label: 'Dommages matériels et immateriels consécutifs', showInputs: false },
    { label: 'Défense / Recours', showInputs: false },

  ];



  constructor() {

  }
  toggleInputs(option: any, index: number, fieldset: number) {
    option.showInputs = !option.showInputs;

    if (fieldset === 0 && index === 3) {  // Si c'est la troisième option (index 2) du premier fieldset
      option.showSubCheckboxes = !option.showSubCheckboxes;
      option.showInputs = false; // Assurez-vous que les inputs ne sont pas affichés pour la troisième option principale
    }
  }






  calculer() {
    if(this.loyerMensuel) {
      this.resultat = this.loyerMensuel * 15 * 12;
    } else {
      this.resultat = 0;
    }
  }

  toggleButton() {
    if (this.buttonLabel === 'Oui') {
      this.buttonLabel = 'Non';
      this.showInput = true;
    } else {
      this.buttonLabel = 'Oui';
      this.showInput = false;
    }
  }



  ngOnInit() {
  }

}
