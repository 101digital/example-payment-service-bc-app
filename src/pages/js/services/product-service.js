import axios from 'axios';
import env from '../env';

const getQuery = () => {
  let objectName = 'Product2';
  let fieldsName = ['Id', 'Name', 'ProductCode'];

  return `SELECT+${fieldsName.join(',')}+FROM ${objectName}`;
};

const authHeader = () => {
  return {
    headers: {
      Authorization:
        'Bearer 00D1e0000008rUC!AR4AQOmqwHedpBs2g2ZACm.ibPAOj3xtKmknMAeG5COq7epTapJEv5e4Qpc3bCdsFWIYASfu7ouLF6yKJ3_T2ORO1X1U7DFB',
    },
  };
};

const getProducts = () => {
  // let url = `${env.get('INSTANCE_URL')}/services/data/v45.0/queryAll/?q=${getQuery()}`
  // let data = await axios.get(url, authHeader)

  let data = {
    totalRecords: 10,
    data: [
      {
        Id: '01t1e000000Rv86AAC',
        Name: 'test',
        ProductId__c: null,
        Dangerous_Goods_Class__c: 'Miscellaneous Dangerous (9)',
        hazChemCode__c: null,
        Pack_group__c: null,
        Pack_Size__c: 213.0,
        Pack_Type__c: 'Drum',
        Pack_Unit__c: 'UnitKGM',
        Shelf_life_unit_of_time__c: 'Day',
        Shelf_life_quantity__c: 365.0,
        Storage_Conditions__c: 'General Storage',
        Temperature_Conditions__c: '>25 - 40 degree C',
        UN_number__c: 3081.0,
      },
      {
        Id: '01t1e000000RvJ1AAK',
        Name: 'test',
        ProductId__c: null,
        Dangerous_Goods_Class__c: 'Miscellaneous Dangerous (9)',
        hazChemCode__c: null,
        Pack_group__c: null,
        Pack_Size__c: 213.0,
        Pack_Type__c: 'Drum',
        Pack_Unit__c: 'UnitKGM',
        Shelf_life_unit_of_time__c: 'Day',
        Shelf_life_quantity__c: 365.0,
        Storage_Conditions__c: 'General Storage',
        Temperature_Conditions__c: '>25 - 40 degree C',
        UN_number__c: 3081.0,
      },
      {
        Id: '01t1e000000RvMUAA0',
        Name: 'test',
        ProductId__c: null,
        Dangerous_Goods_Class__c: 'Miscellaneous Dangerous (9)',
        hazChemCode__c: null,
        Pack_group__c: null,
        Pack_Size__c: 213.0,
        Pack_Type__c: 'Drum',
        Pack_Unit__c: 'UnitKGM',
        Shelf_life_unit_of_time__c: 'Day',
        Shelf_life_quantity__c: 365.0,
        Storage_Conditions__c: 'General Storage',
        Temperature_Conditions__c: '>25 - 40 degree C',
        UN_number__c: 3081.0,
      },
      {
        Id: '01t1e000000RwDyAAK',
        Name: 'test',
        ProductId__c: 'aaaa',
        Dangerous_Goods_Class__c: 'Miscellaneous Dangerous (9)',
        hazChemCode__c: null,
        Pack_group__c: null,
        Pack_Size__c: 213.0,
        Pack_Type__c: 'Drum',
        Pack_Unit__c: 'UnitKGM',
        Shelf_life_unit_of_time__c: 'Day',
        Shelf_life_quantity__c: 365.0,
        Storage_Conditions__c: 'General Storage',
        Temperature_Conditions__c: '>25 - 40 degree C',
        UN_number__c: 3081.0,
      },
      {
        Id: '01t5g000002vjtCAAQ',
        Name: 'SYNOLAC 40X60 185KG/DRUM',
        ProductId__c: '000000000010005535',
        Dangerous_Goods_Class__c: 'Flammable Liquid (3)',
        hazChemCode__c: null,
        Pack_group__c: 'III',
        Pack_Size__c: 185.0,
        Pack_Type__c: 'Drum',
        Pack_Unit__c: 'KGM',
        Shelf_life_unit_of_time__c: 'Day',
        Shelf_life_quantity__c: 365.0,
        Storage_Conditions__c: 'Flammable Ambient',
        Temperature_Conditions__c: '>15 -25 degree C with controlled humidity',
        UN_number__c: 1866.0,
      },
      {
        Id: '01t5g000002vjtHAAQ',
        Name: 'SYNLAIT IFB01020 V7 25KG/BAG',
        ProductId__c: '000000000010005517',
        Dangerous_Goods_Class__c: null,
        hazChemCode__c: null,
        Pack_group__c: null,
        Pack_Size__c: 25.0,
        Pack_Type__c: 'Bag',
        Pack_Unit__c: 'KGM',
        Shelf_life_unit_of_time__c: 'Day',
        Shelf_life_quantity__c: 540.0,
        Storage_Conditions__c: 'General Storage',
        Temperature_Conditions__c: '>25 - 40 degree C',
        UN_number__c: null,
      },
      {
        Id: '01t5g000002vjtMAAQ',
        Name: 'BENTONE 27 V CG 25KG/BAG',
        ProductId__c: '000000000010000346',
        Dangerous_Goods_Class__c: null,
        hazChemCode__c: null,
        Pack_group__c: null,
        Pack_Size__c: 25.0,
        Pack_Type__c: 'Bag',
        Pack_Unit__c: 'KGM',
        Shelf_life_unit_of_time__c: 'Day',
        Shelf_life_quantity__c: 730.0,
        Storage_Conditions__c: 'General Storage',
        Temperature_Conditions__c: '>15 -25 degree C with controlled humidity',
        UN_number__c: null,
      },
      {
        Id: '01t5g000002vjtNAAQ',
        Name: 'AMGARD CU 238.14KG/DRUM',
        ProductId__c: '000000000010000120',
        Dangerous_Goods_Class__c: null,
        hazChemCode__c: null,
        Pack_group__c: null,
        Pack_Size__c: 238.0,
        Pack_Type__c: 'Drum',
        Pack_Unit__c: 'KGM',
        Shelf_life_unit_of_time__c: 'Day',
        Shelf_life_quantity__c: 730.0,
        Storage_Conditions__c: 'General Storage',
        Temperature_Conditions__c: '>25 - 40 degree C',
        UN_number__c: null,
      },
      {
        Id: '01t5g000002vjtOAAQ',
        Name: 'ABEX EP-110 213.2KG/DRUM',
        ProductId__c: '000000000010000054',
        Dangerous_Goods_Class__c: 'Miscellaneous Dangerous (9)',
        hazChemCode__c: null,
        Pack_group__c: 'III',
        Pack_Size__c: 213.0,
        Pack_Type__c: 'Drum',
        Pack_Unit__c: 'KGM',
        Shelf_life_unit_of_time__c: 'Day',
        Shelf_life_quantity__c: 365.0,
        Storage_Conditions__c: 'General Storage',
        Temperature_Conditions__c: '>25 - 40 degree C',
        UN_number__c: 3082.0,
      },
      {
        Id: '01t5g000002vl0kAAA',
        Name: 'abcTest2532',
        ProductId__c: null,
        Dangerous_Goods_Class__c: 'Flammable',
        hazChemCode__c: null,
        Pack_group__c: 'III',
        Pack_Size__c: 22.0,
        Pack_Type__c: 'Bag',
        Pack_Unit__c: 'KG',
        Shelf_life_unit_of_time__c: 'Day',
        Shelf_life_quantity__c: 562.0,
        Storage_Conditions__c: 'General Storage',
        Temperature_Conditions__c: '>15 -25 degree C with controlled humidity',
        UN_number__c: null,
      },
    ],
  };
  return data;
};

export default {
  getProducts: getProducts,
};
