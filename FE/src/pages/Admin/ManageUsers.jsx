import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useGetAllAccount } from "../../api/AccountEndPoint";

const ManageUsers = () => {
  const queryGetAllAccount = useGetAllAccount(10, 1);

  return <div></div>;
};

export default ManageUsers;
