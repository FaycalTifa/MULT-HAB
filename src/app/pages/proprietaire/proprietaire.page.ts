import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';

declare const require: any;
const html2pdf = require('html2pdf.js');

interface Option {
  label: string;
  showInputs: boolean;
  capitalMultiplier: number;
  calculatedCapital?: number;
  showSubCheckboxes?: boolean;
  subOptions?: SubOption[];
}

interface SubOption {
  label: string;
  showInputs: boolean;
  capitalMultiplier: number;
  calculatedCapital?: number;
}

@Component({
  selector: 'app-proprietaire',
  templateUrl: './proprietaire.page.html',
  styleUrls: ['./proprietaire.page.scss'],
})
export class ProprietairePage implements OnInit {
  @ViewChild('content', { static: false })
  content!: ElementRef;
  constructor() {}

  buttonLabel: string = 'Oui';
  showInput: boolean = false;

  loyerMensuel: number = 0;
  resultat: number = 0;

  sousTotal1: number = 0;
  sousTotal2: number = 0;
  sousTotal3: number = 0;
  primeNette: number = 0;
  primeTtc: number = 0;
  taxeTotale: number = 0;
  accessoire: number = 5000;
  taxe1: number = 0;
  taxe2: number = 0;

  options1: Option[] = [
    { label: 'Batiment / risque locatif', showInputs: false, capitalMultiplier: (0.5 / 1000) , calculatedCapital: 0 },
    { label: 'Ensemble contenu', showInputs: false, capitalMultiplier: (0.5 / 1000) , calculatedCapital: 0 },
    {
      label: 'Frais et pertes divers',
      showInputs: false,
      capitalMultiplier: 2,
      showSubCheckboxes: false,
      subOptions: [
        { label: 'Recours des voisins et des tiers', showInputs: false, capitalMultiplier: (0.15 / 1000) , calculatedCapital: 0 },
        { label: 'Privation de jouissance', showInputs: false, capitalMultiplier: (0.3 / 1000) , calculatedCapital: 0 },
        { label: 'Frais de déclai et démolition', showInputs: false, capitalMultiplier: (0.3 / 1000) , calculatedCapital: 0 },
        { label: 'Honoraire', showInputs: false, capitalMultiplier: (0.3 / 1000) , calculatedCapital: 0 },
      ]
    },
    { label: 'Toutes explosions', showInputs: false, capitalMultiplier: 0 , calculatedCapital: 0 },
  ];

  options2: Option[] = [
    { label: 'Dommages aux appareils électriques', showInputs: false, capitalMultiplier: (4 / 1000) , calculatedCapital: 0},
    { label: 'Dégâts des eaux', showInputs: false, capitalMultiplier: (1 / 1000) , calculatedCapital: 0 },
    { label: 'Bris de glaces', showInputs: false, capitalMultiplier: (1 / 1000) , calculatedCapital: 0 },
    { label: 'Vol avec effraction du contenu en général (mobilier et matériel)', showInputs: false, capitalMultiplier: (5 / 1000) , calculatedCapital: 0 },
    { label: 'Déteriorations mobilieres et immobilières conséqutives à un vol', showInputs: false, capitalMultiplier: 0 , calculatedCapital: 1000 },
  ];



  options3: Option[] = [
    { label: 'Dommages corporels', showInputs: false, capitalMultiplier: (1 / 1000) , calculatedCapital: 0 },
    { label: 'Dommages matériels et immatériels consécutifs', showInputs: false, capitalMultiplier: (1 / 1000) , calculatedCapital: 0 },
    { label: 'Défense / Recours', showInputs: false, capitalMultiplier: (1 / 1000) , calculatedCapital: 0 },
  ];
  ngOnInit() {

  }
  // Méthode pour générer le PDF
  generatePDF() {
    const options = {
      margin: [1, 0.5, 0.5, 0.5],
      filename: 'myfile.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: 'blue',
        logging: true
      },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Calculer les primes avant de générer le PDF
    this.calculer();

    // Utiliser html2pdf pour générer le PDF
    html2pdf()
      .from(this.getContentAsHtml())
      .set(options)
      .save();
  }

  getContentAsHtml(): HTMLElement {
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = `
      <table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr style="border-bottom: 1px solid #ddd;" >
            <th style="border: 1px solid #ddd; padding: 8px;">Label</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Capitaux</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Prime</th>
          </tr>
        </thead>
        <tbody>
          ${this.options1.map(option => `
            <tr  style="border-bottom: 1px solid #ddd;">
              <td style="border: 1px solid #ddd; padding: 8px;">${option.label}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${option.showInputs ?
               (document.getElementById(`capital-${option.label}`) as HTMLInputElement).value : '-'}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${option.calculatedCapital}</td>

            </tr>
              ${option.subOptions && option.showSubCheckboxes ? option.subOptions.map(subOption => `
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="border: 1px solid #ddd; padding: 8px;">${subOption.label}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">
                ${subOption.showInputs ? (document.getElementById(`sub-capital-${subOption.label}`) as HTMLInputElement).value : '-'}
              </td>
              <td style="border: 1px solid #ddd; padding: 8px;">${subOption.calculatedCapital}</td>
            </tr>
          `).join('') : ''}
        `).join('')}
            <!-- Ajoutez ici le calcul du sous-total pour options1 -->
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="border: 1px solid #ddd; padding: 8px;" colspan="2">Sous-total</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${this.sousTotal1}</td>
        </tr>
           ${this.options2.map(option => `
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="border: 1px solid #ddd; padding: 8px;">${option.label}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${option.showInputs ?
               (document.getElementById(`capital-${option.label}`) as HTMLInputElement).value : '-'}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${option.calculatedCapital}</td>
            </tr>
            `).join('')}
            <tr style="border-bottom: 1px solid #ddd;">
            <td style="border: 1px solid #ddd; padding: 8px;" colspan="2" >Sous-total</td>
            <td style="border: 5px solid #ddd; padding: 8px;">${this.sousTotal2}</td>
          </tr>
           ${this.options3.map(option => `
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="border: 1px solid #ddd; padding: 8px;">${option.label}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${option.showInputs ?
              (document.getElementById(`capital-${option.label}`) as HTMLInputElement).value : '-'}</td>
              <td style="border: 5px solid #ddd; padding: 8px;">${option.calculatedCapital}</td>
            </tr>
            `).join('')}
            <tr style="border-bottom: 1px solid #ddd;">
            <td style="border: 1px solid #ddd; padding: 8px;" colspan="2" >Sous-total</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${this.sousTotal3}</td>
          </tr>

          <tr>
          <td style="border: 1px solid #ddd; padding: 2px; colspan="2" >Taxe</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${this.taxeTotale}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
          <td style="border: 1px solid #ddd; padding: 8px; colspan="2" >Prime TTC</td>
            <td style="border: 5px solid #ddd; padding: 8px;">${this.primeTtc}</td>
          </tr>
          <tr>
          <td style="border: 1px solid #ddd; padding: 2px; colspan="2" >Prime Nette</td>
            <td style="border: 5px solid #ddd; padding: 8px;">${this.primeNette}</td>
          </tr>

        </tbody>
      </table>
    `;


    return contentDiv;
  }

  // Exemple de mise à jour de subOption.calculatedCapital
calculateCalculatedCapital(subOption: any) {
  // Implémentez votre logique de calcul ici
  subOption.calculatedCapital = this.calculateSomeValue(subOption);
}

calculateSomeValue(subOption: any): number {
  // Logique de calcul pour subOption.calculatedCapital
  // Par exemple :
  return subOption.value1 + subOption.value2;
}

  // Méthode pour récupérer la valeur de la sous-option
  getSubOptionValue(subOption: any): string {
    const inputElement = document.getElementById(`sub-capital-${subOption.label}`) as HTMLInputElement;
    return inputElement ? inputElement.value : '-';
  }


  toggleInputs(option: Option, index: number, fieldset: number) {
    option.showInputs = !option.showInputs;

    if (fieldset === 1 && index === 2) {
      option.showSubCheckboxes = !option.showSubCheckboxes;
      option.showInputs = false;
    }
  }

  toggleButton() {
    this.buttonLabel = this.buttonLabel === 'Oui' ? 'Non' : 'Oui';
    this.showInput = !this.showInput;
  }

    calculer() {
        this.sousTotal1 = 0;
        this.sousTotal2 = 0;
        this.sousTotal3 = 0;

        // Calcul pour options1
        this.options1.forEach(option => {
            if (option.showInputs) {
                const capitalInput = parseFloat((document.getElementById(`capital-${option.label}`) as HTMLInputElement).value);
                if (option.label === 'Ensemble contenu') {
                    option.calculatedCapital = Math.round(capitalInput * option.capitalMultiplier);
                } else {
                    if (this.buttonLabel === 'Non') {
                        option.calculatedCapital = Math.round(capitalInput * option.capitalMultiplier * 12 * 15);
                    } else {
                        option.calculatedCapital = Math.round(capitalInput * option.capitalMultiplier);
                    }
                }
                this.sousTotal1 += option.calculatedCapital || 0;
            }

            if (option.subOptions) {
                option.subOptions.forEach(subOption => {
                    if (subOption.showInputs) {
                        const subCapitalInput = parseFloat((document.getElementById(`sub-capital-${subOption.label}`) as HTMLInputElement).value);
                        if (subOption.label === 'Privation de jouissance') {
                            if (this.buttonLabel === 'Oui') {
                                subOption.calculatedCapital = Math.round((subCapitalInput / 15) * subOption.capitalMultiplier);
                            } else {
                                subOption.calculatedCapital = Math.round(subCapitalInput * subOption.capitalMultiplier * 12);
                            }
                        } else {
                            subOption.calculatedCapital = Math.round(subCapitalInput * subOption.capitalMultiplier);
                        }
                        this.sousTotal1 += subOption.calculatedCapital || 0;
                    }
                });
            }
        });


        // Calcul pour options2
        this.options2.forEach(option => {
            if (option.showInputs) {
                const capitalInput = parseFloat((document.getElementById(`capital-${option.label}`) as HTMLInputElement).value);
                option.calculatedCapital = Math.round(capitalInput * option.capitalMultiplier);
                this.sousTotal2 += option.calculatedCapital || 0;
            }
        });

        // Calcul pour options3
        this.options3.forEach(option => {
            if (option.showInputs) {
                const capitalInput = parseFloat((document.getElementById(`capital-${option.label}`) as HTMLInputElement).value);
                option.calculatedCapital = Math.round(capitalInput * option.capitalMultiplier);
                this.sousTotal3 += option.calculatedCapital || 0;
            }
        });

        this.primeNette = this.sousTotal1 + this.sousTotal2 + this.sousTotal3;
        this.taxe1 = Math.round((this.sousTotal1 + this.accessoire) * 0.2);
        this.taxe2 = Math.round((this.sousTotal2 + this.sousTotal3) * 0.12);
        this.taxeTotale = this.taxe1 + this.taxe2;
        this.primeTtc = this.primeNette + this.taxeTotale + this.accessoire;

        // Affichage pour débogage
        console.log('===========this.options1===============', this.options1);
        console.log('===========this.sousTotal1===============', this.sousTotal1);

        console.log('===========this.options2===============', this.options2);
        console.log('===========this.sousTotal2===============', this.sousTotal2);

        console.log('===========this.options3===============', this.options3);
        console.log('===========this.sousTotal3===============', this.sousTotal3);
    }



    resetFields() {
        this.options1.forEach(option => {
            if (option.showInputs) {
                const inputElement = (document.getElementById(`capital-${option.label}`) as HTMLInputElement);
                if (inputElement) {
                    inputElement.value = '';
                }
                option.calculatedCapital = 0;
            }
            if (option.subOptions) {
                option.subOptions.forEach(subOption => {
                    if (subOption.showInputs) {
                        const subInputElement = (document.getElementById(`sub-capital-${subOption.label}`) as HTMLInputElement);
                        if (subInputElement) {
                            subInputElement.value = '';
                        }
                        subOption.calculatedCapital = 0;
                    }
                });
            }
        });

        this.options2.forEach(option => {
            if (option.showInputs) {
                const inputElement = (document.getElementById(`capital-${option.label}`) as HTMLInputElement);
                if (inputElement) {
                    inputElement.value = '';
                }
                option.calculatedCapital = 0;
            }
        });

        this.options3.forEach(option => {
            if (option.showInputs) {
                const inputElement = (document.getElementById(`capital-${option.label}`) as HTMLInputElement);
                if (inputElement) {
                    inputElement.value = '';
                }
                option.calculatedCapital = 0;
            }
        });

        // Réinitialiser les totaux et les autres valeurs calculées
        this.sousTotal1 = 0;
        this.sousTotal2 = 0;
        this.sousTotal3 = 0;
        this.primeNette = 0;
        this.taxe1 = 0;
        this.taxe2 = 0;
        this.taxeTotale = 0;
        this.primeTtc = 0;
    }



  }



