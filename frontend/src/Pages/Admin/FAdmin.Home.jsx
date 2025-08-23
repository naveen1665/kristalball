import React, { useState } from 'react'
import NavbarAdmin from '../../Components/Component.NavbarAdmin'
import AdminDashboard from './Dashboard/FAdmin.Dashboard'
import FAdminAddEquipments from './Equipment/FAdmin.AddEquipments';
import FAdminBaseHome from './Bases/FAdmin.BaseHome';
import FAdminImportExport from './ImportExport/FAdmin.ImportExport';
import FAdminTransaction from './Transaction/FAdmin.Transaction';

function AdminHome() {
  const [current, setCurrent] = useState("bases");

  return (
    <div>
      <NavbarAdmin setCurrent={setCurrent} user_name={"Naveen"} />
      {current === "bases" && <AdminDashboard />}
      {current === "equipments" && <FAdminAddEquipments/>}
      {current === "managebases" && <FAdminBaseHome/>}
      {current === "importexport" && <FAdminImportExport/>}
      {current === "transaction" && <FAdminTransaction/>}
    </div>
  )
}

export default AdminHome;
