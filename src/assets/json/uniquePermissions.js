const uniquePermissions = [
  {
    label: 'Columnas',
    options: [
      {
        value: "col_1",
        label: 'Ocultar Columnas (Owner, Developer, Builder, Contact, Phone, Mail)',
        selected: true,
      }
    ],
  },
  {
    label: 'Tablas Bicharts',
    options: [
      {
        value: "table_1",
        label: 'Show tabla en Graficas (Availability, Gross Abso, Inv.-Bts-Exp., Ranking Availability, Ranking Gross Abso.)',
        selected: true,
      }
    ],
  },
  {
    label: 'Fibras',
    options: [
      {
        value: "fibras_1",
        label: 'Show Fibras',
        selected: true,
      }
    ],
  }
];

const biChartsModules = [
  {
    label: 'Bicharts',
    options: [
      {
        value: 1,
        label: 'Show Availability',
        selected: true,
      },
      {
        value: 2,
        label: 'Show Gross Absorption Vs Availability',
        selected: true,
      },
      {
        value: 3,
        label: 'Show Gross Absorption',
        selected: true,
      },
      {
        value: 4,
        label: 'Show Historical Gross Absorption VS Previous Years',
        selected: true,
      },
      {
        value: 5,
        label: 'Show Historical Gross Absorption',
        selected: true,
      },
      {
        value: 6,
        label: 'Show Gross Absorption By Industry/Country',
        selected: true,
      },
      {
        value: 7,
        label: 'Show Gross Absorption By Inventory/BTS/Expansion',
        selected: true,
      },
      {
        value: 8,
        label: 'Show Ranking Availability.',
        selected: true,
      },
      {
        value: 9,
        label: 'Show Ranking Gross Absorption.',
        selected: true,
      },
    ],
  }
];

export { uniquePermissions, biChartsModules };
