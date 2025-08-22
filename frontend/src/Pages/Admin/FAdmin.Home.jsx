import React, { useState } from 'react'
import NavbarAdmin from '../../Components/Component.NavbarAdmin'
import AdminDashboard from './Dashboard/FAdmin.Dashboard'
import FAdminAddEquipments from './Equipment/FAdmin.AddEquipments';
import FAdminBaseHome from './Bases/FAdmin.BaseHome';

function AdminHome() {
  const [current, setCurrent] = useState("bases");

  return (
    <div>
      <NavbarAdmin setCurrent={setCurrent} user_name={"Naveen"} />
      {current === "bases" && <AdminDashboard />}
      {current === "equipments" && <FAdminAddEquipments/>}
      {current === "managebases" && <FAdminBaseHome/>}
      {current === "importexport" && <p className="ml-64 p-6">📊 Reports Page</p>}
      {current === "transaction" && <p className="ml-64 p-6">💸 Transactions Page</p>}
    </div>
  )
}

export default AdminHome;
