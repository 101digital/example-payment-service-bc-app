import axios from 'axios';
import env from '../env';

const getQuery = () => {
  let objectName = 'Product2';
  let fieldsName = [
    'Id',
    'Name',
    'ProductId__c',
    'Dangerous_Goods_Class__c',
    'hazChemCode__c',
    'Pack_group__c',
    'Pack_Size__c',
    'Pack_Type__c',
    'Pack_Unit__c',
    'Shelf_life_unit_of_time__c',
    'Shelf_life_quantity__c',
    'Storage_Conditions__c',
    'Temperature_Conditions__c',
    'UN_number__c',
  ];

  return `SELECT+${fieldsName.join(',')}+FROM ${objectName} WHERE IsDeleted=FALSE`;
};

const authHeader = () => {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  };
};

const getProducts = async () => {
  let url = `${env.get('INSTANCE_URL')}/services/data/v45.0/queryAll/?q=${getQuery()}`;
  let resp = await axios.get(url, authHeader());
  resp.data.records.forEach((e) => {
    delete e.attributes;
  });

  let returnData = {
    data: resp.data.records,
    totalRecords: resp.data.totalSize,
  };
  return returnData;
};

export default {
  getProducts: getProducts,
};
