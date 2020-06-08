import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './XxxWpWebPart.module.scss';
import * as strings from 'XxxWpWebPartStrings';

export interface IXxxWpWebPartProps {
  description: string;
}

require('../../../node_modules/bootstrap/dist/css/bootstrap.min.css');
require('../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css');
require('../../../node_modules/datatables.net-bs4/css/dataTables.bootstrap4.min.css')

import "jquery";
import "bootstrap";
import "datatables.net";
import "datatables.net-bs4";


export default class XxxWpWebPart extends BaseClientSideWebPart <IXxxWpWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
    <table id="tabla1" class="table table-hover">
      <thead>
        <tr>
          <th scope="col">País</th>
          <th scope="col">Idioma</th>
          <th scope="col">Moneda</th>
          <th scope="col">Bandera</th>
        </tr>
      </thead>
      <tbody id="tBodyTabla1">

      </tbody>
    </table>

    <div id="contenedorModales"></div>
        
      `;    

      $(document).ready(function() {

        var uri = "https://restcountries.eu/rest/v2/all";
      
        $.ajax({
          url: uri, 
          type: "GET",
          dataType: 'json',
          async: true,
          error:function(objeto1,objeto2,objeto3){
            console.log(objeto1);
            console.log(objeto2);
            console.log(objeto3);
            //errorEvent("Error en la conexión");
          },
          timeout:600000,  // 5 segundos
          success: function (paises){
      
                  var salidaTd = "";
                  var salidaModal = "";
                  
                  //Recorre el json
            for (let i = 0; i < paises.length; i++) {
      
              salidaTd += "<tr data-toggle='modal' data-target='#Modal" + i + "'>";
              salidaTd += "<td>" + paises[i].name.toString() + "</td>";
              salidaTd += "<td>" + paises[i].languages[0].name.toString() + "</td>";

              // Valida si el código de moneda existe
              if(paises[i].currencies[0].code == null){
                  if(paises[i].currencies[1].code == null){
                      salidaTd += "<th>NotFound</th>";
                  }else{
                      salidaTd += "<td>" + paises[i].currencies[1].code.toString() + " - "+ paises[i].currencies[1].name.toString() +"</td>";
                  }
              }else{
                  salidaTd += "<td>" + paises[i].currencies[0].code.toString() + " - "+ paises[i].currencies[0].name.toString() +"</td>";
              }
              
              salidaTd += "<td><img src='" + paises[i].flag.toString() + "' width='60px' height='40px'></td>";
              salidaTd += "</tr>";


              // --- Inicio Modal
              salidaModal +='<div class="modal fade" id="Modal' + i + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel' + i + '" aria-hidden="true">';
                  salidaModal +='<div class="modal-dialog" role="document">';
                      salidaModal +='<div class="modal-content">';
                          salidaModal +='<div class="modal-header">';
                              salidaModal +='<h5 class="modal-title" id="exampleModalLabel' + i + '">Información adicional - ' + paises[i].name.toString() + '</h5>';
                              salidaModal +='<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
                                  salidaModal +='<span aria-hidden="true">&times;</span>';
                              salidaModal +='</button>';
                          salidaModal +='</div>';
                          salidaModal +='<div class="modal-body">';
                              salidaModal +='<p><strong>* Region: </strong>'+paises[i].region.toString()+'</p><hr>';
                              salidaModal +='<p><strong>* SubRegion: </strong>'+paises[i].subregion.toString()+'</p><hr>';
                              salidaModal +='<p><strong>* Capital: </strong>'+paises[i].capital.toString()+'</p><hr>';
                              salidaModal +='<p><strong>* Población: </strong>'+paises[i].population.toString()+'</p><hr>';
                              salidaModal +='<p><strong>* Código llamadas: </strong>+'+paises[i].callingCodes.toString()+'</p>';
                          salidaModal +='</div>';
                          salidaModal +='<div class="modal-footer">';
                              salidaModal +='<button type="button" class="btn btn-primary" data-dismiss="modal">Regresar</button>';
                          salidaModal +='</div>';
                      salidaModal +='</div>';
                  salidaModal +='</div>';
              salidaModal +='</div>';
              // --- Fin Modal
      
            }
      
                  //Se agrega el contenido de la variable a la tabla
                  document.getElementById("tBodyTabla1").innerHTML = salidaTd;
      
                  //Se agrega el contenido de la variable al Modal
                  document.getElementById("contenedorModales").innerHTML = salidaModal;
                  
      
                  $('#tabla1').DataTable();
      
              }
      
          }); 
      
      } );
  }

  protected get dataVersion(): Version {
  return Version.parse('1.0');
}

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}