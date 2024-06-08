<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { cilArrowCircleLeft, cilBasket } from '@coreui/icons'

  const companies = [
  {id: 1, name:'ADS'},
  {id: 2, name:'Advance '},
  {id: 3, name:'Aliah'},
  {id: 4, name:'Altea Desarrollos'},
  {id: 5, name:'American Industries'},
  {id: 6, name:'Amistad'},
  {id: 8, name:'Areya'},
  {id: 9, name:'Artha Capital'},
  {id: 10, name:'Atisa'},
  {id: 11, name:'AVANTE'},
  {id: 13, name:'BLI'},
  {id: 14, name:'Calidra'},
  {id: 15, name:'Carza'},
  {id: 16, name:'CBC'},
  {id: 17, name:'CBRE'},
  {id: 18, name:'Centinela'},
  {id: 19, name:'Colliers'},
  {id: 20, name:'CPA'},
  {id: 21, name:'CREA'},
  {id: 22, name:'Cushman '},
  {id: 23, name:'Davisa'},
  {id: 25, name:'Exeter'},
  {id: 27, name:'Finsa'},
  {id: 28, name:'G Industrial'},
  {id: 29, name: 'GP'}
  ]
  
  const optionsCompanies = companies.map(company => ({
  value: company.id,     // Este será el valor del <option>, normalmente un id único
  label: company.name,   // Este será el texto visible del <option>
  component: company.name // Opcional: usado cuando selectionType es "text"
}))


    const router = useRouter()
    const optionsPermissions = [
    {
      label: 'Columnas',
      options: [
        {
          value: 1,
          label: 'Mostrar tabla en Graficas (Availability, Gross Abso, Inv.-Bts-Exp., Ranking Availability, Ranking Gross Abso.)',
          selected: true,
        }
      ],
    },
    {
      label: 'Tablas',
      options: [
        {
          value: 2,
          label: 'Mostrar tabla en Graficas (Availability, Gross Abso, Inv.-Bts-Exp., Ranking Availability, Ranking Gross Abso.)',
          selected: true,
        }
      ],
    },
    {
      label: 'Fibras',
      options: [
        {
          value: 3,
          label: 'Mostrar Fibras',
          selected: true,
        }
      ],
    },
  ]
  const optionsModulos = [
    {
      value: 1,
      label: 'Availability',
    },
    {
      value: 2,
      label: 'Absorption',
    },
    {
      value: 3,
      label: 'Gráficas',
    },
    {
      value: 4,
      label: 'Overview',
    },
    {
      value: 5,
      label: 'Land Available',
    },
    {
      value: 6,
      label: 'Land Absorption',
    },
    {
      value: 7,
      label: 'CAM',
    },
    {
      value: 8,
      label: 'Land Absorption',
    },
    {
      value: 9,
      label: 'Negative Absorption',
    },
    {
      value: 10,
      label: 'Analytics Availability',
    },
    {
      value: 11,
      label: 'Analytics Absorption',
    },
    {
      value: 12,
      label: 'Market Report',
    },
    {
      value: 13,
      label: 'Market Size',
    },
    {
      value: 14,
      label: 'Industrial Park',
    },
  ]
  const optionsMarkets = [
    {
      value: 1,
      label: 'Guanajuato',
    },
    {
      value: 2,
      label: 'Queretaro',
    },
    {
      value: 3,
      label: 'Mexico City',
    },
    {
      value: 4,
      label: 'Matamoros',
    },
    {
      value: 5,
      label: 'Monterrey',
    },
    {
      value: 6,
      label: 'Chihuahua',
    },
    {
      value: 7,
      label: 'Puebla',
    },
    {
      value: 8,
      label: 'Saltillo',
    },
    {
      value: 9,
      label: 'San Luis Potosi',
    },
    {
      value: 10,
      label: 'Guadalajara',
    },
    {
      value: 11,
      label: 'Juarez',
    },
    {
      value: 12,
      label: 'Mexicali',
    },
    {
      value: 13,
      label: 'Tijuana',
    },
    {
      value: 14,
      label: 'Reynosa',
    },
    {
      value: 15,
      label: 'Nuevo Laredo',
    },
    {
      value: 16,
      label: 'Aguascalientes',
    },
    {
      value: 17,
      label: 'Hidalgo',
    },
    {
      value: 18,
      label: 'Hermosillo',
    },
    {
      value: 19,
      label: 'La Laguna',
    },
    {
      value: 20,
      label: 'Merida',
    },
  ]
  const optionsSubMarkets = [
    {
      label: 'Guanajuato',
      code: 'mrk',
      options: [
        {
          value: 1,
          label: 'Celaya',
        },
        {
          value: 2,
          label: 'Irapuato',
        },
        {
          value: 3,
          label: 'Lagos de Moreno',
        },
        {
          value: 4,
          label: 'Leon',
        },
        {
          value: 5,
          label: 'Salamanca',
        },
        {
          value: 6,
          label: 'Silao',
        }
      ],
    },
    {
      label: 'Queretaro',
      code: 'mrk',
      options: [
        {
          value: 7,
          label: 'Airport',
        },
        {
          value: 8,
          label: 'El Marques',
        },
        {
          value: 9,
          label: 'North',
        }
      ],
    },
    {
      label: 'Mexico City',
      code: 'mrk',
      options: [
        {
          value: 10,
          label: 'Atizapan',
        },
        {
          value: 11,
          label: 'Azcapotzalco - Vallejo',
        },
        {
          value: 12,
          label: 'Coacalco',
        },
        {
          value: 13,
          label: 'Cuautitlan',
        },
        {
          value: 14,
          label: 'Huehuetoca',
        },
        {
          value: 15,
          label: 'Iztapalapa',
        },
        {
          value: 16,
          label: 'Last Mile',
        },
        {
          value: 17,
          label: 'Naucalpan',
        },
        {
          value: 18,
          label: 'Tepotzotlan',
        },
        {
          value: 19,
          label: 'Tlalnepantla',
        },
        {
          value: 20,
          label: 'Toluca',
        },
        {
          value: 21,
          label: 'Tultepec',
        },
        {
          value: 22,
          label: 'Tultitlan',
        }
      ],
    },
    {
      label: 'Matamoros',
      code: 'mrk',
      options: [
        {
          value: 23,
          label: 'East',
        },
        {
          value: 24,
          label: 'West',
        }
      ],
      flags: {
          mrk: cilBasket
        },
    },
    {
      label: 'Monterrey',
      code: 'mrk',
      options: [
        {
          value: 25,
          label: 'Apodaca',
        },
        {
          value: 26,
          label: 'Cienega de Flores',
        },
        {
          value: 27,
          label: 'Escobedo',
        },
        {
          value: 28,
          label: 'Guadalupe',
        },
        {
          value: 29,
          label: 'Last Mile',
        },
        {
          value: 30,
          label: 'Pesqueria',
        },
        {
          value: 31,
          label: 'Santa Catarina',
        }
      ],
    },
    {
      label: 'Chihuahua',
      code: 'mrk',
      options: [
        {
          value: 32,
          label: 'East',
        },
        {
          value: 32,
          label: 'West',
        }
      ],
    },
    {
      label: 'Puebla',
      code: 'mrk',
      options: [
        {
          value: 33,
          label: 'Cuautlancingo',
        },
        {
          value: 34,
          label: 'Huejotzingo',
        },
        {
          value: 35,
          label: 'San Jose Chiapa',
        },
        {
          value: 36,
          label: 'Tlaxcala',
        }
      ],
    },
    {
      label: 'Saltillo',
      code: 'mrk',
      options: [
        {
          value: 37,
          label: 'Cuautlancingo',
        },
        {
          value: 38,
          label: 'Huejotzingo',
        },
        {
          value: 39,
          label: 'San Jose Chiapa',
        },
        {
          value: 40,
          label: 'Tlaxcala',
        }
      ],
      flags: {
          mrk: cilBasket
        },
    },
    {
      label: 'San Luis Potosi',
      code: 'mrk',
      options: [
        {
          value: 41,
          label: 'Arteaga',
        },
        {
          value: 42,
          label: 'Derramadero',
        },
        {
          value: 43,
          label: 'Ramos Arizpe',
        },
        {
          value: 44,
          label: 'Saltillo',
        },
      ],
    },
    {
      label: 'Guadalajara',
      code: 'mrk',
      options: [
        {
          value: 45,
          label: 'Las Colinas',
        },
        {
          value: 46,
          label: 'Logistik',
        },
        {
          value: 47,
          label: 'Milenium',
        },
        {
          value: 48,
          label: 'San Luis de la Paz',
        },
        {
          value: 49,
          label: 'Tres Naciones',
        },
        {
          value: 50,
          label: 'WTC',
        }
      ],
    },
    {
      label: 'Juarez',
      code: 'mrk',
      options: [
        {
          value: 51,
          label: 'El Salto',
        },
        {
          value: 52,
          label: 'Lopez Mateos',
        },
        {
          value: 53,
          label: 'South Periferico',
        },
        {
          value: 54,
          label: 'Zapopan',
        }
      ],
    },
    {
      label: 'Mexicali',
      code: 'mrk',
      options: [
        {
          value: 1,
          label: '',
        }
      ],
      flags: {
          mrk: cilBasket
        },
    },
    {
      label: 'Tijuana',
      code: 'mrk',
      options: [
        {
          value: 1,
          label: '',
        }
      ],
    },
    {
      label: 'Reynosa',
      code: 'mrk',
      options: [
        {
          value: 1,
          label: '',
        }
      ],
    },
    {
      label: 'Nuevo Laredo',
      code: 'mrk',
      options: [
        {
          value: 1,
          label: '',
        }
      ],
    },
    {
      label: 'Aguascalientes',
      code: 'mrk',
      options: [
        {
          value: 1,
          label: '',
        }
      ],
      flags: {
          mrk: cilBasket
        },
    },
    {
      label: 'Hidalgo',
      code: 'mrk',
      options: [
        {
          value: 1,
          label: '',
        }
      ],
    },
    {
      label: 'Hermosillo',
      code: 'mrk',
      options: [
        {
          value: 1,
          label: '',
        }
      ],
    },
    {
      label: 'La Laguna',
      code: 'mrk',
      options: [
        {
          value: 1,
          label: '',
        }
      ],
    },
    {
      label: 'Merida',
      code: 'mrk',
      options: [
        {
          value: 1,
          label: '',
        }
      ],
      flags: {
          mrk: cilBasket
        },
    },
  ]
</script>
<template>
  <div>
    <div style="display: flex; justify-content: right;">
      <router-link to="../polizas">
        <CButton color="primary" variant="outline">
          <CIcon :content="cilArrowCircleLeft" size="sm" />
          return
        </CButton>
      </router-link>
    </div>

    <CTabs activeItemKey="profile">
      <CTabList variant="tabs">
        <CTab itemKey="profile">Profile</CTab>
        <CTab itemKey="permissions">Permissions</CTab>
      </CTabList>
      <CTabContent>
        <CTabPanel class="p-3" itemKey="profile">
          <CContainer>
            <CRow>
              <CCol :md="6">
                <CCol>
                    <CMultiSelect 
                      :multiple="false" 
                      label="Select companie"
                      :options="optionsCompanies"/>
                </CCol>
                <CCol>
                  <CFormInput type="text"
                  label="Name" 
                  placeholder="name" 
                  aria-label="default input example"/>
                </CCol>
                <CCol>
                  <CFormInput type="text"
                  label="Last Name" 
                  placeholder="lastName" 
                  aria-label="default input example"/>
                </CCol>
                <CCol>
                <CForm>
                  <CFormInput
                    type="email"
                    id="exampleFormControlInput1"
                    label="Email address"
                    placeholder="name@example.com"
                    text="Must be 8-20 characters long."
                    aria-describedby="exampleFormControlInputHelpInline"
                  />
                </CForm>
              </CCol>
                <CCol>
                  <CFormInput type="number"
                  label="Total Screens" 
                  placeholder="totalScreens" 
                  aria-label="default input example"/>
                </CCol> 
              </CCol>
              <CCol :md="6">
                <CCol>
                  <CFormInput type="text"
                  label="Position" 
                  placeholder="Position" 
                  aria-label="default input example"/>
                </CCol>
                <CCol>
                  <CFormInput type="text"
                  label="UserName" 
                  placeholder="userName" 
                  aria-label="default input example"/>
                </CCol>
                <CCol>
                  <CFormInput 
                  label="Password" 
                  type="password" 
                  id="inputPassword"/>
                </CCol>
                <CCol>
                  <CFormInput 
                  label="Confirm Password" 
                  type="password" 
                  id="confirmInputPassword"/>
                </CCol>
                <CCol>
                  <CFormInput 
                  type="file"
                   id="formFile" 
                  label="Image Profile" />
                </CCol>
                <CCol>
                  <div style="display: flex; justify-content: left; align-items: center;">
                    <label for="status">Status</label>
                    <div style="margin-left: 1rem; padding-top: 1rem;">
                      <CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox1" value="option1" label="Activo" />
                      <CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox2" value="option2" label="Inactivo" />
                    </div>
                  </div>
                </CCol>
              </CCol>
            </CRow>
          </CContainer>
        </CTabPanel>
        <CTabPanel class="p-3" itemKey="permissions">
          <div class="docs-example rounded-top p-4">
            <CContainer>
              <CRow>
                <CCol :md="6">
                  <CCol>
                    <CMultiSelect 
                    label="Select permissions"
                    :options="optionsPermissions" 
                    selectionType="counter" />
                  </CCol>
                  <CCol>
                    <CMultiSelect 
                    label="Select Modulos"
                    :options="optionsModulos" 
                    selectionType="counter" />
                  </CCol>
                  <CCol>
                    <CMultiSelect 
                    label="Select Markets"
                    :options="optionsMarkets" 
                    selectionType="counter" />
                  </CCol>
                  <CCol>
                    <CMultiSelect 
                    label="Select SubMarkets"
                    :options="optionsSubMarkets" 
                    selectionType="counter" />
                  </CCol>
                </CCol>
                <CCol :md="6">
                  <CCol>
                    <CMultiSelect 
                    label="Select Years"
                    :options="optionsYears" 
                    selectionType="counter" />
                  </CCol>
                  <CCol>
                    <CMultiSelect 
                    label="Select Quarters"
                    :options="optionsQuarters" 
                    selectionType="counter" />
                  </CCol>
                </CCol>
              </CRow>
              <CRow>
                <div style="display: flex; justify-content: center;padding:1rem">
                  <CButton color="success" variant="outline" type="submit">Submit</CButton>
                </div>
              </CRow>
            </CContainer>
             
          </div>
        </CTabPanel>
      </CTabContent>
    </CTabs>
  </div>
</template>