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
   enteredValue?: number;

}

interface SubOption {
  label: string;
  showInputs: boolean;
  capitalMultiplier: number;
  calculatedCapital?: number;
  enteredValue?: number;
}

@Component({
  selector: 'app-proprietaire',
  templateUrl: './proprietaire.page.html',
  styleUrls: ['./proprietaire.page.scss'],
})
export class ProprietairePage implements OnInit {
  qrDataURL!: string;
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
  donneesSaisies: string = '';


  options1: Option[] = [
    { label: 'Batiment / risque locatif', showInputs: false, capitalMultiplier: (0.5 / 1000), calculatedCapital: 0 },
    { label: 'Ensemble contenu', showInputs: false, capitalMultiplier: (0.5 / 1000), calculatedCapital: 0 },
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
    { label: 'Toutes explosions', showInputs: false, capitalMultiplier: 0, calculatedCapital: 0 },
   ];

  options2: Option[] = [
    { label: 'Dommages aux appareils électriques', showInputs: false, capitalMultiplier: (4 / 1000) , calculatedCapital: 0},
    { label: 'Dégâts des eaux', showInputs: false, capitalMultiplier: (1 / 1000) , calculatedCapital: 0 },
    { label: 'Bris de glaces', showInputs: false, capitalMultiplier: (1 / 1000) , calculatedCapital: 0 },
    { label: 'Vol avec effraction du contenu en général (mobilier et matériel)', showInputs: false, capitalMultiplier: (5 / 1000) , calculatedCapital: 0 },
    { label: 'Déteriorations mobilieres et immobilières conséqutives à un vol', showInputs: false, capitalMultiplier: 0 , calculatedCapital: 1000 },
  ];

  options3: Option[] = [
    { label: 'Dommages corporels *dont intoxications alimentaires', showInputs: false, capitalMultiplier: (1 / 1000) , calculatedCapital: 0 },
    { label: 'Dommages matériels et immatériels consécutifs', showInputs: false, capitalMultiplier: (1 / 1000) , calculatedCapital: 0 },
    { label: 'Défense / Recours', showInputs: false, capitalMultiplier: (1 / 1000) , calculatedCapital: 0 },
  ];


   // Méthode pour recalculer la somme de "Batiment / risque locatif" et "Ensemble contenu"
   calculateSommeBatimentEnsemble(): string {
    const batimentRisqueLocatif = this.options1.find(option => option.label === 'Batiment / risque locatif');
    const ensembleContenu = this.options1.find(option => option.label === 'Ensemble contenu');

    if (batimentRisqueLocatif && ensembleContenu) {
      const value1 = parseFloat((document.getElementById('capital-Batiment / risque locatif') as HTMLInputElement)?.value || '0');
      const value2 = parseFloat((document.getElementById('capital-Ensemble contenu') as HTMLInputElement)?.value || '0');
      const total = value1 + value2;
      return total.toString();
    } else {
      return '-';
    }
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
         <div>
         <img style="width:75px ; height:75px" src="/assets/icon/uab.jpeg" />

        <h1>PROPOSITION D'ASSURANCE MULTIRISQUE HABITATION</h1>

      </div>
          <tr style="border-bottom: 1px solid #ddd;" >
            <th style="border: 1px solid #ddd; padding: 8px;">Désignations</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Capitaux</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Primes</th>
          </tr>
        </thead>
        <tbody>
        ${this.options1
          // Filtrer pour exclure "Toutes explosions"
          .filter(option => option.label !== 'Toutes explosions')
          .map(option => `
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="border: 1px solid #ddd; padding: 8px;">${option.label}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">
                ${option.showInputs ?
                  (document.getElementById(`capital-${option.label}`) as HTMLInputElement).value : '-'}
              </td>
              <td style="border: 1px solid #ddd; padding: 8px;">
                ${option.calculatedCapital !== undefined ? option.calculatedCapital : '-'}
              </td>
            </tr>
            ${option.subOptions && option.showSubCheckboxes ? option.subOptions.map(subOption => `
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="border: 1px solid #ddd; padding: 8px;">${subOption.label}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  ${subOption.showInputs ?
                    (document.getElementById(`sub-capital-${subOption.label}`) as HTMLInputElement).value : '-'}
                </td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  ${subOption.calculatedCapital !== undefined ? subOption.calculatedCapital : '-'}
                </td>
              </tr>
            `).join('') : ''}
          `).join('')}
        <!-- Ligne pour calculer et afficher "Toutes explosions" -->
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="border: 1px solid #ddd; padding: 8px;">Toutes explosions</td>
          <td style="border: 1px solid #ddd; padding: 8px;">
            ${this.calculateSommeBatimentEnsemble() || '-'}
          </td>
          <td style="border: 1px solid #ddd; padding: 8px;">-</td>
        </tr>
        <!-- Autres lignes du tableau -->
        <!-- ... -->
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
      <div>
      <label for="donneesSaisies">NOTONS BIEN:</label>
      <input placeholder="Remarque pour dommages corporels"
       id="donneesSaisies" type="text" value="${this.donneesSaisies}" disabled>
    </div>
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
    // Réinitialisation des sous-totaux et des valeurs calculées
    this.sousTotal1 = 0;
    this.sousTotal2 = 0;
    this.sousTotal3 = 0;

    // Calcul pour options1
    this.options1.forEach(option => {
      if (option.showInputs) {
        const capitalInput = parseFloat((document.getElementById(`capital-${option.label}`) as HTMLInputElement).value);
        option.enteredValue = capitalInput; // Stocke la valeur entrée par l'utilisateur

        // Calcul de la prime selon la logique spécifiée
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
            subOption.enteredValue = subCapitalInput; // Stocke la valeur entrée par l'utilisateur

            // Calcul de la prime pour la sous-option selon la logique spécifiée
            if (subOption.label === 'Privation de jouissance') {
              if (this.buttonLabel === 'Oui') {
                subOption.calculatedCapital = Math.round((subCapitalInput ) * subOption.capitalMultiplier);
              } else {
                subOption.calculatedCapital = Math.round(subCapitalInput * subOption.capitalMultiplier );
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
        option.enteredValue = capitalInput; // Stocke la valeur entrée par l'utilisateur
        option.calculatedCapital = Math.round(capitalInput * option.capitalMultiplier);
        this.sousTotal2 += option.calculatedCapital || 0;
      }
    });

    // Calcul pour options3
    this.options3.forEach(option => {
      if (option.showInputs) {
        const capitalInput = parseFloat((document.getElementById(`capital-${option.label}`) as HTMLInputElement).value);
        option.enteredValue = capitalInput; // Stocke la valeur entrée par l'utilisateur
        option.calculatedCapital = Math.round(capitalInput * option.capitalMultiplier);
        this.sousTotal3 += option.calculatedCapital || 0;
      }
    });

    // Calcul pour "Toutes explosions"
  const batimentRisqueLocatifCapital = parseFloat((document.getElementById(`capital-Batiment / risque locatif`) as HTMLInputElement).value);
  const ensembleContenuCapital = parseFloat((document.getElementById(`capital-Ensemble contenu`) as HTMLInputElement).value);
  const toutesExplosionsCapital = batimentRisqueLocatifCapital + ensembleContenuCapital;
  this.options1[3].calculatedCapital = toutesExplosionsCapital;


    // Calculer les totaux et autres valeurs nécessaires
    this.primeNette = this.sousTotal1 + this.sousTotal2 + this.sousTotal3;
    this.taxe1 = Math.round((this.sousTotal1 + this.accessoire) * 0.2);
    this.taxe2 = Math.round((this.sousTotal2 + this.sousTotal3) * 0.12);
    this.taxeTotale = this.taxe1 + this.taxe2;
    this.primeTtc = this.primeNette + this.taxeTotale + this.accessoire;

    // Pour le débogage ou pour vérification
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



    // Appeler cette méthode pour générer le QR Code avec une URL spécifique
    ngOnInit() {

    }




  }



