import React, { useEffect, useState } from 'react';
import NavbarCommander from '../../Components/Component.NavbarCommander';
import CBaseComm from './Base/CBase.Comm';
import { GET_SINGLE_BASE } from '../../Constants/Constants.ApiEndpoints';
import { BackendClient } from '../../AxiosClient/BackendClient';
import CCommanderImportExport from './ImportExport/CImportExport.Comm';
import CEquipmentsComm from './Equipments/CEquipments.Comm';
import CTransactionComm from './Transaction/CTransaction.Comm';

function CommanderHome() {
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState("bases");
  const [baseDetails, setBaseDetails] = useState(null);
  const [base_id, setBase_id] = useState("B001");

  useEffect(() => {
    const fetchBaseDetails = async () => {
      setLoading(true);
      try {
        const response = await BackendClient.post(GET_SINGLE_BASE, { user_name: "Naveen", base_id:"B001"});
        if (response.status === 200) setBaseDetails(response.data);
      } catch (err) {
        console.error("Error fetching base details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBaseDetails();
  }, [base_id]);

  return (
    <div>
      <NavbarCommander setCurrent={setCurrent} user_name="Naveen" loading={loading} />
      {current === "bases" && <CBaseComm baseDetails={baseDetails} />}
      {current === "equipments" && <CEquipmentsComm base_assets={baseDetails.base_assets}/>}
      {current === "managebases" && <h1>Manage Bases</h1>}
      {current === "importexport" && baseDetails && (
        <CCommanderImportExport base_id={base_id} />
      )}
      {current === "transaction" && <CTransactionComm base_log={baseDetails.base_log}/>}
    </div>
  );
}

export default CommanderHome;
