import React, { useState } from 'react'
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import { useGetAllAccount } from '../../api/AccountEndPoint'

const ManageUsers = () => {

  const queryGetAllAccount = useGetAllAccount(10,1)
  console.log('asfd',queryGetAllAccount)
  console.log('123')

  return (
    <div>ManageUsers</div>
  )
}

export default ManageUsers